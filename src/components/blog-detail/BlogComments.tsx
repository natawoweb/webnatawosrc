
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { CommentForm } from "./comments/CommentForm";
import { CommentList } from "./comments/CommentList";
import { ShareMenu } from "./comments/ShareMenu";
import { Comment } from "./comments/types";

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

  const handleReaction = async (commentId: string, type: 'like' | 'dislike') => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to react to comments",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("comment_reactions")
        .upsert(
          {
            comment_id: commentId,
            user_id: session.user.id,
            reaction_type: type,
          },
          {
            onConflict: 'comment_id,user_id'
          }
        );

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
      toast({
        title: "Success",
        description: `Comment ${type}d successfully`,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Comments</h3>
        <ShareMenu />
      </div>

      {session ? (
        <CommentForm
          value={comment}
          onChange={setComment}
          onSubmit={handleComment}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Please login to comment
        </p>
      )}

      <CommentList
        comments={comments}
        session={session}
        canDeleteComments={canDeleteComments}
        onEdit={(comment) => {
          setEditingCommentId(comment.id);
          setEditedContent(comment.content);
        }}
        onDelete={handleDeleteComment}
        onReaction={handleReaction}
      />

      {editingCommentId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Comment</h3>
            <CommentForm
              value={editedContent}
              onChange={setEditedContent}
              onSubmit={() => handleEditComment(editingCommentId)}
              isEditing
              onCancel={() => {
                setEditingCommentId(null);
                setEditedContent("");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
