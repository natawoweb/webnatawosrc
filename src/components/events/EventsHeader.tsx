
import { useLanguage } from "@/contexts/LanguageContext";

export function EventsHeader() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center text-center space-y-4 py-12">
      <h1 className="text-4xl font-bold">
        {t("Literary Events", "இலக்கிய நிகழ்வுகள்")}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        {t(
          "Join our vibrant community at various literary events, workshops, and gatherings. Connect with fellow writers and readers while exploring the world of literature.",
          "பல்வேறு இலக்கிய நிகழ்வுகள், பட்டறைகள் மற்றும் கூட்டங்களில் எங்கள் துடிப்பான சமூகத்தில் இணையுங்கள். இலக்கிய உலகை ஆராயும்போது சக எழுத்தாளர்கள் மற்றும் வாசகர்களுடன் இணையுங்கள்."
        )}
      </p>
    </div>
  );
}
