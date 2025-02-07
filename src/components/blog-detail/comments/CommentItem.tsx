
import { Trash2, Pencil, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comment } from "./types";

interface CommentItemProps {
  comment: Comment;
  session: any;
  canDeleteComments: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReaction: (commentId: string, type: 'like' | 'dislike') => void;
}

export const CommentItem = ({
  comment,
  session,
  canDeleteComments,
  onEdit,
  onDelete,
  onReaction,
}: CommentItemProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-2">
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
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>
      <p>{comment.content}</p>
      <div className="flex items-center gap-4 mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReaction(comment.id, 'like')}
          className={comment.user_reaction === 'like' ? 'bg-green-100' : ''}
        >
          <ThumbsUp className={`h-4 w-4 mr-2 ${comment.user_reaction === 'like' ? 'text-green-600' : ''}`} />
          {comment.likes_count || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReaction(comment.id, 'dislike')}
          className={comment.user_reaction === 'dislike' ? 'bg-red-100' : ''}
        >
          <ThumbsDown className={`h-4 w-4 mr-2 ${comment.user_reaction === 'dislike' ? 'text-red-600' : ''}`} />
          {comment.dislikes_count || 0}
        </Button>
      </div>
    </div>
  );
};
