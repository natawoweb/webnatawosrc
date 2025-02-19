
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/adminUtils";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";

export function MobileNav() {
  const { session, signOut } = useSession();
  const { profile } = useProfile();
  const { t } = useLanguage();

  return (
    <div className="flex lg:hidden items-center gap-4">
      <ThemeToggle />
      {session ? (
        <>
          <NotificationsDropdown />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-4 px-2">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{profile?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>
                <nav className="flex flex-col space-y-2">
                  <Link
                    to="/user/profile"
                    className="px-2 py-1 text-sm hover:underline"
                  >
                    {t("Profile", "சுயவிவரம்")}
                  </Link>
                  <Link
                    to="/dashboard"
                    className="px-2 py-1 text-sm hover:underline"
                  >
                    {t("Dashboard", "டாஷ்போர்டு")}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-2 py-1 text-sm text-left hover:underline text-red-500"
                  >
                    {t("Log out", "வெளியேறு")}
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <Button asChild>
          <Link to="/auth">
            {t("Sign In", "உள்நுழைய")}
          </Link>
        </Button>
      )}
    </div>
  );
}
