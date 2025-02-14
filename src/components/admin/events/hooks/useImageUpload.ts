
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export async function uploadImages(files: File[]) {
  const { toast } = useToast();
  
  try {
    console.log("Starting image upload process", { numberOfFiles: files.length });
    
    // Create storage bucket if it doesn't exist
    const { data: bucketExists } = await supabase
      .storage
      .getBucket('event-images');
      
    if (!bucketExists) {
      console.log("Creating event-images bucket");
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('event-images', { public: true });
        
      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError);
        throw createBucketError;
      }
    }

    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("Uploading file", { fileName, fileType: file.type });

      const { error: uploadError, data: uploadData } = await supabase.storage
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

      console.log("File uploaded successfully", { filePath, uploadData });

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      console.log("Generated public URL", { publicUrl: data.publicUrl });
      
      return data.publicUrl;
    });

    const results = await Promise.all(uploadPromises);
    console.log("All images uploaded successfully", { urls: results });
    return results;
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
