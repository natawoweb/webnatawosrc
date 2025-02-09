
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogManagement } from "@/hooks/useBlogManagement";
import { useEditBlogForm } from "@/hooks/useEditBlogForm";
import { EditBlogDialog } from "@/components/admin/blog/EditBlogDialog";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { updateBlog, isUpdating } = useBlogManagement();

  const {
    title,
    content,
    titleTamil,
    contentTamil,
    selectedCategory,
    setTitle,
    setContent,
    setTitleTamil,
    setContentTamil,
    setSelectedCategory,
    blog,
    categories,
    isLoading
  } = useEditBlogForm(id);

  useEffect(() => {
    if (!isOpen) {
      navigate("/dashboard");
    }
  }, [isOpen, navigate]);

  const handleSaveDraft = async () => {
    if (!id) return;
    
    try {
      await updateBlog({
        blogId: id,
        blogData: {
          title,
          content,
          title_tamil: titleTamil,
          content_tamil: contentTamil,
          category_id: selectedCategory,
          status: "draft"
        }
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;

    try {
      await updateBlog({
        blogId: id,
        blogData: {
          title,
          content,
          title_tamil: titleTamil,
          content_tamil: contentTamil,
          category_id: selectedCategory,
          status: "pending_approval"
        }
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };

  if (isLoading) return null;

  return (
    <EditBlogDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      blog={blog}
      title={title}
      content={content}
      titleTamil={titleTamil}
      contentTamil={contentTamil}
      selectedCategory={selectedCategory}
      categories={categories || []}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onTitleTamilChange={setTitleTamil}
      onContentTamilChange={setContentTamil}
      onCategoryChange={setSelectedCategory}
      onSaveDraft={handleSaveDraft}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
    />
  );
}
