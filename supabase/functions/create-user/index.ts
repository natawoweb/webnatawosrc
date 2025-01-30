import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Utility function to create error responses
const createErrorResponse = (status: number, error: string, message: string, details?: any) => {
  const errorResponse = {
    error,
    message,
    details: details || undefined
  };
  console.error('Error details:', errorResponse);
  return new Response(
    JSON.stringify(errorResponse),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

// Validate required fields
const validateFields = (email: string, fullName: string, role: string) => {
  const errors = [];
  if (!email) errors.push('Email is required');
  if (!fullName) errors.push('Full name is required');
  if (!role) errors.push('Role is required');
  if (email && !email.includes('@')) errors.push('Invalid email format');
  return errors;
};

// Verify admin status
const verifyAdmin = async (supabaseAdmin: any, userId: string) => {
  console.log('Verifying admin status for user:', userId);
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
};

// Create user and profile
const createUserAndProfile = async (supabaseAdmin: any, email: string, fullName: string, role: string) => {
  console.log('Starting user creation process for:', email);
  
  try {
    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Create the user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (createError) {
      console.error('Error creating auth user:', createError);
      throw new Error(`Auth user creation failed: ${createError.message}`);
    }

    if (!userData.user) {
      throw new Error('User creation failed - no user data returned');
    }

    console.log('Auth user created successfully, creating profile...');

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userData.user.id,
        full_name: fullName,
        email: email
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // If profile creation fails, attempt to clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    console.log('Profile created successfully, setting user role...');

    // Set user role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: role
      });

    if (roleError) {
      console.error('Error setting user role:', roleError);
      // If role assignment fails, clean up both profile and auth user
      await supabaseAdmin.from('profiles').delete().eq('id', userData.user.id);
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      throw new Error(`Role assignment failed: ${roleError.message}`);
    }

    return userData.user;
  } catch (error) {
    console.error('Error in createUserAndProfile:', error);
    throw error;
  }
};

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received create user request');
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return createErrorResponse(401, 'Unauthorized', 'Missing Authorization header');
    }

    // Initialize Supabase client
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

    // Get request body
    const { email, fullName, role } = await req.json();
    console.log('Request payload:', { email, fullName, role });

    // Validate fields
    const validationErrors = validateFields(email, fullName, role);
    if (validationErrors.length > 0) {
      return createErrorResponse(400, 'Validation Error', 'Invalid input data', validationErrors);
    }

    // Verify admin status
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser }, error: verifyError } = await supabaseAdmin.auth.getUser(jwt);
    
    if (verifyError || !adminUser) {
      console.error('Auth verification error:', verifyError);
      return createErrorResponse(401, 'Unauthorized', 'Invalid authentication token');
    }

    try {
      await verifyAdmin(supabaseAdmin, adminUser.id);
    } catch (error) {
      return createErrorResponse(403, 'Forbidden', error.message);
    }

    // Create user and associated records
    const user = await createUserAndProfile(supabaseAdmin, email, fullName, role);

    return new Response(
      JSON.stringify({ 
        success: true,
        user,
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