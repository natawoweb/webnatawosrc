
import { useState } from "react";
import { BlogFilters } from "./BlogFilters";
import { BlogTable } from "./BlogTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Blog = Database['public']['Tables']['blogs']['Row'];
type BlogStatus = Database['public']['Enums']['blog_status'];

export function BlogManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<BlogStatus | "all">("all");
  const navigate = useNavigate();
  const { session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["writer-blogs", searchQuery, selectedStatus, session?.user.id],
    queryFn: async () => {
      let query = supabase
        .from('blogs')
        .select('*', { count: 'exact' })
        .eq('author_id', session?.user.id);

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (selectedStatus && selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Blog[];
    },
    enabled: !!session?.user.id,
  });

  const handleCreateBlog = () => {
    navigate('/writer/blogs/new');
  };

  const handleEditBlog = (blog: Blog) => {
    navigate(`/writer/blogs/${blog.id}/edit`);
  };

  const handleViewBlog = (blog: Blog) => {
    navigate(`/blogs/${blog.id}`);
  };

  const handleDeleteBlog = async (blog: Blog) => {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', blog.id);

    if (error) {
      console.error('Error deleting blog:', error);
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
        <Button onClick={handleCreateBlog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Blog
        </Button>
      </div>

      <BlogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <BlogTable
        blogs={blogs || []}
        isLoading={isLoading}
        onEdit={handleEditBlog}
        onDelete={handleDeleteBlog}
        onView={handleViewBlog}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={blogs?.length || 0}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
