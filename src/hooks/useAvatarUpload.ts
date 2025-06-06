/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/integrations/supabase/types/models';
import { useQueryClient } from '@tanstack/react-query';

export const useAvatarUpload = (
  profile: Profile | null,
  onSuccess: (url: string) => void
) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      // First check if we have an authenticated user
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to upload an avatar.');
      }

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        throw new Error(
          'Please upload an image file (jpg, jpeg, png, or gif).'
        );
      }

      if (!profile?.id) {
        throw new Error('Profile ID is required for upload.');
      }

      // Create a unique filename for the avatar including the extension
      const fileName = `${profile.id}.${fileExt}`;

      // First remove any existing avatar for this user
      try {
        await supabase.storage.from('avatars').remove([fileName]);
      } catch (error) {
        console.error(error);
      }

      // Upload the file to Supabase storage with explicit content type
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      if (!data) {
        throw new Error('Upload failed: No data returned');
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName);

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id); // Use session.user.id to ensure we're updating the current user's profile

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      // Update local state and invalidate queries
      onSuccess(publicUrl);
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      toast({
        title: 'Success',
        description: 'Avatar updated successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: 'destructive',
        title: 'Error uploading avatar',
        description: error.message || 'Please try again later.',
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
