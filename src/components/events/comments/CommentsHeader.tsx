
import { MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function CommentsHeader() {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-2 mb-6">
      <MessageSquare className="h-5 w-5" />
      <h2 className="text-xl font-semibold">
        {t("Comments", "கருத்துகள்")}
      </h2>
    </div>
  );
}
