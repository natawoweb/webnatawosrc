
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/useSession";

export function useCommentReactions(eventId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { session } = useSession();

  const reactToCommentMutation = useMutation({
    mutationFn: async ({ commentId, type }: { commentId: string; type: 'like' | 'dislike' }) => {
      if (!session?.user?.id) {
        throw new Error('You must be logged in to react to comments');
      }
      
      const { data: existingReaction } = await supabase
        .from('event_comment_reactions')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', session.user.id)
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
        // Create new reaction
        const { error } = await supabase
          .from('event_comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: session.user.id,
            type
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventComments", eventId] });
    },
    onError: (error: Error) => {
      console.error("Error reacting to comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update reaction. Please try again.",
      });
    }
  });

  return {
    reactToComment: (commentId: string, type: 'like' | 'dislike') => 
      reactToCommentMutation.mutate({ commentId, type }),
  };
}
