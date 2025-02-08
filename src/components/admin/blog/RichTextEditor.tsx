
import React, { useEffect, useState, useCallback } from 'react';
import { 
  Editor, 
  EditorState, 
  RichUtils, 
  convertFromRaw,
  convertToRaw,
  ContentState,
  AtomicBlockUtils,
  DraftHandleValue
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { EditorToolbar } from './editor/EditorToolbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  language?: "english" | "tamil";
}

interface ImageComponentState {
  width: number;
  height: number;
}

export function RichTextEditor({ content, onChange, language = "english" }: RichTextEditorProps) {
  const { toast } = useToast();
  const [editorState, setEditorState] = useState(() => {
    try {
      let contentObj;
      try {
        contentObj = JSON.parse(content);
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (e) {
        return EditorState.createWithContent(ContentState.createFromText(content || ''));
      }

      if (contentObj && contentObj.blocks) {
        return EditorState.createWithContent(convertFromRaw(contentObj));
      }
      
      return EditorState.createWithContent(
        ContentState.createFromText(typeof contentObj === 'string' ? contentObj : '')
      );
    } catch (e) {
      console.error('Error initializing editor state:', e);
      return EditorState.createEmpty();
    }
  });

  const [imageStates, setImageStates] = useState<{ [key: string]: ImageComponentState }>({});

  useEffect(() => {
    try {
      let contentObj;
      try {
        contentObj = JSON.parse(content);
        if (typeof contentObj === 'string') {
          contentObj = JSON.parse(contentObj);
        }
      } catch (e) {
        const contentState = ContentState.createFromText(content || '');
        setEditorState(EditorState.createWithContent(contentState));
        return;
      }

      if (contentObj && contentObj.blocks) {
        const contentState = convertFromRaw(contentObj);
        setEditorState(EditorState.createWithContent(contentState));
      }
    } catch (e) {
      console.error('Error updating editor state:', e);
    }
  }, [content]);

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    
    // Save image states in the entity data
    rawContent.blocks.forEach(block => {
      if (block.type === 'atomic') {
        const entityKey = block.entityRanges[0]?.key;
        if (entityKey !== undefined) {
          const entity = rawContent.entityMap[entityKey];
          if (entity && entity.type === 'IMAGE' && imageStates[block.key]) {
            entity.data = {
              ...entity.data,
              width: imageStates[block.key].width,
              height: imageStates[block.key].height
            };
          }
        }
      }
    });
    
    onChange(JSON.stringify(rawContent));
  }, [editorState, onChange, imageStates]);

  const handleKeyCommand = (command: string): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'IMAGE',
        'IMMUTABLE',
        { src: publicUrl, width: 300, height: 'auto' }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(
        editorState,
        { currentContent: contentStateWithEntity }
      );
      const nextEditorState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
      setEditorState(nextEditorState);

      // Initialize image state
      const block = nextEditorState.getCurrentContent().getLastBlock();
      setImageStates(prev => ({
        ...prev,
        [block.getKey()]: { width: 300, height: 'auto' }
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image",
      });
    }
  };

  const blockRendererFn = (contentBlock: any) => {
    if (contentBlock.getType() === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0);
      if (!entityKey) return null;
      
      const entity = editorState.getCurrentContent().getEntity(entityKey);
      if (entity.getType() === 'IMAGE') {
        return {
          component: ImageComponent,
          editable: false,
          props: {
            onResizeImage: (width: number) => {
              setImageStates(prev => ({
                ...prev,
                [contentBlock.getKey()]: { width, height: 'auto' }
              }));
            }
          }
        };
      }
    }
    return null;
  };

  const ImageComponent = (props: any) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0));
    const { src } = entity.getData();
    const blockKey = props.block.getKey();
    const imageState = imageStates[blockKey] || { width: 300, height: 'auto' };

    return (
      <div className="relative my-4">
        <img 
          src={src} 
          alt="Blog content" 
          style={{ width: imageState.width, height: imageState.height }}
          className="max-w-full object-contain"
        />
        <div className="mt-2 w-64">
          <Slider
            defaultValue={[imageState.width]}
            max={800}
            min={100}
            step={10}
            onValueChange={(value) => props.blockProps.onResizeImage(value[0])}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg flex flex-col h-full bg-white">
      <EditorToolbar 
        editorState={editorState}
        onInlineStyle={toggleInlineStyle}
        onBlockType={toggleBlockType}
        language={language}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id={`image-upload-${language}`}
          />
          <label htmlFor={`image-upload-${language}`}>
            <Button type="button" variant="outline" asChild>
              <span className="cursor-pointer">
                <Image className="w-4 h-4 mr-2" />
                Add Image
              </span>
            </Button>
          </label>
        </div>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          blockRendererFn={blockRendererFn}
        />
      </div>
    </div>
  );
}
