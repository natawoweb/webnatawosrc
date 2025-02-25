
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

  useEffect(() => {
    let isMounted = true;
    
    const getProfile = async () => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      
      if (session) {
        getProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname, fetchProfile]);

  return {
    loading,
    profile,
    setProfile
  };
};
