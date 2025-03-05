
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedWriters } from "@/components/home/FeaturedWriters";
import { FeaturedBlogs } from "@/components/home/FeaturedBlogs";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  useEffect(() => {
    const checkUserRole = async () => {
      // Check if we have a redirect flag from auth
      const shouldRedirect = localStorage.getItem('auth_redirect');
      
      if (shouldRedirect) {
        // Remove the flag immediately
        localStorage.removeItem('auth_redirect');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if user is admin
          const { data: isAdmin } = await supabase.rpc('has_role', {
            user_id: session.user.id,
            required_role: 'admin'
          });
          
          if (isAdmin) {
            navigate("/admin", { replace: true });
            return;
          }

          // Check if user is a writer
          if (profile?.user_type === 'writer') {
            navigate("/dashboard", { replace: true });
            return;
          }
        }
      }
    };

    if (!loading) {
      checkUserRole();
    }
  }, [navigate, profile, loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <FeaturedBlogs />
      <FeaturedWriters />
      <UpcomingEvents />
    </div>
  );
};

export default Index;
