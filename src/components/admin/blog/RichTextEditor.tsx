
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

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg flex flex-col h-full">
      <EditorToolbar editor={editor} language={language} />
      <div className="flex-1 overflow-auto relative bg-white">
        <EditorContent 
          editor={editor} 
          className="prose max-w-none min-h-full p-6 focus:outline-none cursor-text" 
        />
      </div>
    </div>
  );
}
