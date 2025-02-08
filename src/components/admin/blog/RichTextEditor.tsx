
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
      // If content is a string that needs to be parsed
      const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Check if it's already in Draft.js format
      if (contentObj && contentObj.blocks) {
        return EditorState.createWithContent(convertFromRaw(contentObj));
      }
      
      // If it's plain text or empty, create with plain text
      return EditorState.createWithContent(
        ContentState.createFromText(typeof content === 'string' ? content : '')
      );
    } catch (e) {
      console.error('Error parsing initial content:', e);
      return EditorState.createWithContent(ContentState.createFromText(''));
    }
  });

  useEffect(() => {
    try {
      const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
      
      if (contentObj && contentObj.blocks) {
        const contentState = convertFromRaw(contentObj);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    } catch (e) {
      console.error('Error updating editor state:', e);
      // If parsing fails, set content as plain text
      const contentState = ContentState.createFromText(typeof content === 'string' ? content : '');
      setEditorState(EditorState.createWithContent(contentState));
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
