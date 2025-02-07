
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UserWithRole } from "@/types/user-management";

export function useUserQueries() {
  return useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // First, get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Then, get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      console.log('Fetched profiles:', profiles);
      console.log('Fetched user roles:', userRoles);

      // Combine profiles with their roles
      return profiles.map(profile => {
        const userRole = userRoles.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "reader"
        };
      }) as UserWithRole[];
    },
  });
}

