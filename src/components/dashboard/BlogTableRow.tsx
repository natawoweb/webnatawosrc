
import { TableCell, TableRow } from "@/components/ui/table";
import { BlogStatusBadge } from "@/components/admin/blog/BlogStatusBadge";
import { BlogTableActions } from "./BlogTableActions";
import { Database } from "@/integrations/supabase/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

// Extend the base Blog type to include the joined data
type Blog = Database["public"]["Tables"]["blogs"]["Row"] & {
  blog_comments?: Array<{ count: number }>;
  blog_categories?: { name: string };
};

interface BlogTableRowProps {
  blog: Blog;
  onDelete: (blogId: string) => Promise<void>;
  onPublish: (blogId: string) => Promise<void>;
}

export function BlogTableRow({ blog, onDelete, onPublish }: BlogTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{blog.title}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <BlogStatusBadge status={blog.status || 'draft'} />
          {blog.status === 'rejected' && blog.rejection_reason && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{blog.rejection_reason}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      <TableCell>
        {blog.published_at 
          ? new Date(blog.published_at).toLocaleDateString() 
          : '-'}
      </TableCell>
      <TableCell>{blog.views_count || 0}</TableCell>
      <TableCell>{blog.blog_comments?.[0]?.count || 0}</TableCell>
      <TableCell>
        <BlogTableActions
          blogId={blog.id}
          blog={blog}
          status={blog.status || 'draft'}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      </TableCell>
    </TableRow>
  );
}
