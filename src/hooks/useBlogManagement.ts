
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Ensure content is valid JSON
      const validateAndParseContent = (content: string) => {
        try {
          return typeof content === 'string' ? JSON.parse(content) : content;
        } catch (error) {
          console.error('Error parsing content:', error);
          return null;
        }
      };

      const parsedContent = validateAndParseContent(blogData.content);
      if (!parsedContent) throw new Error("Invalid content format");

      const parsedContentTamil = blogData.content_tamil 
        ? validateAndParseContent(blogData.content_tamil)
        : null;

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
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { blogData: { status } }) => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      
      toast({
        title: "Success",
        description: `Blog ${status === 'draft' ? 'saved as draft' : 'submitted for review'} successfully`,
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
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
