
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Eye, Pencil } from "lucide-react";
import { BlogStatusBadge } from "./BlogStatusBadge";
import { Database } from "@/integrations/supabase/types";
import type { BlogStatus } from "@/integrations/supabase/types/content";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
  const status = blog.status as BlogStatus;

  // Query to check if user has manager role
  const { data: isManager } = useQuery({
    queryKey: ["isManager", blog.id],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const { data } = await supabase.rpc('has_role', {
        user_id: user.data.user?.id || '',
        required_role: 'manager'
      });
      return !!data;
    },
  });

  const handleView = () => {
    navigate(`/blog/${blog.id}`);
  };

  const renderActionButtons = () => {
    const canDeleteBlog = canDelete || isAdmin || isManager;

    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleView}
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
        {canDeleteBlog && (
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
              size="sm"
              className="text-green-500 hover:text-green-700"
              onClick={onApprove}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={onReject}
            >
              Reject
            </Button>
          </>
        )}
        {status === 'approved' && !isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-700"
            onClick={onPublish}
          >
            Publish
          </Button>
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
