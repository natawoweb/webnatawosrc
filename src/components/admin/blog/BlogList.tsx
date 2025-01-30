import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BlogStatusBadge } from "./BlogStatusBadge";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogListProps {
  blogs: Blog[];
}

export function BlogList({ blogs }: BlogListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBlogStatusMutation = useMutation({
    mutationFn: async ({ blogId, status }: { blogId: string; status: string }) => {
      const { error } = await supabase
        .from("blogs")
        .update({ status })
        .eq("id", blogId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({
        title: "Success",
        description: "Blog status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog status: " + error.message,
      });
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
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog: " + error.message,
      });
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogs.map((blog) => (
          <TableRow key={blog.id}>
            <TableCell className="font-medium">{blog.title}</TableCell>
            <TableCell>
              <BlogStatusBadge status={blog.status} />
            </TableCell>
            <TableCell>{new Date(blog.created_at || "").toLocaleDateString()}</TableCell>
            <TableCell>{new Date(blog.updated_at || "").toLocaleDateString()}</TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const nextStatus = {
                    draft: "submitted",
                    submitted: "approved",
                    approved: "rejected",
                    rejected: "draft"
                  }[blog.status as string];
                  updateBlogStatusMutation.mutate({ 
                    blogId: blog.id, 
                    status: nextStatus 
                  });
                }}
              >
                <Edit className="h-4 w-4 text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteBlogMutation.mutate(blog.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}