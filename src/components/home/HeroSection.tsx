
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function HeroSection() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50" />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <img 
            src="/lovable-uploads/2e998827-54b8-4981-b796-0eaa5c1cd8e2.png" 
            alt="NATAWO Logo" 
            className="h-40 w-40 object-contain mb-8 animate-in fade-in zoom-in duration-700"
          />
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-in fade-in slide-in duration-1000">
              Celebrate Tamil Literature Across North America
            </h1>
          </div>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in duration-1000 delay-200">
            Join our vibrant community of writers and readers celebrating Tamil literary excellence.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in duration-1000 delay-300">
            {!isLoggedIn && (
              <Button size="lg" className="group" onClick={() => navigate('/auth')}>
                <Users className="mr-2 h-4 w-4" />
                Join Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={() => navigate('/search')}>
              Discover Writers
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/events')}>
              <Calendar className="mr-2 h-4 w-4" />
              Upcoming Events
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
