
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BlogData {
  title: string;
  content: string;
  title_tamil?: string;
  content_tamil?: string;
  category_id?: string;
}

export function useBlogMutations(
  currentBlogId: string | undefined,
  setCurrentBlogId: (id: string) => void,
  setLastSaved: (date: Date) => void,
  setIsSaving: (saving: boolean) => void
) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const saveBlog = useMutation({
    mutationFn: async (blogData: BlogData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Ensure content is in proper format
      const formattedContent = typeof blogData.content === 'string' ? 
        blogData.content : 
        JSON.stringify(blogData.content);

      const formattedContentTamil = blogData.content_tamil ? 
        typeof blogData.content_tamil === 'string' ? 
          blogData.content_tamil : 
          JSON.stringify(blogData.content_tamil) 
        : null;

      if (currentBlogId) {
        console.log('Updating existing blog:', currentBlogId);
        console.log('With content:', formattedContent);
        
        const { error } = await supabase
          .from("blogs")
          .update({
            title: blogData.title,
            content: formattedContent,
            title_tamil: blogData.title_tamil || null,
            content_tamil: formattedContentTamil,
            category_id: blogData.category_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentBlogId);

        if (error) throw error;
        return currentBlogId;
      } else {
        console.log('Creating new blog');
        const { data, error } = await supabase
          .from("blogs")
          .insert({
            title: blogData.title,
            content: formattedContent,
            title_tamil: blogData.title_tamil || null,
            content_tamil: formattedContentTamil,
            category_id: blogData.category_id || null,
            author_id: user.id,
            status: "draft",
          })
          .select()
          .single();

        if (error) throw error;

        console.log('New blog created with ID:', data.id);
        setCurrentBlogId(data.id);
        return data.id;
      }
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["writer-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast({
        title: "Changes saved",
        description: "Your content has been automatically saved",
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save changes: " + error.message,
      });
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });

  const submitBlog = useMutation({
    mutationFn: async (blogData: BlogData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const formattedContent = typeof blogData.content === 'string' ? 
        blogData.content : 
        JSON.stringify(blogData.content);

      const formattedContentTamil = blogData.content_tamil ? 
        typeof blogData.content_tamil === 'string' ? 
          blogData.content_tamil : 
          JSON.stringify(blogData.content_tamil) 
        : null;

      const updateData = {
        status: "pending_approval" as const,
        title: blogData.title,
        content: formattedContent,
        title_tamil: blogData.title_tamil || null,
        content_tamil: formattedContentTamil,
        category_id: blogData.category_id || null,
        updated_at: new Date().toISOString(),
      };

      if (currentBlogId) {
        const { error } = await supabase
          .from("blogs")
          .update(updateData)
          .eq('id', currentBlogId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blogs")
          .insert({
            ...updateData,
            author_id: user.id,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["writer-blogs"] });
      toast({
        title: "Success",
        description: "Blog submitted for approval",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit blog: " + error.message,
      });
    },
  });

  return { saveBlog, submitBlog };
}
