
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTranslation() {
  const { toast } = useToast();

  const translateContent = async (title: string, content: string) => {
    try {
      console.log('Starting translation with:', { title, content });
      const contentObj = JSON.parse(content);
      
      // Extract text content from Draft.js blocks
      const textContent = contentObj.blocks
        .map((block: any) => block.text)
        .filter((text: string) => text.trim())
        .join('\n');

      console.log('Extracted text content:', textContent);

      // First translate the title
      console.log('Translating title:', title);
      const titleResponse = await supabase.functions.invoke('translate', {
        body: { text: title }
      });

      console.log('Title translation response:', titleResponse);
      if (titleResponse.error) throw new Error(titleResponse.error.message);
      
      // Then translate the content
      console.log('Translating content:', textContent);
      const contentResponse = await supabase.functions.invoke('translate', {
        body: { text: textContent }
      });

      console.log('Content translation response:', contentResponse);
      if (contentResponse.error) throw new Error(contentResponse.error.message);

      const translatedTitle = titleResponse.data.data.translations[0].translatedText;
      const translatedText = contentResponse.data.data.translations[0].translatedText;
      
      console.log('Translation results:', { translatedTitle, translatedText });

      // Create valid Draft.js content structure
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

      console.log('Generated Draft.js content:', newContent);

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
