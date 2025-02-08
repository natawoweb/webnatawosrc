
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { SupabaseConfig } from './types.ts';

export function initSupabaseAdmin({ url, key }: SupabaseConfig) {
  if (!url || !key) {
    throw new Error('Missing Supabase configuration');
  }
  return createClient(url, key);
}

export async function checkExistingUser(supabaseAdmin: any, email: string): Promise<boolean> {
  const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
  if (listError) {
    console.error('Error checking existing users:', listError);
    throw new Error('Failed to check existing users');
  }

  return existingUsers.users.some(user => user.email === email);
}
