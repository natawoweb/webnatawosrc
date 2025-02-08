
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic } from "lucide-react";
import { EditorState } from 'draft-js';

interface TextFormatButtonsProps {
  editorState: EditorState;
  onInlineStyle: (style: string) => void;
}

export function TextFormatButtons({ editorState, onInlineStyle }: TextFormatButtonsProps) {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInlineStyle('BOLD')}
        className={currentStyle.has('BOLD') ? 'bg-muted' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInlineStyle('ITALIC')}
        className={currentStyle.has('ITALIC') ? 'bg-muted' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
    </>
  );
}
