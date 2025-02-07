
import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoadingState } from "@/components/blogs/LoadingState";

const BlogDetail = () => {
  const { id } = useParams();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          blog_categories (
            name
          ),
          profiles (
            full_name
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load blog. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            The requested blog could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <article className="prose prose-lg mx-auto">
        {blog.cover_image && (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-8">
          <p>By {blog.profiles?.full_name || "Anonymous"}</p>
          <p>•</p>
          <p>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</p>
          <p>•</p>
          <p>{blog.blog_categories?.name || "Uncategorized"}</p>
        </div>
        <div className="mt-8" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
};

export default BlogDetail;
