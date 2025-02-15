
import { useState, useEffect } from 'react';
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';

interface ImageComponentState {
  width: number;
  height: string | number;
}

export const useEditorState = (content: string, onChange: (content: string) => void) => {
  const [editorState, setEditorState] = useState(() => {
    try {
      if (!content) {
        return EditorState.createEmpty();
      }

      let contentObj;
      try {
        contentObj = JSON.parse(content);
      } catch (e) {
        return EditorState.createWithContent(ContentState.createFromText(content || ''));
      }

      if (typeof contentObj === 'string') {
        try {
          contentObj = JSON.parse(contentObj);
        } catch (e) {
          return EditorState.createWithContent(ContentState.createFromText(contentObj));
        }
      }

      if (contentObj && contentObj.blocks) {
        return EditorState.createWithContent(convertFromRaw(contentObj));
      }

      return EditorState.createEmpty();
    } catch (e) {
      console.error('Error initializing editor state:', e);
      return EditorState.createEmpty();
    }
  });

  const [imageStates, setImageStates] = useState<{ [key: string]: ImageComponentState }>({});

  // Only update from props on mount or when content is empty
  useEffect(() => {
    if (!content) {
      setEditorState(EditorState.createEmpty());
    }
  }, []);

  const handleEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    
    try {
      const contentState = newEditorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      
      Object.entries(imageStates).forEach(([blockKey, state]) => {
        const block = rawContent.blocks.find(b => b.key === blockKey);
        if (block && block.type === 'atomic') {
          const entityKey = block.entityRanges[0]?.key;
          if (entityKey !== undefined) {
            const entity = rawContent.entityMap[entityKey];
            if (entity && entity.type === 'IMAGE') {
              entity.data = {
                ...entity.data,
                width: state.width,
                height: state.height
              };
            }
          }
        }
      });

      onChange(JSON.stringify(rawContent));
    } catch (e) {
      console.error('Error converting editor state to raw:', e);
    }
  };

  return {
    editorState,
    setEditorState: handleEditorStateChange,
    imageStates,
    setImageStates
  };
};
