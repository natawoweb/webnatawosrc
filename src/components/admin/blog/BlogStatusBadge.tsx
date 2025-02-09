
import { Badge } from "@/components/ui/badge";
import { BookText, CheckSquare, Edit, XSquare, Send, Upload } from "lucide-react";
import type { BlogStatus } from "@/integrations/supabase/types/content";

interface BlogStatusBadgeProps {
  status: string;
}

export function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() as BlogStatus || 'draft';
  
  switch (normalizedStatus) {
    case "approved":
      return (
        <Badge variant="secondary" className="bg-green-500 text-white">
          <CheckSquare className="w-4 h-4 mr-1" /> Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">
          <XSquare className="w-4 h-4 mr-1" /> Rejected
        </Badge>
      );
    case "pending_approval":
      return (
        <Badge variant="outline" className="bg-yellow-500 text-white">
          <Send className="w-4 h-4 mr-1" /> Pending Approval
        </Badge>
      );
    case "published":
      return (
        <Badge variant="secondary" className="bg-blue-500 text-white">
          <Upload className="w-4 h-4 mr-1" /> Published
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          <Edit className="w-4 h-4 mr-1" /> Draft
        </Badge>
      );
  }
}
