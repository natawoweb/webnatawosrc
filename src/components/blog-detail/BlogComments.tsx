
import { useState } from "react";
import { Trash2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id?: string;
  profiles?: {
    full_name: string | null;
  };
}

interface BlogCommentsProps {
  blogId: string;
  comments?: Comment[];
  session: any;
  canDeleteComments: boolean;
}

export const BlogComments = ({
  blogId,
  comments,
  session,
  canDeleteComments,
}: BlogCommentsProps) => {
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleComment = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to comment",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Comment cannot be empty",
      });
      return;
    }

    try {
      const { error } = await supabase.from("blog_comments").insert({
        blog_id: blogId,
        user_id: session.user.id,
        content: comment.trim(),
      });

      if (error) throw error;

      setComment("");
      queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editedContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Comment cannot be empty",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("blog_comments")
        .update({ content: editedContent.trim() })
        .eq("id", commentId);

      if (error) throw error;

      setEditingCommentId(null);
      setEditedContent("");
      queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Comments</h3>
      {session ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleComment}>Post Comment</Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Please login to comment
        </p>
      )}

      <div className="space-y-4 mt-8">
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className="border rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {comment.profiles?.full_name || "Anonymous"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                {(session?.user.id === comment.user_id || canDeleteComments) && (
                  <>
                    {session?.user.id === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(comment)}
                        disabled={editingCommentId === comment.id}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            {editingCommentId === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="mt-2"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
