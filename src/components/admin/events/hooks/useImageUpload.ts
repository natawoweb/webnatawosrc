
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export async function uploadImages(files: File[]) {
  const { toast } = useToast();
  
  try {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
        });
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error in uploadImages:", error);
    toast({
      variant: "destructive",
      title: "Upload Error",
      description: "Failed to upload images. Please try again.",
    });
    throw error;
  }
}
