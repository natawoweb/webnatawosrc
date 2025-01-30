import { Badge } from "@/components/ui/badge";
import { BookText, CheckSquare, Edit, XSquare } from "lucide-react";

interface BlogStatusBadgeProps {
  status: string;
}

export function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  console.log("Rendering status badge for:", status); // Debug log
  
  const normalizedStatus = status?.toLowerCase() || 'draft';
  
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
    case "submitted":
      return (
        <Badge variant="outline" className="bg-yellow-500 text-white">
          <BookText className="w-4 h-4 mr-1" /> Submitted
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