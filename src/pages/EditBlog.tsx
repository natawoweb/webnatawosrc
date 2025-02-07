
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogContentSection } from "@/components/admin/blog/BlogContentSection";
import { CreateBlogHeader } from "@/components/admin/blog/CreateBlogHeader";
import { CreateBlogActions } from "@/components/admin/blog/CreateBlogActions";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditBlog() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translateContent } = useTranslation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update state when blog data is loaded
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content ? JSON.stringify(blog.content) : JSON.stringify({
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: []
        }]
      }));
      setTitleTamil(blog.title_tamil || "");
      setContentTamil(blog.content_tamil ? JSON.stringify(blog.content_tamil) : JSON.stringify({
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: []
        }]
      }));
      setSelectedCategory(blog.category_id || "");
    }
  }, [blog]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async (blogData: {
      title: string;
      content: string;
      title_tamil?: string;
      content_tamil?: string;
      status: string;
      category_id?: string;
    }) => {
      const { error } = await supabase
        .from("blogs")
        .update({
          title: blogData.title,
          content: JSON.parse(blogData.content),
          title_tamil: blogData.title_tamil || null,
          content_tamil: blogData.content_tamil ? JSON.parse(blogData.content_tamil) : {},
          status: blogData.status,
          category_id: blogData.category_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog updated successfully",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog: " + error.message,
      });
    },
  });

  const handleUpdate = (status: "draft" | "pending_approval") => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    updateBlogMutation.mutate({
      title,
      content,
      title_tamil: titleTamil,
      content_tamil: contentTamil,
      status,
      category_id: selectedCategory
    });
  };

  const handleTranslate = async () => {
    try {
      const { translatedTitle, translatedContent } = await translateContent(title, content);
      setTitleTamil(translatedTitle);
      setContentTamil(translatedContent);
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  const hasContent = () => {
    try {
      if (!title) return false;
      const contentObj = JSON.parse(content || '{}');
      const textContent = contentObj.content?.[0]?.content?.[0]?.text;
      return Boolean(textContent);
    } catch (error) {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-[1400px] py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Edit Blog</h2>
        </div>

        <CreateBlogHeader
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onBack={() => navigate("/dashboard")}
        />
        
        <CreateBlogActions
          onSaveDraft={() => handleUpdate("draft")}
          onSubmit={() => handleUpdate("pending_approval")}
          isLoading={updateBlogMutation.isPending}
        />

        <div className="grid grid-cols-2 gap-6">
          <BlogContentSection
            language="english"
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onTranslate={handleTranslate}
            hasContent={hasContent()}
          />
          <BlogContentSection
            language="tamil"
            title={titleTamil}
            content={contentTamil}
            onTitleChange={setTitleTamil}
            onContentChange={setContentTamil}
          />
        </div>
      </div>
    </div>
  );
}
