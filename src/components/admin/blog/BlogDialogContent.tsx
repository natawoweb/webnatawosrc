
import { BlogContentSection } from "./BlogContentSection";
import { BlogDialogHeader } from "./BlogDialogHeader";
import { BlogActions } from "./BlogActions";
import { Database } from "@/integrations/supabase/types";
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
}: BlogDialogContentProps) {
  const { toast } = useToast();

  const hasContent = () => {
    try {
      if (!title) return false;
      const contentObj = JSON.parse(content || '{}');
      // Handle both new Draft.js and old content formats
      if (contentObj.blocks) {
        return contentObj.blocks.some((block: any) => block.text.trim().length > 0);
      } else if (contentObj.content) {
        return contentObj.content.some((block: any) => 
          block.content?.some((item: any) => item.text?.trim().length > 0)
        );
      }
      return false;
    } catch (error) {
      console.error('Error checking content:', error);
      return false;
    }
  };

  const handleTranslate = async () => {
    try {
      let textToTranslate = '';
      
      try {
        const contentObj = JSON.parse(content);
        // Handle both new Draft.js and old content formats
        if (contentObj.blocks) {
          textToTranslate = contentObj.blocks
            .map((block: any) => block.text)
            .filter((text: string) => text.trim())
            .join('\n');
        } else if (contentObj.content) {
          textToTranslate = contentObj.content
            .map((block: any) => 
              block.content?.map((item: any) => item.text).join('')
            )
            .filter((text: string) => text.trim())
            .join('\n');
        }
      } catch (error) {
        console.error('Error parsing content:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to parse content for translation",
        });
        return;
      }

      // First translate the title
      console.log('Translating title:', title);
      const titleResponse = await supabase.functions.invoke('translate', {
        body: { text: title }
      });

      if (titleResponse.error) throw new Error(titleResponse.error.message);
      
      // Then translate the content
      console.log('Translating content:', textToTranslate);
      const contentResponse = await supabase.functions.invoke('translate', {
        body: { text: textToTranslate }
      });

      if (contentResponse.error) throw new Error(contentResponse.error.message);

      // Update the Tamil title
      const translatedTitle = titleResponse.data.data.translations[0].translatedText;
      onTitleTamilChange(translatedTitle);

      // Create a new Draft.js content structure for the translated text
      const translatedText = contentResponse.data.data.translations[0].translatedText;
      const newContent = {
        blocks: translatedText.split('\n').map((text: string, index: number) => ({
          key: `translated-${index}`,
          text: text.trim(),
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        })).filter((block: any) => block.text.length > 0),
        entityMap: {}
      };
      
      onContentTamilChange(JSON.stringify(newContent));

      toast({
        title: "Translation Complete",
        description: "Content has been translated to Tamil",
      });
    } catch (error: any) {
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
      
      <BlogActions
        onSaveDraft={onSaveDraft}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlogContentSection
          language="english"
          title={title}
          content={content}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
          onTranslate={handleTranslate}
          hasContent={hasContent()}
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
