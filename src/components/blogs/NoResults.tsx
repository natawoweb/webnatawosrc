
import { SearchX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NoResultsProps {
  hasActiveSearch: boolean;
}

export function NoResults({ hasActiveSearch }: NoResultsProps) {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-xl font-semibold">
        {hasActiveSearch ? 
          t("No matching blogs found", "பொருந்தும் பதிவுகள் எதுவும் கிடைக்கவில்லை") : 
          t("No blogs available", "பதிவுகள் எதுவும் கிடைக்கவில்லை")}
      </h2>
      <p className="mt-2 text-muted-foreground">
        {hasActiveSearch ? 
          t(
            "Try adjusting your search filters or try a different search term",
            "உங்கள் தேடல் வடிப்பான்களை சரிசெய்யவும் அல்லது வேறு தேடல் சொற்களை முயற்சிக்கவும்"
          ) : 
          t(
            "Check back later for new blog posts",
            "புதிய பதிவுகளுக்காக பின்னர் சரிபார்க்கவும்"
          )}
      </p>
    </div>
  );
}
