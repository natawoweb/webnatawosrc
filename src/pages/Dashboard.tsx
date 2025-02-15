
import { Link } from "react-router-dom";
import { BookPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogTable } from "@/components/dashboard/BlogTable";
import { useSession } from "@/hooks/useSession";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/hooks/useDashboardData";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export default function Dashboard() {
  const { session } = useSession();
  const { toast } = useToast();
  const { data: blogs, isLoading } = useDashboardData(session?.user?.id);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDelete = async (blogId: string) => {
    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blogId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handlePublish = async (blogId: string) => {
    try {
      console.log("Publishing blog:", blogId);
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("blogs")
        .update({ 
          status: 'published',
          published_at: now
        })
        .eq("id", blogId)
        .select();

      if (error) {
        console.error("Error publishing blog:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Blog published successfully",
      });
    } catch (error: any) {
      console.error("Publish error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const paginatedBlogs = blogs?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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

        <BlogTable 
          blogs={paginatedBlogs || []} 
          onDelete={handleDelete}
          onPublish={handlePublish}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={blogs?.length || 0}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
