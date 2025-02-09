
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useSession } from "@/hooks/useSession";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogListProps {
  blogs: Blog[];
}

export function BlogList({ blogs }: BlogListProps) {
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useSession();
  const { data: userRoles } = useUserRoles(session?.user?.id);

  const { 
    deleteBlogMutation, 
    canDeleteBlog, 
    getAuthorName,
    userProfile,
  } = useBlogListManagement();

  const isAdmin = userRoles?.some(role => role.role === 'admin') || false;
  console.log('BlogList - User Roles:', userRoles);
  console.log('BlogList - Is Admin:', isAdmin);

  const handleDelete = (blog: Blog) => {
    console.log("Setting blog to delete:", blog);
    setBlogToDelete(blog);
  };

  const handleApprove = async (blog: Blog) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: 'approved' })
        .eq('id', blog.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog has been approved",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleReject = async (blog: Blog) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: 'rejected' })
        .eq('id', blog.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog has been rejected",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
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
              isAdmin={isAdmin}
              onDelete={() => handleDelete(blog)}
              onEdit={() => {
                setBlogToEdit(blog);
                setIsEditDialogOpen(true);
              }}
              onApprove={() => handleApprove(blog)}
              onReject={() => handleReject(blog)}
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

