
import { useEventComments } from "./hooks/useEventComments";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { CommentsHeader } from "./CommentsHeader";
import { CommentsSkeleton } from "./CommentsSkeleton";
import { useLanguage } from "@/contexts/LanguageContext";

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
  
  const { t } = useLanguage();

  if (error) {
    return (
      <div className="text-red-500">
        {t(
          "Failed to load comments. Please try again.",
          "கருத்துகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CommentsHeader />
      
      {currentUser ? (
        <CommentForm onSubmit={addComment} />
      ) : (
        <p className="text-muted-foreground text-center py-4">
          {t(
            "Please log in to add comments",
            "கருத்துகளைச் சேர்க்க உள்நுழையவும்"
          )}
        </p>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <CommentsSkeleton />
        ) : comments?.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {t(
              "No comments yet. Be the first to comment!",
              "இதுவரை கருத்துகள் இல்லை. முதல் கருத்தை இடுங்கள்!"
            )}
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
