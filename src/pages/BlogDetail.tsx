
import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/blogs/LoadingState";
import { BlogHeader } from "@/components/blog-detail/BlogHeader";
import { BlogContent } from "@/components/blog-detail/BlogContent";
import { BlogRating } from "@/components/blog-detail/BlogRating";
import { BlogComments } from "@/components/blog-detail/BlogComments";
import { BlogErrorState } from "@/components/blog-detail/BlogErrorState";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import { useBlogComments } from "@/hooks/useBlogComments";
import { useBlogRating } from "@/hooks/useBlogRating";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckSquare, XSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BlogDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { language } = useLanguage();

  // Increment view count when the page loads
  React.useEffect(() => {
    if (id) {
      const incrementViews = async () => {
        await supabase.rpc('increment_blog_views', { blog_id: id });
      };
      incrementViews();
    }
  }, [id]);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: userRoles } = useUserRoles(session?.user?.id);
  const { data: blog, isLoading, error } = useBlogDetail(id);
  const comments = useBlogComments(id!, session);
  const { data: userCurrentRating } = useBlogRating(id!, session?.user?.id);

  const isAdminOrManager = userRoles?.some(
    (role) => role.role === "admin" || role.role === "manager"
  );

  const canApproveOrReject = isAdminOrManager && blog?.status === 'pending_approval';

  const handleApprove = async () => {
    if (!id) return;
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog has been approved",
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog has been rejected",
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <BlogErrorState error={error} />;
  }

  if (!blog) {
    return <BlogErrorState notFound />;
  }

  const getTitle = () => {
    // Only return Tamil title if it exists and Tamil language is selected
    if (language === 'tamil' && blog.title_tamil) {
      return blog.title_tamil;
    }
    // Fallback to English title
    return blog.title;
  };

  const getContent = () => {
    let content;
    
    // Only use Tamil content if it exists and Tamil language is selected
    if (language === 'tamil' && blog.content_tamil) {
      content = blog.content_tamil;
    } else {
      // Fallback to English content
      content = blog.content;
    }

    // Handle content parsing
    if (typeof content === 'string') {
      try {
        // Check if the content is JSON
        const parsedContent = JSON.parse(content);
        return JSON.stringify(parsedContent);
      } catch {
        // If parsing fails, return as-is (it's probably plain text)
        return content;
      }
    }
    
    // If content is already an object, stringify it
    return JSON.stringify(content);
  };

  return (
    <div className="container mx-auto py-8">
      <article className="prose prose-lg mx-auto">
        <BlogHeader
          title={getTitle()}
          authorName={blog.profiles?.full_name}
          publishedDate={blog.published_at || blog.created_at}
          categoryName={blog.blog_categories?.name}
          coverImage={blog.cover_image}
          viewsCount={blog.views_count}
        />
        
        {canApproveOrReject && (
          <div className="flex gap-4 my-4">
            <Button
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Approve Blog
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
            >
              <XSquare className="w-4 h-4 mr-2" />
              Reject Blog
            </Button>
          </div>
        )}
        
        <BlogContent content={getContent()} />

        <div className="mt-12 border-t pt-8">
          <BlogRating
            blogId={blog.id}
            initialRating={userCurrentRating?.rating}
          />

          <BlogComments
            blogId={blog.id}
            comments={comments}
            session={session}
            canDeleteComments={isAdminOrManager}
          />
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
