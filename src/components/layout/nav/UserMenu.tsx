import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/adminUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Profile } from "@/integrations/supabase/types/models";
import { useEffect, useState } from "react";

interface UserMenuProps {
  profile: Profile | null;
  onSignOut: () => void;
}

export const UserMenu = ({ profile, onSignOut }: UserMenuProps) => {
  const { t } = useLanguage();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const initials = profile?.full_name ? getInitials(profile.full_name) : '';
  const avatarUrl = profile?.avatar_url || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
            {avatarUrl && (
              <AvatarImage 
                src={avatarUrl} 
                alt={profile?.full_name || ""}
                onLoad={() => setIsImageLoaded(true)}
                className={isImageLoaded ? 'opacity-100' : 'opacity-0'}
              />
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link to="/profile">
            {t("Profile", "சுயவிவரம்")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          {t("Sign Out", "வெளியேறு")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
