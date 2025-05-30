
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/models";
import { useProfileData } from "./useProfileData";
import { useProfileUpdates } from "./useProfileUpdates";
import { isPublicRoute } from "@/utils/routeUtils";
import { useToast } from "@/hooks/use-toast";

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { profile, setProfile, fetchProfile } = useProfileData(mounted);
  const {
    isEditing,
    editedProfile,
    setIsEditing,
    updateProfile,
    handleProfileChange,
    handleSocialLinkChange,
    handleCancel,
  } = useProfileUpdates(profile, setProfile);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        // If there's no session and we're on a public route, just set loading to false
        if (!session && isPublicRoute(location.pathname)) {
          setLoading(false);
          return;
        }

        // Only redirect to auth if not on a public route and user needs to be authenticated
        if (!session && !isPublicRoute(location.pathname)) {
          setLoading(false);
          navigate('/auth');
          return;
        }

        if (session) {
          await fetchProfile(session);
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error in getProfile:', error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error loading profile",
            description: error.message || "Please try again later.",
          });
          setLoading(false);
        }
      }
    };

    getProfile();

    // Set up auth state listener for profile changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      if (session) {
        getProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      setMounted(false);
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname, fetchProfile, mounted]);

  return {
    loading,
    profile,
    isEditing,
    editedProfile,
    setIsEditing,
    updateProfile,
    setProfile, // Add setProfile to the returned object
    handleProfileChange,
    handleSocialLinkChange,
    handleCancel,
  };
};
