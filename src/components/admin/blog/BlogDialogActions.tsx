import { Button } from "@/components/ui/button";
import { Save, SendHorizontal } from "lucide-react";

interface BlogDialogActionsProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function BlogDialogActions({
  onSaveDraft,
  onSubmit,
  isLoading,
}: BlogDialogActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={onSaveDraft}
        disabled={isLoading}
      >
        <Save className="mr-2 h-4 w-4" />
        Save as Draft
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isLoading}
      >
        <SendHorizontal className="mr-2 h-4 w-4" />
        Submit for Review
      </Button>
    </div>
  );
}