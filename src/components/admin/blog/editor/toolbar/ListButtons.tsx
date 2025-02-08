
import React from 'react';
import { Button } from "@/components/ui/button";
import { List, ListOrdered } from "lucide-react";
import { EditorState } from 'draft-js';

interface ListButtonsProps {
  editorState: EditorState;
  onBlockType: (blockType: string) => void;
}

export function ListButtons({ editorState, onBlockType }: ListButtonsProps) {
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
        onClick={() => onBlockType('unordered-list-item')}
        className={blockType === 'unordered-list-item' ? 'bg-muted' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onBlockType('ordered-list-item')}
        className={blockType === 'ordered-list-item' ? 'bg-muted' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </>
  );
}
