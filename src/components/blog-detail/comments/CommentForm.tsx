
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isEditing?: boolean;
  onCancel?: () => void;
}

export const CommentForm = ({
  value,
  onChange,
  onSubmit,
  isEditing,
  onCancel,
}: CommentFormProps) => {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write your comment..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex gap-2">
        <Button onClick={onSubmit}>
          {isEditing ? 'Save' : 'Post Comment'}
        </Button>
        {isEditing && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
