
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LoadingState() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">
        {t("Loading blogs...", "பதிவுகளை ஏற்றுகிறது...")}
      </p>
    </div>
  );
}
