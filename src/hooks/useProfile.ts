
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProfilesTable } from "@/integrations/supabase/types/auth";
import { toast } from "sonner";

export type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  email: string | null;
  level: string | null;
  location: string | null;
  status: string | null;
  user_type: string;
  date_of_birth: string | null;
  gender: string | null;
  pseudonym: string | null;
  county: string | null;
  state: string | null;
  social_links: Record<string, string>;
  approval_status: 'pending' | 'approved' | 'rejected';
};

export function useProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      // Ensure the profile has required fields with defaults
      return {
        ...data,
        social_links: data.social_links || {},
        approval_status: data.approval_status || 'pending'
      } as Profile;
    },
  });

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (updatedProfile: Partial<Profile>) => {
      if (!profile?.id) throw new Error('No profile ID');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    },
  });

  const handleProfileChange = (field: string, value: any) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value,
    });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      social_links: {
        ...(editedProfile.social_links || {}),
        [platform]: value,
      },
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const setProfile = (newProfile: Profile | null) => {
    if (newProfile) {
      queryClient.setQueryData(['profile'], newProfile);
    }
  };

  return {
    profile,
    loading,
    error,
    isEditing,
    editedProfile,
    setIsEditing,
    updateProfile,
    setProfile,
    handleProfileChange,
    handleSocialLinkChange,
    handleCancel,
  };
}
