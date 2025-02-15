
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

interface CreateBlogActionsProps {
  onSubmit: () => void;
  isLoading: boolean;
}

export function CreateBlogActions({
  onSubmit,
  isLoading,
}: CreateBlogActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onSubmit}
        disabled={isLoading}
      >
        <SendHorizontal className="mr-2 h-4 w-4" />
        Submit for Approval
      </Button>
    </div>
  );
}
