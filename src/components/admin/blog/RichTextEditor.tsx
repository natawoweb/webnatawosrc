
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { EditorToolbar } from './editor/EditorToolbar';
import { ImageUploader } from './editor/ImageUploader';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
  placeholder?: string;
}

const convertDraftToTiptap = (draftContent: any) => {
  try {
    // If it's already in TipTap format, return as is
    if (draftContent.type === 'doc') {
      return draftContent;
    }

    // Convert Draft.js format to TipTap format
    const blocks = draftContent.blocks || [];
    
    return {
      type: 'doc',
      content: blocks.map((block: any) => {
        let nodeType = 'paragraph';
        let textAlign = block.data?.textAlign || 'left';

        switch (block.type) {
          case 'header-one':
            nodeType = 'heading';
            break;
          case 'ordered-list-item':
            nodeType = 'orderedList';
            break;
          case 'unordered-list-item':
            nodeType = 'bulletList';
            break;
          case 'atomic':
            if (draftContent.entityMap[block.entityRanges[0]?.key]?.type === 'IMAGE') {
              return {
                type: 'image',
                attrs: {
                  src: draftContent.entityMap[block.entityRanges[0].key].data.src,
                  alt: draftContent.entityMap[block.entityRanges[0].key].data.alt || '',
                }
              };
            }
            break;
        }

        // If text is empty, provide a space to prevent empty text node error
        const text = block.text.trim() || ' ';

        return {
          type: nodeType,
          attrs: { textAlign },
          content: [{
            type: 'text',
            text
          }]
        };
      }).filter(Boolean)
    };
  } catch (error) {
    console.error('Error converting content:', error);
    return {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: ' ' // Providing a space instead of empty string
        }]
      }]
    };
  }
};

export function RichTextEditor({ content, onChange, language = "english", placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
    ],
    content: content ? convertDraftToTiptap(JSON.parse(content)) : {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: ' ' // Default content with a space
        }]
      }]
    },
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
          {!editor.getText().trim() && placeholder && (
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
