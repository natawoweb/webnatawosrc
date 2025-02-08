
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTranslation() {
  const { toast } = useToast();

  const translateContent = async (title: string, content: string) => {
    try {
      const contentObj = JSON.parse(content);
      
      // Extract text content from Draft.js blocks
      const textContent = contentObj.blocks
        .map((block: any) => block.text)
        .filter((text: string) => text.trim())
        .join('\n');

      // First translate the title
      const titleResponse = await supabase.functions.invoke('translate', {
        body: { text: title }
      });

      if (titleResponse.error) throw new Error(titleResponse.error.message);
      
      // Then translate the content
      const contentResponse = await supabase.functions.invoke('translate', {
        body: { text: textContent }
      });

      if (contentResponse.error) throw new Error(contentResponse.error.message);

      const translatedTitle = titleResponse.data.data.translations[0].translatedText;
      const translatedText = contentResponse.data.data.translations[0].translatedText;
      
      // Create new Draft.js content with translated text
      const newContent = {
        blocks: [{
          key: '1',
          text: translatedText,
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }],
        entityMap: {}
      };

      toast({
        title: "Translation Complete",
        description: "Content has been translated to Tamil",
      });

      return {
        translatedTitle,
        translatedContent: JSON.stringify(newContent)
      };
    } catch (error: any) {
      console.error('Translation error:', error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: error.message,
      });
      throw error;
    }
  };

  return { translateContent };
}
