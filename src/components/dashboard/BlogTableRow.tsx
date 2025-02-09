
import { TableCell, TableRow } from "@/components/ui/table";
import { BlogStatusBadge } from "@/components/admin/blog/BlogStatusBadge";
import { BlogTableActions } from "./BlogTableActions";
import { Blog } from "@/types/blog";

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
          status={blog.status || 'draft'}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      </TableCell>
    </TableRow>
  );
}
