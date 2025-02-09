
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BlogContent } from "@/components/blog-detail/BlogContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/integrations/supabase/types";
import { Globe } from "lucide-react";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogPreviewDialogProps {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlogPreviewDialog({
  blog,
  open,
  onOpenChange,
}: BlogPreviewDialogProps) {
  if (!blog) return null;

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
      </DialogContent>
    </Dialog>
  );
}
