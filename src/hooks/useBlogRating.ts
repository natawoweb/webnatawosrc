
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useBlogRating(blogId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ["blog-user-rating", blogId, userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("blog_ratings")
        .select("rating")
        .eq("blog_id", blogId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
