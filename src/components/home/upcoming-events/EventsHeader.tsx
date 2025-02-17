
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventsHeaderProps {
  navigateToEvents: () => void;
}

export function EventsHeader({ navigateToEvents }: EventsHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <h2 className="text-3xl font-bold">
        {t("Upcoming Events", "வரவிருக்கும் நிகழ்வுகள்")}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl">
        {t(
          "Join our upcoming literary events and connect with fellow Tamil literature enthusiasts.",
          "எங்களின் வரவிருக்கும் இலக்கிய நிகழ்வுகளில் கலந்து கொண்டு தமிழ் இலக்கிய ஆர்வலர்களுடன் இணையுங்கள்."
        )}
      </p>
      <Button variant="outline" onClick={navigateToEvents} className="group">
        {t("View All Events", "அனைத்து நிகழ்வுகளையும் காண")}
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
