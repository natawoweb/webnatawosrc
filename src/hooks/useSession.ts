import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useSession = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 1000 * 60 * 5, // Session data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
  });

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Invalidate and remove session data from the query cache
      queryClient.removeQueries({ queryKey: ["session"] });
      // Clear any user-related queries from the cache
      queryClient.removeQueries({ queryKey: ["profile"] });
      queryClient.removeQueries({ queryKey: ["isAdmin"] });
      // Navigate to home page after sign out
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { session, signOut };
};
