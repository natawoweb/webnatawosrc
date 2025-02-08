
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogUpdateData {
  title: string;
  content: string;
  title_tamil?: string;
  content_tamil?: string;
  category_id?: string;
  status: string;
}

export function useBlogManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBlogMutation = useMutation({
    mutationFn: async ({ blogId, blogData }: { blogId: string; blogData: BlogUpdateData }) => {
      console.log("Updating blog with status:", blogData.status);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Parse content if it's a string and not already parsed
      let parsedContent;
      try {
        parsedContent = typeof blogData.content === 'string' 
          ? JSON.parse(blogData.content)
          : blogData.content;

        // Check if content is double-encoded
        if (typeof parsedContent === 'string') {
          parsedContent = JSON.parse(parsedContent);
        }
      } catch (error) {
        console.error('Error parsing content:', error);
        parsedContent = blogData.content;
      }

      // Parse Tamil content if it exists
      let parsedContentTamil;
      try {
        parsedContentTamil = blogData.content_tamil && typeof blogData.content_tamil === 'string'
          ? JSON.parse(blogData.content_tamil)
          : blogData.content_tamil;

        // Check if Tamil content is double-encoded
        if (typeof parsedContentTamil === 'string') {
          parsedContentTamil = JSON.parse(parsedContentTamil);
        }
      } catch (error) {
        console.error('Error parsing Tamil content:', error);
        parsedContentTamil = blogData.content_tamil;
      }

      const { data, error } = await supabase
        .from("blogs")
        .update({
          title: blogData.title,
          content: parsedContent,
          title_tamil: blogData.title_tamil || null,
          content_tamil: parsedContentTamil,
          category_id: blogData.category_id || null,
          status: blogData.status,
          author_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blogId)
        .select("*");

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast({
        title: "Success",
        description: "Blog updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog: " + error.message,
      });
    },
  });

  return {
    updateBlog: updateBlogMutation.mutate,
    isUpdating: updateBlogMutation.isPending,
  };
}
