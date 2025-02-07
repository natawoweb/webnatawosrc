
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/components/blog-detail/comments/types";

export function useBlogComments(blogId: string, session: any) {
  const { data: comments } = useQuery({
    queryKey: ["blog-comments", blogId],
    queryFn: async () => {
      const { data: commentsData, error: commentsError } = await supabase
        .from("blog_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            full_name
          )
        `)
        .eq("blog_id", blogId)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch reactions for each comment
      const commentsWithReactions = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: reactions } = await supabase
            .from("comment_reactions")
            .select("reaction_type, user_id")
            .eq("comment_id", comment.id);

          const userReaction = reactions?.find(
            (r) => r.user_id === session?.user?.id
          )?.reaction_type as 'like' | 'dislike' | null;

          const likes = reactions?.filter((r) => r.reaction_type === "like").length || 0;
          const dislikes = reactions?.filter((r) => r.reaction_type === "dislike").length || 0;

          return {
            ...comment,
            likes_count: likes,
            dislikes_count: dislikes,
            user_reaction: userReaction,
          };
        })
      );

      return commentsWithReactions as Comment[];
    },
    enabled: !!blogId,
  });

  return comments;
}
