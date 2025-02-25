
import { useState, useEffect, useRef } from "react";
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
  const fetchedRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { profile, setProfile, fetchProfile } = useProfileData(mounted);
  const profileUpdates = useProfileUpdates(profile, setProfile);

  useEffect(() => {
    let isMounted = true;
    
    const getProfile = async () => {
      if (fetchedRef.current) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (!session && isPublicRoute(location.pathname)) {
          setLoading(false);
          return;
        }

        if (!session && !isPublicRoute(location.pathname)) {
          setLoading(false);
          navigate('/auth', { replace: true });
          return;
        }

        if (session) {
          await fetchProfile(session);
          fetchedRef.current = true;
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
      
      if (event === 'SIGNED_IN') {
        queryClient.removeQueries({ queryKey: ["profile"] });
        fetchedRef.current = false;
        await getProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        fetchedRef.current = false;
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, fetchProfile, queryClient, toast]);

  return {
    loading,
    profile,
    setProfile,
    ...profileUpdates
  };
};
