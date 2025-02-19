import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/adminUtils";
import { useProfile } from "@/hooks/useProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export function DesktopNav() {
  const { session, signOut } = useSession();
  const { profile } = useProfile();
  const { t } = useLanguage();

  return (
    <div className="hidden lg:flex items-center gap-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {t("Events", "நிகழ்வுகள்")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] md:grid-cols-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/events" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                      {t("Upcoming Events", "வரவிருக்கும் நிகழ்வுகள்")}
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/events/categories" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                      {t("Event Categories", "நிகழ்வு வகைகள்")}
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {t("Blogs", "வலைப்பதிவுகள்")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] md:grid-cols-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/blogs" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                      {t("All Blogs", "அனைத்து வலைப்பதிவுகள்")}
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/blogs/categories" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                      {t("Blog Categories", "வலைப்பதிவு வகைகள்")}
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {t("Writers", "எழுத்தாளர்கள்")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] md:grid-cols-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/writers" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                      {t("All Writers", "அனைத்து எழுத்தாளர்கள்")}
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link to="/writers/genres" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                      {t("Writer Genres", "எழுத்தாளர் வகைகள்")}
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">
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
                  <Link to="/user/profile">
                    {t("Profile", "சுயவிவரம்")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    {t("Dashboard", "டாஷ்போர்டு")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  {t("Log out", "வெளியேறு")}
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
  );
}
