
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "@/integrations/supabase/types";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BlogPreviewTabs } from "./preview/BlogPreviewTabs";
import { BlogPreviewActions } from "./preview/BlogPreviewActions";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogPreviewDialogProps {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (blog: Blog) => void;
  onReject?: (blog: Blog) => void;
}

export function BlogPreviewDialog({
  blog,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: BlogPreviewDialogProps) {
  const { session } = useSession();
  const { data: userRoles } = useUserRoles(session?.user?.id);
  const isAdmin = userRoles?.some(role => role.role === 'admin') || false;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleApprove = async () => {
    if (!blog) return;

    try {
      const { error: updateError } = await supabase
        .from('blogs')
        .update({ status: 'approved' })
        .eq('id', blog.id);

      if (updateError) throw updateError;

      const { error: notificationError } = await supabase.functions.invoke('signup-notifications', {
        body: {
          type: 'writer_welcome',
          email: blog.author_id,
          fullName: 'Writer',
        }
      });

      if (notificationError) throw notificationError;

      onOpenChange(false);
      toast({
        title: "Success",
        description: "Blog has been approved and writer has been notified",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });

      if (onApprove) {
        onApprove(blog);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleReject = async () => {
    if (!blog || !onReject) return;
    onReject(blog);
    onOpenChange(false);
  };

  if (!blog) return null;

  const showActions = isAdmin && blog.status === 'pending_approval';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Blog Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <BlogPreviewTabs blog={blog} />
        </ScrollArea>
        {showActions && (
          <DialogFooter>
            <BlogPreviewActions 
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
