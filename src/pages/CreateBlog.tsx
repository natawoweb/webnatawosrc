
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogContentSection } from "@/components/admin/blog/BlogContentSection";
import { CreateBlogHeader } from "@/components/admin/blog/CreateBlogHeader";
import { CreateBlogActions } from "@/components/admin/blog/CreateBlogActions";
import { LanguageSelector } from "@/components/admin/blog/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import type { BlogStatus } from "@/integrations/supabase/types/content";

const emptyContent = JSON.stringify({
  blocks: [{ 
    key: 'initial', 
    text: '', 
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {}
  }],
  entityMap: {}
});

export default function CreateBlog() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translateContent } = useTranslation();
  
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "tamil" | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(emptyContent);
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState(emptyContent);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  const createBlogMutation = useMutation({
    mutationFn: async (blogData: {
      title: string;
      content: string;
      title_tamil?: string;
      content_tamil?: string;
      status: BlogStatus;
      category_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("blogs")
        .insert({
          title: blogData.title,
          content: blogData.content,
          title_tamil: blogData.title_tamil || null,
          content_tamil: blogData.content_tamil || null,
          author_id: user.id,
          status: blogData.status,
          category_id: blogData.category_id || null,
          content_type: 'draft-js'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog created successfully",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog: " + error.message,
      });
    },
  });

  const handleCreate = (status: BlogStatus) => {
    if (status === "draft" && !title) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title is required even for drafts",
      });
      return;
    }

    if (status === "pending_approval" && (!title || !hasContent())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required for submission",
      });
      return;
    }

    createBlogMutation.mutate({
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
      const contentObj = JSON.parse(content);
      const hasNonEmptyTitle = title.trim().length > 0;
      const hasNonEmptyContent = contentObj.blocks.some((block: any) => block.text.trim().length > 0);
      return hasNonEmptyTitle && hasNonEmptyContent;
    } catch (error) {
      console.error('Error parsing content:', error);
      return false;
    }
  };

  if (!selectedLanguage) {
    return <LanguageSelector onLanguageSelect={setSelectedLanguage} />;
  }

  return (
    <div className="container max-w-[1400px] py-8">
      <div className="space-y-6">
        <CreateBlogHeader
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onBack={() => navigate("/dashboard")}
        />
        
        <CreateBlogActions
          onSaveDraft={() => handleCreate("draft")}
          onSubmit={() => handleCreate("pending_approval")}
          isLoading={createBlogMutation.isPending}
        />

        <div className="grid grid-cols-1 gap-6">
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
    </div>
  );
}
