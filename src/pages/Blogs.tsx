import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Blogs = () => {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      console.log("Fetching blogs...");
      
      // Fetch blogs with categories and author profiles in a single query
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          blog_categories (
            name
          ),
          author:profiles!blogs_author_id_fkey (
            full_name
          )
        `)
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }
      
      console.log("Fetched blogs:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col h-full">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Error loading blogs: {error.message}</p>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No Blogs Found</p>
        <p className="text-muted-foreground">
          There are currently no approved blogs to display. Please check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog.id} className="flex flex-col h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                {blog.title}
              </h2>
              <div
                className="text-muted-foreground mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html:
                    typeof blog.content === "string"
                      ? blog.content
                      : JSON.stringify(blog.content),
                }}
              />
              <p className="text-sm text-muted-foreground">
                Category: {blog.blog_categories?.name || "Uncategorized"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Author: {blog.author?.full_name || "Anonymous"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blogs;