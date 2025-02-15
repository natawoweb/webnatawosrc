
import { useState } from "react";

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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(emptyContent);
  const [titleTamil, setTitleTamil] = useState("");
  const [contentTamil, setContentTamil] = useState(emptyContent);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | undefined>(undefined);

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
