
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

  console.log("Index page rendered with:", {
    profile,
    loading,
    locationState: location.state,
    pathname: location.pathname
  });

  useEffect(() => {
    const checkUserRole = async () => {
      console.log("Checking user role...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session status:", session ? "Active" : "No session");

      // Only redirect if coming from the auth page
      if (session && !loading && location.state?.from === '/auth') {
        console.log("User authenticated from auth page, checking roles...");
        
        // Check if user is admin
        const { data: isAdmin } = await supabase.rpc('has_role', {
          user_id: session.user.id,
          required_role: 'admin'
        });

        console.log("Admin check result:", isAdmin);

        if (isAdmin) {
          console.log("Admin user detected, redirecting to admin dashboard");
          navigate("/admin");
          return;
        }

        // Check if user is a writer
        console.log("Writer check - user type:", profile?.user_type);
        if (profile?.user_type === 'writer') {
          console.log("Writer detected, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }
      } else {
        console.log("Regular page load or navigation, not redirecting", {
          hasSession: !!session,
          isLoading: loading,
          from: location.state?.from
        });
      }
    };

    checkUserRole();
  }, [navigate, profile, loading, location]);

  console.log("Rendering Index page components");
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
