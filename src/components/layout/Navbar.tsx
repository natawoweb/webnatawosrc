
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSession } from "@/hooks/useSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/adminUtils";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Navbar: React.FC = () => {
  const { session, signOut } = useSession();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      const { data } = await supabase.rpc('has_role', {
        user_id: session.user.id,
        required_role: 'admin'
      });
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const isWriter = profile?.user_type === "writer";

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/", { replace: true });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/2e998827-54b8-4981-b796-0eaa5c1cd8e2.png" 
                alt="NATAWO Logo" 
                className="h-10 w-10"
              />
              <span className="text-xl font-semibold">NATAWO</span>
            </Link>

            {session && (
              <div className="hidden md:flex items-center gap-6">
                {isAdmin && (
                  <Link 
                    to="/admin"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    {t("Admin Dashboard", "நிர்வாக டாஷ்போர்டு")}
                  </Link>
                )}
                {isWriter && !isAdmin && (
                  <Link 
                    to="/dashboard"
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    {t("Writer Dashboard", "எழுத்தாளர் டாஷ்போர்டு")}
                  </Link>
                )}
                <Link 
                  to="/search-writers"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                >
                  {t("Writers", "எழுத்தாளர்கள்")}
                </Link>
                <Link 
                  to="/blogs"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                >
                  {t("Blogs", "வலைப்பதிவுகள்")}
                </Link>
                <Link 
                  to="/events"
                  className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                >
                  {t("Events", "நிகழ்வுகள்")}
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <Globe className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            {session ? (
              <>
                <NotificationsDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                        <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        {t("Profile", "சுயவிவரம்")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={isAdmin ? "/admin" : "/dashboard"}>
                        {isAdmin 
                          ? t("Admin Dashboard", "நிர்வாக டாஷ்போர்டு")
                          : t("Dashboard", "டாஷ்போர்டு")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      {t("Sign Out", "வெளியேறு")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">
                  {t("Sign In", "உள்நுழைய")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
