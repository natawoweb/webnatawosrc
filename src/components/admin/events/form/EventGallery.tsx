import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface EventGalleryProps {
  initialGallery?: string[];
  selectedImages: File[];
  onImageSelect: (files: File[]) => void;
  onImageRemove: (index: number) => void;
}

export function EventGallery({
  initialGallery,
  selectedImages,
  onImageSelect,
  onImageRemove,
}: EventGalleryProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      onImageSelect(filesArray);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="images">Event Images</Label>
      <div className="flex items-center gap-2">
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => document.getElementById("images")?.click()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {initialGallery && initialGallery.length > 0 && (
        <div className="mt-4">
          <Label>Current Gallery</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {initialGallery.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="mt-4">
          <Label>New Images</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}