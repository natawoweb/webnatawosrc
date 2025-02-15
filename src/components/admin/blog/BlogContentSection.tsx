
import React, { memo } from 'react';
import { RichTextEditor } from "./RichTextEditor";
import { ContentInput } from "./editor/ContentInput";

interface BlogContentSectionProps {
  language: "english" | "tamil";
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  hasContent?: boolean;
}

const BlogContentSection = memo(({
  language,
  title,
  content,
  onTitleChange,
  onContentChange,
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
      </div>
    </div>
  );
});

BlogContentSection.displayName = 'BlogContentSection';

export { BlogContentSection };
