
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface BlogsByDate {
  [year: string]: {
    [month: string]: Array<any>;
  };
}

const Blogs = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const { toast } = useToast();
  
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ["blogs", searchQuery],
    queryFn: async () => {
      console.log("Fetching blogs with query:", searchQuery);
      
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

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
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

  const handleSearch = () => {
    if (searchInput.trim() === searchQuery.trim()) {
      toast({
        description: "Please enter a different search term",
        duration: 2000,
      });
      return;
    }
    setSearchQuery(searchInput.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

  const hasBlogs = blogs && Object.keys(blogs).length > 0;

  if (!hasBlogs) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Blogs Found</AlertTitle>
          <AlertDescription>
            {searchQuery 
              ? `No blogs found matching "${searchQuery}". Try a different search term.`
              : "There are currently no approved blogs to display. Please check back later!"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Latest Blogs</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 w-72"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>

        {Object.entries(blogs)
          .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
          .map(([year, months]) => (
            <div key={year} className="space-y-6">
              <h2 className="text-2xl font-semibold">{year}</h2>
              {Object.entries(months)
                .sort(([monthA], [monthB]) => {
                  const dateA = new Date(`${monthA} 1, ${year}`);
                  const dateB = new Date(`${monthB} 1, ${year}`);
                  return dateB.getTime() - dateA.getTime();
                })
                .map(([month, monthBlogs]) => (
                  <div key={`${year}-${month}`} className="space-y-4">
                    <h3 className="text-xl font-medium text-muted-foreground">{month}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {monthBlogs.map((blog) => (
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
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Blogs;
