
import { Link } from "react-router-dom";
import { BookPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogTable } from "@/components/dashboard/BlogTable";
import { useSession } from "@/hooks/useSession";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/hooks/useDashboardData";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { session } = useSession();
  const { toast } = useToast();
  const { data: blogs, isLoading } = useDashboardData(session?.user?.id);

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
      const { error } = await supabase
        .from("blogs")
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq("id", blogId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog published successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
          blogs={blogs || []} 
          onDelete={handleDelete}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}
