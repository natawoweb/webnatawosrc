
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogTableRow } from "./BlogTableRow";
import { Blog } from "@/types/blog";

interface BlogTableProps {
  blogs: Blog[];
  onDelete: (blogId: string) => Promise<void>;
  onPublish: (blogId: string) => Promise<void>;
}

export function BlogTable({ blogs, onDelete, onPublish }: BlogTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Published Date</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogs?.map((blog) => (
          <BlogTableRow
            key={blog.id}
            blog={blog}
            onDelete={onDelete}
            onPublish={onPublish}
          />
        ))}
      </TableBody>
    </Table>
  );
}
