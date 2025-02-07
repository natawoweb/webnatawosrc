
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

export function useEventComments(eventId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

      const { data: reactionCounts } = await supabase
        .rpc('get_comment_reactions', { p_comment_id: commentsData?.[0]?.id });

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

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("event_comments")
        .insert([{ 
          event_id: eventId, 
          content,
          user_id: currentUser?.id 
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventComments", eventId] });
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment. Please try again.",
      });
    }
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from("event_comments")
        .update({ content })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventComments", eventId] });
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update comment. Please try again.",
      });
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("event_comments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventComments", eventId] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment. Please try again.",
      });
    }
  });

  const reactToCommentMutation = useMutation({
    mutationFn: async ({ commentId, type }: { commentId: string; type: 'like' | 'dislike' }) => {
      const { data: existingReaction } = await supabase
        .from('event_comment_reactions')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', currentUser?.id)
        .maybeSingle();

      if (existingReaction) {
        if (existingReaction.type === type) {
          // If clicking the same reaction type, remove it
          const { error } = await supabase
            .from('event_comment_reactions')
            .delete()
            .eq('id', existingReaction.id);
          if (error) throw error;
        } else {
          // If clicking different reaction type, update it
          const { error } = await supabase
            .from('event_comment_reactions')
            .update({ type })
            .eq('id', existingReaction.id);
          if (error) throw error;
        }
      } else {
        // If no existing reaction, create new one
        const { error } = await supabase
          .from('event_comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: currentUser?.id,
            type
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventComments", eventId] });
    },
    onError: (error) => {
      console.error("Error reacting to comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reaction. Please try again.",
      });
    }
  });

  return {
    comments,
    isLoading,
    error,
    currentUser,
    addComment: (content: string) => addCommentMutation.mutate(content),
    updateComment: (id: string, content: string) => updateCommentMutation.mutate({ id, content }),
    deleteComment: (id: string) => deleteCommentMutation.mutate(id),
    reactToComment: (commentId: string, type: 'like' | 'dislike') => 
      reactToCommentMutation.mutate({ commentId, type }),
  };
}
