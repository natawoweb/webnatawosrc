import { Button } from "@/components/ui/button";
import { BlogDialogActions } from "./BlogDialogActions";

interface BlogActionsProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function BlogActions({
  onSaveDraft,
  onSubmit,
  isLoading,
}: BlogActionsProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <BlogDialogActions
          onSaveDraft={onSaveDraft}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}