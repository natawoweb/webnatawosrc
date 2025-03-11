import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Mail } from "lucide-react";

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">
          {t("Privacy Policy", "தனியுரிமைக் கொள்கை")}
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

        <section className="space-y-8">
          <div className="space-y-4">
            <p>
              {t(
                "North America Tamil Writers Organization (NATAWO) respects your privacy and is committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your data when you access our website, engage in forums, or participate in our programs.",
                "வட அமெரிக்க தமிழ் எழுத்தாளர்கள் அமைப்பு (NATAWO) உங்கள் தனியுரிமையை மதிக்கிறது மற்றும் உங்கள் தனிப்பட்ட தகவல்களைப் பாதுகாக்க உறுதிபூண்டுள்ளது. நீங்கள் எங்கள் வலைத்தளத்தை அணுகும்போது, மன்றங்களில் ஈடுபடும்போது அல்லது எங்கள் நிகழ்ச்சிகளில் பங்கேற்கும்போது உங்கள் தரவை எவ்வாறு சேகரிக்கிறோம், பயன்படுத்துகிறோம், வெளிப்படுத்துகிறோம் மற்றும் பாதுகாக்கிறோம் என்பதை இந்த தனியுரிமைக் கொள்கை விவரிக்கிறது."
              )}
            </p>
            <p>
              {t(
                "By using our website, you agree to the practices described in this Privacy Policy. If you do not agree with the terms, please discontinue use of our services.",
                "எங்கள் வலைத்தளத்தைப் பயன்படுத்துவதன் மூலம், இந்த தனியுரிமைக் கொள்கையில் விவரிக்கப்பட்டுள்ள நடைமுறைகளுக்கு நீங்கள் ஒப்புக்கொள்கிறீர்கள். விதிமுறைகளுடன் நீங்கள் ஒப்புக்கொள்ளவில்லை என்றால், எங்கள் சேவைகளைப் பயன்படுத்துவதை நிறுத்திவிடவும்."
              )}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {t("1. Information We Collect", "1. நாங்கள் சேகரிக்கும் தகவல்கள்")}
            </h2>
            
            <h3 className="text-xl font-medium">
              {t(
                "A. Personal Information (Voluntarily Provided by Users)",
                "அ. தனிப்பட்ட தகவல்கள் (பயனர்களால் தன்னார்வமாக வழங்கப்படுபவை)"
              )}
            </h3>
            
            <p>{t("We collect personal information when you:", "பின்வரும் சந்தர்ப்பங்களில் நாங்கள் தனிப்பட்ட தகவல்களைச் சேகரிக்கிறோம்:")}</p>
            
            <ul className="list-disc pl-6">
              <li>{t("Register for an account on our website", "எங்கள் வலைத்தளத்தில் கணக்கைப் பதிவு செய்யும்போது")}</li>
              <li>{t("Participate in forums, discussions, or submit literary works", "மன்றங்களில் பங்கேற்கும்போது, விவாதங்களில் கலந்துகொள்ளும்போது அல்லது இல���்கியப் படைப்புகளை சமர்ப்பிக்கும்போது")}</li>
              <li>{t("Subscribe to our newsletter, events, or membership programs", "எங்கள் செய்திமடல், நிகழ்வுகள் அல்லது உறுப்பினர் திட்டங்களுக்கு பதிவு செய்யும்போது")}</li>
              <li>{t("Contact us for support, feedback, or inquiries", "ஆதரவு, கருத்து அல்லது விசாரணைகளுக்காக எங்களை தொடர்பு கொள்ளும்போது")}</li>
            </ul>

            <h3 className="text-xl font-medium">
              {t(
                "B. Information Collected Automatically",
                "B. செய்திமடலில் சேகரிக்கப்பட்ட தகவல்கள்"
              )}
            </h3>
            
            <p>{t("When you use our website, certain information is collected automatically through cookies and analytics tools:", "எங்கள் வலைத்தளத்தைப் பயன்படுத்துவதற்கு, செய்திமடலில் சேகரிக்கப்பட்ட தகவல்களை கொடுத்து கொள்ளும்:")}</p>
            
            <ul className="list-disc pl-6">
              <li>{t("IP Address & Device Information – To improve website security and optimize performance.", "IP குறிப்பு மற்றும் கத்திரை தகவல்கள் – வலைத்தளத்தின் செய்திமடலை செய்து கொடுத்து கொள்ளும்.")}</li>
              <li>{t("Browser & Operating System Details – To ensure compatibility with our platform.", "பாக்கிதை மற்றும் உருதியை தகவல்கள் – வலைத்தளத்தின் பயன்படுத்துவதற்கு செய்து கொடுத்து கொள்ளும்.")}</li>
              <li>{t("Usage Data – Pages visited, time spent, and interactions on the website.", "பக்கிதைகள் கிடைப்பது, வாக்கியத்தின் காலம் செய்து கொடுத்து கொள்ளும்.")}</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {t("2. Legal Basis for Collecting Information", "2. சேகரிக்கும் தகவல்களை செய்து கொடுத்து கொள்ளும் நடைமுறைகள்")}
            </h2>
            
            <p>{t("We process personal information under the following legal bases:", "வாழ்க்கை தகவல்களை செய்து கொடுத்து கொள்ளும் நடைமுறைகள்:")}</p>
            
            <ul className="list-disc pl-6">
              <li>{t("Legitimate Interest – To provide services such as forums, community engagement, and user interactions.", "விதிமுறை – மன்றங்களில் பங்கேற்கும்போது, விவாதங்களில் கலந்துகொள்ளும்போது அல்லது எங்கள் நிகழ்ச்சிகளில் பங்கேற்கும்போது உங்கள் தரவை எவ்வாறு சேகரிக்கிறோம், பயன்படுத்துகிறோம், வெளிப்படுத்துகிறோம் மற்றும் பாதுகாக்கிறோம்.")}</li>
              <li>{t("Consent – When users voluntarily submit personal data for newsletters, memberships, or event registrations.", "ஒப்புக்கொள்கிறீர்கள் தன்னார்வமாக வழங்கப்படும்போது உங்கள் தனிப்பட்ட தகவல்களை சேகரிக்கிறோம்.")}</li>
              <li>{t("Contractual Necessity – For processing payments, event sign-ups, and service-related communication.", "செய்திமடலில் சேகரிக்கப்பட்ட தகவல்களை செய்து கொடுத்து கொள்ளும்.")}</li>
              <li>{t("Legal Compliance – To comply with applicable laws, regulations, or legal obligations.", "நடைமுறைகள் செய்து கொடுத்து கொள்ளும்.")}</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {t("3. How We Use Your Information", "3. உங்கள் தகவல்களை சேகரிக்கும் தகவல்களை பயன்படுத்துவதற்கு")}
            </h2>
            
            <p>{t("We use collected information for:", "சேகரிக்கப்பட்ட தகவல்களை பயன்படுத்துவதற்கு:")}</p>
            
            <ul className="list-disc pl-6">
              <li>{t("User Account Management – To create and maintain user accounts.", "வலைத்தளத்தில் கணக்கைப் பதிவு செய்யும்போது உங்கள் வலைத்தளத்தின் கணக்கை தெரிவுக்கும்.")}</li>
              <li>{t("Community Engagement – Facilitating discussions, forums, and collaborations.", "விவாதங்களில் கலந்துகொள்ளும்போது மன்றங்களில் பங்கேற்கும்போது உங்கள் வலைத்தளத்தின் விவாதங்களை தெரிவுக்கும்.")}</li>
              <li>{t("Service Improvement – Enhancing website functionality, user experience, and content recommendations.", "வலைத்தளத்தின் விவாதங்களை தெரிவுக்கும், உங்கள் வலைத்தளத்தின் விவாதங்களை தெரிவுக்கும், உங்கள் வலைத்தளத்தின் விவாதங்களை தெரிவுக்கும்.")}</li>
              <li>{t("Event Management – Organizing literary events, workshops, and writing competitions.", "விவாதங்களில் கலந்துகொள்ளும்போது மன்றங்களில் பங்கேற்கும்போது உங்கள் வலைத்தளத்தின் விவாதங்களை தெரிவுக்கும்.")}</li>
              <li>{t("Security & Fraud Prevention – Detecting unauthorized activities and protecting user data.", "வலைத்தளத்தின் விவாதங்களை தெரிவுக்கும், உங்கள் வலைத்தளத்தின் விவாதங்களை தெரிவுக்கும்.")}</li>
              <li>{t("Legal & Compliance Requirements – Responding to legal requests and regulatory requirements.", "நடைமுறைகள் செய்து கொடுத்து கொள்ளும்.")}</li>
            </ul>
            <p>{t("We do not use personal information for automated decision-making or profiling.", "உங்கள் தனிப்பட்ட தகவல்களை சேகரிக்கும் தகவல்களை பயன்படுத்துவதற்கு அறிவு செய்து கொடுத்து கொள்ளும்.")}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {t("4. Contact Information", "4. தொடர்பு தகவல்")}
            </h2>
            <p className="mb-4">
              {t(
                "If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:",
                "இந்த தனியுரிமைக் கொள்கை தொடர்பான கேள்விகள், கவலைகள் அல்லது கோரிக்கைகள் இருந்தால், தயவுசெய்து எங்களை தொடர்பு கொள்ளவும்:"
              )}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>{t("Email:", "மின்னஞ்சல்:")}</span>
              <a href="mailto:natawomail@gmail.com" className="text-primary hover:underline">
                 contact@natawo.org
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
