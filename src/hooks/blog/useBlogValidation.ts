
export function useBlogValidation() {
  const hasContent = (content: string, title: string) => {
    try {
      if (!content || content.trim() === '') return false;
      
      const contentObj = JSON.parse(content);
      const hasNonEmptyTitle = title.trim().length > 0;
      const hasNonEmptyContent = contentObj.blocks && contentObj.blocks.some((block: any) => block.text.trim().length > 0);
      return hasNonEmptyTitle && hasNonEmptyContent;
    } catch (error) {
      console.error('Error parsing content:', error);
      return false;
    }
  };

  return { hasContent };
}
