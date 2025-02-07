
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

const BlogDetail = () => {
  const { id } = useParams();

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

  const { data: userRoles } = useUserRoles(session?.user.id);
  const { data: blog, isLoading, error } = useBlogDetail(id);
  const comments = useBlogComments(id!, session);
  const { data: userCurrentRating } = useBlogRating(id!, session?.user.id);

  const canDeleteComments = userRoles?.some(
    (role) => role.role === "admin" || role.role === "manager"
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <BlogErrorState error={error} />;
  }

  if (!blog) {
    return <BlogErrorState notFound />;
  }

  return (
    <div className="container mx-auto py-8">
      <article className="prose prose-lg mx-auto">
        <BlogHeader
          title={blog.title}
          authorName={blog.profiles?.full_name}
          publishedDate={blog.published_at || blog.created_at}
          categoryName={blog.blog_categories?.name}
          coverImage={blog.cover_image}
          viewsCount={blog.views_count}
        />
        
        <BlogContent content={blog.content} />

        <div className="mt-12 border-t pt-8">
          <BlogRating
            blogId={blog.id}
            initialRating={userCurrentRating?.rating}
          />

          <BlogComments
            blogId={blog.id}
            comments={comments}
            session={session}
            canDeleteComments={canDeleteComments}
          />
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
