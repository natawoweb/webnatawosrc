
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/models";

interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/auth');
        return;
      }

      let { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error loading profile:', fetchError);
        throw fetchError;
      }

      // If profile doesn't exist, wait a moment and try again
      // This helps in case the auth trigger hasn't completed yet
      if (!existingProfile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { data: retryProfile, error: retryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (retryError) throw retryError;
        if (!retryProfile) {
          console.error('Profile not found after retry');
          throw new Error('Profile not found. Please try logging out and back in.');
        }
        existingProfile = retryProfile;
      }

      setProfile(existingProfile as Profile);
      setEditedProfile(existingProfile as Profile);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editedProfile) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/auth');
        return;
      }

      const updates = {
        ...editedProfile,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);

      if (error) throw error;
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message || "Please try again later.",
      });
    }
  }

  function handleProfileChange(field: string, value: any) {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  }

  function handleSocialLinkChange(platform: keyof SocialLinks, value: string) {
    if (!editedProfile) return;
    const currentSocialLinks = editedProfile.social_links || {};
    const updatedSocialLinks = typeof currentSocialLinks === 'string' 
      ? JSON.parse(currentSocialLinks) 
      : currentSocialLinks;

    setEditedProfile({
      ...editedProfile,
      social_links: {
        ...updatedSocialLinks,
        [platform]: value
      }
    });
  }

  function handleCancel() {
    setEditedProfile(profile);
    setIsEditing(false);
  }

  return {
    loading,
    profile,
    isEditing,
    editedProfile,
    setIsEditing,
    updateProfile,
    handleProfileChange,
    handleSocialLinkChange,
    handleCancel,
  };
};
