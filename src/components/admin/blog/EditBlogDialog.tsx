
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BlogDialogContent } from "@/components/admin/blog/BlogDialogContent";

interface EditBlogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  blog: any;
  title: string;
  content: string;
  titleTamil: string;
  contentTamil: string;
  selectedCategory: string;
  categories: Array<{ id: string; name: string }>;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onTitleTamilChange: (value: string) => void;
  onContentTamilChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function EditBlogDialog({
  isOpen,
  onOpenChange,
  blog,
  title,
  content,
  titleTamil,
  contentTamil,
  selectedCategory,
  categories,
  onTitleChange,
  onContentChange,
  onTitleTamilChange,
  onContentTamilChange,
  onCategoryChange,
  onSaveDraft,
  onSubmit,
  isLoading,
}: EditBlogDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[90%] w-[1200px] h-[90vh] p-6"
        aria-describedby="dialog-description"
      >
        <div id="dialog-description" className="sr-only">Edit blog post</div>
        <div className="h-full overflow-y-auto">
          <BlogDialogContent
            blog={blog}
            title={title}
            content={content}
            titleTamil={titleTamil}
            contentTamil={contentTamil}
            selectedCategory={selectedCategory}
            categories={categories || []}
            onTitleChange={onTitleChange}
            onContentChange={onContentChange}
            onTitleTamilChange={onTitleTamilChange}
            onContentTamilChange={onContentTamilChange}
            onCategoryChange={onCategoryChange}
            onSaveDraft={onSaveDraft}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
