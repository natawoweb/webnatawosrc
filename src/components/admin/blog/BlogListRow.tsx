
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Eye, Pencil, CheckCircle, XCircle } from "lucide-react";
import { BlogStatusBadge } from "./BlogStatusBadge";
import { Database } from "@/integrations/supabase/types";
import type { BlogStatus } from "@/integrations/supabase/types/content";
import { useNavigate } from "react-router-dom";

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
}: BlogListRowProps) {
  const navigate = useNavigate();
  const status = blog.status as BlogStatus;

  console.log('BlogListRow - Props:', { isAdmin, canDelete, blog });

  const renderActionButtons = () => {
    const showDeleteButton = isAdmin;
    console.log('Show delete button:', { isAdmin, showDeleteButton });

    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/preview/${blog.id}`)}
          title="View Blog"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          title="Edit Blog"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        {showDeleteButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            title="Delete Blog"
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {status === 'pending_approval' && isAdmin && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="text-green-500 hover:text-green-700"
              onClick={onApprove}
              title="Approve Blog"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={onReject}
              title="Reject Blog"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
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
      <TableCell>
        {renderActionButtons()}
      </TableCell>
    </TableRow>
  );
}
