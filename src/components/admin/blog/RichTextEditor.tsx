
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

const processInitialContent = (content: string) => {
  try {
    console.log('Processing initial content:', content);
    
    // If content is empty or just whitespace, return default structure
    if (!content || !content.trim()) {
      return {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: ' ' }] // Always include a space
        }]
      };
    }

    // Try to parse the content if it's a string
    let parsedContent;
    try {
      parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      // Handle double-stringified content
      if (typeof parsedContent === 'string') {
        parsedContent = JSON.parse(parsedContent);
      }
    } catch (e) {
      console.log('Content is not JSON, treating as plain text');
      return {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: content }]
        }]
      };
    }

    // If it's already in TipTap format
    if (parsedContent.type === 'doc') {
      console.log('Content is already in TipTap format');
      // Ensure no empty text nodes
      if (parsedContent.content) {
        parsedContent.content = parsedContent.content.map((node: any) => {
          if (node.type === 'paragraph' && (!node.content || !node.content[0]?.text)) {
            return {
              ...node,
              content: [{ type: 'text', text: ' ' }]
            };
          }
          return node;
        });
      }
      return parsedContent;
    }

    // If it's in Draft.js format
    if (parsedContent.blocks) {
      console.log('Converting Draft.js format to TipTap');
      return convertDraftToTiptap(parsedContent);
    }

    // If we get here, wrap the content in a paragraph
    console.log('Wrapping content in default structure');
    return {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: String(content) || ' ' }]
      }]
    };
  } catch (error) {
    console.error('Error processing initial content:', error);
    return {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: ' ' }]
      }]
    };
  }
};

const convertDraftToTiptap = (draftContent: any) => {
  try {
    const blocks = draftContent.blocks || [];
    
    if (blocks.length === 0) {
      return {
        type: 'doc',
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: ' ' }]
        }]
      };
    }

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

        return {
          type: nodeType,
          attrs: { textAlign },
          content: [{
            type: 'text',
            text: block.text || ' ' // Always provide at least a space
          }]
        };
      }).filter(Boolean)
    };
  } catch (error) {
    console.error('Error converting Draft.js content:', error);
    return {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: ' ' }]
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
    content: processInitialContent(content),
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
