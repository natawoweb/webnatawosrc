
import { supabase } from "@/integrations/supabase/client";

export async function resetUserPassword(email: string) {
  try {
    const { data, error } = await supabase.functions.invoke('admin-reset-password', {
      body: { email }
    });
    
    if (error) throw error;
    
    return {
      success: true,
      credentials: data.credentials,
      message: data.message
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
