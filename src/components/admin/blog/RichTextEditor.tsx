import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Keyboard
} from "lucide-react";
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (language === "tamil" && editorRef.current) {
      const script = document.createElement('script');
      script.src = "https://www.google.com/jsapi";
      
      script.onload = () => {
        // @ts-ignore
        google.load("elements", "1", {
          packages: "transliteration",
          callback: () => {
            const control = new window.google.elements.transliteration.TransliterationControl({
              sourceLanguage: 'en',
              destinationLanguage: ['ta'],
              shortcutKey: 'ctrl+g',
              transliterationEnabled: true
            });
            
            const elements = editorRef.current!.getElementsByClassName('ProseMirror');
            if (elements.length > 0) {
              control.makeTransliteratable([elements[0]]);
              // Enable transliteration by default
              control.toggleTransliteration();
            }
          }
        });
      };

      // Only add the script if it hasn't been added before
      if (!document.querySelector('script[src="https://www.google.com/jsapi"]')) {
        document.head.appendChild(script);
      }

      return () => {
        // Cleanup if needed
        const scriptElement = document.querySelector('script[src="https://www.google.com/jsapi"]');
        if (scriptElement) {
          scriptElement.remove();
        }
      };
    }
  }, [language, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg h-full flex flex-col" ref={editorRef}>
      <div className="border-b p-2 flex gap-2 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'bg-muted' : ''}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
        {language === "tamil" && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Keyboard className="mr-2 h-4 w-4" />
            Press Ctrl+G to toggle Tamil typing
          </div>
        )}
      </div>
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 flex-grow overflow-y-auto focus:outline-none cursor-text" 
      />
    </div>
  );
}