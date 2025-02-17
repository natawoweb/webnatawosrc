
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

interface DesktopNavProps {
  session: any;
  handleSignOut: () => Promise<void>;
  navigate: (path: string) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  session,
  handleSignOut,
  navigate,
}) => {
  const location = useLocation();
  const { profile } = useProfile();
  const { language, setLanguage, t } = useLanguage();
  const isWriter = profile?.user_type === "writer";

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

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      {isAdmin && (
        <Link 
          to="/admin" 
          className={cn(
            "px-3 py-2 rounded-md transition-colors",
            isActiveRoute("/admin")
              ? "text-foreground font-medium bg-accent"
              : "text-foreground/80 hover:text-foreground"
          )}
        >
          {t("Admin Dashboard", "நிர்வாக டாஷ்போர்டு")}
        </Link>
      )}
      {isWriter && (
        <Link 
          to="/dashboard" 
          className={cn(
            "px-3 py-2 rounded-md transition-colors",
            isActiveRoute("/dashboard")
              ? "text-foreground font-medium bg-accent"
              : "text-foreground/80 hover:text-foreground"
          )}
        >
          {t("Dashboard", "டாஷ்போர்டு")}
        </Link>
      )}
      <Link 
        to="/search" 
        className={cn(
          "px-3 py-2 rounded-md transition-colors",
          isActiveRoute("/search")
            ? "text-foreground font-medium bg-accent"
            : "text-foreground/80 hover:text-foreground"
        )}
      >
        {t("Writers", "எழுத்தாளர்கள்")}
      </Link>
      <Link 
        to="/blogs" 
        className={cn(
          "px-3 py-2 rounded-md transition-colors",
          isActiveRoute("/blogs")
            ? "text-foreground font-medium bg-accent"
            : "text-foreground/80 hover:text-foreground"
        )}
      >
        {t("Blogs", "வலைப்பதிவுகள்")}
      </Link>
      <Link 
        to="/events" 
        className={cn(
          "px-3 py-2 rounded-md transition-colors",
          isActiveRoute("/events")
            ? "text-foreground font-medium bg-accent"
            : "text-foreground/80 hover:text-foreground"
        )}
      >
        {t("Events", "நிகழ்வுகள்")}
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-auto px-3 gap-2">
            <Globe className="h-4 w-4" />
            <span>{language === 'english' ? 'English' : 'தமிழ்'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage("english")}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("tamil")}>
            தமிழ் (Tamil)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ThemeToggle />

      {session && <NotificationsDropdown />}

      {session ? (
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.pseudonym ? profile.pseudonym[0].toUpperCase() : profile?.email?.[0].toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            {t("Sign Out", "வெளியேறு")}
          </Button>
        </div>
      ) : (
        <Link to="/auth">
          <Button variant="outline" className="ml-4">
            {t("Sign In", "உள்நுழைக")}
          </Button>
        </Link>
      )}
    </div>
  );
};
