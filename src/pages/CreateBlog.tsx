
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogContentSection } from "@/components/admin/blog/BlogContentSection";
import { CreateBlogHeader } from "@/components/admin/blog/CreateBlogHeader";
import { CreateBlogActions } from "@/components/admin/blog/CreateBlogActions";
import { useTranslation } from "@/hooks/useTranslation";

export default function CreateBlog() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translateContent } = useTranslation();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(JSON.stringify({
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
  }));
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState(JSON.stringify({
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
  }));
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
      status: string;
      category_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log('Creating blog with data:', blogData);

      const { error } = await supabase
        .from("blogs")
        .insert({
          title: blogData.title,
          content: blogData.content,
          title_tamil: blogData.title_tamil || null,
          content_tamil: blogData.content_tamil || null,
          author_id: user.id,
          status: blogData.status,
          category_id: blogData.category_id || null
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

  const handleCreate = (status: "draft" | "pending_approval") => {
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
      
      console.log('Content check:', {
        hasNonEmptyTitle,
        hasNonEmptyContent,
        title: title.trim(),
        blocks: contentObj.blocks.map((b: any) => b.text.trim())
      });
      
      return hasNonEmptyTitle && hasNonEmptyContent;
    } catch (error) {
      console.error('Error parsing content:', error);
      return false;
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
