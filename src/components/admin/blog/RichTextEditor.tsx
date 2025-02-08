
import React, { useEffect, useState } from 'react';
import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertFromRaw,
  convertToRaw,
  ContentState 
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { EditorToolbar } from './editor/EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
}

export function RichTextEditor({ content, onChange, language = "english" }: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(() => {
    try {
      let contentObj;
      try {
        // First try parsing it as JSON
        contentObj = JSON.parse(content);
        // If it's still a string, try parsing it again (handles double encoding)
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (e) {
        // If parsing fails, assume it's plain text
        return EditorState.createWithContent(ContentState.createFromText(content || ''));
      }

      // Check if it's in Draft.js format
      if (contentObj && contentObj.blocks) {
        return EditorState.createWithContent(convertFromRaw(contentObj));
      }
      
      // If not in Draft.js format, create from plain text
      return EditorState.createWithContent(
        ContentState.createFromText(typeof contentObj === 'string' ? contentObj : '')
      );
    } catch (e) {
      console.error('Error initializing editor state:', e);
      return EditorState.createEmpty();
    }
  });

  useEffect(() => {
    try {
      let contentObj;
      try {
        contentObj = JSON.parse(content);
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (e) {
        // If parsing fails, treat as plain text
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
  }, [content]);

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    onChange(JSON.stringify(rawContent));
  }, [editorState, onChange]);

  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  return (
    <div className="border rounded-lg flex flex-col h-full bg-white">
      <EditorToolbar 
        editorState={editorState}
        onInlineStyle={toggleInlineStyle}
        onBlockType={toggleBlockType}
        language={language}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
}
