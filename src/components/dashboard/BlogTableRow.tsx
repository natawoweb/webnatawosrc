
import { TableCell, TableRow } from "@/components/ui/table";
import { BlogStatusBadge } from "@/components/admin/blog/BlogStatusBadge";
import { BlogTableActions } from "./BlogTableActions";
import { Database } from "@/integrations/supabase/types";

// Use the correct type from Supabase database types
type Blog = Database["public"]["Tables"]["blogs"]["Row"];

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
        <BlogStatusBadge status={blog.status || 'draft'} />
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
