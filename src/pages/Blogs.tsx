import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BlogsList } from "@/components/blogs/BlogsList";
import { BlogSearch } from "@/components/blogs/BlogSearch";
import { LoadingState } from "@/components/blogs/LoadingState";
import { NoResults } from "@/components/blogs/NoResults";
import { startOfDay, endOfDay } from "date-fns";

interface BlogsByDate {
  [year: string]: {
    [month: string]: Array<any>;
  };
}

const Blogs = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchType, setSearchType] = React.useState("title");
  const [dateFilter, setDateFilter] = React.useState<Date>();
  const [ratingFilter, setRatingFilter] = React.useState("all");
  
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ["blogs", searchTerm, searchType, dateFilter, ratingFilter],
    queryFn: async () => {
      console.log("Fetching blogs with search:", { 
        term: searchTerm, 
        type: searchType,
        date: dateFilter,
        rating: ratingFilter
      });
      
      let query = supabase
        .from("blogs")
        .select(`
          *,
          blog_categories (
            name
          ),
          profiles (
            full_name
          ),
          ratings (
            rating
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

      if (dateFilter) {
        query = query.gte('published_at', startOfDay(dateFilter).toISOString())
                    .lte('published_at', endOfDay(dateFilter).toISOString());
      }

      const { data: blogsData, error } = await query;

      if (error) {
        console.error("Error fetching blogs:", error);
        throw error;
      }

      // If rating filter is applied, filter blogs by average rating
      if (ratingFilter !== 'all' && blogsData) {
        const filteredBlogs = blogsData.filter(blog => {
          const ratings = blog.ratings || [];
          if (ratings.length === 0) return false;
          
          const averageRating = ratings.reduce((acc: number, curr: any) => 
            acc + curr.rating, 0) / ratings.length;
          
          return averageRating >= parseInt(ratingFilter);
        });
        
        return groupBlogsByDate(filteredBlogs);
      }

      return groupBlogsByDate(blogsData || []);
    },
  });

  const groupBlogsByDate = (blogs: any[]) => {
    return blogs.reduce((acc: BlogsByDate, blog) => {
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
  };

  const hasBlogs = !!(blogs && Object.keys(blogs).length > 0);
  const hasActiveSearch = searchTerm.trim() !== '' || !!dateFilter || ratingFilter !== 'all';

  if (isLoading) {
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
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              ratingFilter={ratingFilter}
              onRatingFilterChange={setRatingFilter}
            />
          </div>
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
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
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              ratingFilter={ratingFilter}
              onRatingFilterChange={setRatingFilter}
            />
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load blogs. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
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
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            ratingFilter={ratingFilter}
            onRatingFilterChange={setRatingFilter}
          />
        </div>

        {!hasBlogs && <NoResults hasActiveSearch={hasActiveSearch} />}
        {hasBlogs && <BlogsList blogs={blogs} />}
      </div>
    </div>
  );
};

export default Blogs;
