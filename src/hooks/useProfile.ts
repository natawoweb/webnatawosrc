
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/models";
import { useProfileData } from "./useProfileData";
import { useProfileUpdates } from "./useProfileUpdates";
import { isPublicRoute } from "@/utils/routeUtils";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { profile, setProfile, fetchProfile } = useProfileData(mounted);
  const profileUpdates = useProfileUpdates(profile, setProfile);

  useEffect(() => {
    let isMounted = true;
    let lastFetchTime = 0;
    const FETCH_COOLDOWN = 2000; // 2 seconds cooldown between fetches
    
    const getProfile = async () => {
      const now = Date.now();
      if (now - lastFetchTime < FETCH_COOLDOWN) {
        return;
      }
      lastFetchTime = now;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        // If there's no session and we're on a public route, just set loading to false
        if (!session && isPublicRoute(location.pathname)) {
          setLoading(false);
          return;
        }

        // Only redirect to auth if not on a public route and user needs to be authenticated
        if (!session && !isPublicRoute(location.pathname)) {
          setLoading(false);
          navigate('/auth', { replace: true });
          return;
        }

        if (session) {
          await fetchProfile(session);
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error in getProfile:', error);
        if (isMounted) {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      if (session) {
        // Clear any existing profile data in the cache
        queryClient.removeQueries({ queryKey: ["profile"] });
        await getProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname, fetchProfile, queryClient]);

  return {
    loading,
    profile,
    setProfile,
    ...profileUpdates
  };
};
