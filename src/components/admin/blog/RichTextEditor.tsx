import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { useRef } from 'react';
import { EditorToolbar } from './editor/EditorToolbar';
import { useTamilInputSetup } from './editor/TamilInputSetup';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
}

export function RichTextEditor({ content, onChange, language = "english" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

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

  const editorElement = editorRef.current?.getElementsByClassName('ProseMirror')[0];
  useTamilInputSetup({
    elementRef: editorElement as HTMLElement,
    enabled: language === "tamil"
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg h-full flex flex-col" ref={editorRef}>
      <EditorToolbar editor={editor} language={language} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 flex-grow overflow-y-auto focus:outline-none cursor-text" 
      />
    </div>
  );
}