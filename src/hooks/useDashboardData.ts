
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export function useDashboardData(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to events changes for this user
    const channel = supabase
      .channel(`events-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `created_by=eq.${userId}`
        },
        (payload) => {
          console.log('Received event change:', payload);
          queryClient.invalidateQueries({ 
            queryKey: ["user-events", userId],
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
    queryKey: ["user-events", userId],
    queryFn: async () => {
      console.log('Fetching events for user:', userId);
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          event_comments (count),
          event_categories (
            name
          )
        `)
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        throw error;
      }
      
      console.log('Fetched events:', data);
      return data;
    },
    enabled: !!userId,
  });
}
