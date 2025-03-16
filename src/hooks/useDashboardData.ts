import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export function useDashboardData(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to all blog changes for this user
    const channel = supabase
      .channel(`blogs-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Listen specifically for new blogs/drafts
          schema: 'public',
          table: 'blogs',
          filter: `author_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['writer-blogs', userId],
            exact: true,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'blogs',
          filter: `author_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['writer-blogs', userId],
            exact: true,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'blogs',
          filter: `author_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['writer-blogs', userId],
            exact: true,
          });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Cleanup subscription when component unmounts or userId changes
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  return useQuery({
    queryKey: ['writer-blogs', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('blogs')
        .select(
          `
          *,
          blog_comments (count),
          blog_categories (
            name
          )
        `
        )
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });
}
