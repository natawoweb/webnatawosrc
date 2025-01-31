import { Input } from "@/components/ui/input";
import { RichTextEditor } from "./RichTextEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlogContentSectionProps {
  language: "english" | "tamil";
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export function BlogContentSection({
  language,
  title,
  content,
  onTitleChange,
  onContentChange,
}: BlogContentSectionProps) {
  const isEnglish = language === "english";
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (isEnglish) return; // Only translate on Tamil side

    try {
      // Parse the content JSON to extract text
      const contentObj = JSON.parse(content || '{}');
      const textContent = contentObj.content?.[0]?.content?.[0]?.text || '';

      // Translate title
      const titleResponse = await supabase.functions.invoke('translate', {
        body: { text: title }
      });

      if (titleResponse.error) throw new Error(titleResponse.error.message);
      
      // Translate content
      const contentResponse = await supabase.functions.invoke('translate', {
        body: { text: textContent }
      });

      if (contentResponse.error) throw new Error(contentResponse.error.message);

      // Update title
      const translatedTitle = titleResponse.data.data.translations[0].translatedText;
      onTitleChange(translatedTitle);

      // Update content
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
      onContentChange(JSON.stringify(newContent));

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

  // Check if there's content to translate
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

  return (
    <Card className="h-[800px] flex flex-col">
      <CardHeader>
        {isEnglish ? (
          <>
            <CardTitle>English Content</CardTitle>
            <CardDescription>Write your blog post in English</CardDescription>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tamil Content</CardTitle>
              <CardDescription>தமிழில் உங்கள் வலைப்பதிவை எழுதுங்கள்</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleTranslate}
              disabled={!hasContent()}
            >
              <Globe className="mr-2 h-4 w-4" />
              Translate
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col space-y-4">
        <div>
          <label htmlFor={`title-${language}`} className="text-sm font-medium">
            Title
          </label>
          <Input
            id={`title-${language}`}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={isEnglish ? "Enter blog title" : "தலைப்பை உள்ளிடவும்"}
          />
        </div>
        <div className="flex-1 min-h-0">
          <label htmlFor={`content-${language}`} className="text-sm font-medium block mb-2">
            Content
          </label>
          <div className="h-[600px]">
            <RichTextEditor
              content={content}
              onChange={onContentChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}