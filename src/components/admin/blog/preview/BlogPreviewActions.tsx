
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogPreviewActionsProps {
  onApprove: () => void;
  onReject: () => void;
}

export function BlogPreviewActions({ onApprove, onReject }: BlogPreviewActionsProps) {
  return (
    <div className="sm:justify-end gap-2 border-t pt-4">
      <Button
        variant="ghost"
        className="text-green-500 hover:text-green-700 hover:bg-green-100"
        onClick={onApprove}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Approve
      </Button>
      <Button
        variant="ghost"
        className="text-red-500 hover:text-red-700 hover:bg-red-100"
        onClick={onReject}
      >
        <XCircle className="h-4 w-4 mr-2" />
        Reject
      </Button>
    </div>
  );
}
