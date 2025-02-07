
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/integrations/supabase/types/models";

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

      if (!existingProfile) {
        const newProfile: Profile = {
          id: session.user.id,
          email: session.user.email,
          full_name: null,
          created_at: new Date().toISOString(),
          user_type: 'reader'
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }

        existingProfile = newProfile;
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
      };

      let { error } = await supabase
        .from('profiles')
        .upsert(updates);

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
    setEditedProfile((prev) => ({
      ...prev!,
      [field]: value
    }));
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
    handleCancel,
  };
};
