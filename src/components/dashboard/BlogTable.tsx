
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogTableRow } from "./BlogTableRow";
import { Blog } from "@/types/blog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface BlogTableProps {
  blogs: Blog[];
  onDelete: (blogId: string) => Promise<void>;
  onPublish: (blogId: string) => Promise<void>;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function BlogTable({ 
  blogs, 
  onDelete, 
  onPublish,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: BlogTableProps) {
  return (
    <div className="space-y-4">
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
      
      <DataTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
