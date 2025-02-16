
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import type { BlogStatus } from "@/integrations/supabase/types/content";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogUpdateData {
  title: string;
  content: string;
  title_tamil?: string;
  content_tamil?: string;
  category_id?: string;
  status: BlogStatus;
}

export function useBlogManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBlogMutation = useMutation({
    mutationFn: async ({ blogId, blogData }: { blogId: string; blogData: BlogUpdateData }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Ensure content is in Draft.js format
      const ensureDraftJsFormat = (content: string) => {
        try {
          const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
          
          // If it's already in Draft.js format
          if (contentObj.blocks && Array.isArray(contentObj.blocks)) {
            return contentObj;
          }

          // Convert to Draft.js format
          return {
            blocks: [{ 
              key: 'initial', 
              text: typeof contentObj === 'string' ? contentObj : JSON.stringify(contentObj), 
              type: 'unstyled',
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {}
            }],
            entityMap: {}
          };
        } catch (error) {
          console.error('Error processing content:', error);
          return null;
        }
      };

      const parsedContent = ensureDraftJsFormat(blogData.content);
      if (!parsedContent) throw new Error("Invalid content format");

      const parsedContentTamil = blogData.content_tamil 
        ? ensureDraftJsFormat(blogData.content_tamil)
        : null;

      console.log('Saving blog with content:', parsedContent);

      const { data, error } = await supabase
        .from("blogs")
        .update({
          title: blogData.title,
          content: JSON.stringify(parsedContent),
          title_tamil: blogData.title_tamil || null,
          content_tamil: parsedContentTamil ? JSON.stringify(parsedContentTamil) : null,
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
    onSuccess: (data, { blogData: { status } }) => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      
      toast({
        title: "Success",
        description: `Blog ${status === 'draft' ? 'saved as draft' : 'submitted for review'} successfully`,
      });

      return data;
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
    updateBlog: updateBlogMutation.mutateAsync,
    isUpdating: updateBlogMutation.isPending,
  };
}
