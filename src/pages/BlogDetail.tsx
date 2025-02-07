
import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoadingState } from "@/components/blogs/LoadingState";
import { BlogHeader } from "@/components/blog-detail/BlogHeader";
import { BlogContent } from "@/components/blog-detail/BlogContent";
import { BlogRating } from "@/components/blog-detail/BlogRating";
import { BlogComments } from "@/components/blog-detail/BlogComments";

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

  const { data: userRoles } = useQuery({
    queryKey: ["user-roles", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const canDeleteComments = userRoles?.some(
    (role) => role.role === "admin" || role.role === "manager"
  );

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

  const { data: comments } = useQuery({
    queryKey: ["blog-comments", id],
    queryFn: async () => {
      const { data: commentsData, error: commentsError } = await supabase
        .from("blog_comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            full_name
          )
        `)
        .eq("blog_id", id)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch reactions for each comment
      const commentsWithReactions = await Promise.all(
        commentsData.map(async (comment) => {
          const { data: reactions } = await supabase
            .from("comment_reactions")
            .select("reaction_type, user_id")
            .eq("comment_id", comment.id);

          const userReaction = reactions?.find(
            (r) => r.user_id === session?.user?.id
          )?.reaction_type;

          const likes = reactions?.filter((r) => r.reaction_type === "like").length || 0;
          const dislikes = reactions?.filter((r) => r.reaction_type === "dislike").length || 0;

          return {
            ...comment,
            likes_count: likes,
            dislikes_count: dislikes,
            user_reaction: userReaction,
          };
        })
      );

      return commentsWithReactions;
    },
    enabled: !!id,
  });

  const { data: userCurrentRating } = useQuery({
    queryKey: ["blog-user-rating", id, session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from("blog_ratings")
        .select("rating")
        .eq("blog_id", id)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
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
