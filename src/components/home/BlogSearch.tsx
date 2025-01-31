import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type BlogCategory = Database["public"]["Tables"]["blog_categories"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type Blog = Database["public"]["Tables"]["blogs"]["Row"] & {
  blog_categories: BlogCategory | null;
  profiles: Profile | null;
};

export function BlogSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const navigate = useNavigate();

  const { data: blogs } = useQuery({
    queryKey: ["blogs", searchQuery, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from("blogs")
        .select(`
          *,
          blog_categories(*),
          profiles(*)
        `)
        .eq('status', 'approved');

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (categoryFilter) {
        query = query.eq("category_id", categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Blog[];
    },
  });

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore Blogs</h2>
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {blog.cover_image && (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  By {blog.profiles?.full_name} in {blog.blog_categories?.name}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/blog/${blog.id}`)}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
