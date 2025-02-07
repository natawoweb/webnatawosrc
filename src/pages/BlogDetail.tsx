
import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Star, StarOff, Trash2 } from "lucide-react";
import { LoadingState } from "@/components/blogs/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = React.useState("");
  const [userRating, setUserRating] = React.useState(0);
  const [hoveredRating, setHoveredRating] = React.useState(0);

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
      const { data, error } = await supabase
        .from("blog_comments")
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq("blog_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
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

  React.useEffect(() => {
    if (userCurrentRating?.rating) {
      setUserRating(userCurrentRating.rating);
    }
  }, [userCurrentRating]);

  const handleRating = async (rating: number) => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to rate this blog",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("blog_ratings")
        .upsert({
          blog_id: id,
          user_id: session.user.id,
          rating,
        });

      if (error) throw error;

      setUserRating(rating);
      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleComment = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to comment",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Comment cannot be empty",
      });
      return;
    }

    try {
      const { error } = await supabase.from("blog_comments").insert({
        blog_id: id,
        user_id: session.user.id,
        content: comment.trim(),
      });

      if (error) throw error;

      setComment("");
      queryClient.invalidateQueries({ queryKey: ["blog-comments", id] });
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["blog-comments", id] });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
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
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

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

        <div className="mt-12 border-t pt-8">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="text-xl font-semibold mr-4">Rate this blog</h3>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRating(rating)}
                  disabled={!session}
                >
                  {rating <= (hoveredRating || userRating) ? (
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="w-6 h-6" />
                  )}
                </button>
              ))}
            </div>
            {!session && (
              <span className="text-sm text-muted-foreground ml-4">
                Please login to rate
              </span>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comments</h3>
            {session ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button onClick={handleComment}>Post Comment</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Please login to comment
              </p>
            )}

            <div className="space-y-4 mt-8">
              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        {comment.profiles?.full_name || "Anonymous"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {canDeleteComments && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
