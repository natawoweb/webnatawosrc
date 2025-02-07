
import { useCommentQueries } from "./useCommentQueries";
import { useCommentMutations } from "./useCommentMutations";
import { useCommentReactions } from "./useCommentReactions";
import type { Comment } from "./useCommentQueries";

export type { Comment };

export function useEventComments(eventId: string) {
  const { comments, isLoading, error, currentUser } = useCommentQueries(eventId);
  const { addComment, updateComment, deleteComment } = useCommentMutations(eventId);
  const { reactToComment } = useCommentReactions(eventId);

  return {
    comments,
    isLoading,
    error,
    currentUser,
    addComment,
    updateComment,
    deleteComment,
    reactToComment,
  };
}
