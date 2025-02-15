
import React, { memo } from 'react';
import { RichTextEditor } from "./RichTextEditor";
import { ContentInput } from "./editor/ContentInput";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <ContentInput
        language={language}
        title={title}
        onTitleChange={onTitleChange}
        placeholder={isEnglish ? "Enter a compelling title..." : "தலைப்பை உள்ளிடவும்..."}
      />
      <div className="relative">
        <RichTextEditor
          content={content}
          onChange={onContentChange}
          language={language}
          placeholder={isEnglish ? "Tell your story..." : "உங்கள் கதையை சொல்லுங்கள்..."}
        />
        {isEnglish && onTranslate && (
          <div className="absolute top-2 right-2">
            <Button
              onClick={onTranslate}
              disabled={!hasContent}
              className="bg-[#FF4747] hover:bg-[#FF4747]/90 text-white"
            >
              <Globe className="mr-2 h-4 w-4" />
              Translate to Tamil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

BlogContentSection.displayName = 'BlogContentSection';

export { BlogContentSection };
