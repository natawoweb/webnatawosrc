
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { EditorState } from 'draft-js';

interface AlignmentButtonsProps {
  editorState: EditorState;
  onBlockType: (blockType: string) => void;
}

export function AlignmentButtons({ editorState, onBlockType }: AlignmentButtonsProps) {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onBlockType('left')}
        className={blockType === 'left' ? 'bg-muted' : ''}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onBlockType('center')}
        className={blockType === 'center' ? 'bg-muted' : ''}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onBlockType('right')}
        className={blockType === 'right' ? 'bg-muted' : ''}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onBlockType('justify')}
        className={blockType === 'justify' ? 'bg-muted' : ''}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </>
  );
}
