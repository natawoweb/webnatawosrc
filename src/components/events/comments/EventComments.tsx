
import { MessageSquare } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";

interface EventCommentsProps {
  eventId: string;
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  event_id: string;
  updated_at: string | null;
  profile: Profile;
}

export function EventComments({ eventId }: EventCommentsProps) {
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
          profile:user_id(
            id,
            full_name,
            bio,
            avatar_url,
            created_at,
            updated_at,
            email
          )
        `)
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }

      console.log("Fetched comments:", data);
      return (data || []).map(comment => ({
        ...comment,
        profile: comment.profile || {
          id: comment.user_id,
          full_name: "Anonymous",
          bio: "",
          avatar_url: null,
          created_at: "",
          updated_at: "",
          email: "",
        }
      })) as Comment[];
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

  if (error) {
    return (
      <div className="text-red-500">
        Error loading comments. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Comments</h2>
      </div>

      <CommentForm onSubmit={(content) => addCommentMutation.mutate(content)} />

      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : comments?.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments?.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUser?.id}
              onEdit={(id, content) => updateCommentMutation.mutate({ id, content })}
              onDelete={(id) => deleteCommentMutation.mutate(id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
