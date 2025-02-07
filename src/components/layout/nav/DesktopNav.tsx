
import * as React from "react";
import { Link } from "react-router-dom";
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
  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      <Link to="/search" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md">
        Writers
      </Link>
      <Link to="/blogs" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md">
        Blogs
      </Link>
      <Link to="/events" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md">
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

      {session && <NotificationsDropdown />}

      {session ? (
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
              <AvatarFallback>{session?.user?.email?.[0]?.toUpperCase() || '?'}</AvatarFallback>
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
