import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlogStatusBadge } from "./BlogStatusBadge";
import { EditBlogDialog } from "./EditBlogDialog";
import { DeleteUserDialog } from "../DeleteUserDialog";
import { Database } from "@/integrations/supabase/types";
import { useState } from "react";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogListProps {
  blogs: Blog[];
}

export function BlogList({ blogs }: BlogListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  // Add query to fetch author names
  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name");
      if (error) throw error;
      return data;
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blogId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });
      setBlogToDelete(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog: " + error.message,
      });
    },
  });

  // Helper function to get author name
  const getAuthorName = (authorId: string) => {
    const profile = profiles?.find(p => p.id === authorId);
    return profile?.full_name || 'Unknown Author';
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
            <TableRow key={blog.id}>
              <TableCell className="font-medium">{blog.title}</TableCell>
              <TableCell>{getAuthorName(blog.author_id)}</TableCell>
              <TableCell>
                <BlogStatusBadge status={blog.status} />
              </TableCell>
              <TableCell>{new Date(blog.updated_at || "").toLocaleDateString()}</TableCell>
              <TableCell className="space-x-2">
                <EditBlogDialog blog={blog} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBlogToDelete(blog)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteUserDialog
        open={!!blogToDelete}
        onOpenChange={() => setBlogToDelete(null)}
        onConfirm={() => {
          if (blogToDelete) {
            deleteBlogMutation.mutate(blogToDelete.id);
          }
        }}
      />
    </>
  );
}