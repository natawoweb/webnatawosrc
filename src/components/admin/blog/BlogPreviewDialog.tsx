
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { BlogContent } from "@/components/blog-detail/BlogContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/integrations/supabase/types";
import { Globe, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
      // Update blog status
      const { error: updateError } = await supabase
        .from('blogs')
        .update({ status: 'approved' })
        .eq('id', blog.id);

      if (updateError) throw updateError;

      // Send notification to writer
      const { error: notificationError } = await supabase.functions.invoke('signup-notifications', {
        body: {
          type: 'writer_welcome',
          email: blog.author_id, // This will be resolved to the actual email in the Edge Function
          fullName: 'Writer', // This will be resolved in the Edge Function
        }
      });

      if (notificationError) throw notificationError;

      // Close dialog and show success message
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Blog has been approved and writer has been notified",
      });

      // Invalidate queries to refresh the blog list
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });

      // Call the onApprove callback if provided
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
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="english" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                English
              </TabsTrigger>
              <TabsTrigger value="tamil" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                தமிழ்
              </TabsTrigger>
            </TabsList>
            <TabsContent value="english" className="mt-4">
              <article className="prose prose-lg max-w-none">
                <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                <BlogContent content={blog.content} />
              </article>
            </TabsContent>
            <TabsContent value="tamil" className="mt-4">
              <article className="prose prose-lg max-w-none">
                <h1 className="text-3xl font-bold mb-4">
                  {blog.title_tamil || "Title not available in Tamil"}
                </h1>
                {blog.content_tamil ? (
                  <BlogContent content={blog.content_tamil as string} />
                ) : (
                  <p className="text-muted-foreground italic">
                    Content not available in Tamil
                  </p>
                )}
              </article>
            </TabsContent>
          </Tabs>
        </ScrollArea>
        {showActions && (
          <DialogFooter className="sm:justify-end gap-2 border-t pt-4">
            <Button
              variant="ghost"
              className="text-green-500 hover:text-green-700 hover:bg-green-100"
              onClick={handleApprove}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={handleReject}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
