
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BlogDialogContent } from "@/components/admin/blog/BlogDialogContent";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

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

  useEffect(() => {
    if (!isOpen) {
      navigate("/dashboard");
    }
  }, [isOpen, navigate]);

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
            title={blog.title || ""}
            content={blog.content ? JSON.stringify(blog.content) : ""}
            titleTamil={blog.title_tamil || ""}
            contentTamil={blog.content_tamil ? JSON.stringify(blog.content_tamil) : ""}
            selectedCategory={blog.category_id || ""}
            categories={categories || []}
            onTitleChange={(value) => console.log("Title changed:", value)}
            onContentChange={(value) => console.log("Content changed:", value)}
            onTitleTamilChange={(value) => console.log("Tamil title changed:", value)}
            onContentTamilChange={(value) => console.log("Tamil content changed:", value)}
            onCategoryChange={(value) => console.log("Category changed:", value)}
            onSaveDraft={() => console.log("Save as draft")}
            onSubmit={() => console.log("Submit for review")}
            isLoading={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
