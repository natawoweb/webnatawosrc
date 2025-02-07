
import { MessageSquare } from "lucide-react";

export function CommentsHeader() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <MessageSquare className="h-5 w-5" />
      <h2 className="text-xl font-semibold">Comments</h2>
    </div>
  );
}
