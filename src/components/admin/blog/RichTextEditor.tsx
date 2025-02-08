
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useRef, useEffect } from 'react';
import { EditorToolbar } from './editor/EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
}

export function RichTextEditor({ content, onChange, language = "english" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const parseContent = (contentString: string) => {
    try {
      if (!contentString) {
        return {
          type: 'doc',
          content: [{
            type: 'paragraph',
            content: []
          }]
        };
      }

      const parsed = JSON.parse(contentString);
      
      if (!parsed.type || parsed.type !== 'doc') {
        return {
          type: 'doc',
          content: [{
            type: 'paragraph',
            content: parsed.content?.[0]?.content || []
          }]
        };
      }

      return parsed;
    } catch (error) {
      console.warn('Error parsing editor content:', error);
      return {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: []
        }]
      };
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: parseContent(content),
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    autofocus: 'end',
    editable: true,
  });

  useEffect(() => {
    if (!editor || !cursorRef.current || !editorRef.current) return;

    const updateCursorPosition = () => {
      const { view } = editor;
      const { state } = view;
      const { selection } = state;
      const dom = view.domAtPos(selection.anchor);
      
      // Check if the node is an HTMLElement before accessing getBoundingClientRect
      if (!dom.node || !(dom.node instanceof HTMLElement)) return;

      const editorBounds = editorRef.current?.getBoundingClientRect();
      const nodeBounds = dom.node.getBoundingClientRect();
      
      if (!editorBounds || !cursorRef.current) return;

      const relativeTop = nodeBounds.top - editorBounds.top;
      const relativeLeft = nodeBounds.left - editorBounds.left;

      cursorRef.current.style.transform = `translate(${relativeLeft}px, ${relativeTop}px)`;
      cursorRef.current.style.opacity = '1';
    };

    editor.on('selectionUpdate', updateCursorPosition);
    return () => {
      editor.off('selectionUpdate', updateCursorPosition);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg h-full flex flex-col relative" ref={editorRef}>
      <EditorToolbar editor={editor} language={language} />
      <div className="relative flex-grow">
        <div 
          ref={cursorRef}
          className="absolute w-0.5 h-5 bg-blue-500 transition-transform duration-100 pointer-events-none opacity-0"
          style={{ zIndex: 50 }}
        />
        <EditorContent 
          editor={editor} 
          className="prose max-w-none p-6 h-full overflow-y-auto focus:outline-none cursor-text bg-white" 
        />
      </div>
    </div>
  );
}
