
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Eye, CheckSquare, XSquare, Upload } from "lucide-react";
import { BlogStatusBadge } from "./BlogStatusBadge";
import { Database } from "@/integrations/supabase/types";
import type { BlogStatus } from "@/integrations/supabase/types/content";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogListRowProps {
  blog: Blog;
  getAuthorName: (authorId: string) => string;
  canDelete: boolean;
  isAdmin: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onPublish?: () => void;
}

export function BlogListRow({
  blog,
  getAuthorName,
  canDelete,
  isAdmin,
  onDelete,
  onEdit,
  onApprove,
  onReject,
  onPublish,
}: BlogListRowProps) {
  const renderActionButtons = () => {
    const status = blog.status as BlogStatus;

    if (isAdmin) {
      return (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
          >
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          {status === 'pending_approval' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-500 hover:text-green-700"
                onClick={onApprove}
              >
                <CheckSquare className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={onReject}
              >
                <XSquare className="h-4 w-4 mr-1" /> Reject
              </Button>
            </>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </>
      );
    }

    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        {status === 'approved' && (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-700"
            onClick={onPublish}
          >
            <Upload className="h-4 w-4 mr-1" /> Publish
          </Button>
        )}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </>
    );
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{blog.title}</TableCell>
      <TableCell>{getAuthorName(blog.author_id)}</TableCell>
      <TableCell>
        <BlogStatusBadge status={blog.status || 'draft'} />
      </TableCell>
      <TableCell>{new Date(blog.updated_at || "").toLocaleDateString()}</TableCell>
      <TableCell className="space-x-2">
        {renderActionButtons()}
      </TableCell>
    </TableRow>
  );
}
