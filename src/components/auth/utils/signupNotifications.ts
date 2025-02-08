
import { supabase } from "@/integrations/supabase/client";

export async function handleSignupNotifications(
  role: 'reader' | 'writer',
  email: string,
  fullName: string
) {
  if (role === 'reader') {
    await supabase.functions.invoke('signup-notifications', {
      body: {
        type: 'reader_welcome',
        email,
        fullName,
      }
    });
  } else if (role === 'writer') {
    // Get admin emails
    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (adminRoles?.length) {
      const { data: adminProfiles } = await supabase
        .from('profiles')
        .select('email')
        .in('id', adminRoles.map(r => r.user_id));

      const adminEmails = adminProfiles?.map(p => p.email).filter(Boolean) || [];

      // Notify admins
      await supabase.functions.invoke('signup-notifications', {
        body: {
          type: 'writer_request',
          email,
          fullName,
          adminEmails,
        }
      });

      // Send confirmation to writer
      await supabase.functions.invoke('signup-notifications', {
        body: {
          type: 'request_submitted',
          email,
          fullName,
        }
      });
    }
  }
}
