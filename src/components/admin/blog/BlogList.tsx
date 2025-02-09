
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DeleteBlogDialog } from "./DeleteBlogDialog";
import { EditBlogDialog } from "./EditBlogDialog";
import { BlogListRow } from "./BlogListRow";
import { useBlogListManagement } from "@/hooks/useBlogListManagement";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogListProps {
  blogs: Blog[];
}

export function BlogList({ blogs }: BlogListProps) {
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { 
    deleteBlogMutation, 
    canDeleteBlog, 
    getAuthorName 
  } = useBlogListManagement();

  const handleDelete = (blog: Blog) => {
    console.log("Setting blog to delete:", blog);
    setBlogToDelete(blog);
  };

  // Helper function to safely convert content_tamil to string
  const getContentTamilString = (contentTamil: any): string => {
    if (!contentTamil) return "";
    if (typeof contentTamil === "string") return contentTamil;
    return JSON.stringify(contentTamil);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <BlogListRow
              key={blog.id}
              blog={blog}
              getAuthorName={getAuthorName}
              canDelete={canDeleteBlog(blog)}
              onDelete={() => handleDelete(blog)}
              onEdit={() => {
                setBlogToEdit(blog);
                setIsEditDialogOpen(true);
              }}
            />
          ))}
        </TableBody>
      </Table>

      {blogToEdit && (
        <EditBlogDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          blog={blogToEdit}
          title={blogToEdit.title}
          content={blogToEdit.content}
          titleTamil={blogToEdit.title_tamil || ""}
          contentTamil={getContentTamilString(blogToEdit.content_tamil)}
          selectedCategory={blogToEdit.category_id || ""}
          categories={[]} // This will be populated by the EditBlogDialog component
          onTitleChange={() => {}}
          onContentChange={() => {}}
          onTitleTamilChange={() => {}}
          onContentTamilChange={() => {}}
          onCategoryChange={() => {}}
          onSaveDraft={() => {}}
          onSubmit={() => {}}
          isLoading={false}
        />
      )}

      <DeleteBlogDialog
        open={!!blogToDelete}
        onOpenChange={(open) => {
          if (!open) setBlogToDelete(null);
        }}
        onConfirm={() => {
          if (blogToDelete) {
            console.log("Confirming delete for blog:", blogToDelete.id);
            deleteBlogMutation.mutate(blogToDelete.id);
            setBlogToDelete(null);
          }
        }}
        blog={blogToDelete}
      />
    </>
  );
}
