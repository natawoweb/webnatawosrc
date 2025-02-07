
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Blogs = () => {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      console.log("Fetching blogs...");
      const { data: session } = await supabase.auth.getSession();
      console.log("Current session:", session);

      // First fetch blogs with their categories
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          blog_categories(name)
        `)
        .eq("status", "approved");

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }

      console.log("Raw blogs data:", data); // Added to see raw data before author processing

      // Then fetch author profiles for the blogs
      const blogsWithAuthors = await Promise.all(
        data.map(async (blog) => {
          console.log("Processing blog:", blog); // Added to debug individual blog processing
          const { data: authorData, error: authorError } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", blog.author_id)
            .single();
          
          if (authorError) {
            console.error("Error fetching author for blog:", blog.id, authorError);
          }
          console.log("Author data for blog:", blog.id, authorData); // Added to debug author data
          
          return {
            ...blog,
            author_name: authorData?.full_name || "Anonymous"
          };
        })
      );
      
      console.log("Final processed blogs:", blogsWithAuthors);
      return blogsWithAuthors;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load blogs. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!blogs?.length) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Blogs Found</AlertTitle>
          <AlertDescription>
            There are currently no approved blogs to display. Please check back later!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog.id} className="flex flex-col">
            {blog.cover_image && (
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Category: {blog.blog_categories?.name || "Uncategorized"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Author: {blog.author_name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
