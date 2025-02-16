
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEventQuery(userId: string | undefined) {
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
