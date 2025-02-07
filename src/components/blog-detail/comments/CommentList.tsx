
import { Comment } from "./types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments?: Comment[];
  session: any;
  canDeleteComments: boolean;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  onReaction: (commentId: string, type: 'like' | 'dislike') => void;
}

export const CommentList = ({
  comments,
  session,
  canDeleteComments,
  onEdit,
  onDelete,
  onReaction,
}: CommentListProps) => {
  return (
    <div className="space-y-4 mt-8">
      {comments?.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          session={session}
          canDeleteComments={canDeleteComments}
          onEdit={() => onEdit(comment)}
          onDelete={() => onDelete(comment.id)}
          onReaction={onReaction}
        />
      ))}
    </div>
  );
};
