
import { useState, useEffect, useCallback } from 'react';
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';
import { ImageComponentState } from './ImageComponent';

export const useEditorState = (content: string, onChange: (content: string) => void) => {
  const [editorState, setEditorState] = useState(() => {
    try {
      // If content is empty, create empty editor state
      if (!content) {
        return EditorState.createEmpty();
      }

      let contentObj;
      try {
        contentObj = JSON.parse(content);
      } catch (e) {
        // If parsing fails, create state from plain text
        return EditorState.createWithContent(ContentState.createFromText(content || ''));
      }

      // Handle case where contentObj is already stringified
      if (typeof contentObj === 'string') {
        try {
          contentObj = JSON.parse(contentObj);
        } catch (e) {
          return EditorState.createWithContent(ContentState.createFromText(contentObj));
        }
      }

      // If we have valid Draft.js content structure
      if (contentObj && contentObj.blocks) {
        return EditorState.createWithContent(convertFromRaw(contentObj));
      }

      // Fallback to empty state
      return EditorState.createEmpty();
    } catch (e) {
      console.error('Error initializing editor state:', e);
      return EditorState.createEmpty();
    }
  });

  const [imageStates, setImageStates] = useState<{ [key: string]: ImageComponentState }>({});

  // Handle content updates from parent
  useEffect(() => {
    try {
      if (!content) {
        setEditorState(EditorState.createEmpty());
        return;
      }

      let contentObj;
      try {
        contentObj = JSON.parse(content);
      } catch (e) {
        return;
      }

      // Only update if the content is significantly different
      const currentContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      if (content !== currentContent) {
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
        
        if (contentObj && contentObj.blocks) {
          const newState = EditorState.createWithContent(convertFromRaw(contentObj));
          setEditorState(newState);
        }
      }
    } catch (e) {
      console.error('Error updating editor state:', e);
    }
  }, [content]);

  // Handle editor state changes
  const handleEditorStateChange = useCallback((newEditorState: EditorState) => {
    setEditorState(newEditorState);
    
    const contentState = newEditorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    
    // Update image states if present
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

    // Notify parent of content change
    onChange(JSON.stringify(rawContent));
  }, [imageStates, onChange]);

  return {
    editorState,
    setEditorState: handleEditorStateChange,
    imageStates,
    setImageStates
  };
};
