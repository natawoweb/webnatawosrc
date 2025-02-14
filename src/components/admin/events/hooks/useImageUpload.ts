
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export async function uploadImages(files: File[]) {
  const { toast } = useToast();
  
  try {
    console.log("Starting image upload process", { numberOfFiles: files.length });
    
    // Check user role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Check if user has admin or manager role
    const { data: hasAdminRole } = await supabase.rpc('has_role', {
      user_id: user.id,
      required_role: 'admin'
    });

    const { data: hasManagerRole } = await supabase.rpc('has_role', {
      user_id: user.id,
      required_role: 'manager'
    });

    if (!hasAdminRole && !hasManagerRole) {
      throw new Error("You don't have permission to upload event images");
    }

    const uploadPromises = files.map(async (file) => {
      // Create a unique filename with timestamp and random string
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split(".").pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      console.log("Uploading file", { fileName, fileType: file.type });

      // Convert blob URL to File object if needed
      let fileToUpload = file;
      if (file.type === "" && typeof file !== 'string' && 'toString' in file) {
        const blobUrl = file.toString();
        if (blobUrl.startsWith('blob:')) {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          fileToUpload = new File([blob], fileName, { type: blob.type });
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
          contentType: fileToUpload.type
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully", { fileName });

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      console.log("Generated public URL", { publicUrl: data.publicUrl });
      
      return data.publicUrl;
    });

    const results = await Promise.all(uploadPromises);
    console.log("All images uploaded successfully", { urls: results });
    return results;
  } catch (error: any) {
    console.error("Error in uploadImages:", error);
    toast({
      variant: "destructive",
      title: "Upload Error",
      description: error.message || "Failed to upload images. Please try again.",
    });
    throw error;
  }
}
