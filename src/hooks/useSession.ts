
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";

export const useSession = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 1000 * 60 * 5, // Session data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
  });

  const { data: userRole } = useQuery({
    queryKey: ["userRole", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // First check profile type
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.user_type === 'writer') {
        return 'writer';
      }

      // Then check admin role
      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: session.user.id,
        required_role: 'admin'
      });

      return isAdmin ? 'admin' : 'user';
    },
    enabled: !!session?.user?.id,
  });

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all queries from the cache
      queryClient.clear();
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });

      // Navigate to home page after sign out
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return { 
    session, 
    isSessionLoading, 
    signOut,
    userRole, // Add this to return value
    isAdmin: userRole === 'admin',
    isWriter: userRole === 'writer'
  };
};
