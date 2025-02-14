
import { useState, useEffect, useCallback } from "react";
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

export const useProfileUpdates = (profile: Profile | null, setProfile: (profile: Profile | null) => void) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize editedProfile whenever profile changes using useCallback
  const initializeEditedProfile = useCallback(() => {
    if (profile) {
      setEditedProfile({
        ...profile,
        social_links: typeof profile.social_links === 'string' 
          ? JSON.parse(profile.social_links) 
          : profile.social_links || {}
      });
    }
  }, [profile]);

  // Use useEffect for initialization
  useEffect(() => {
    initializeEditedProfile();
  }, [initializeEditedProfile]);

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
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
        social_links: typeof editedProfile.social_links === 'string' 
          ? editedProfile.social_links 
          : JSON.stringify(editedProfile.social_links)
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
  };

  const handleProfileChange = useCallback((field: string, value: any) => {
    if (!editedProfile) return;
    setEditedProfile(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  }, [editedProfile]);

  const handleSocialLinkChange = useCallback((platform: keyof SocialLinks, value: string) => {
    if (!editedProfile) return;
    
    const currentSocialLinks = editedProfile.social_links || {};
    const parsedSocialLinks = typeof currentSocialLinks === 'string' 
      ? JSON.parse(currentSocialLinks) 
      : currentSocialLinks;

    setEditedProfile(prev => prev ? {
      ...prev,
      social_links: {
        ...parsedSocialLinks,
        [platform]: value
      }
    } : null);
  }, [editedProfile]);

  const handleCancel = useCallback(() => {
    setEditedProfile(profile);
    setIsEditing(false);
  }, [profile]);

  return {
    isEditing,
    editedProfile,
    setIsEditing,
    setEditedProfile,
    updateProfile,
    handleProfileChange,
    handleSocialLinkChange,
    handleCancel,
  };
};
