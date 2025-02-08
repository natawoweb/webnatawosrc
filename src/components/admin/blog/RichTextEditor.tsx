
import React from 'react';
import { Editor, RichUtils, DraftHandleValue } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { EditorToolbar } from './editor/EditorToolbar';
import { ImageComponent } from './editor/ImageComponent';
import { ImageUploader } from './editor/ImageUploader';
import { useEditorState } from './editor/useEditorState';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
}

export function RichTextEditor({ content, onChange, language = "english" }: RichTextEditorProps) {
  const { editorState, setEditorState, imageStates, setImageStates } = useEditorState(content, onChange);

  const handleKeyCommand = (command: string): DraftHandleValue => {
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

  const blockRendererFn = (contentBlock: any) => {
    if (contentBlock.getType() === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0);
      if (!entityKey) return null;
      
      const entity = editorState.getCurrentContent().getEntity(entityKey);
      if (entity.getType() === 'IMAGE') {
        return {
          component: ImageComponent,
          editable: false,
          props: {
            onResizeImage: (width: number) => {
              setImageStates(prev => ({
                ...prev,
                [contentBlock.getKey()]: { width, height: 'auto' }
              }));
            }
          }
        };
      }
    }
    return null;
  };

  const handleImageAdd = (blockKey: string) => {
    setImageStates(prev => ({
      ...prev,
      [blockKey]: { width: 300, height: 'auto' }
    }));
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
        <ImageUploader
          language={language}
          editorState={editorState}
          setEditorState={setEditorState}
          onImageAdd={handleImageAdd}
        />
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          blockRendererFn={blockRendererFn}
        />
      </div>
    </div>
  );
}
