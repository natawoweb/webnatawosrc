
import { useEventComments } from "./hooks/useEventComments";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { CommentsHeader } from "./CommentsHeader";
import { CommentsSkeleton } from "./CommentsSkeleton";

interface EventCommentsProps {
  eventId: string;
}

export function EventComments({ eventId }: EventCommentsProps) {
  const {
    comments,
    isLoading,
    error,
    currentUser,
    addComment,
    updateComment,
    deleteComment,
    reactToComment,
  } = useEventComments(eventId);

  if (error) {
    return (
      <div className="text-red-500">
        Error loading comments. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CommentsHeader />
      
      <CommentForm onSubmit={addComment} />

      <div className="space-y-4">
        {isLoading ? (
          <CommentsSkeleton />
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
              onEdit={(id, content) => updateComment(id, content)}
              onDelete={(id) => deleteComment(id)}
              onReaction={(id, type) => reactToComment(id, type)}
            />
          ))
        )}
      </div>
    </div>
  );
}
