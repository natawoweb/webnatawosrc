import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import { Globe, Save } from "lucide-react";

export default function CreateBlog() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState("");

  const createBlogMutation = useMutation({
    mutationFn: async (blogData: {
      title: string;
      content: string;
      title_tamil?: string;
      content_tamil?: string;
      status: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("blogs")
        .insert({
          title: blogData.title,
          content: blogData.content ? JSON.parse(blogData.content) : {},
          title_tamil: blogData.title_tamil || null,
          content_tamil: blogData.content_tamil ? JSON.parse(blogData.content_tamil) : {},
          author_id: user.id,
          status: blogData.status
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({
        title: "Success",
        description: "Blog created successfully",
      });
      navigate("/admin");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog: " + error.message,
      });
    },
  });

  const handleCreate = (status: "draft" | "pending_approval") => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    createBlogMutation.mutate({
      title,
      content,
      title_tamil: titleTamil,
      content_tamil: contentTamil,
      status
    });
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Blog</h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => handleCreate("draft")}
              disabled={createBlogMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              onClick={() => handleCreate("pending_approval")}
              disabled={createBlogMutation.isPending}
            >
              Submit for Approval
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium">Title (English)</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <label htmlFor="content" className="text-sm font-medium">Content (English)</label>
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="title-tamil" className="text-sm font-medium">Title (Tamil)</label>
              <Button variant="ghost" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                Translate
              </Button>
            </div>
            <Input
              id="title-tamil"
              value={titleTamil}
              onChange={(e) => setTitleTamil(e.target.value)}
              placeholder="Enter blog title in Tamil"
            />
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content-tamil" className="text-sm font-medium">Content (Tamil)</label>
                <Button variant="ghost" size="sm">
                  <Globe className="mr-2 h-4 w-4" />
                  Translate
                </Button>
              </div>
              <RichTextEditor
                content={contentTamil}
                onChange={setContentTamil}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}