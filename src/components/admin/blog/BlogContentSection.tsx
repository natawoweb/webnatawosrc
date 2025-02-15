
import React, { memo, useMemo } from 'react';
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

const BlogContentSection = memo(({
  language,
  title,
  content,
  onTitleChange,
  onContentChange,
  onTranslate,
  hasContent,
}: BlogContentSectionProps) => {
  const isEnglish = language === "english";
  const shouldEnableTranslate = useMemo(() => 
    isEnglish && onTranslate && hasContent, 
    [isEnglish, onTranslate, hasContent]
  );

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {isEnglish ? "Write Your Blog Post" : "உங்கள் வலைப்பதிவை எழுதுங்கள்"}
            </CardTitle>
            <CardDescription>
              {isEnglish 
                ? "Express your thoughts with rich formatting and media" 
                : "உங்கள் எண்ணங்களை வடிவமைப்புடன் வெளிப்படுத்துங்கள்"}
            </CardDescription>
          </div>
          {isEnglish && onTranslate && (
            <Button
              onClick={onTranslate}
              disabled={!shouldEnableTranslate}
              className="bg-[#FF4747] hover:bg-[#FF4747]/90 text-white"
            >
              <Globe className="mr-2 h-4 w-4" />
              Translate to Tamil
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col space-y-4 pb-6">
        <ContentInput
          language={language}
          title={title}
          onTitleChange={onTitleChange}
          placeholder={isEnglish ? "Enter a compelling title..." : "தலைப்பை உள்ளிடவும்..."}
        />
        <div className="flex-1 min-h-0">
          <div className="h-full">
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
});

BlogContentSection.displayName = 'BlogContentSection';

export { BlogContentSection };
