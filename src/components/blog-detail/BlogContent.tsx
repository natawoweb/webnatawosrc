
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

interface BlogContentProps {
  content: string;
}

export const BlogContent = ({ content }: BlogContentProps) => {
  const getFormattedContent = () => {
    try {
      const contentState = convertFromRaw(JSON.parse(content));
      return stateToHTML(contentState);
    } catch (error) {
      console.error('Error parsing blog content:', error);
      return '';
    }
  };

  return (
    <div 
      className="mt-8 prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: getFormattedContent() }} 
    />
  );
};

