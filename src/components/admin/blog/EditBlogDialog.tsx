import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Save, SendHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { BlogContentSection } from "./BlogContentSection";
import { CategoryManagement } from "./CategoryManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CategoryManagement categories={categories || []} />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleUpdate("draft")}
                disabled={updateBlogMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              <Button
                onClick={() => handleUpdate("submitted")}
                disabled={updateBlogMutation.isPending}
              >
                <SendHorizontal className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            </div>
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