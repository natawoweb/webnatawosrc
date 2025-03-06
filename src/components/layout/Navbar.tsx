
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./nav/NavLinks";
import { UserMenu } from "./nav/UserMenu";
import { LanguageSelector } from "./nav/LanguageSelector";

export const Navbar: React.FC = () => {
  const { session, signOut } = useSession();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/2e998827-54b8-4981-b796-0eaa5c1cd8e2.png" 
              alt="NATAWO Logo" 
              className="h-10 w-10"
            />
            <span className="text-xl font-semibold">NATAWO</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 ml-auto">
            <NavLinks />
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <ThemeToggle />
              {session ? (
                <>
                  <NotificationsDropdown />
                  <UserMenu profile={profile} onSignOut={signOut} />
                </>
              ) : (
                <Button asChild variant="default">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
