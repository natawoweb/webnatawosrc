import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

interface CreateUserPayload {
  email: string
  fullName: string
  role: 'reader' | 'writer' | 'manager' | 'admin'
}

function generateSecurePassword(): string {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  password += 'A'; // Uppercase
  password += 'a'; // Lowercase
  password += '1'; // Number
  password += '!'; // Special character
  
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidRole(role: string): role is CreateUserPayload['role'] {
  return ['reader', 'writer', 'manager', 'admin'].includes(role);
}

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

function createErrorResponse(status: number, message: string, details?: any): Response {
  console.error(`Error: ${message}`, details);
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

async function handleCreateUser(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: CreateUserPayload = await req.json();
    console.log('Received payload:', payload);
    
    const validation = validatePayload(payload);
    if (!validation.isValid) {
      return createErrorResponse(400, validation.error!);
    }

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

    const tempPassword = generateSecurePassword();
    console.log('Creating auth user for email:', payload.email);

    // First, check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser.users.some(user => user.email === payload.email);
    
    if (userExists) {
      return createErrorResponse(400, 'User with this email already exists');
    }

    // Create auth user
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

    console.log('Auth user created successfully:', authUser.user.id);

    // Insert into profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        full_name: `${payload.role.charAt(0).toUpperCase() + payload.role.slice(1)} Profile`,
        email: payload.email,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return createErrorResponse(500, `Failed to create profile: ${profileError.message}`);
    }

    console.log('Profile created successfully');
    
    // Insert into user_roles table
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authUser.user.id,
        role: payload.role,
      });

    if (roleError) {
      console.error('Error setting user role:', roleError);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return createErrorResponse(500, `Failed to set user role: ${roleError.message}`);
    }

    console.log('User role set successfully');

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