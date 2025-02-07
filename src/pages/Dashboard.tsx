
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BookPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogStatusBadge } from "@/components/admin/blog/BlogStatusBadge";
import { useSession } from "@/hooks/useSession";

export default function Dashboard() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["writer-blogs", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          blog_comments(count),
          blog_categories (
            name
          )
        `)
        .eq("author_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const filteredBlogs = blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Writer's Dashboard</h1>
          <Link to="/write">
            <Button>
              <BookPlus className="mr-2 h-4 w-4" />
              Write New Blog
            </Button>
          </Link>
        </div>

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
            {filteredBlogs?.map((blog) => (
              <TableRow key={blog.id}>
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
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/blog/${blog.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/edit-blog/${blog.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        // Delete functionality will be implemented here
                        console.log("Delete blog:", blog.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
