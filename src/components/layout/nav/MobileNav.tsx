
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
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileNavProps {
  isOpen: boolean;
  session: any;
  handleSignOut: () => Promise<void>;
  navigate: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
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
    <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              "block px-3 py-2 rounded-md transition-colors",
              isActiveRoute("/admin")
                ? "text-foreground font-medium bg-accent"
                : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
            )}
          >
            {t("Admin Dashboard", "நிர்வாக டாஷ்போர்டு")}
          </Link>
        )}
        {isWriter && (
          <Link
            to="/dashboard"
            className={cn(
              "block px-3 py-2 rounded-md transition-colors",
              isActiveRoute("/dashboard")
                ? "text-foreground font-medium bg-accent"
                : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
            )}
          >
            {t("Dashboard", "டாஷ்போர்டு")}
          </Link>
        )}
        <Link
          to="/search"
          className={cn(
            "block px-3 py-2 rounded-md transition-colors",
            isActiveRoute("/search")
              ? "text-foreground font-medium bg-accent"
              : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
          )}
        >
          {t("Writers", "எழுத்தாளர்கள்")}
        </Link>
        <Link
          to="/blogs"
          className={cn(
            "block px-3 py-2 rounded-md transition-colors",
            isActiveRoute("/blogs")
              ? "text-foreground font-medium bg-accent"
              : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
          )}
        >
          {t("Blogs", "வலைப்பதிவுகள்")}
        </Link>
        <Link
          to="/events"
          className={cn(
            "block px-3 py-2 rounded-md transition-colors",
            isActiveRoute("/events")
              ? "text-foreground font-medium bg-accent"
              : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
          )}
        >
          {t("Events", "நிகழ்வுகள்")}
        </Link>
        
        <div className="px-3 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Globe className="h-4 w-4" />
                <span>{language === 'english' ? 'English' : 'தமிழ்'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("english")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("tamil")}>
                தமிழ் (Tamil)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-3 py-2">
          <ThemeToggle />
        </div>

        {session && (
          <div className="px-3 py-2">
            <NotificationsDropdown />
          </div>
        )}

        {session ? (
          <>
            <Link to="/profile" className="px-3 py-2 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.pseudonym ? profile.pseudonym[0].toUpperCase() : profile?.email?.[0].toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{t("Profile", "சுயவிவரம்")}</span>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="w-full mt-4">
              <LogOut className="h-4 w-4 mr-2" />
              {t("Sign Out", "வெளியேறு")}
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button variant="outline" className="w-full mt-4">
              {t("Sign In", "உள்நுழைக")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
