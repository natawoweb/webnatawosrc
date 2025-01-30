import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('Missing Authorization header')
      return new Response(
        JSON.stringify({ 
          error: 'Missing Authorization header',
          message: 'Authorization header is required'
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get the request body
    const { email, fullName, role } = await req.json()
    console.log('Received request to create user:', { email, fullName, role })

    if (!email || !fullName || !role) {
      console.error('Missing required fields:', { email, fullName, role })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          message: 'Email, full name, and role are required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get user from auth token
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user: adminUser }, error: verifyError } = await supabaseAdmin.auth.getUser(jwt)
    
    if (verifyError || !adminUser) {
      console.error('Invalid JWT or user not found:', verifyError)
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Only admins can create users'
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Verify admin role
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      user_id: adminUser.id,
      required_role: 'admin'
    })

    if (roleError || !isAdmin) {
      console.error('User is not an admin:', adminUser.id)
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Only admins can create users'
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8)
    console.log('Creating user with email:', email)

    // Create the user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      return new Response(
        JSON.stringify({ 
          error: 'Database error creating new user',
          message: createError.message
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!userData.user) {
      console.error('User data is null after creation')
      return new Response(
        JSON.stringify({ 
          error: 'Database error creating new user',
          message: 'User creation failed'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('User created successfully:', userData.user.id)

    // Set the user's role
    const { error: roleSetError } = await supabaseAdmin
      .from('user_roles')
      .upsert({
        user_id: userData.user.id,
        role: role
      })

    if (roleSetError) {
      console.error('Error setting user role:', roleSetError)
      // Even if role setting fails, the user was created successfully
      return new Response(
        JSON.stringify({ 
          success: true,
          user: userData.user,
          warning: 'User created but role setting failed: ' + roleSetError.message
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        user: userData.user,
        message: 'User created successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in create-user function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})