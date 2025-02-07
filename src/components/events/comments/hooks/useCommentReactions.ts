
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCommentReactions(eventId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const reactToCommentMutation = useMutation({
    mutationFn: async ({ commentId, type }: { commentId: string; type: 'like' | 'dislike' }) => {
      const currentUser = (await supabase.auth.getUser()).data.user;
      
      const { data: existingReaction } = await supabase
        .from('event_comment_reactions')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', currentUser?.id)
        .maybeSingle();

      if (existingReaction) {
        if (existingReaction.type === type) {
          const { error } = await supabase
            .from('event_comment_reactions')
            .delete()
            .eq('id', existingReaction.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('event_comment_reactions')
            .update({ type })
            .eq('id', existingReaction.id);
          if (error) throw error;
        }
      } else {
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
    reactToComment: (commentId: string, type: 'like' | 'dislike') => 
      reactToCommentMutation.mutate({ commentId, type }),
  };
}
