
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/models";
import { useQueryClient } from "@tanstack/react-query";

export const useAvatarUpload = (profile: Profile | null, onSuccess: (url: string) => void) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        throw new Error('Please upload an image file (jpg, jpeg, png, or gif).');
      }

      if (!profile?.id) {
        throw new Error('Profile ID is required for upload.');
      }

      // Generate a unique filename with timestamp to prevent conflicts
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${profile.id}-${timestamp}-${randomId}.${fileExt}`;

      console.log('Starting avatar upload:', {
        profileId: profile.id,
        fileName: fileName,
        fileType: file.type,
        bucketName: 'avatars'
      });

      // Delete old avatar if it exists
      if (profile.avatar_url) {
        try {
          const oldUrl = new URL(profile.avatar_url);
          const oldFileName = oldUrl.pathname.split('/avatars/')[1];
          if (oldFileName) {
            console.log('Removing old avatar:', oldFileName);
            await supabase.storage
              .from('avatars')
              .remove([oldFileName]);
          }
        } catch (error) {
          console.error('Error removing old avatar:', error);
          // Continue with upload even if delete fails
        }
      }
      
      // Upload new avatar with simplified options
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      if (!data) {
        throw new Error('Upload failed: No data returned');
      }

      console.log('Upload successful, getting public URL');

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated successfully with new avatar URL');

      // Update local state and invalidate queries
      onSuccess(publicUrl);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      toast({
        title: "Success",
        description: "Avatar updated successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "Error uploading avatar",
        description: error.message || "Please try again later.",
      });
    } finally {
      setUploading(false);
    }
  }

  return {
    uploading,
    uploadAvatar,
  };
};
