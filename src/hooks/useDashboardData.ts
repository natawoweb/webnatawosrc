
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export function useDashboardData(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to all blog changes for this user
    const channel = supabase
      .channel(`blogs-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'blogs',
          filter: `author_id=eq.${userId}` // Only listen to changes for this user's blogs
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          // Immediately invalidate the query to trigger a refresh
          queryClient.invalidateQueries({ 
            queryKey: ["writer-blogs", userId],
            exact: true
          });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Cleanup subscription when component unmounts or userId changes
    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  return useQuery({
    queryKey: ["writer-blogs", userId],
    queryFn: async () => {
      console.log('Fetching blogs for user:', userId);
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          blog_comments (count),
          blog_categories (
            name
          )
        `)
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
      
      console.log('Fetched blogs:', data);
      return data;
    },
    enabled: !!userId,
  });
}
