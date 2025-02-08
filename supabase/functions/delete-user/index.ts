
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user is an admin
    const {
      data: { user },
      error: getUserError,
    } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

    if (getUserError || !user) {
      throw new Error('Not authenticated')
    }

    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      throw new Error('Not authorized - admin role required')
    }

    // Get the user ID to delete from the request body
    const { userId } = await req.json()
    if (!userId) {
      throw new Error('User ID is required')
    }

    // First delete from profiles and user_roles (with new RLS policies)
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      throw new Error('Failed to delete user profile')
    }

    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (roleError) {
      console.error('Error deleting user role:', roleError)
      throw new Error('Failed to delete user role')
    }

    // Finally delete the user from auth.users
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(
      userId
    )

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      throw deleteError
    }

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
