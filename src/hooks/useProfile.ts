
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProfilesTable } from "@/integrations/supabase/types/auth";

export function useProfile() {
  const { data: profile, isLoading: loading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data as ProfilesTable["Row"];
    },
  });

  return { profile, loading, error };
}
