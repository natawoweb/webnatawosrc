
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useTranslation() {
  const { toast } = useToast();

  const translateContent = async (title: string, content: string) => {
    try {
      const contentObj = JSON.parse(content || '{}');
      const textContent = contentObj.content?.[0]?.content?.[0]?.text || '';

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
      
      const newContent = {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            text: translatedText
          }]
        }]
      };

      toast({
        title: "Translation Complete",
        description: "Content has been translated to Tamil",
      });

      return {
        translatedTitle,
        translatedContent: JSON.stringify(newContent)
      };
    } catch (error) {
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
