
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useDebouncedCallback } from "use-debounce";
import { useBlogState } from "./blog/useBlogState";
import { useBlogMutations } from "./blog/useBlogMutations";
import { useBlogValidation } from "./blog/useBlogValidation";

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
  const { hasContent } = useBlogValidation();
  
  const {
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
    lastSaved,
    setLastSaved,
    isSaving,
    setIsSaving,
    currentBlogId,
    setCurrentBlogId,
    emptyContent
  } = useBlogState({ initialData, initialBlogId });

  const { saveBlog, submitBlog } = useBlogMutations(
    currentBlogId,
    setCurrentBlogId,
    setLastSaved,
    setIsSaving
  );

  // Increase debounce time to 2 seconds and add leading edge trigger
  const debouncedSave = useDebouncedCallback(async () => {
    if (isSaving) return;
    if (!title && !hasContent(content, title)) return;

    try {
      setIsSaving(true);
      console.log('Auto-saving blog with ID:', currentBlogId);
      console.log('Content being saved:', content);
      
      await saveBlog.mutateAsync({
        title,
        content,
        title_tamil: titleTamil,
        content_tamil: contentTamil,
        category_id: selectedCategory
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, 2000, { leading: true, trailing: true });

  // Only trigger auto-save when content actually changes
  useEffect(() => {
    const hasRealContent = content !== emptyContent;
    const shouldSave = hasRealContent || title || titleTamil || contentTamil !== emptyContent;
    
    if (shouldSave) {
      console.log('Content changed, triggering auto-save');
      debouncedSave();
    }
  }, [title, content, titleTamil, contentTamil, selectedCategory]);

  const handleSubmit = () => {
    if (!title || !hasContent(content, title)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required for submission",
      });
      return;
    }
    submitBlog.mutate({
      title,
      content,
      title_tamil: titleTamil,
      content_tamil: contentTamil,
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
    hasContent: () => hasContent(content, title),
    isSubmitting: submitBlog.isPending,
    isSaving: saveBlog.isPending,
    lastSaved,
  };
}
