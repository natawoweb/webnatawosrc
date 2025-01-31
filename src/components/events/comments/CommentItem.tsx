import { format } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./CommentForm";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function CommentItem({ 
  comment, 
  currentUserId, 
  onEdit, 
  onDelete 
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (content: string) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  return (
    <div className="bg-card p-4 rounded-lg space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="font-semibold">
            {comment.profiles?.full_name || "Anonymous"}
          </div>
          <span className="text-sm text-muted-foreground">
            {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
        {currentUserId === comment.user_id && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {isEditing ? (
        <CommentForm
          initialValue={comment.content}
          onSubmit={handleEdit}
          buttonText="Update"
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="text-muted-foreground">{comment.content}</p>
      )}
    </div>
  );
}