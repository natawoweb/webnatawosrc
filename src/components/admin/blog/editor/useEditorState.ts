
import { useState, useEffect } from 'react';
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';
import { ImageComponentState } from './ImageComponent';

export const useEditorState = (content: string, onChange: (content: string) => void) => {
  const [editorState, setEditorState] = useState(() => {
    try {
      let contentObj;
      try {
        contentObj = JSON.parse(content);
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (e) {
        return EditorState.createWithContent(ContentState.createFromText(content || ''));
      }

      if (contentObj && contentObj.blocks) {
        const contentState = convertFromRaw(contentObj);
        return EditorState.createWithContent(contentState);
      }
      
      return EditorState.createWithContent(
        ContentState.createFromText(typeof contentObj === 'string' ? contentObj : '')
      );
    } catch (e) {
      console.error('Error initializing editor state:', e);
      return EditorState.createEmpty();
    }
  });

  const [imageStates, setImageStates] = useState<{ [key: string]: ImageComponentState }>({});

  // Only update editor state from props when content changes and it's different from current state
  useEffect(() => {
    const currentContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    if (content !== currentContent) {
      try {
        let contentObj;
        try {
          contentObj = JSON.parse(content);
          if (typeof contentObj === 'string') {
            contentObj = JSON.parse(contentObj);
          }
        } catch (e) {
          const contentState = ContentState.createFromText(content || '');
          setEditorState(EditorState.createWithContent(contentState));
          return;
        }

        if (contentObj && contentObj.blocks) {
          const contentState = convertFromRaw(contentObj);
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (e) {
        console.error('Error updating editor state:', e);
      }
    }
  }, [content]);

  // Update content when editor state changes, but avoid unnecessary updates
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    
    rawContent.blocks.forEach(block => {
      if (block.type === 'atomic') {
        const entityKey = block.entityRanges[0]?.key;
        if (entityKey !== undefined) {
          const entity = rawContent.entityMap[entityKey];
          if (entity && entity.type === 'IMAGE' && imageStates[block.key]) {
            entity.data = {
              ...entity.data,
              width: imageStates[block.key].width,
              height: imageStates[block.key].height
            };
          }
        }
      }
    });

    const newContent = JSON.stringify(rawContent);
    if (newContent !== content) {
      onChange(newContent);
    }
  }, [editorState, imageStates]);

  return {
    editorState,
    setEditorState,
    imageStates,
    setImageStates
  };
};

