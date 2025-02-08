
import { RichTextEditor } from "./RichTextEditor";
import { ContentInput } from "./editor/ContentInput";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BlogContentSectionProps {
  language: "english" | "tamil";
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onTranslate?: () => void;
  hasContent?: boolean;
}

export function BlogContentSection({
  language,
  title,
  content,
  onTitleChange,
  onContentChange,
  onTranslate,
  hasContent,
}: BlogContentSectionProps) {
  const isEnglish = language === "english";

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              {isEnglish ? "English Content" : "Tamil Content"}
            </CardTitle>
            <CardDescription>
              {isEnglish 
                ? "Write your blog post in English" 
                : "தமிழில் உங்கள் வலைப்பதிவை எழுதுங்கள்"}
            </CardDescription>
          </div>
          {isEnglish && onTranslate && (
            <Button
              onClick={onTranslate}
              disabled={!hasContent}
              className="bg-[#FF4747] hover:bg-[#FF4747]/90 text-white"
            >
              <Globe className="mr-2 h-4 w-4" />
              Translate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col space-y-4 pb-6">
        <ContentInput
          language={language}
          title={title}
          onTitleChange={onTitleChange}
          placeholder={isEnglish ? "Enter blog title" : "தலைப்பை உள்ளிடவும்"}
        />
        <div className="flex-1 min-h-0">
          <label className="text-sm font-medium block mb-2">
            Content
          </label>
          <div className="h-[calc(100%-2rem)]">
            <RichTextEditor
              content={content}
              onChange={onContentChange}
              language={language}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
