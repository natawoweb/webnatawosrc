
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BlogsList } from "@/components/blogs/BlogsList";
import { BlogSearch } from "@/components/blogs/BlogSearch";
import { LoadingState } from "@/components/blogs/LoadingState";
import { NoResults } from "@/components/blogs/NoResults";

interface BlogsByDate {
  [year: string]: {
    [month: string]: Array<any>;
  };
}

const Blogs = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchType, setSearchType] = React.useState("title");
  
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ["blogs", searchTerm, searchType],
    queryFn: async () => {
      console.log("Fetching blogs with search:", { term: searchTerm, type: searchType });
      
      let query = supabase
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
        .eq("status", "approved")
        .order('published_at', { ascending: false });

      if (searchTerm) {
        switch (searchType) {
          case "title":
            query = query.ilike('title', `%${searchTerm}%`);
            break;
          case "author":
            query = query.ilike('profiles.full_name', `%${searchTerm}%`);
            break;
          case "category":
            query = query.ilike('blog_categories.name', `%${searchTerm}%`);
            break;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }

      console.log("Fetched blogs:", data);
      
      // Transform and group the data by date
      const groupedBlogs = (data || []).reduce((acc: BlogsByDate, blog) => {
        const date = new Date(blog.published_at || blog.created_at);
        const year = date.getFullYear().toString();
        const month = date.toLocaleString('default', { month: 'long' });
        
        if (!acc[year]) {
          acc[year] = {};
        }
        if (!acc[year][month]) {
          acc[year][month] = [];
        }
        
        acc[year][month].push({
          ...blog,
          author_name: blog.profiles?.full_name || "Anonymous"
        });
        
        return acc;
      }, {});

      return groupedBlogs;
    },
  });

  const hasBlogs = blogs && Object.keys(blogs).length > 0;
  const hasActiveSearch = searchTerm.trim() !== '';

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
            Failed to load blogs. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hasBlogs) {
    return (
      <div className="container mx-auto py-8">
        <NoResults hasActiveSearch={hasActiveSearch} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">Latest Blogs</h1>
          <BlogSearch
            searchTerm={searchTerm}
            searchType={searchType}
            onSearchTermChange={setSearchTerm}
            onSearchTypeChange={setSearchType}
          />
        </div>

        <BlogsList blogs={blogs} />
      </div>
    </div>
  );
};

export default Blogs;
