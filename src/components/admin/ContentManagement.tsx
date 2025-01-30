import { useQuery } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type BlogWithProfile = Blog & {
  author_name: string | null;
};

export function ContentManagement() {
  const { toast } = useToast();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      // First, get all blogs
      const { data: blogs, error: blogsError } = await supabase
        .from("blogs")
        .select("*")
        .returns<Blog[]>();

      if (blogsError) throw blogsError;

      // Then get all unique author profiles
      const uniqueAuthorIds = [...new Set(blogs.map(blog => blog.author_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", uniqueAuthorIds)
        .returns<Profile[]>();

      if (profilesError) throw profilesError;

      // Combine blogs with author names
      const blogsWithProfiles: BlogWithProfile[] = blogs.map(blog => ({
        ...blog,
        author_name: profiles.find(profile => profile.id === blog.author_id)?.full_name || "Unknown"
      }));

      return blogsWithProfiles;
    },
  });

  const updateBlogStatus = async (blogId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("blogs")
        .update({ status })
        .eq("id", blogId);

      if (error) throw error;

      toast({
        title: "Blog updated",
        description: `Blog has been ${status}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog status.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          View All Content
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs?.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium">{blog.title}</TableCell>
              <TableCell>{blog.author_name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    blog.status === "approved"
                      ? "default"
                      : blog.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {blog.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(blog.created_at || "").toLocaleDateString()}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateBlogStatus(blog.id, "approved")}
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateBlogStatus(blog.id, "rejected")}
                >
                  <XCircle className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}