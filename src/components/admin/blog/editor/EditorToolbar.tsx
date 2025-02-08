
import React from "react";
import { EditorState } from 'draft-js';
import { TextFormatButtons } from './toolbar/TextFormatButtons';
import { ListButtons } from './toolbar/ListButtons';
import { AlignmentButtons } from './toolbar/AlignmentButtons';

interface EditorToolbarProps {
  editorState: EditorState;
  onInlineStyle: (style: string) => void;
  onBlockType: (blockType: string) => void;
  language?: "english" | "tamil";
}

export function EditorToolbar({ 
  editorState, 
  onInlineStyle, 
  onBlockType,
  language 
}: EditorToolbarProps) {
  return (
    <div className="border-b p-2 flex gap-2 flex-wrap">
      <TextFormatButtons editorState={editorState} onInlineStyle={onInlineStyle} />
      <ListButtons editorState={editorState} onBlockType={onBlockType} />
      <div className="h-6 w-px bg-border mx-2" />
      <AlignmentButtons editorState={editorState} onBlockType={onBlockType} />
    </div>
  );
}
