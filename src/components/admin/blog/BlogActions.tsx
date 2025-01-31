import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { BlogDialogActions } from "./BlogDialogActions";

interface BlogActionsProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  onTranslate: () => void;
  isLoading: boolean;
  hasContent: boolean;
}

export function BlogActions({
  onSaveDraft,
  onSubmit,
  onTranslate,
  isLoading,
  hasContent,
}: BlogActionsProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <BlogDialogActions
          onSaveDraft={onSaveDraft}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
        <Button 
          variant="secondary"
          onClick={onTranslate}
          disabled={!hasContent}
          className="min-w-[200px]"
        >
          <Globe className="mr-2 h-4 w-4" />
          Translate to Tamil
        </Button>
      </div>
    </div>
  );
}