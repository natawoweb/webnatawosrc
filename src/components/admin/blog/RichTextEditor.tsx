
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
    if (!content) return EditorState.createEmpty();

    try {
      const parsedContent = JSON.parse(content);
      
      // Validate if the content has the required Draft.js structure
      if (parsedContent && parsedContent.blocks) {
        return EditorState.createWithContent(convertFromRaw(parsedContent));
      }
      
      // If not valid Draft.js format, create with plain text
      return EditorState.createWithContent(
        ContentState.createFromText(content)
      );
    } catch (e) {
      console.error('Error parsing content:', e);
      return EditorState.createEmpty();
    }
  });

  useEffect(() => {
    if (!content) return;

    try {
      const parsedContent = JSON.parse(content);
      
      // Only update if content is different
      const currentRawContent = convertToRaw(editorState.getCurrentContent());
      if (JSON.stringify(currentRawContent) !== JSON.stringify(parsedContent)) {
        const contentState = convertFromRaw(parsedContent);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    } catch (e) {
      console.error('Error updating editor state:', e);
      // If parsing fails, try to set content as plain text
      const contentState = ContentState.createFromText(content);
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
