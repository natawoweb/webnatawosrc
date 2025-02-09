
import { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(profile);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleProfileChange = (field: string, value: any) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
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
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

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
