import { BlogContentSection } from "./BlogContentSection";
import { BlogDialogHeader } from "./BlogDialogHeader";
import { BlogDialogActions } from "./BlogDialogActions";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();

  const hasContent = () => {
    try {
      if (!title) return false;
      const contentObj = JSON.parse(content || '{}');
      const textContent = contentObj.content?.[0]?.content?.[0]?.text;
      return Boolean(textContent);
    } catch (error) {
      return false;
    }
  };

  const handleTranslate = async () => {
    try {
      const contentObj = JSON.parse(content || '{}');
      const textContent = contentObj.content?.[0]?.content?.[0]?.text || '';

      const titleResponse = await supabase.functions.invoke('translate', {
        body: { text: title }
      });

      if (titleResponse.error) throw new Error(titleResponse.error.message);
      
      const contentResponse = await supabase.functions.invoke('translate', {
        body: { text: textContent }
      });

      if (contentResponse.error) throw new Error(contentResponse.error.message);

      const translatedTitle = titleResponse.data.data.translations[0].translatedText;
      onTitleTamilChange(translatedTitle);

      const translatedText = contentResponse.data.data.translations[0].translatedText;
      const newContent = {
        ...contentObj,
        content: [{
          ...contentObj.content?.[0],
          content: [{
            ...contentObj.content?.[0]?.content?.[0],
            text: translatedText
          }]
        }]
      };
      onContentTamilChange(JSON.stringify(newContent));

      toast({
        title: "Translation Complete",
        description: "Content has been translated to Tamil",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <BlogDialogHeader
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <BlogDialogActions
            onSaveDraft={onSaveDraft}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-end">
          <Button 
            variant="outline"
            onClick={handleTranslate}
            disabled={!hasContent()}
            className="w-full sm:w-auto"
          >
            <Globe className="mr-2 h-4 w-4" />
            Translate to Tamil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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