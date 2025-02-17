
import { useState } from "react";
import { format } from "date-fns";
import { Edit2, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./CommentForm";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: Profile;
  likes_count?: number;
  dislikes_count?: number;
  user_reaction?: 'like' | 'dislike' | null;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReaction: (id: string, type: 'like' | 'dislike') => void;
}

export function CommentItem({ 
  comment, 
  currentUserId, 
  onEdit, 
  onDelete,
  onReaction
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useLanguage();

  const handleEdit = (content: string) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  return (
    <div className="bg-card p-4 rounded-lg space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="font-semibold">
            {comment.profiles?.full_name || t("Anonymous", "அநாமதேயர்")}
          </div>
          <span className="text-sm text-muted-foreground">
            {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
        <div className="flex gap-2">
          {currentUserId === comment.user_id && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                title={t("Edit comment", "கருத்தைத் திருத்து")}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                title={t("Delete comment", "கருத்தை நீக்கு")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <CommentForm
          initialValue={comment.content}
          onSubmit={handleEdit}
          buttonText={t("Update", "புதுப்பி")}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="text-muted-foreground">{comment.content}</p>
      )}
      <div className="flex gap-4 mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReaction(comment.id, 'like')}
          className={comment.user_reaction === 'like' ? 'bg-green-100 dark:bg-green-900' : ''}
          title={t("Like comment", "கருத்தை விரும்பு")}
        >
          <ThumbsUp className={`h-4 w-4 mr-2 ${comment.user_reaction === 'like' ? 'text-green-600' : ''}`} />
          {comment.likes_count || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReaction(comment.id, 'dislike')}
          className={comment.user_reaction === 'dislike' ? 'bg-red-100 dark:bg-red-900' : ''}
          title={t("Dislike comment", "கருத்தை விரும்பவில்லை")}
        >
          <ThumbsDown className={`h-4 w-4 mr-2 ${comment.user_reaction === 'dislike' ? 'text-red-600' : ''}`} />
          {comment.dislikes_count || 0}
        </Button>
      </div>
    </div>
  );
}
