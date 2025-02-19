
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ComingSoon() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-3xl">
            {t("Coming Soon!", "விரைவில் வருகிறது!")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-lg">
            {t(
              "This feature is currently under development. Stay tuned for updates!",
              "இந்த அம்சம் தற்போது உருவாக்கப்பட்டு வருகிறது. புதுப்பிப்புகளுக்காக காத்திருங்கள்!"
            )}
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="h-5 w-5" />
            <p>
              {t("Contact Us:", "எங்களை தொடர்பு கொள்ள:")} {" "}
              <a 
                href="mailto:natawomail@gmail.com" 
                className="text-primary hover:underline"
              >
                natawomail@gmail.com
              </a>
            </p>
          </div>
          <div className="mt-8">
            <Link 
              to="/" 
              className="text-primary hover:underline"
            >
              {t("← Back to Home", "← முகப்பிற்குத் திரும்பு")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
