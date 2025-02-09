
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BlogDialogContent } from "@/components/admin/blog/BlogDialogContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useBlogManagement } from "@/hooks/useBlogManagement";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { updateBlog, isUpdating } = useBlogManagement();

  // State for form data
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  // Initialize form data when blog data is loaded
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content ? JSON.stringify(blog.content) : "");
      setTitleTamil(blog.title_tamil || "");
      setContentTamil(blog.content_tamil ? JSON.stringify(blog.content_tamil) : "");
      setSelectedCategory(blog.category_id || "");
    }
  }, [blog]);

  useEffect(() => {
    if (!isOpen) {
      navigate("/dashboard");
    }
  }, [isOpen, navigate]);

  const handleSaveDraft = () => {
    if (id) {
      updateBlog({
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
    }
  };

  const handleSubmit = () => {
    if (id) {
      updateBlog({
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
    }
  };

  if (!blog || isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="max-w-[90%] w-[1200px] h-[90vh] p-6"
        aria-describedby="dialog-description"
      >
        <div id="dialog-description" className="sr-only">Edit blog post</div>
        <div className="h-full overflow-y-auto">
          <BlogDialogContent
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
