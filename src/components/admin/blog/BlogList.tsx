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

  // Helper function to get author name
  const getAuthorName = (authorId: string) => {
    const profile = profiles?.find(p => p.id === authorId);
    return profile?.full_name || 'Unknown Author';
  };

  return (
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
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this blog?')) {
                    deleteBlogMutation.mutate(blog.id);
                  }
                }}
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