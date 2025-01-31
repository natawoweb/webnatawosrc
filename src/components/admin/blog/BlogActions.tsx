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
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <BlogDialogActions
          onSaveDraft={onSaveDraft}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
      
      <Button 
        variant="outline"
        onClick={onTranslate}
        disabled={!hasContent}
        className="w-full"
      >
        <Globe className="mr-2 h-4 w-4" />
        Translate to Tamil
      </Button>
    </div>
  );
}