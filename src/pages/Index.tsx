import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWriters } from "@/components/home/FeaturedWriters";
import { FeaturedBlogs } from "@/components/home/FeaturedBlogs";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useProfile();

  useEffect(() => {
    const checkUserRole = async () => {
      console.log("Checking user role...");
      const { data: { session } } = await supabase.auth.getSession();

      // Only handle redirects if we're coming from the auth page
      if (session && !loading && location.state?.from === '/auth') {
        console.log("User authenticated from auth page, checking roles...");
        
        // Check if user is admin
        const { data: isAdmin } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          required_role: 'admin'
        });

        if (isAdmin) {
          console.log("Admin user detected, redirecting to admin dashboard");
          navigate("/admin", { replace: true });
          return;
        }

        // Check if user is a writer
        if (profile?.user_type === 'writer') {
          console.log("Writer detected, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
          return;
        }
      }
    };

    checkUserRole();
  }, [navigate, profile, loading, location.state]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedBlogs />
      <FeaturedWriters />
      <UpcomingEvents />
    </div>
  );
};

export default Index;
