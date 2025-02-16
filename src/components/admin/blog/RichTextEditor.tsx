
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { EditorToolbar } from './editor/EditorToolbar';
import { ImageUploader } from './editor/ImageUploader';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, language = "english", placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
    ],
    content: content ? JSON.parse(content) : '',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(JSON.stringify(json));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg flex flex-col h-full bg-white">
      <EditorToolbar editor={editor} language={language} />
      <div className="flex-1 overflow-y-auto p-4">
        <ImageUploader
          language={language}
          onImageAdd={(url: string) => {
            editor.chain().focus().setImage({ src: url }).run();
          }}
        />
        <div className="relative min-h-[200px]">
          {!editor.getText() && placeholder && (
            <div className="absolute text-gray-400 pointer-events-none p-0">
              {placeholder}
            </div>
          )}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
