
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { BlogDialogContent } from "./BlogDialogContent";
import { useBlogManagement } from "@/hooks/useBlogManagement";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface EditBlogDialogProps {
  blog: Blog;
}

export function EditBlogDialog({ blog }: EditBlogDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(
    typeof blog.content === 'string' ? blog.content : JSON.stringify(blog.content)
  );
  const [titleTamil, setTitleTamil] = useState(blog.title_tamil || "");
  const [contentTamil, setContentTamil] = useState(
    blog.content_tamil
      ? typeof blog.content_tamil === 'string'
        ? blog.content_tamil
        : JSON.stringify(blog.content_tamil)
      : JSON.stringify({
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
        })
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(blog.category_id || "");

  const { updateBlog, isUpdating } = useBlogManagement();
  const { toast } = useToast();

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

  const handleUpdate = (status: "draft" | "submitted") => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    console.log("Handling update with status:", status);

    updateBlog({
      blogId: blog.id,
      blogData: {
        title,
        content,
        title_tamil: titleTamil,
        content_tamil: contentTamil,
        category_id: selectedCategory,
        status,
      }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        // Clear form state
        setTitle(blog.title);
        setContent(typeof blog.content === 'string' ? blog.content : JSON.stringify(blog.content));
        setTitleTamil(blog.title_tamil || "");
        setContentTamil(
          blog.content_tamil
            ? typeof blog.content_tamil === 'string'
              ? blog.content_tamil
              : JSON.stringify(blog.content_tamil)
            : JSON.stringify({
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
              })
        );
        setSelectedCategory(blog.category_id || "");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
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
            onSaveDraft={() => handleUpdate("draft")}
            onSubmit={() => handleUpdate("submitted")}
            isLoading={isUpdating}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
