
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Eye, Pencil, CheckCircle, XCircle, Star } from "lucide-react";
import { BlogStatusBadge } from "./BlogStatusBadge";
import { Database } from "@/integrations/supabase/types";
import type { BlogStatus } from "@/integrations/supabase/types/content";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogListRowProps {
  blog: Blog;
  getAuthorName: (authorId: string) => string;
  canDelete: boolean;
  isAdmin: boolean;
  onDelete: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function BlogListRow({
  blog,
  getAuthorName,
  canDelete,
  isAdmin,
  onDelete,
  onApprove,
  onReject,
}: BlogListRowProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const status = blog.status as BlogStatus;
  const [isFeatured, setIsFeatured] = useState(blog.featured || false);

  const handleFeatureBlog = async () => {
    try {
      const newFeaturedStatus = !isFeatured;
      const { error } = await supabase
        .from('blogs')
        .update({
          featured: newFeaturedStatus,
          featured_month: newFeaturedStatus ? new Date().toISOString().substring(0, 7) : null
        })
        .eq('id', blog.id);

      if (error) throw error;

      setIsFeatured(newFeaturedStatus);
      toast({
        title: "Success",
        description: newFeaturedStatus 
          ? "Blog has been featured for this month"
          : "Blog has been unfeatured"
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update featured status"
      });
    }
  };

  const renderActionButtons = () => {
    const showDeleteButton = isAdmin;

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
          onClick={() => navigate(`/edit/${blog.id}`)}
          title="Edit Blog"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        {status === 'published' && isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFeatureBlog}
            title={isFeatured ? "Unfeature Blog" : "Feature Blog"}
          >
            <Star className={`h-4 w-4 ${
              isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
            }`} />
          </Button>
        )}
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
