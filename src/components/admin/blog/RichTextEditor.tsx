
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import { EditorToolbar } from './editor/EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
}

export function RichTextEditor({ content, onChange, language = "english" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      BulletList,
      OrderedList,
      TextAlign.configure({
        types: ['paragraph', 'heading']
      }),
    ],
    content: content ? JSON.parse(content) : {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: []
      }]
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4',
      },
    },
  });

  return (
    <div className="border rounded-lg flex flex-col h-full bg-white">
      <EditorToolbar editor={editor} language={language} />
      <EditorContent 
        editor={editor} 
        className="flex-1 overflow-y-auto"
      />
    </div>
  );
}
