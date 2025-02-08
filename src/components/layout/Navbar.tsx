
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DesktopNav } from "./nav/DesktopNav";
import { MobileNav } from "./nav/MobileNav";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState("English");
  const [session, setSession] = React.useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later.",
      });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/", { replace: true });
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/2e998827-54b8-4981-b796-0eaa5c1cd8e2.png" 
                alt="NATAWO Logo" 
                className="h-10 w-10"
              />
              <span className="text-xl font-semibold">NATAWO</span>
            </Link>
          </div>

          <DesktopNav
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
            session={session}
            handleSignOut={handleSignOut}
            navigate={navigate}
          />

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <MobileNav
        isOpen={isOpen}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        session={session}
        handleSignOut={handleSignOut}
        navigate={navigate}
      />
    </nav>
  );
};
