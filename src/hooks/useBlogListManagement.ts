/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useSession } from '@/hooks/useSession';

type Blog = Database['public']['Tables']['blogs']['Row'];

export function useBlogListManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useSession();

  // Get current user's profile to check permissions
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Add query to fetch author names
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name');
      if (error) throw error;
      return data;
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const { error } = await supabase.from('blogs').delete().eq('id', blogId);

      if (error) {
        console.error('Error deleting blog:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({
        title: 'Success',
        description: 'Blog deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);

      // Handle specific error cases
      let errorMessage = 'Failed to delete blog.';
      if (error?.message?.includes('row-level security')) {
        if (
          userProfile?.user_type === 'admin' ||
          userProfile?.user_type === 'manager'
        ) {
          errorMessage = 'You can only delete approved or published blogs';
        } else {
          errorMessage = 'You can only delete your own blogs';
        }
      }

      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    },
  });

  const canDeleteBlog = (blog: Blog) => {
    if (!session?.user?.id) return false;

    // Blog owner can always delete their own blog
    if (blog.author_id === session.user.id) return true;

    // Admins and managers can delete approved/published blogs
    if (
      (userProfile?.user_type === 'admin' ||
        userProfile?.user_type === 'manager') &&
      (blog.status === 'approved' || blog.status === 'published')
    ) {
      return true;
    }

    return false;
  };

  const getAuthorName = (authorId: string) => {
    const profile = profiles?.find((p) => p.id === authorId);
    return profile?.full_name || 'Unknown Author';
  };

  return {
    deleteBlogMutation,
    canDeleteBlog,
    getAuthorName,
    userProfile,
  };
}
