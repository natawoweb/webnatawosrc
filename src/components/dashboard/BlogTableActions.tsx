
import { Eye, Pencil, Trash2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DeleteBlogDialog } from "@/components/admin/blog/DeleteBlogDialog";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogTableActionsProps {
  blogId: string;
  blog: Blog;
  status: string;
  onDelete: (blogId: string) => Promise<void>;
  onPublish: (blogId: string) => Promise<void>;
}

export function BlogTableActions({ 
  blogId, 
  blog,
  status, 
  onDelete, 
  onPublish 
}: BlogTableActionsProps) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await onDelete(blogId);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/blogs/${blogId}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Blog</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/edit/${blogId}`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Blog</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Blog</p>
            </TooltipContent>
          </Tooltip>

          {status === 'approved' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => onPublish(blogId)}
                >
                  <Rocket className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Publish Blog</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      <DeleteBlogDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        blog={blog}
      />
    </>
  );
}
