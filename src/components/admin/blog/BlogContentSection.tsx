import { memo } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { ContentInput } from './editor/ContentInput';

interface BlogContentSectionProps {
  language: 'english' | 'tamil';
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  hasContent?: boolean;
}

const BlogContentSection = memo(
  ({
    language,
    title,
    content,
    onTitleChange,
    onContentChange,
    hasContent,
  }: BlogContentSectionProps) => {
    const isEnglish = language === 'english';

    return (
      <div className="space-y-8">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b">
            <h2 className="font-semibold">{isEnglish ? 'Title' : 'தலைப்பு'}</h2>
          </div>
          <div className="p-4">
            <ContentInput
              language={language}
              title={title}
              onTitleChange={onTitleChange}
              placeholder={
                isEnglish
                  ? 'Enter a compelling title...'
                  : 'தலைப்பை உள்ளிடவும்...'
              }
            />
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b">
            <h2 className="font-semibold">
              {isEnglish ? 'Content' : 'உள்ளடக்கம்'}
            </h2>
          </div>
          <div className="p-4">
            <RichTextEditor
              content={content}
              onChange={onContentChange}
              language={language}
              placeholder={
                isEnglish ? 'Tell your story...' : 'உங்கள் கதையை சொல்லுங்கள்...'
              }
            />
          </div>
        </div>
      </div>
    );
  }
);

BlogContentSection.displayName = 'BlogContentSection';

export { BlogContentSection };
