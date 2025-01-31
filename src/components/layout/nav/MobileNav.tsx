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
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";

interface MobileNavProps {
  isOpen: boolean;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  session: any;
  handleSignOut: () => Promise<void>;
  navigate: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  currentLanguage,
  setCurrentLanguage,
  session,
  handleSignOut,
  navigate,
}) => {
  return (
    <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link
          to="/writers"
          className="block px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
        >
          Writers
        </Link>
        <Link
          to="/events"
          className="block px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
        >
          Events
        </Link>
        <Link
          to="/blogs"
          className="block px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-accent"
        >
          Blogs
        </Link>
        
        <div className="px-3 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Globe className="h-4 w-4" />
                <span>{currentLanguage}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCurrentLanguage("English")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentLanguage("தமிழ்")}>
                தமிழ் (Tamil)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {session && (
          <div className="px-3 py-2">
            <NotificationsDropdown />
          </div>
        )}

        {session ? (
          <Button variant="outline" onClick={handleSignOut} className="w-full mt-4">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate("/auth")} className="w-full mt-4">
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};