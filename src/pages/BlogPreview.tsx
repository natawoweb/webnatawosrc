
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import { LoadingState } from "@/components/blogs/LoadingState";
import { BlogErrorState } from "@/components/blog-detail/BlogErrorState";
import { BlogHeader } from "@/components/blog-detail/BlogHeader";
import { BlogRating } from "@/components/blog-detail/BlogRating";
import { BlogComments } from "@/components/blog-detail/BlogComments";
import { useSession } from "@/hooks/useSession";
import { BlogPreviewTabs } from "@/components/admin/blog/preview/BlogPreviewTabs";

export default function BlogPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useSession();
  const { data: blog, isLoading, error } = useBlogDetail(id);

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
      <div className="space-y-6">
        <BlogHeader
          title={blog.title}
          authorName={blog.profiles?.full_name || "Anonymous"}
          publishedDate={blog.created_at || ""}
          categoryName={blog.blog_categories?.name || "Uncategorized"}
          coverImage={blog.cover_image || undefined}
          viewsCount={blog.views_count || 0}
        />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <BlogPreviewTabs blog={blog} />

          <div className="mt-8">
            <BlogRating blogId={blog.id} />
          </div>

          <div className="mt-8">
            <BlogComments
              blogId={blog.id}
              comments={[]}
              session={session}
              canDeleteComments={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
