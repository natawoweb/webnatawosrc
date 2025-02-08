
import { Button } from "@/components/ui/button";
import { EditorState } from 'draft-js';
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

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
  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="border-b p-2 flex gap-2 flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInlineStyle('BOLD')}
        className={currentStyle.has('BOLD') ? 'bg-muted' : ''}
      >
        <BoldIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInlineStyle('ITALIC')}
        className={currentStyle.has('ITALIC') ? 'bg-muted' : ''}
      >
        <ItalicIcon className="h-4 w-4" />
      </Button>
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
      <div className="h-6 w-px bg-border mx-2" />
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
    </div>
  );
}
