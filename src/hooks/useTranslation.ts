/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useTranslation() {
  const { toast } = useToast();

  const translateContent = async (title: string, content: string) => {
    try {
      let contentObj;

      try {
        contentObj = JSON.parse(content);
        // Handle double-stringified content
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (e) {
        console.error('Error parsing content in translation:', e);
        contentObj = { blocks: [{ text: content }] };
      }

      // Extract text from Draft.js content
      const textContent = contentObj.blocks
        .map((block: any) => block.text)
        .filter((text: string) => text.trim())
        .join('\n');

      // Detect if the text is Tamil using a simple check
      const isTamil = /[\u0B80-\u0BFF]/.test(title + textContent);
      const sourceLang = isTamil ? 'ta' : 'en';
      const targetLang = isTamil ? 'en' : 'ta';

      // First translate the title
      const titleResponse = await supabase.functions.invoke('translate', {
        body: {
          text: title,
          sourceLang,
          targetLang,
        },
      });

      if (titleResponse.error) throw new Error(titleResponse.error.message);

      // Then translate the content
      const contentResponse = await supabase.functions.invoke('translate', {
        body: {
          text: textContent,
          sourceLang,
          targetLang,
        },
      });

      if (contentResponse.error) throw new Error(contentResponse.error.message);

      // Check if responses have the expected structure
      if (!titleResponse.data?.translatedText) {
        throw new Error('Invalid title translation response');
      }
      if (!contentResponse.data?.translatedText) {
        throw new Error('Invalid content translation response');
      }

      const translatedTitle = titleResponse.data.translatedText;
      const translatedText = contentResponse.data.translatedText;

      // Create Draft.js content structure
      const newContent = {
        blocks: translatedText
          .split('\n')
          .map((text: string, index: number) => ({
            key: `translated-${index}`,
            text: text.trim(),
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          }))
          .filter((block: any) => block.text.length > 0),
        entityMap: {},
      };

      // Ensure we're returning a properly stringified Draft.js content
      const stringifiedContent = JSON.stringify(newContent);

      toast({
        title: 'Translation Complete',
        description: 'Content has been translated',
      });

      return {
        translatedTitle,
        translatedContent: stringifiedContent,
      };
    } catch (error: any) {
      console.error('Translation error:', error);
      toast({
        variant: 'destructive',
        title: 'Translation Failed',
        description: error.message,
      });
      throw error;
    }
  };

  return { translateContent };
}
