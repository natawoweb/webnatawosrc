
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
      description: error.message || "Failed to upload images. Please try again.",
    });
    throw error;
  }
}
