import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { BlogContentSection } from "./BlogContentSection";
import { BlogDialogHeader } from "./BlogDialogHeader";
import { BlogDialogActions } from "./BlogDialogActions";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface EditBlogDialogProps {
  blog: Blog;
}

export function EditBlogDialog({ blog }: EditBlogDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(JSON.stringify(blog.content));
  const [titleTamil, setTitleTamil] = useState(blog.title_tamil || "");
  const [contentTamil, setContentTamil] = useState(JSON.stringify(blog.content_tamil || {}));
  const [selectedCategory, setSelectedCategory] = useState<string>(blog.category_id || "");

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

  const updateBlogMutation = useMutation({
    mutationFn: async (blogData: {
      title: string;
      content: string;
      title_tamil?: string;
      content_tamil?: string;
      category_id?: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from("blogs")
        .update({
          title: blogData.title,
          content: JSON.parse(blogData.content),
          title_tamil: blogData.title_tamil || null,
          content_tamil: blogData.content_tamil ? JSON.parse(blogData.content_tamil) : {},
          category_id: blogData.category_id || null,
          status: blogData.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blog.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({
        title: "Success",
        description: "Blog updated successfully",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog: " + error.message,
      });
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

    updateBlogMutation.mutate({
      title,
      content,
      title_tamil: titleTamil,
      content_tamil: contentTamil,
      category_id: selectedCategory,
      status,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1400px] w-[90vw]">
        <BlogDialogHeader
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <BlogDialogActions
              onSaveDraft={() => handleUpdate("draft")}
              onSubmit={() => handleUpdate("submitted")}
              isLoading={updateBlogMutation.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <BlogContentSection
              language="english"
              title={title}
              content={content}
              onTitleChange={setTitle}
              onContentChange={setContent}
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
      </DialogContent>
    </Dialog>
  );
}