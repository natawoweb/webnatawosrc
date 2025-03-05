
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function UnderConstruction() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Construction className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-3xl">
            {t("Website Under Construction", "வலைத்தளம் கட்டுமானத்தில் உள்ளது")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-lg">
            {t(
              "We are working hard to bring you a better experience. Please check back soon!",
              "சிறந்த அனுபவத்தை வழங்க கடினமாக உழைக்கிறோம். விரைவில் மீண்டும் சரிபார்க்கவும்!"
            )}
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <p>
              {t("Contact:", "தொடர்பு:")} {" "}
              <a 
                href="mailto:natawomail@gmail.com" 
                className="text-primary hover:underline"
              >
                natawomail@gmail.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
