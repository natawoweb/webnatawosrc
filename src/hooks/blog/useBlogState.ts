
import { useState, useEffect } from "react";

const emptyContent = JSON.stringify({
  blocks: [{ 
    key: 'initial', 
    text: '', 
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {}
  }],
  entityMap: {}
});

interface UseBlogStateProps {
  initialData?: {
    title?: string;
    content?: string;
    title_tamil?: string;
    content_tamil?: string;
    category_id?: string;
  };
  initialBlogId?: string;
}

export function useBlogState({ initialData, initialBlogId }: UseBlogStateProps = {}) {
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "tamil">("english");
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || emptyContent);
  const [titleTamil, setTitleTamil] = useState(initialData?.title_tamil || "");
  const [contentTamil, setContentTamil] = useState(
    initialData?.content_tamil ? 
      typeof initialData.content_tamil === 'string' ? 
        initialData.content_tamil : 
        JSON.stringify(initialData.content_tamil) 
      : emptyContent
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category_id || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | undefined>(initialBlogId);

  // Only update the state from initialData when it changes significantly
  useEffect(() => {
    if (initialData && initialData.title !== undefined) {
      setTitle(initialData.title);
      setContent(initialData.content || emptyContent);
      setTitleTamil(initialData.title_tamil || "");
      setContentTamil(
        initialData.content_tamil ? 
          typeof initialData.content_tamil === 'string' ? 
            initialData.content_tamil : 
            JSON.stringify(initialData.content_tamil) 
          : emptyContent
      );
      setSelectedCategory(initialData.category_id || "");
    }
    if (initialBlogId) {
      setCurrentBlogId(initialBlogId);
    }
  }, [initialBlogId, initialData]); // Add initialData as a dependency to update when data is loaded

  return {
    selectedLanguage,
    setSelectedLanguage,
    title,
    setTitle,
    content,
    setContent,
    titleTamil,
    setTitleTamil,
    contentTamil,
    setContentTamil,
    selectedCategory,
    setSelectedCategory,
    lastSaved,
    setLastSaved,
    isSaving,
    setIsSaving,
    currentBlogId,
    setCurrentBlogId,
    emptyContent
  };
}
