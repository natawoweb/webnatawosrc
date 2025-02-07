
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  event_id: string;
  updated_at: string | null;
  profiles: Profile;
  likes_count?: number;
  dislikes_count?: number;
  user_reaction?: 'like' | 'dislike' | null;
}

export function useCommentQueries(eventId: string) {
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["eventComments", eventId],
    queryFn: async () => {
      const { data: commentsData, error: commentsError } = await supabase
        .from("event_comments")
        .select(`
          *,
          profiles:profiles!event_comments_user_id_fkey(*),
          reactions:event_comment_reactions(type, user_id)
        `)
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      const currentUser = (await supabase.auth.getUser()).data.user;

      // Process comments to include reaction data
      const processedComments = commentsData?.map(comment => {
        const reactions = comment.reactions || [];
        const userReaction = reactions.find(r => r.user_id === currentUser?.id)?.type as 'like' | 'dislike' | null;
        const likes = reactions.filter(r => r.type === 'like').length;
        const dislikes = reactions.filter(r => r.type === 'dislike').length;

        return {
          ...comment,
          likes_count: likes,
          dislikes_count: dislikes,
          user_reaction: userReaction || null,
          reactions: undefined // Remove raw reactions from the object
        };
      });

      return processedComments as Comment[];
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  return {
    comments,
    isLoading,
    error,
    currentUser,
  };
}
