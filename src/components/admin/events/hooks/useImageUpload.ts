/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client';

export async function uploadImages(files: File[]): Promise<string[]> {
  try {
    // Check user role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user has admin or manager role
    const { data: hasAdminRole } = await supabase.rpc('has_role', {
      user_id: user.id,
      required_role: 'admin',
    });

    const { data: hasManagerRole } = await supabase.rpc('has_role', {
      user_id: user.id,
      required_role: 'manager',
    });

    if (!hasAdminRole && !hasManagerRole) {
      throw new Error("You don't have permission to upload event images");
    }

    const uploadPromises = files.map(async (file) => {
      if (!(file instanceof File)) {
        console.error('Invalid file object:', file);
        throw new Error('Invalid file object provided');
      }

      // Create a unique filename with timestamp and random string
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream',
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error: any) {
    console.error('Error in uploadImages:', error);
    throw error;
  }
}
