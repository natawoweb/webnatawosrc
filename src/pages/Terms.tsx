import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Mail } from "lucide-react";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">
          {t("Terms of Use", "பயன்பாட்டு விதிமுறைகள்")}
        </h1>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="mb-6">
          <p className="text-lg font-medium">
            {t(
              "North America Tamil Writers Organization (NATAWO)",
              "வட அமெரிக்க தமிழ் எழுத்தாளர்கள் அமைப்பு (NATAWO)"
            )}
          </p>
          <p className="text-muted-foreground">
            {t("Effective Date:", "நடைமுறைக்கு வரும் தேதி:")} {t("February 14, 2025", "பிப்ரவரி 14, 2025")}
          </p>
          <p className="text-muted-foreground">
            {t("Last Updated:", "கடைசியாக புதுப்பிக்கப்பட்டது:")} {t("February 19, 2025", "பிப்ரவரி 19, 2025")}
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <p>
            {t(
              "Welcome to the North America Tamil Writers Organization (NATAWO) website. These Terms of Use govern your access and use of our website, forums, and related services. By using our website, you agree to these terms. If you do not agree, please discontinue use of our services.",
              "வட அமெரிக்க தமிழ் எழுத்தாளர்கள் அமைப்ப���ன் (NATAWO) வலைத்தளத்திற்கு வரவேற்கிறோம். இந்த பயன்பாட்டு விதிமுறைகள் எங்கள் வலைத்தளம், மன்றங்கள் மற்றும் தொடர்புடைய சேவைகளை அணுகுவதையும் பயன்படுத்துவதையும் நிர்வகிக்கின்றன. எங்கள் வலைத்தளத்தைப் பயன்படுத்துவதன் மூலம், இந்த விதிமுறைகளுக்கு நீங்கள் ஒப்புக்கொள்கிறீர்கள். நீங்கள் ஒப்புக்கொள்ளவில்லை என்றால், எங்கள் சேவைகளைப் பயன்படுத்துவதை நிறுத்தவும்."
            )}
          </p>

          {/* Section 1: Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold">
              {t("1. Acceptance of Terms", "1. விதிமுறைகளை ஏற்றுக்கொள்ளுதல்")}
            </h2>
            <p>
              {t(
                "By accessing our website, you acknowledge that you have read, understood, and agreed to these Terms of Use. NATAWO reserves the right to modify these terms at any time. Continued use of the website after updates constitutes acceptance of the revised terms.",
                "எங்கள் வலைத்தளத்தை அணுகுவதன் மூலம், இந்த பயன்பாட்டு விதிமுறைகளை நீங்கள் படித்து, புரிந்துகொண்டு, ஒப்புக்கொண்டுள்ளீர்கள் என்பதை ஒப்புக்கொள்கிறீர்கள். இந்த விதிமுறைகளை எந்த நேரத்திலும் மாற்றும் உரிமையை NATAWO கொண்டுள்ளது. புதுப்பிப்புகளுக்குப் பிறகு வலைத்தளத்தைத் தொடர்ந்து பயன்படுத்துவது திருத்தப்பட்ட விதிமுறைகளை ஏற்றுக்கொள்வதாகும்."
              )}
            </p>
          </section>

          {/* Section 2: User Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold">
              {t("2. User Eligibility", "2. பயனர் தகுதி")}
            </h2>
            <ul className="list-disc pl-6">
              <li>
                {t(
                  "You must be at least 13 years old to use our services.",
                  "எங்கள் சேவைகளைப் பயன்படுத்த நீங்கள் குறைந்தபட்சம் 13 வயது நிரம்பியவராக இருக்க வேண்டும்."
                )}
              </li>
              <li>
                {t(
                  "If you are under 18, you must obtain parental or legal guardian consent.",
                  "நீங்கள் 18 வயதுக்குட்பட்டவராக இருந்தால், பெற்றோர் அல்லது சட்டப்பூர்வ பாதுகாவலரின் ஒப்புதலைப் பெற வேண்டும்."
                )}
              </li>
              <li>
                {t(
                  "Users are responsible for ensuring compliance with their local laws regarding website use.",
                  "வலைத்தள பயன்பாடு தொடர்பான உள்ளூர் சட்டங்களுக்கு இணங்குவதை உறுதிசெய்வது பயனர்களின் பொறுப்பாகும்."
                )}
              </li>
            </ul>
          </section>

          {/* Sections 3-12 follow the same pattern */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("3. Content Guidelines", "3. தொடர்பு தேவைகள்")}
            </h2>
            <p>
              {t(
                "When submitting content to our platform, you must ensure that:",
                "வலைத்தள பயன்பாடு தொடர்பான உள்ளூர் சட்டங்களுக்கு இணங்குவதை உறுதிசெய்வது பயனர்களின் பொறுப்பாகும்."
              )}
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                {t(
                  "You own or have the right to share the content",
                  "வாசிக்கு அல்லது பெற்றோர் அல்லது சட்டப்பூர்வ பாதுகாவலரின் ஒப்புதலைப் பெற வேண்டும்."
                )}
              </li>
              <li>
                {t(
                  "The content does not violate any laws or regulations",
                  "வாசிக்கு அல்லது பெற்றோர் அல்லது சட்டப்பூர்வ பாதுகாவலரின் ஒப்புதலைப் பெற வேண்டும்."
                )}
              </li>
              <li>
                {t(
                  "The content follows our community standards",
                  "வாசிக்கு அல்லது பெற்றோர் அல்லது சட்டப்பூர்வ பாதுகாவலரின் ஒப்புதலைப் பெற வேண்டும்."
                )}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("4. User Conduct", "4. பயனர் கொடுக்கல்")}
            </h2>
            <p>
              {t(
                "Users are expected to behave in a manner that is respectful and appropriate for our community. This includes:",
                "வலைத்தள பயனர்கள் மூன்று முறையை செய்து பயன்படுத்த வேண்டும். இது அதுவே அவர்கள் மூன்று முறையை செய்து பயன்படுத்த வேண்டும்:"
              )}
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                {t(
                  "Respectful communication",
                  "வாசிக்கு அல்லது பெற்றோர் அல்லது சட்டப்பூர்வ பாதுகாவலரின் ஒப்புதலைப் பெற வேண்டும்."
                )}
              </li>
              <li>
                {t(
                  "Respectful behavior towards others",
                  "வாசிக்கு அல்லது பெற்றோர் அல்லது சட்டப்பூர்வ பாதுகாவலரின் ஒப்புதலைப் பெற வேண்டும்."
                )}
              </li>
              <li>
                {t(
                  "Respectful behavior towards our staff",
                  "வாசிக்கு அல்லது பெற்றோர் அல்லது சட்டப்பூர்வ பாதுகாவலரின் ஒப்புதலைப் பெற வேண்டும்."
                )}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("5. Privacy Policy", "5. சொற்பாட்டு சொற்புல்")}
            </h2>
            <p>
              {t(
                "We respect your privacy and will not share your personal information with third parties without your consent.",
                "நீங்கள் சொற்பாட்டு சொற்புல் சொற்புதலை பெற வேண்டும். நீங்கள் சொற்பாட்டு சொற்புல் சொற்புதலை பெற வேண்டும்."
              )}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("6. Intellectual Property", "6. இந்திய கொடுக்கல்")}
            </h2>
            <p>
              {t(
                "All content on our platform is the property of NATAWO. You may not reproduce, distribute, or use any content without our express permission.",
                "வலைத்தள பயன்பாடு தொடர்பான உள்ளூர் சட்டங்களுக்கு இணங்குவதை உறுதிசெய்வது பயனர்களின் பொறுப்பாகும்."
              )}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("7. Disclaimers", "7. தொடர்பு தொடர்புகள்")}
            </h2>
            <p>
              {t(
                "NATAWO is not responsible for any damages or losses that may occur as a result of using our services.",
                "NATAWO இந்த சேவைகளைப் பயன்படுத்த நீங்கள் குறைந்தபட்சம் 13 வயது நிரம்பியவராக இருக்க வேண்டும்."
              )}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("8. Third-Party Links", "8. தொடர்பு தொடர்புகள்")}
            </h2>
            <p>
              {t(
                "NATAWO may include links to third-party websites. We are not responsible for the content or activities of these websites.",
                "NATAWO இந்த சேவைகளைப் பயன்படுத்த நீங்கள் குறைந்தபட்சம் 13 வயது நிரம்பியவராக இருக்க வேண்டும்."
              )}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("9. Changes to Terms of Use", "9. பயன்பாட்டு விதிமுறைகள் மாற்றுதல்")}
            </h2>
            <p>
              {t(
                "NATAWO reserves the right to modify these terms at any time. Continued use of the website after updates constitutes acceptance of the revised terms.",
                "NATAWO இந்த சேவைகளைப் பயன்படுத்த நீங்கள் குறைந்தபட்சம் 13 வயது நிரம்பியவராக இருக்க வேண்டும்."
              )}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("10. Governing Law", "10. நிறுவன சட்டம்")}
            </h2>
            <p>
              {t(
                "These Terms of Use are governed by the laws of the United States.",
                "NATAWO இந்த சேவைகளைப் பயன்படுத்த நீங்கள் குறைந்தபட்சம் 13 வயது நிரம்பியவராக இருக்க வேண்டும்."
              )}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("11. Contact Information", "11. தொடர்பு தகவல்")}
            </h2>
            <p className="mb-4">
              {t(
                "For any questions or concerns regarding these Terms of Use, please contact:",
                "இந்த பயன்பாட்டு விதிமுறைகள் தொடர்பான கேள்விகள் அல்லது கவலைகள் இருந்தால், தயவுசெய்து தொடர்பு கொள்ளவும்:"
              )}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>{t("Email:", "மின்னஞ்சல்:")}</span>
              <a href="mailto:natawomail@gmail.com" className="text-primary hover:underline">
                natawomail@gmail.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("12. Arbitration", "12. அரிச்சித்தல்")}
            </h2>
            <p>
              {t(
                "Any disputes arising from these Terms of Use shall be resolved through arbitration in accordance with the rules of the American Arbitration Association.",
                "NATAWO இந்த சேவைகளைப் பயன்படுத்த நீங்கள் குறைந்தபட்சம் 13 வயது நிரம்பியவராக இருக்க வேண்டும்."
              )}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t("13. Contact Information", "13. தொடர்பு தகவல்")}
            </h2>
            <p className="mb-4">
              {t(
                "For any questions or concerns regarding these Terms of Use, please contact:",
                "இந்த பயன்பாட்டு விதிமுறைகள் தொடர்பான கேள்விகள் அல்லது கவலைகள் இருந்தால், தயவுசெய்து தொடர்பு கொள்ளவும்:"
              )}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>{t("Email:", "மின்னஞ்சல்:")}</span>
              <a href="mailto:natawomail@gmail.com" className="text-primary hover:underline">
                natawomail@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
