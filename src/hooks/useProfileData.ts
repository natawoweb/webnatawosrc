
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/models";
import { useToast } from "@/hooks/use-toast";

export const useProfileData = (mounted: boolean) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (session: any) => {
    if (!mounted) return null;
    
    try {
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

      if (mounted) {
        setProfile(existingProfile as Profile);
        return existingProfile as Profile;
      }
      return null;
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      if (mounted) {
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: error.message || "Please try again later.",
        });
      }
      throw error;
    }
  };

  return { profile, setProfile, fetchProfile };
};
