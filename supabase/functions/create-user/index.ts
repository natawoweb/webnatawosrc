import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const createErrorResponse = (status: number, error: string, message: string, details?: any) => {
  const errorResponse = {
    error,
    message,
    details: details || undefined
  };
  console.error('Error response:', errorResponse);
  return new Response(
    JSON.stringify(errorResponse),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

const validateFields = (email: string, fullName: string, role: string) => {
  console.log('Validating fields:', { email, fullName, role });
  const errors = [];
  if (!email) errors.push('Email is required');
  if (!fullName) errors.push('Full name is required');
  if (!role) errors.push('Role is required');
  if (email && !email.includes('@')) errors.push('Invalid email format');
  return errors;
};

const verifyAdmin = async (supabaseAdmin: any, userId: string) => {
  console.log('Verifying admin status for user:', userId);
  try {
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      user_id: userId,
      required_role: 'admin'
    });

    if (roleError) {
      console.error('Role verification error:', roleError);
      throw new Error(`Role verification failed: ${roleError.message}`);
    }

    if (!isAdmin) {
      throw new Error('User is not authorized to create users');
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    throw error;
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received create user request');
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse(401, 'Unauthorized', 'Missing Authorization header');
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
    );

    const { email, fullName, role } = await req.json();
    console.log('Request payload:', { email, fullName, role });

    const validationErrors = validateFields(email, fullName, role);
    if (validationErrors.length > 0) {
      return createErrorResponse(400, 'Validation Error', 'Invalid input data', validationErrors);
    }

    // Verify JWT and get admin user
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser }, error: verifyError } = await supabaseAdmin.auth.getUser(jwt);
    
    if (verifyError || !adminUser) {
      console.error('Auth verification error:', verifyError);
      return createErrorResponse(401, 'Unauthorized', 'Invalid authentication token');
    }

    // Verify admin status
    try {
      await verifyAdmin(supabaseAdmin, adminUser.id);
    } catch (error) {
      return createErrorResponse(403, 'Forbidden', error.message);
    }

    console.log('Creating new user with auth.admin.createUser...');
    
    // Create the user with auth
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-8),
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (createError) {
      console.error('Error creating auth user:', createError);
      return createErrorResponse(500, 'Auth Error', `Failed to create auth user: ${createError.message}`);
    }

    if (!userData.user) {
      return createErrorResponse(500, 'Auth Error', 'No user data returned from auth creation');
    }

    console.log('Auth user created successfully:', userData.user.id);

    // Create profile
    console.log('Creating user profile...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userData.user.id,
        full_name: fullName,
        email: email
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      return createErrorResponse(500, 'Database Error', `Failed to create profile: ${profileError.message}`);
    }

    // Set user role
    console.log('Setting user role...');
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: role
      });

    if (roleError) {
      console.error('Error setting user role:', roleError);
      // Clean up profile and auth user if role assignment fails
      await supabaseAdmin.from('profiles').delete().eq('id', userData.user.id);
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      return createErrorResponse(500, 'Database Error', `Failed to assign role: ${roleError.message}`);
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
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse(
      500,
      'Server Error',
      error.message || 'An unexpected error occurred',
      error
    );
  }
});