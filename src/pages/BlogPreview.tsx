
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogContent } from "@/components/blog-detail/BlogContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBlogDetail } from "@/hooks/useBlogDetail";
import { LoadingState } from "@/components/blogs/LoadingState";
import { BlogErrorState } from "@/components/blog-detail/BlogErrorState";

export default function BlogPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Blog Preview</h1>
          
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="english" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                English
              </TabsTrigger>
              <TabsTrigger value="tamil" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                தமிழ்
              </TabsTrigger>
            </TabsList>
            <TabsContent value="english" className="mt-4">
              <article className="prose prose-lg max-w-none">
                <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                <BlogContent content={blog.content} />
              </article>
            </TabsContent>
            <TabsContent value="tamil" className="mt-4">
              <article className="prose prose-lg max-w-none">
                <h1 className="text-3xl font-bold mb-4">
                  {blog.title_tamil || "Title not available in Tamil"}
                </h1>
                {blog.content_tamil ? (
                  <BlogContent content={blog.content_tamil as string} />
                ) : (
                  <p className="text-muted-foreground italic">
                    Content not available in Tamil
                  </p>
                )}
              </article>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
