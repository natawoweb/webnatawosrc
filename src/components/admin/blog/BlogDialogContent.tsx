import { BlogContentSection } from "./BlogContentSection";
import { BlogDialogHeader } from "./BlogDialogHeader";
import { BlogDialogActions } from "./BlogDialogActions";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogDialogContentProps {
  blog: Blog;
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

export function BlogDialogContent({
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
}: BlogDialogContentProps) {
  return (
    <div className="space-y-6">
      <BlogDialogHeader
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <div className="flex items-center justify-between">
        <BlogDialogActions
          onSaveDraft={onSaveDraft}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <BlogContentSection
          language="english"
          title={title}
          content={content}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
        />
        <BlogContentSection
          language="tamil"
          title={titleTamil}
          content={contentTamil}
          onTitleChange={onTitleTamilChange}
          onContentChange={onContentTamilChange}
        />
      </div>
    </div>
  );
}