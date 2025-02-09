
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

interface BlogContentProps {
  content: string;
}

export const BlogContent = ({ content }: BlogContentProps) => {
  const getFormattedContent = () => {
    try {
      // First try to parse the content
      let contentObj;
      try {
        contentObj = JSON.parse(content);
        // Handle case where content might be double-stringified
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (e) {
        console.error('Error parsing content:', e);
        return content; // Return raw content if parsing fails
      }

      // Check if it's in Draft.js format
      if (contentObj.blocks && Array.isArray(contentObj.blocks)) {
        const contentState = convertFromRaw(contentObj);
        return stateToHTML(contentState);
      }

      // If not in Draft.js format, return as is
      return typeof contentObj === 'string' ? contentObj : content;
    } catch (error) {
      console.error('Error formatting blog content:', error);
      return content; // Fallback to displaying raw content
    }
  };

  return (
    <div 
      className="mt-8 prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: getFormattedContent() }} 
    />
  );
};
