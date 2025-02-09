
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BlogDialogContent } from "@/components/admin/blog/BlogDialogContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useBlogManagement } from "@/hooks/useBlogManagement";
import { useToast } from "@/hooks/use-toast";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { updateBlog, isUpdating } = useBlogManagement();
  const { toast } = useToast();

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

  // Initialize form data when blog data is loaded - using useEffect with proper dependency array
  useEffect(() => {
    if (!blog) return;

    const initializeContent = (rawContent: any) => {
      if (!rawContent) return "";
      try {
        if (typeof rawContent === 'string') {
          // If it's already a JSON string, parse it to validate and re-stringify
          const parsed = JSON.parse(rawContent);
          return JSON.stringify(parsed);
        }
        // If it's an object, just stringify it
        return JSON.stringify(rawContent);
      } catch (error) {
        console.error('Error parsing content:', error);
        return "";
      }
    };

    setTitle(blog.title || "");
    setContent(initializeContent(blog.content));
    setTitleTamil(blog.title_tamil || "");
    setContentTamil(initializeContent(blog.content_tamil));
    setSelectedCategory(blog.category_id || "");
  }, [blog]); // Only re-run when blog data changes

  useEffect(() => {
    if (!isOpen) {
      navigate("/dashboard");
    }
  }, [isOpen, navigate]);

  const handleSaveDraft = () => {
    if (!id) return;
    
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
  };

  const handleSubmit = () => {
    if (!id) return;

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
