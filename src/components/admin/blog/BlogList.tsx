/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { DeleteBlogDialog } from './DeleteBlogDialog';
import { RejectBlogDialog } from './RejectBlogDialog';
import { BlogListRow } from './BlogListRow';
import { useBlogListManagement } from '@/hooks/useBlogListManagement';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useSession } from '@/hooks/useSession';

type Blog = Database['public']['Tables']['blogs']['Row'];

interface BlogListProps {
  blogs: Blog[];
}

export function BlogList({ blogs }: BlogListProps) {
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [blogToReject, setBlogToReject] = useState<Blog | null>(null);
  const { toast } = useToast();
  const { session } = useSession();
  const { data: userRoles } = useUserRoles(session?.user?.id);

  const { deleteBlogMutation, canDeleteBlog, getAuthorName, userProfile } =
    useBlogListManagement();

  const isAdmin = userRoles?.some((role) => role.role === 'admin') || false;

  const handleDelete = (blog: Blog) => {
    setBlogToDelete(blog);
  };

  const handleApprove = async (blog: Blog) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: 'approved' })
        .eq('id', blog.id);

      if (error) throw error;

      toast({
        title: 'Blog Approved',
        description: `The blog "${blog.title}" has been approved successfully.`,
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const handleReject = async (blog: Blog) => {
    setBlogToReject(blog);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!blogToReject) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', blogToReject.id);

      if (error) throw error;

      toast({
        title: 'Blog Rejected',
        description: `The blog "${blogToReject.title}" has been rejected.`,
        duration: 3000,
      });
      setBlogToReject(null);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <BlogListRow
              key={blog.id}
              blog={blog}
              getAuthorName={getAuthorName}
              canDelete={canDeleteBlog(blog)}
              isAdmin={isAdmin}
              onDelete={() => handleDelete(blog)}
              onApprove={() => handleApprove(blog)}
              onReject={() => handleReject(blog)}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteBlogDialog
        open={!!blogToDelete}
        onOpenChange={(open) => {
          if (!open) setBlogToDelete(null);
        }}
        onConfirm={() => {
          if (blogToDelete) {
            deleteBlogMutation.mutate(blogToDelete.id);
            setBlogToDelete(null);
          }
        }}
        blog={blogToDelete}
      />

      <RejectBlogDialog
        open={!!blogToReject}
        onOpenChange={(open) => {
          if (!open) setBlogToReject(null);
        }}
        onConfirm={handleRejectConfirm}
        blogTitle={blogToReject?.title || ''}
      />
    </>
  );
}
