
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/models";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export const useProfileData = (mounted: boolean) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (session: any) => {
    if (!mounted || !session?.user?.id) return null;
    
    try {
      let { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If profile doesn't exist, wait a moment and retry once
      if (!existingProfile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { data: retryProfile, error: retryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (retryError) throw retryError;
        if (!retryProfile) {
          throw new Error('Profile not found. Please try logging out and back in.');
        }
        existingProfile = retryProfile;
      }

      // Parse social_links if needed
      if (existingProfile.social_links && typeof existingProfile.social_links === 'string') {
        try {
          existingProfile.social_links = JSON.parse(existingProfile.social_links);
        } catch (e) {
          console.error('Error parsing social links:', e);
          existingProfile.social_links = {};
        }
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
