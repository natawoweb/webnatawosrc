import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

interface CreateUserPayload {
  email: string
  fullName: string
  role: 'reader' | 'writer' | 'manager' | 'admin'
}

// Utility function to generate a secure password
function generateSecurePassword(): string {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each required character type
  password += 'A'; // Uppercase
  password += 'a'; // Lowercase
  password += '1'; // Number
  password += '!'; // Special character
  
  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Utility function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to validate role
function isValidRole(role: string): role is CreateUserPayload['role'] {
  return ['reader', 'writer', 'manager', 'admin'].includes(role);
}

// Utility function to validate the payload
function validatePayload(payload: any): { isValid: boolean; error?: string } {
  if (!payload) {
    return { isValid: false, error: 'Payload is required' };
  }

  if (!payload.email || !isValidEmail(payload.email)) {
    return { isValid: false, error: 'Valid email is required' };
  }

  if (!payload.fullName || payload.fullName.trim().length < 2) {
    return { isValid: false, error: 'Full name is required (minimum 2 characters)' };
  }

  if (!payload.role || !isValidRole(payload.role)) {
    return { isValid: false, error: 'Valid role is required (reader, writer, manager, or admin)' };
  }

  return { isValid: true };
}

// Utility function to create error response
function createErrorResponse(status: number, message: string, details?: any): Response {
  return new Response(
    JSON.stringify({
      error: "Auth Error",
      message,
      details
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

// Utility function to create success response
function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

// Main handler function
async function handleCreateUser(req: Request): Promise<Response> {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: CreateUserPayload = await req.json();
    
    // Validate payload
    const validation = validatePayload(payload);
    if (!validation.isValid) {
      return createErrorResponse(400, validation.error!);
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

    // Generate secure password
    const tempPassword = generateSecurePassword();

    console.log('Creating auth user with email:', payload.email);
    
    // Create auth user with all required data
    const { data: authUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: payload.fullName,
      },
    });

    if (createUserError) {
      console.error('Error creating auth user:', createUserError);
      return createErrorResponse(500, `Failed to create auth user: ${createUserError.message}`);
    }

    if (!authUser.user) {
      console.error('No user returned from auth user creation');
      return createErrorResponse(500, 'Failed to create auth user: No user returned');
    }

    console.log('Auth user created successfully');
    
    // Insert into user_roles table
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authUser.user.id,
        role: payload.role,
      });

    if (roleError) {
      console.error('Error setting user role:', roleError);
      // If role assignment fails, we should delete the created user
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return createErrorResponse(500, `Failed to set user role: ${roleError.message}`);
    }

    return createSuccessResponse({
      user: authUser.user,
      tempPassword,
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse(500, 'An unexpected error occurred', error);
  }
}

serve(handleCreateUser);