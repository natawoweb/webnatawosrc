
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BlogForm } from "@/components/admin/blog/BlogForm";
import { useBlogForm } from "@/hooks/useBlogForm";
import { Json } from "@/integrations/supabase/types/shared";

export default function EditBlog() {
  const { id } = useParams();

  const { data: blog, isLoading: isBlogLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      console.log("Fetched blog data:", data);
      return data;
    },
  });

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

  // Format the blog data and ensure content_tamil is properly stringified
  const formattedBlogData = blog ? {
    title: blog.title || "",
    content: blog.content || "",
    title_tamil: blog.title_tamil || "",
    content_tamil: typeof blog.content_tamil === 'string' 
      ? blog.content_tamil 
      : blog.content_tamil 
        ? JSON.stringify(blog.content_tamil)
        : "",
    category_id: blog.category_id || ""
  } : undefined;

  console.log("Formatted blog data:", formattedBlogData);

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
  } = useBlogForm({
    blogId: id,
    initialData: formattedBlogData,
  });

  console.log("Current title state:", title);
  console.log("Current titleTamil state:", titleTamil);

  if (isBlogLoading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <BlogForm
      title="Edit Blog"
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
