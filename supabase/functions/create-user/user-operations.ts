/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateUserPayload } from '../_shared/types.ts';

export async function createAuthUser(
  supabaseAdmin: any,
  payload: CreateUserPayload
) {
  const { data: authUser, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        full_name: payload.fullName,
        role: payload.role,
        level: payload.level,
      },
    });

  if (createUserError) {
    console.error('Error creating auth user:', createUserError);
    throw new Error(`Failed to create auth user: ${createUserError.message}`);
  }

  if (!authUser.user) {
    console.error('No user returned from auth user creation');
    throw new Error('Failed to create auth user: No user returned');
  }

  return authUser.user;
}

export async function updateUserRole(
  supabaseAdmin: any,
  userId: string,
  role: string
) {
  const { error: roleError } = await supabaseAdmin.from('user_roles').upsert({
    user_id: userId,
    role,
    created_at: new Date().toISOString(),
  });

  if (roleError) {
    console.error('Error creating user role:', roleError);
    throw new Error(`Failed to create user role: ${roleError.message}`);
  }
}

export async function updateUserProfile(
  supabaseAdmin: any,
  userId: string,
  payload: CreateUserPayload
) {
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      level: payload.level,
      user_type: payload.role,
      full_name: payload.fullName,
    })
    .eq('id', userId);

  if (profileError) {
    console.error('Error updating profile:', profileError);
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }
}
