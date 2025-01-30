import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Utility function to create error responses
const createErrorResponse = (status: number, error: string, message: string) => {
  console.error(`Error: ${error}, Message: ${message}`);
  return new Response(
    JSON.stringify({ error, message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

// Validate required fields
const validateFields = (email: string, fullName: string, role: string) => {
  if (!email || !fullName || !role) {
    throw new Error('Missing required fields');
  }
  
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }
};

// Verify admin status
const verifyAdmin = async (supabaseAdmin: any, userId: string) => {
  console.log('Verifying admin status for user:', userId);
  const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
    user_id: userId,
    required_role: 'admin'
  });

  if (roleError || !isAdmin) {
    throw new Error('User is not authorized to create users');
  }
};

// Create user and profile
const createUserAndProfile = async (supabaseAdmin: any, email: string, fullName: string, role: string) => {
  console.log('Creating user with email:', email);
  
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
    console.error('Error creating user:', createError);
    throw new Error(`Failed to create user: ${createError.message}`);
  }

  if (!userData.user) {
    throw new Error('User creation failed - no user data returned');
  }

  console.log('User created successfully, creating profile...');

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
    throw new Error(`Failed to create profile: ${profileError.message}`);
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
    throw new Error(`Failed to set user role: ${roleError.message}`);
  }

  return userData.user;
};

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    console.log('Received request to create user:', { email, fullName, role });

    // Validate fields
    try {
      validateFields(email, fullName, role);
    } catch (error) {
      return createErrorResponse(400, 'Validation Error', error.message);
    }

    // Verify admin status
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user: adminUser }, error: verifyError } = await supabaseAdmin.auth.getUser(jwt);
    
    if (verifyError || !adminUser) {
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
      error.message || 'An unexpected error occurred'
    );
  }
});