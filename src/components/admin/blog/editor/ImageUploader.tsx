
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploaderProps {
  language: "english" | "tamil";
  onImageAdd: (url: string) => void;
}

export const ImageUploader = ({ language, onImageAdd }: ImageUploaderProps) => {
  const { toast } = useToast();

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

      onImageAdd(publicUrl);

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

  return (
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
  );
};
