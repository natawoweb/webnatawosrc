import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "./RichTextEditor";

export function CreateBlogDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createBlogMutation = useMutation({
    mutationFn: async (blogData: { title: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("blogs")
        .insert({
          title: blogData.title,
          content: blogData.content ? JSON.parse(blogData.content) : {},
          author_id: user.id,
          status: "draft"
        });

      if (error) {
        console.error("Error creating blog:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({
        title: "Success",
        description: "Blog created successfully",
      });
      setIsOpen(false);
      setTitle("");
      setContent("");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create blog: " + error.message,
      });
    },
  });

  const handleCreate = () => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required",
      });
      return;
    }

    createBlogMutation.mutate({ title, content });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <BookPlus className="mr-2 h-4 w-4" />
          Create Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
            />
          </div>
          <div>
            <label htmlFor="content" className="text-sm font-medium">Content</label>
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={!title || !content || createBlogMutation.isPending}
          >
            {createBlogMutation.isPending ? "Creating..." : "Create Blog"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}