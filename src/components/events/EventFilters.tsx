
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterUpcoming: () => void;
  showingUpcoming: boolean;
}

export function EventFilters({
  searchQuery,
  onSearchChange,
  onFilterUpcoming,
  showingUpcoming,
}: EventFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder={t(
          "Search events by title, description or location...",
          "தலைப்பு, விளக்கம் அல்லது இடத்தால் நிகழ்வுகளைத் தேடுங்கள்..."
        )}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-sm"
      />
      <Button
        variant={showingUpcoming ? "default" : "outline"}
        onClick={onFilterUpcoming}
        className="w-full sm:w-auto"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {showingUpcoming ? 
          t("Showing Upcoming", "வரவிருக்கும் நிகழ்வுகள்") : 
          t("Show All", "அனைத்தையும் காட்டு")}
      </Button>
    </div>
  );
}
