
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Plus, Image as ImageIcon, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EventGalleryProps {
  initialGallery?: string[];
  selectedImages: File[];
  onImageSelect: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  onExistingImageRemove?: (index: number) => void;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per image

export function EventGallery({
  initialGallery = [],
  selectedImages,
  onImageSelect,
  onImageRemove,
  onExistingImageRemove,
}: EventGalleryProps) {
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: FileList) => {
    const filesArray = Array.from(files);
    
    // Check file types
    const invalidTypeFile = filesArray.find(file => !ALLOWED_FILE_TYPES.includes(file.type));
    if (invalidTypeFile) {
      setError(`File "${invalidTypeFile.name}" is not a valid image format. Please use JPEG, PNG, or GIF.`);
      return null;
    }

    // Check file sizes
    const oversizedFile = filesArray.find(file => file.size > MAX_FILE_SIZE);
    if (oversizedFile) {
      setError(`File "${oversizedFile.name}" exceeds the 5MB size limit.`);
      return null;
    }

    return filesArray;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files?.length) return;

    const validatedFiles = validateFiles(e.target.files);
    if (validatedFiles) {
      onImageSelect(validatedFiles);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="images">Event Gallery</Label>
        <div className="flex items-center gap-2">
          <Input
            id="images"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setError(null);
              document.getElementById("images")?.click();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Images
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <p className="text-sm text-muted-foreground">
        Allowed formats: JPEG, PNG, GIF (max 5MB per image)
      </p>

      {initialGallery?.length > 0 && (
        <div className="space-y-2">
          <Label>Current Gallery</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {initialGallery.map((url, index) => (
              <div key={url} className="relative group aspect-square">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer w-full h-full">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
                {onExistingImageRemove && (
                  <button
                    type="button"
                    onClick={() => onExistingImageRemove(index)}
                    className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="space-y-2">
          <Label>New Images</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!initialGallery?.length && !selectedImages.length && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No images added yet. Click "Add Images" to upload event photos.
          </p>
        </div>
      )}
    </div>
  );
}
