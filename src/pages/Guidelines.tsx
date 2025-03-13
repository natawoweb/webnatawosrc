import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Mail } from "lucide-react";

export default function Guidelines() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">
          {t("Guidelines", "வழிகாட்டுதல்கள்")}
        </h1>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        {/* Introduction */}
        <div className="mb-8">
          <p>
            {t(
              "The North America Tamil Writers Organization (NATAWO) website serves as a community platform for Tamil writers, literary enthusiasts, and scholars. To maintain a respectful and constructive environment, users must adhere to the following guidelines when engaging in discussions, forums, and contributions.",
              "வட அமெரிக்க தமிழ் எழுத்தாளர்கள் அமைப்பின் (NATAWO) வலைத்தளம் தமிழ் எழுத்தாளர்கள், இலக்கிய ஆர்வலர்கள் மற்றும் அறிஞர்களுக்கான சமூக தளமாக செயல்படுகிறது. மரியாதையான மற்றும் ஆக்கபூர்வமான சூழலை பராமரிக்க, விவாதங்கள், மன்றங்கள் மற்றும் பங்களிப்புகளில் ஈடுபடும்போது பயனர்கள் பின்வரும் வழிகாட்டுதல்களைப் பின்பற்ற வேண்டும்."
            )}
          </p>
        </div>

        {/* Section 1: General Code of Conduct */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("1. General Code of Conduct", "1. பொது நடத்தை விதிமுறைகள்")}
          </h2>
          <ul className="list-disc pl-6">
            <li>
              {t(
                "Be respectful and courteous to all members",
                "அனைத்து உறுப்பினர்களிடமும் மரியாதையாகவும் பண்பாகவும் நடந்து கொள்ளுங்கள்"
              )}
            </li>
            <li>
              {t(
                "Maintain civility in discussions and avoid personal attacks",
                "விவாதங்களில் நாகரிகத்தை கடைப்பிடித்து, தனிப்பட்ட தாக்குதல்களைத் தவிர்க்கவும்"
              )}
            </li>
            <li>
              {t(
                "Use appropriate language and refrain from offensive, discriminatory, or hateful speech",
                "பொருத்தமான மொழியைப் பயன்படுத்தி, அவமதிப்பான, பாகுபாடு காட்டும் அல்லது வெறுப்பூட்டும் பேச்சுக்களைத் தவிர்க்கவும்"
              )}
            </li>
            <li>
              {t(
                "Constructive criticism is encouraged, but trolling, bullying, or harassment will not be tolerated",
                "ஆக்கபூர்வமான விமர்சனங்கள் ஊக்குவிக்கப்படுகின்றன, ஆனால் ட்ரோலிங், வம்பு அல்லது துன்புறுத்தல் ஏற்றுக்கொள்ளப்படாது"
              )}
            </li>
            <li>
              {t(
                "Respect cultural diversity and Tamil literary heritage in discussions",
                "விவாதங்களில் கலாச்சார பன்முகத்தன்மையையும் தமிழ் இலக்கிய பாரம்பரியத்தையும் மதிக்கவும்"
              )}
            </li>
          </ul>
        </section>

        {/* Section 2: Forum & Discussion Rules */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("2. Forum & Discussion Rules", "2. மன்றம் & விவாத விதிகள்")}
          </h2>
          <ul className="list-disc pl-6">
            <li>
              {t(
                "Stay on-topic and contribute meaningfully to discussions",
                "தலைப்பில் இருங்கள் மற்றும் விவாதங்களுக்கு அர்த்தமுள்ள பங்களிப்பைச் செய்யுங்கள்"
              )}
            </li>
            <li>
              {t(
                "Avoid spam, self-promotion, or repeated posting of the same content",
                "ஸ்பேம், சுய விளம்பரம் அல்லது ஒரே உள்ளடக்கத்தை மீண்டும் மீண்டும் பதிவிடுவதைத் தவிர்க்கவும்"
              )}
            </li>
            <li>
              {t(
                "No plagiarism – Always credit sources when sharing external content",
                "திருட்டு இல்லை - வெளிப்புற உள்ளடக்கத்தைப் பகிரும்போது எப்போதும் ஆதாரங்களுக்கு கடன் கொடுங்கள்"
              )}
            </li>
            <li>
              {t(
                "Discussions must align with the mission of NATAWO (Tamil literature, writing, culture)",
                "விவாதங்கள் NATAWO இன் நோக்கத்துடன் (தமிழ் இலக்கியம், எழுத்து, கலாச்சாரம்) ஒத்துப்போக வேண்டும்"
              )}
            </li>
            <li>
              {t(
                "Misinformation or false claims will be removed",
                "தவறான தகவல் அல்லது தவறான கூற்றுகள் அகற்றப்படும்"
              )}
            </li>
          </ul>
        </section>

        {/* Section 3: Content Submission Guidelines */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("3. Content Submission Guidelines", "3. உள்ளடக்க சமர்ப்பிப்பு வழிகாட்டுதல்கள்")}
          </h2>
          <p>
            {t(
              "If you are submitting poetry, articles, stories, or forum posts, follow these rules:",
              "நீங்கள் கவிதைகள், கட்டுரைகள், கதைகள் அல்லது மன்ற இடுகைகளைச் சமர்ப்பித்தால், இந்த விதிகளைப் பின்பற்றவும்:"
            )}
          </p>
          <ul className="list-disc pl-6">
            <li>
              {t(
                "Originality: Submissions must be your own work",
                "அசல் தன்மை: சமர்ப்பிப்புகள் உங்கள் சொந்த படைப்பாக இருக்க வேண்டும்"
              )}
            </li>
            <li>
              {t(
                "Copyright Compliance: Do not post copyrighted material without permission",
                "பதிப்புரிமை இணக்கம்: அனுமதியின்றி பதிப்புரிமை பெற்ற பொருட்களைப் பதிவிட வேண்டாம்"
              )}
            </li>
            <li>
              {t(
                "Appropriate Themes: Content should be suitable for a general audience",
                "பொருத்தமான கருப்பொருள்கள்: உள்ளடக்கம் பொதுவான பார்வையாளர்களுக்கு ஏற்றதாக இருக்க வேண்டும்"
              )}
            </li>
            <li>
              {t(
                "Respect Tamil Language: If posting in Tamil, ensure correct spelling and readability",
                "தமிழ் மொழியை மதிக்கவும்: தமிழில் பதிவிடும்போது, சரியான எழுத்து மற்றும் வாசிப்புத்திறனை உறுதிப்படுத்தவும்"
              )}
            </li>
            <li>
              {t(
                "Formatting: Use clear headings and paragraphs for readability",
                "வடிவமைத்தல்: வாசிப்புத்திறனுக்காக தெளிவான தலைப்புகள் மற்றும் பத்திகளைப் பயன்படுத்தவும்"
              )}
            </li>
          </ul>
          <p>
            {t(
              "Moderators reserve the right to edit, remove, or reject content that violates these guidelines.",
              "இந்த வழிகாட்டுதல்களை மீறும் உள்ளடக்கத்தை திருத்த, அகற்ற அல்லது நிராகரிக்க மதிப்பீட்டாளர்களுக்கு உரிமை உண்டு."
            )}
          </p>
        </section>

        {/* Section 4: Profile & Account Usage */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("4. Profile & Account Usage", "4. சுயவிவரம் & கணக்கு பயன்பாடு")}
          </h2>
          <ul className="list-disc pl-6">
            <li>
              {t(
                "Use real or pen names (avoid impersonation)",
                "உண்மையான அல்லது புனைப்பெயர்களைப் பயன்படுத்தவும் (ஆள்மாறாட்டத்தைத் தவிர்க்கவும்)"
              )}
            </li>
            <li>
              {t(
                "Your profile information should be appropriate and free of offensive content",
                "உங்கள் சுயவிவரத் தகவல் பொருத்தமானதாகவும், ஆட்சேபனைக்குரிய உள்ளடக்கம் இல்லாததாகவும் இருக்க வேண்டும்"
              )}
            </li>
            <li>
              {t(
                "Do not share personal contact details (phone numbers, addresses, private emails) in public forums",
                "பொது மன்றங்களில் தனிப்பட்ட தொடர்பு விவரங்களை (தொலைபேசி எண்கள், முகவரிகள், தனிப்பட்ட மின்னஞ்சல்கள்) பகிர வேண்டாம்"
              )}
            </li>
            <li>
              {t(
                "One account per person – Creating multiple accounts for misleading purposes is prohibited",
                "ஒரு நபருக்கு ஒரு கணக்கு - தவறான நோக்கங்களுக்காக பல கணக்குகளை உருவாக்குவது தடைசெய்யப்பட்டுள்ளது"
              )}
            </li>
          </ul>
        </section>

        {/* Section 5: Privacy & Safety */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("5. Privacy & Safety", "5. தனியுரிமை & பாதுகாப்பு")}
          </h2>
          <ul className="list-disc pl-6">
            <li>
              {t(
                "Do not share private conversations or personal data of others without consent",
                "மற்றவர்களின் தனிப்பட்ட உரையாடல்கள் அல்லது தனிப்பட்ட தரவை அவர்களின் ஒப்புதல் இல்லாமல் பகிர வேண்டாம்"
              )}
            </li>
            <li>
              {t(
                "Be cautious when sharing links or downloading attachments from other users",
                "மற்ற பயனர்களிடமிருந்து இணைப்புகளைப் பகிரும்போது அல்லது இணைப்புகளைப் பதிவிறக்கும்போது கவனமாக இருங்கள்"
              )}
            </li>
            <li>
              {t(
                "Report suspicious or inappropriate behavior to the moderators",
                "சந்தேகத்திற்கிடமான அல்லது பொருத்தமற்ற நடத்தையை மதிப்பீட்டாளர்களுக்குப் புகாரளிக்கவும்"
              )}
            </li>
          </ul>
        </section>

        {/* Section 6: Event Participation Guidelines */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("6. Event Participation Guidelines", "6. நிகழ்வு பங்கேற்பு வழிகாட்டுதல்கள்")}
          </h2>
          <p>
            {t(
              "For workshops, contests, or online events:",
              "பயிலரங்குகள், போட்டிகள் அல்லது ஆன்லைன் நிகழ்வுகளுக்கு:"
            )}
          </p>
          <ul className="list-disc pl-6">
            <li>
              {t(
                "Follow the event-specific rules posted by organizers",
                "நிகழ்வு அமைப்பாளர்களால் வெளியிடப்பட்ட நிகழ்வு சார்ந்த விதிகளைப் பின்பற்றவும்"
              )}
            </li>
            <li>
              {t(
                "Submit content before deadlines",
                "கடைசி தேதிக்கு முன் உள்ளடக்கத்தைச் சமர்ப்பிக்கவும்"
              )}
            </li>
            <li>
              {t(
                "Engage positively and support fellow participants",
                "நேர்மறையாக ஈடுபடுங்கள் மற்றும் சக பங்கேற்பாளர்களுக்கு ஆதரவளிக்கவும்"
              )}
            </li>
            <li>
              {t(
                "Respect judges’ and organizers' decisions",
                "நடுவர்கள் மற்றும் அமைப்பாளர்களின் முடிவுகளை மதிக்கவும்"
              )}
            </li>
          </ul>
          <p>
            {t(
              "Disruptive behavior during events may result in removal from the event or future bans.",
              "நிகழ்வுகளின் போது இடையூறு விளைவிக்கும் நடத்தை நிகழ்விலிருந்து நீக்கம் அல்லது எதிர்கால தடைகளுக்கு வழிவகுக்கும்."
            )}
          </p>
        </section>

        {/* Section 7: Prohibited Activities */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("7. Prohibited Activities", "7. தடைசெய்யப்பட்ட செயல்கள்")}
          </h2>
          <p>
            {t(
              "Users must not engage in:",
              "பயனர்கள் இதில் ஈடுபடக்கூடாது:"
            )}
          </p>
          <ul className="list-disc pl-6">
            <li>
              {t(
                "Hate speech, discrimination, or offensive language",
                "வெறுப்பு பேச்சு, பாகுபாடு அல்லது ஆட்சேபனைக்குரிய மொழி"
              )}
            </li>
            <li>
              {t(
                "Defamation or spreading false information about individuals or organizations",
                "தனிநபர்கள் அல்லது நிறுவனங்களைப் பற்றி அவதூறு செய்தல் அல்லது தவறான தகவல்களைப் பரப்புதல்"
              )}
            </li>
            <li>
              {t(
                "Commercial advertising or self-promotion without permission",
                "அனுமதியின்றி வணிக விளம்பரம் அல்லது சுய விளம்பரம்"
              )}
            </li>
            <li>
              {t(
                "Scamming, phishing, or misleading activities",
                "மோசடி, ஃபிஷிங் அல்லது தவறான செயல்கள்"
              )}
            </li>
            <li>
              {t(
                "Illegal activities (e.g., piracy, hacking, or copyright infringement)",
                "சட்டவிரோத நடவடிக்கைகள் (எ.கா., திருட்டு, ஹேக்கிங் அல்லது பதிப்புரிமை மீறல்)"
              )}
            </li>
          </ul>
          <p>
            {t(
              "Violations will result in warnings, content removal, suspension, or permanent bans based on severity.",
              "மீறல்கள் எச்சரிக்கைகள், உள்ளடக்கத்தை அகற்றுதல், இடைநீக்கம் அல்லது தீவிரத்தின் அடிப்படையில் நிரந்தர தடைகளுக்கு வழிவகுக்கும்."
            )}
          </p>
        </section>

        {/* Section 8: Moderation & Reporting Violations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("8. Moderation & Reporting Violations", "8. மதிப்பீடு & மீறல் புகாரளித்தல்")}
          </h2>
          <p>
            {t(
              "Our moderators ensure adherence to these guidelines.",
              "எங்கள் மதிப்பீட்டாளர்கள் இந்த வழிகாட்டுதல்களை கடைபிடிப்பதை உறுதி செய்கிறார்கள்."
            )}
          </p>
          <ul className="list-disc pl-6">
            <li>
              {t(
                "If you encounter violations, use the 'Report' feature or email natawomail@gmail.com.",
                "நீங்கள் மீறல்களை சந்தித்தால், 'புகாரளி' அம்சத்தைப் பயன்படுத்தவும் அல்லது natawomail@gmail.com க்கு மின்னஞ்சல் அனுப்பவும்."
              )}
            </li>
            <li>
              {t(
                "Decisions made by moderators are final and not open to public debate.",
                "மதிப்பீட்டாளர்களால் எடுக்கப்படும் முடிவுகள் இறுதியானவை மற்றும் பொது விவாதத்திற்கு திறந்தவை அல்ல."
              )}
            </li>
          </ul>
        </section>

        {/* Section 9: Updates to Guidelines */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("9. Updates to Guidelines", "9. வழிகாட்டுதல்களுக்கான புதுப்பிப்புகள்")}
          </h2>
          <p>
            {t(
              "NATAWO reserves the right to update these guidelines periodically. Changes will be announced on the website, and continued use implies acceptance.",
              "இந்த வழிகாட்டுதல்களை அவ்வப்போது புதுப்பிக்கும் உரிமையை NATAWO கொண்டுள்ளது. மாற்றங்கள் வலைத்தளத்தில் அறிவிக்கப்படும், மேலும் தொடர்ந்து பயன்படுத்துவது ஏற்றுக்கொள்வதைக் குறிக்கிறது."
            )}
          </p>
        </section>

        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            {t("Contact Us", "எங்களை தொடர்பு கொள்ளுங்கள்")}
          </h2>
          <p className="mb-4">
            {t(
              "For questions about these guidelines, contact:",
              "இந்த வழிகாட்டுதல்கள் பற்றிய கேள்விகளுக்கு, தொடர்பு கொள்ளவும்:"
            )}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>{t("Email:", "மின்னஞ்சல்:")}</span>
            <a href="mailto:natawomail@gmail.com" className="text-primary hover:underline">
              contact@natawo.org
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
