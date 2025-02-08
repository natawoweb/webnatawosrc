
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { CreateUserPayload } from '../_shared/types.ts';
import { corsHeaders, createErrorResponse, createSuccessResponse } from '../_shared/response.ts';
import { validatePayload } from '../_shared/validation.ts';
import { initSupabaseAdmin, checkExistingUser } from '../_shared/supabase.ts';
import { createAuthUser, updateUserRole, updateUserProfile } from './user-operations.ts';
import { sendWelcomeNotification } from './notifications.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = initSupabaseAdmin({
      url: Deno.env.get('SUPABASE_URL')!,
      key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    });

    const payload: CreateUserPayload = await req.json();
    console.log('Received payload:', payload);
    
    const validation = validatePayload(payload);
    if (!validation.isValid) {
      return createErrorResponse(400, validation.error!);
    }

    const userExists = await checkExistingUser(supabaseAdmin, payload.email);
    if (userExists) {
      return createErrorResponse(400, 'User with this email already exists');
    }

    // Create the auth user
    const authUser = await createAuthUser(supabaseAdmin, payload);

    // Wait a moment for the auth trigger to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update user role and profile
    await updateUserRole(supabaseAdmin, authUser.id, payload.role);
    await updateUserProfile(supabaseAdmin, authUser.id, payload);

    // Send welcome notification (non-critical)
    await sendWelcomeNotification(supabaseAdmin, payload);

    return createSuccessResponse({
      user: authUser,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error("Error in create-user function:", error);
    return createErrorResponse(500, 'An unexpected error occurred', error);
  }
});
