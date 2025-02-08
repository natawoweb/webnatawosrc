
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWriters } from "@/components/home/FeaturedWriters";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useProfile();

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Only redirect if coming from the auth page
      if (session && !loading && location.state?.from === '/auth') {
        // Check if user is admin
        const { data: isAdmin } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          required_role: 'admin'
        });

        if (isAdmin) {
          console.log("Admin user detected, redirecting to admin dashboard");
          navigate("/admin");
          return;
        }

        // Check if user is a writer
        if (profile?.user_type === 'writer') {
          console.log("Writer detected, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }
      }
    };

    checkUserRole();
  }, [navigate, profile, loading, location]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedWriters />
      <UpcomingEvents />
    </div>
  );
};

export default Index;

