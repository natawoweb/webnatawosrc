
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
  const [content, setContent] = useState<string>(() => {
    if (!initialData?.content) return emptyContent;
    try {
      // Validate if it's proper JSON
      JSON.parse(initialData.content);
      return initialData.content;
    } catch (e) {
      return JSON.stringify({
        blocks: [{ 
          key: 'initial', 
          text: initialData.content || '', 
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }],
        entityMap: {}
      });
    }
  });
  
  const [titleTamil, setTitleTamil] = useState(initialData?.title_tamil || "");
  const [contentTamil, setContentTamil] = useState<string>(() => {
    if (!initialData?.content_tamil) return emptyContent;
    if (typeof initialData.content_tamil === 'string') {
      try {
        // Validate if it's proper JSON
        JSON.parse(initialData.content_tamil);
        return initialData.content_tamil;
      } catch (e) {
        return emptyContent;
      }
    }
    return JSON.stringify(initialData.content_tamil || emptyContent);
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.category_id || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | undefined>(initialBlogId);

  // Update state when initial data changes
  useEffect(() => {
    if (initialData) {
      console.log("Updating state with initial data:", initialData);
      setTitle(initialData.title || "");
      setContent(prev => {
        if (initialData.content === prev) return prev;
        return initialData.content || emptyContent;
      });
      setTitleTamil(initialData.title_tamil || "");
      setContentTamil(prev => {
        if (initialData.content_tamil === prev) return prev;
        if (typeof initialData.content_tamil === 'string') {
          return initialData.content_tamil || emptyContent;
        }
        return JSON.stringify(initialData.content_tamil || emptyContent);
      });
      setSelectedCategory(initialData.category_id || "");
    }
    if (initialBlogId) {
      setCurrentBlogId(initialBlogId);
    }
  }, [initialData, initialBlogId]);

  // Create wrapped setters that include logging
  const wrappedSetTitle = (newTitle: string) => {
    console.log("Setting new title:", newTitle);
    setTitle(newTitle);
  };

  const wrappedSetTitleTamil = (newTitle: string) => {
    console.log("Setting new Tamil title:", newTitle);
    setTitleTamil(newTitle);
  };

  return {
    selectedLanguage,
    setSelectedLanguage,
    title,
    setTitle: wrappedSetTitle,
    content,
    setContent,
    titleTamil,
    setTitleTamil: wrappedSetTitleTamil,
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
