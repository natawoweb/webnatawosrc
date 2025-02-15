
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useDebouncedCallback } from "use-debounce";

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

interface UseBlogFormProps {
  blogId?: string;
  initialData?: {
    title?: string;
    content?: string;
    title_tamil?: string;
    content_tamil?: string;
    category_id?: string;
  };
}

export function useBlogForm({ blogId: initialBlogId, initialData }: UseBlogFormProps = {}) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { translateContent } = useTranslation();
  const queryClient = useQueryClient();
  
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "tamil">("english");
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || emptyContent);
  const [titleTamil, setTitleTamil] = useState(initialData?.title_tamil || "");
  const [contentTamil, setContentTamil] = useState(initialData?.content_tamil ? 
    typeof initialData.content_tamil === 'string' ? 
      initialData.content_tamil : 
      JSON.stringify(initialData.content_tamil) 
    : emptyContent);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category_id || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | undefined>(initialBlogId);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || emptyContent);
      setTitleTamil(initialData.title_tamil || "");
      setContentTamil(initialData.content_tamil ? 
        typeof initialData.content_tamil === 'string' ? 
          initialData.content_tamil : 
          JSON.stringify(initialData.content_tamil) 
        : emptyContent);
      setSelectedCategory(initialData.category_id || "");
    }
    if (initialBlogId) {
      setCurrentBlogId(initialBlogId);
    }
  }, [initialData, initialBlogId]);

  const saveBlog = useMutation({
    mutationFn: async (blogData: {
      title: string;
      content: string;
      title_tamil?: string;
      content_tamil?: string;
      category_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      if (currentBlogId) {
        console.log('Updating existing blog:', currentBlogId);
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
          .eq('id', currentBlogId);

        if (error) {
          console.error('Error updating blog:', error);
          throw error;
        }
        return currentBlogId;
      } else {
        console.log('Creating new blog');
        const { data, error } = await supabase
          .from("blogs")
          .insert({
            title: blogData.title,
            content: blogData.content,
            title_tamil: blogData.title_tamil || null,
            content_tamil: blogData.content_tamil || null,
            category_id: blogData.category_id || null,
            author_id: user.id,
            status: "draft",
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating blog:', error);
          throw error;
        }
        setCurrentBlogId(data.id);
        return data.id;
      }
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["writer-blogs"] });
      toast({
        title: "Changes saved",
        description: "Your content has been automatically saved",
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error('Save error:', error);
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
    if (!title && !hasContent()) return;

    try {
      setIsSaving(true);
      console.log('Saving blog with ID:', currentBlogId);
      await saveBlog.mutateAsync({
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
    if (title || content !== emptyContent || titleTamil || contentTamil !== emptyContent) {
      debouncedSave();
    }
  }, [title, content, titleTamil, contentTamil, selectedCategory]);

  const submitBlog = useMutation({
    mutationFn: async () => {
      if (!currentBlogId && !title) {
        throw new Error("Blog must be saved as draft first");
      }

      const updateData = {
        status: "pending_approval" as const,
        title,
        content,
        title_tamil: titleTamil || null,
        content_tamil: contentTamil || null,
        category_id: selectedCategory || null,
      };

      if (currentBlogId) {
        const { error } = await supabase
          .from("blogs")
          .update(updateData)
          .eq('id', currentBlogId);

        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const { error } = await supabase
          .from("blogs")
          .insert({
            ...updateData,
            author_id: user.id,
          });

        if (error) throw error;
      }
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
      if (!content || content.trim() === '') return false;
      
      const contentObj = JSON.parse(content);
      const hasNonEmptyTitle = title.trim().length > 0;
      const hasNonEmptyContent = contentObj.blocks && contentObj.blocks.some((block: any) => block.text.trim().length > 0);
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
        if (saveBlog.isPending) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Error while saving before navigation:', error);
      }
    }
    navigate("/dashboard");
  };

  return {
    selectedLanguage,
    setSelectedLanguage,
    title,
    setTitle,
    content,
    setContent,
    titleTamil,
    setTitleTamil,
    contentTamil,
    setContentTamil,
    selectedCategory,
    setSelectedCategory,
    handleSubmit,
    handleTranslate,
    handleBack,
    hasContent,
    isSubmitting: submitBlog.isPending,
    isSaving: saveBlog.isPending,
    lastSaved,
  };
}
