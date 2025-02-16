
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

interface DesktopNavProps {
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  session: any;
  handleSignOut: () => Promise<void>;
  navigate: (path: string) => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  currentLanguage,
  setCurrentLanguage,
  session,
  handleSignOut,
  navigate,
}) => {
  const location = useLocation();
  const { profile } = useProfile();
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
          to="/admin/dashboard" 
          className={cn(
            "px-3 py-2 rounded-md transition-colors",
            isActiveRoute("/admin/dashboard")
              ? "text-foreground font-medium bg-accent"
              : "text-foreground/80 hover:text-foreground"
          )}
        >
          Admin Dashboard
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
          Dashboard
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
        Writers
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
        Blogs
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
        Events
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-auto px-3 gap-2">
            <Globe className="h-4 w-4" />
            <span>{currentLanguage}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setCurrentLanguage("English")}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCurrentLanguage("தமிழ்")}>
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
            Sign Out
          </Button>
        </div>
      ) : (
        <Link to="/auth">
          <Button variant="outline" className="ml-4">
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
};
