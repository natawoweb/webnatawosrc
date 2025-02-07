
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
}

export function useEventComments(eventId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["eventComments", eventId],
    queryFn: async () => {
      console.log("Fetching comments for event:", eventId);
      const { data, error } = await supabase
        .from("event_comments")
        .select(`
          *,
          profiles:profiles!event_comments_user_id_fkey(*)
        `)
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }

      console.log("Fetched comments:", data);
      return data as Comment[];
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

  return {
    comments,
    isLoading,
    error,
    currentUser,
    addComment: (content: string) => addCommentMutation.mutate(content),
    updateComment: (id: string, content: string) => updateCommentMutation.mutate({ id, content }),
    deleteComment: (id: string) => deleteCommentMutation.mutate(id),
  };
}
