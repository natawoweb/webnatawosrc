
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogContentSection } from "@/components/admin/blog/BlogContentSection";
import { CreateBlogHeader } from "@/components/admin/blog/CreateBlogHeader";
import { CreateBlogActions } from "@/components/admin/blog/CreateBlogActions";
import { useTranslation } from "@/hooks/useTranslation";
import type { BlogStatus } from "@/integrations/supabase/types/content";
import { useDebouncedCallback } from "use-debounce";

export default function EditBlog() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translateContent } = useTranslation();
  const queryClient = useQueryClient();
  
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "tamil">("english");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: blog } = useQuery({
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

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setTitleTamil(blog.title_tamil || "");
      setContentTamil(blog.content_tamil ? JSON.stringify(blog.content_tamil) : "");
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

  const updateBlog = useMutation({
    mutationFn: async (blogData: {
      title: string;
      content: string;
      title_tamil?: string;
      content_tamil?: string;
      category_id?: string;
    }) => {
      const { error } = await supabase
        .from("blogs")
        .update({
          title: blogData.title,
          content: blogData.content,
          title_tamil: blogData.title_tamil || null,
          content_tamil: blogData.content_tamil || null,
          category_id: blogData.category_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ["writer-blogs"] });
      toast({
        title: "Changes saved",
        description: "Your content has been automatically saved",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save changes: " + error.message,
      });
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });

  const debouncedSave = useDebouncedCallback(async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      await updateBlog.mutateAsync({
        title,
        content,
        title_tamil: titleTamil,
        content_tamil: contentTamil,
        category_id: selectedCategory
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      setIsSaving(false);
    }
  }, 1000);

  useEffect(() => {
    if (title || content || titleTamil || contentTamil) {
      debouncedSave();
    }
  }, [title, content, titleTamil, contentTamil, selectedCategory]);

  const submitBlog = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("blogs")
        .update({ status: "pending_approval" })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog submitted for approval",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit blog: " + error.message,
      });
    },
  });

  const handleSubmit = () => {
    if (!title || !hasContent()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required for submission",
      });
      return;
    }
    submitBlog.mutate();
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
      const contentObj = JSON.parse(content);
      const hasNonEmptyTitle = title.trim().length > 0;
      const hasNonEmptyContent = contentObj.blocks.some((block: any) => block.text.trim().length > 0);
      return hasNonEmptyTitle && hasNonEmptyContent;
    } catch (error) {
      console.error('Error parsing content:', error);
      return false;
    }
  };

  const handleBack = async () => {
    if (isSaving) {
      try {
        await debouncedSave.flush();
        if (updateBlog.isPending) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Error while saving before navigation:', error);
      }
    }
    navigate("/dashboard");
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-[1400px] py-8">
      <div className="space-y-6">
        <CreateBlogHeader
          title="Edit Blog"
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onBack={handleBack}
        />
        
        <CreateBlogActions
          onSubmit={handleSubmit}
          isLoading={submitBlog.isPending}
        />

        <BlogContentSection
          language={selectedLanguage}
          title={selectedLanguage === "english" ? title : titleTamil}
          content={selectedLanguage === "english" ? content : contentTamil}
          onTitleChange={selectedLanguage === "english" ? setTitle : setTitleTamil}
          onContentChange={selectedLanguage === "english" ? setContent : setContentTamil}
          onTranslate={selectedLanguage === "english" ? handleTranslate : undefined}
          hasContent={hasContent()}
        />
      </div>
    </div>
  );
}
