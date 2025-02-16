
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogForm } from "@/components/admin/blog/BlogForm";
import { useBlogForm } from "@/hooks/useBlogForm";

export default function CreateBlog() {
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

  const {
    selectedLanguage,
    setSelectedLanguage,
    title,
    content,
    titleTamil,
    contentTamil,
    selectedCategory,
    setSelectedCategory,
    handleSubmit,
    handleTranslate,
    handleBack,
    setTitle,
    setContent,
    setTitleTamil,
    setContentTamil,
    hasContent,
    isSubmitting,
  } = useBlogForm();

  return (
    <BlogForm
      categories={categories || []}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      handleSubmit={handleSubmit}
      handleTranslate={handleTranslate}
      handleBack={handleBack}
      currentTitle={title}
      content={content}
      titleTamil={titleTamil}
      contentTamil={contentTamil}
      setTitle={setTitle}
      setContent={setContent}
      setTitleTamil={setTitleTamil}
      setContentTamil={setContentTamil}
      hasContent={hasContent}
      isSubmitting={isSubmitting}
    />
  );
}
