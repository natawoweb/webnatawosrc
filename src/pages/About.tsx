import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  
  const leadershipTeam = [
    {
      name: "Dr. Balamurugan Kuppusamy",
      role: "Chief Coordinator",
      bio: "With over 20 years of experience in Tamil literature and education, Dr. Kuppusamy leads our organization's mission to promote Tamil literary writing.",
      image: "/lovable-uploads/dc133d31-ff53-48f8-9c21-f2aa21c91bc7.png"
    }
  ];

  const milestones = [
    {
      year: 2018,
      event: "Foundation of Writers Hub North America"
    },
    {
      year: 2019,
      event: "First Annual Tamil Literary Festival"
    },
    {
      year: 2020,
      event: "Launch of Digital Library Initiative"
    },
    {
      year: 2021,
      event: "Establishment of Writers Mentorship Program"
    },
    {
      year: 2022,
      event: "Opening of Regional Chapters across Major Cities"
    }
  ];

  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Mission Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">{t("About Us", "எங்களைப் பற்றி")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("Our Mission & Vision", "எங்கள் நோக்கமும் தொலைநோக்கும்")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed">
                {t(
                  "Tamil literature is a bridge between the past and the future, a voice of identity, culture, and creative expression. North America Tamil Writers Organization (NATAWO) is committed to nurturing and celebrating Tamil literary traditions in North America by providing a dynamic platform for Tamil writers to express their creativity, refine their craft, and share their works with a wider audience.",
                  "தமிழ் இலக்கியம் என்பது கடந்த காலத்திற்கும் எதிர்காலத்திற்கும் இடையேயான பாலம், அடையாளம், கலாச்சாரம் மற்றும் படைப்பாற்றல் வெளிப்பாட்டின் குரல். வட அமெரிக்க தமிழ் எழுத்தாளர்கள் அமைப்பு (நடவு) வட அமெரிக்காவில் தமிழ் இலக்கிய மரபுகளை வளர்த்து, கொண்டாடுவதற்காக அர்ப்பணிப்புடன் செயல்படுகிறது. தமிழ் எழுத்தாளர்கள் தங்கள் படைப்பாற்றலை வெளிப்படுத்தவும், தங்கள் திறமையை மெருகேற்றவும், தங்கள் படைப்புகளை பரந்த வாசகர்களுடன் பகிர்ந்து கொள்ளவும் ஒரு இயங்குமிக்க தளத்தை வழங்குகிறது."
                )}
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                {t("Vision", "தொலைநோக்கு")}
              </h2>
              <p className="text-lg leading-relaxed">
                {t(
                  "To nurture and celebrate Tamil literature and culture in North America by inspiring a global community of Tamil writers, fostering creativity, and preserving the rich heritage of the Tamil language promotes cultural identity and literary enhancement for Tamil diaspora children.",
                  "வட அமெரிக்காவில் தமிழ் இலக்கியம் மற்றும் கலாச்சாரத்தை வளர்த்து, கொண்டாட, உலகளாவிய தமிழ் எழுத்தாளர்கள் சமூகத்தை ஊக்குவித்து, படைப்பாற்றலை வளர்த்து, தமிழ் மொழியின் செழுமையான பாரம்பரியத்தைப் பாதுகாத்து, தமிழ் புலம்பெயர் குழந்தைகளுக்கான கலாச்சார அடையாளம் மற்றும் இலக்கிய மேம்பாட்டை ஊக்குவிப்பது."
                )}
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                {t("Mission", "நோக்கம்")}
              </h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  {t(
                    "Empower Tamil Writers: Provide a supportive platform for aspiring and established Tamil writers in North America to express their ideas, refine their craft, and achieve global recognition.",
                    "தமிழ் எழுத்தாளர்களை மேம்படுத்துதல்: வட அமெரிக்காவில் உள்ள ஆர்வமுள்ள மற்றும் நிலைபெற்ற தமிழ் எழுத்தாளர்கள் தங்கள் கருத்துக்களை வெளிப்படு, தங்கள் திறமையை மெருகேற்ற மற்றும் உலகளாவிய அங்கீகாரத்தைப் பெற ஆதரவான தளத்தை வழங்குதல்."
                  )}
                </li>
                <li>
                  {t(
                    "Promote Tamil Literature: Encourage the creation, dissemination, and appreciation of Tamil literary works across diverse genres and styles.",
                    "தமிழ் இலக்கியத்தை ஊக்குவித்தல்: பல்வேறு வகைகள் மற்றும் பாணிகளில் தமிழ் இலக்கியப் படைப்புகளின் உருவாக்கம், பரவல் மற்றும் பாராட்டுதலை ஊக்குவித்தல்."
                  )}
                </li>
                <li>
                  {t(
                    "Preserve Heritage: Uphold the timeless traditions and values of Tamil language and culture while adapting to contemporary themes and expressions.",
                    "பாரம்பரியத்தைப் பாதுகாத்தல்: சமகால கருப்பொருள்கள் மற்றும் வெளிப்பாடுகளுக்கு ஏற்ப மாறும் அதே வேளையில் தமிழ் மொழி மற்றும் கலாச்சாரத்தின் காலத்தால் அழியாத மரபுகள் மற்றும் மதிப்புகளைப் பேணுதல்."
                  )}
                </li>
                <li>
                  {t(
                    "Engage Communities: Host workshops, literary events, and collaborations to connect writers, readers, and scholars in a vibrant literary community.",
                    "சமூகங்களை ஈடுபடுத்துதல்: துடிப்பான இலக்கிய சமூகத்தில் எழுத்தாளர்கள், வாசகர்கள் மற்றும் அறிஞர்களை இணைக்க பட்டறைகள், இலக்கிய நிகழ்வுகள் மற்றும் கூட்டுமுயற்சிகளை நடத்துதல்."
                  )}
                </li>
                <li>
                  {t(
                    "Bridge Generations: Inspire younger generations to embrace Tamil as a medium of creativity, writing and cultural expression through innovative programs and mentorship opportunities. Be a bridge between Tamil Writers and North American literary publishers and libraries to bring the Tamil language into the mainstream in North America.",
                    "தலைமுறைகளை இணைத்தல்: புத்தாக்க திட்டங்கள் மற்றும் வழிகாட்டல் வாய்ப்புகள் மூலம் இளைய தலைமுறையினர் தமிழை படைப்பாற்றல், எழுத்து மற்றும் கலாச்சார வெளிப்பாட்டின் ஊடகமாக ஏற்றுக்கொள்ள ஊக்குவித்தல். வட அமெரிக்காவில் தமிழ் மொழியை முக்கிய நீரோட்டத்திற்கு கொண்டு வர தமிழ் எழுத்தாளர்களுக்கும் வட அமெரிக்க இலக்கிய பதிப்பகங்கள் மற்றும் நூலகங்களுக்கும் இடையே பாலமாக இருத்தல்."
                  )}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Organization Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("About the Organization", "அமைப்பைப் பற்றி")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">{t("Who We Are", "நாங்கள் யார்")}</h3>
              <p className="text-lg leading-relaxed">
                {t(
                  "NATAWO is a non-profit, non-partisan, and secular organization dedicated to promoting Tamil literary expression, education, and cultural identity in North America. We aim to provide Tamil writers with the resources, opportunities, and networks they need to thrive in a global literary environment.",
                  "நடவு என்பது வட அமெரிக்காவில் தமிழ் இலக்கிய வெளிப்பாடு, கல்வி மற்றும் கலாச்சார அடையாளத்தை மேம்படுத்துவதற்காக அர்ப்பணிக்கப்பட்ட இலாப நோக்கற்ற, கட்சி சார்பற்ற மற்றும் மதச்சார்பற்ற அமைப்பாகும். உலகளாவிய இலக்கியச் சூழலில் செழிக்க தமிழ் எழுத்தாளர்கள் சமூகத்தை ஊக்குவித்து, படைப்பாற்றலை வளர்த்து, தமிழ் மொழியை மெருகேற்ற மற்றும் உலகளாவிய அங்கீகாரத்தைப் பெற ஆதரவான தளத்தை வழங்குதல்."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t("Governance & Leadership", "ஆட்சி & தலைமை")}
              </h3>
              <p className="text-lg leading-relaxed">
                {t(
                  "NATAWO is led by a dedicated Board of Coordinators, Bylaws Committee and Global Ambassadors composed of Tamil writers, scholars, educators, and community leaders. The leadership team is responsible for shaping the organization's strategic direction, ensuring financial transparency, and fostering a culture of inclusivity and innovation.",
                  "நடவு அமைப்பானது தமிழ் எழுத்தாளர்கள், அறிஞர்கள், கல்வியாளர்கள் மற்றும் சமூகத் தலைவர்களைக் கொண்ட அர்ப்பணிப்புள்ள ஒருங்கிணைப்பாளர்கள் குழு, விதிமுறைகள் குழு மற்றும் உலகளாவிய தூதுவர்களால் வழிநடத்தப்படுகிறது. அமைப்பின் மூலோபாய திசையை வடிவமைப்பது, நிதி வெளிப்படைத்தன்மையை உறுதி செய்வது மற்றும் உள்ளடக்கம் மற்றும் புத்தாக்கக் கலாச்சாரத்தை வளர்ப்பது தலைமைக் குழுவின் பொறுப்பாகும்."
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">{t("Core Values", "அடிப்படை மதிப்புகள்")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h4 className="font-semibold">
                      {t("Creativity", "படைப்பாற்றல்")}
                    </h4>
                    <p>
                      {t(
                        "Encouraging diverse forms of Tamil literary expression.",
                        "தமிழ் இலக்கிய வெளிப்பாட்டின் பல்வேறு வடிவங்களை ஊக்குவித்தல்."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="font-semibold">
                      {t("Preservation", "பாதுகாப்பு")}
                    </h4>
                    <p>
                      {t(
                        "Safeguarding and promoting Tamil literary heritage.",
                        "தமிழ் இலக்கிய பாரம்பரியத்தைப் பாதுகாத்து மேம்படுத்துதல்."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <h4 className="font-semibold">
                      {t("Collaboration", "கூட்டுறவு")}
                    </h4>
                    <p>
                      {t(
                        "Partnering with local and international literary organizations.",
                        "உள்ளூர் மற்றும் சர்வதேச இலக்கிய அமைப்புகளுடன் கூட்டு சேர்தல்."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <h4 className="font-semibold">
                      {t("Inclusivity", "உள்ளடக்கம்")}
                    </h4>
                    <p>
                      {t(
                        "Welcoming Tamil writers from all backgrounds and experiences.",
                        "அனைத்து பின்னணி மற்றும் அனுபவங்களைக் கொண்ட தமிழ் எழுத்தாளர்களை வரவேற்றல்."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-semibold">
                      {t("Innovation", "புத்தாக்கம்")}
                    </h4>
                    <p>
                      {t(
                        "Using modern platforms to enhance Tamil literary engagement.",
                        "தமிழ் இலக்கிய ஈடுபாட்டை மேம்படுத்த நவீன தளங்களைப் பயன்படுத்துதல்."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* History Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("History", "வரலாறு")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {t(
                    "A Legacy Rooted in Tamil Literary Passion",
                    "தமிழ் இலக்கிய ஆர்வத்தில் வேரூன்றிய மரபு"
                  )}
                </h3>
                <p className="text-lg leading-relaxed">
                  {t(
                    "Tamil literature has thrived for over 2,000 years, evolving through poetry, epics, short stories, and modern storytelling. As Tamil communities flourished in North America, writers sought a dedicated space to share their work, collaborate, and find publishing opportunities.",
                    "தமிழ் இலக்கியம் 2,000 ஆண்டுகளுக்கும் மேலாக கவிதை, காவியங்கள், சிறுகதைகள் மற்றும் நவீன கதை சொல்லல் வழியாக வளர்ந்து வந்துள்ளது. வட அமெரிக்காவில் தமிழ் சமூகங்கள் செழித்தோங்கியதால், எழுத்தாளர்கள் தங்கள் படைப்புகளைப் பகிர்ந்து கொள்ள, ஒத்துழைக்க மற்றும் பதிப்பிக்கும் வாய்ப்புகளைக் கண்டறிய ஒரு அர்ப்பணிக்கப்பட்ட இடத்தைத் தேடினர்."
                  )}
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  {t(
                    "Recognizing this need, a group of passionate Tamil literary enthusiasts founded North America Tamil Writers Incorporated to provide a structured platform for Tamil writers. Since its inception, NATAWO has grown into a respected institution, hosting literary events, mentorship programs, and collaborations that celebrate Tamil storytelling.",
                    "இந்த தேவையை உணர்ந்து, ஆர்வமுள்ள தமிழ் இலக்கிய ஆர்வலர்கள் குழு தமிழ் எழுத்தாளர்களுக்கு ஒரு கட்டமைக்கப்பட்ட தளத்தை வழங்க வட அமெரிக்க தமிழ் எழுத்தாளர்கள் நிறுவனத்தை நிறுவினர். தொடக்கம் முதல், நடவு தமிழ் கதை சொல்லலைக் கொண்டாடும் இலக்கிய நிகழ்வுகள், வழிகாட்டல் திட்டங்கள் மற்றும் கூட்டு முயற்சிகளை நடத்தும் மதிப்புமிக்க நிறுவனமாக வளர்ந்துள்ளது."
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  {t("Founding Story", "தொடக்கக் கதை")}
                </h3>
                <h4 className="text-xl font-medium mb-4">
                  {t(
                    "The Birth of NATAWO: Uniting Tamil Writers Across North America",
                    "நடவு-வின் பிறப்பு: வட அமெரிக்கா முழுவதும் தமிழ் எழுத்தாளர்களை ஒன்றிணைத்தல்"
                  )}
                </h4>
                <p className="text-lg leading-relaxed italic mb-6">
                  {t(
                    "The journey of NATAWO began with a simple yet powerful question:",
                    "நடவு-வின் பயணம் ஒரு எளிமையான ஆனால் சக்திவாய்ந்த கேள்வியுடன் தொடங்கியது:"
                  )}
                </p>
                <blockquote className="border-l-4 border-primary pl-4 mb-6">
                  <p className="text-lg font-medium">
                    {t(
                      "\"How can we create a lasting impact on Tamil literature in North America?\"",
                      "\"வட அமெரிக்காவில் தமிழ் இலக்கியத்தில் நிலையான தாக்கத்தை எவ்வாறு உருவாக்க முடியும்?\""
                    )}
                  </p>
                </blockquote>
                <p className="text-lg leading-relaxed">
                  {t(
                    "A group of dedicated Tamil writers, scholars, and educators came together to find the answer. They shared a common vision—to create a community-driven platform that nurtures Tamil literary talent while promoting the rich heritage of Tamil literature in a globalized world.",
                    "அர்ப்பணிப்புள்ள தமிழ் எழுத்தாளர்கள், அறிஞர்கள் மற்றும் கல்வியாளர்கள் குழு பதிலைக் கண்டறிய ஒன்றிணைந்தனர். உலகமயமாக்கப்பட்ட உலகில் தமிழ் இலக்கியத்தின் செழுமையான பாரம்பரியத்தை மேம்படுத்தும் அதே வேளையில் தமிழ் இலக்கியத் திறமையை வளர்க்கும் சமூகம் சார்ந்த தளத்தை உருவாக்குவது என்ற பொதுவான பார்வையை அவர்கள் பகிர்ந்து கொண்டனர்."
                  )}
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  {t(
                    "Through countless discussions, planning sessions, and collaborations, North America Tamil Writers Incorporated was officially formed as a non-profit literary organization with a commitment to fostering Tamil creativity.",
                    "எண்ணற்ற விவாதங்கள், திட்டமிடல் அமர்வுகள் மற்றும் கூட்டு முயற்சிகள் மூலம், தமிழ் படைப்பாற்றலை வளர்ப்பதற்கான அர்ப்பணிப்புடன் வட அமெரிக்க தமிழ் எழுத்தாளர்கள் நிறுவனம் அதிகாரப்பூர்வமாக இலாப நோக்கற்ற இலக்கிய அமைப்பாக உருவாக்கப்பட்டது."
                  )}
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  {t(
                    "Today, NATAWO stands as a pioneering force in Tamil literary development, bridging generations, cultures, and geographies through literature.",
                    "இன்று, நடவு தமிழ் இலக்கிய வளர்ச்சியில் முன்னோடி சக்தியாக நின்று, இலக்கியம் வழியாக தலைமுறைகள், கலாச்சாரங்கள் மற்றும் புவியியல்களை இணைக்கிறது."
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Leadership Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("Leadership", "தலைமைத்துவம்")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leadershipTeam.map((leader) => (
                <Card key={leader.name} className="overflow-hidden">
                  <img
                    src={leader.image}
                    alt={t(leader.name, "டாக்டர் பாலமுருகன் குப்புசாமி")}
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">
                      {t(leader.name, "டாக்டர் பாலமுருகன் குப்புசாமி")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(leader.role, "முதன்மை ஒருங்கிணைப்பாளர்")}
                    </p>
                    <p className="mt-2 text-sm">
                      {t(
                        leader.bio,
                        "தமிழ் இலக்கியம் மற்றும் கல்வியில் 20 ஆண்டுகளுக்கும் மேலான அனுபவம் கொண்ட டாக்டர் குப்புசாமி, தமிழ் இலக்கிய எழுத்துக்களை மேம்படுத்துவதற்கான எங்கள் அமைப்பின் நோக்கத்தை வழிநடத்துகிறார்."
                      )}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Membership Section */}
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">For Writers</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access to writing workshops and seminars</li>
                  <li>Opportunities to publish in our quarterly journal</li>
                  <li>Networking events with fellow writers</li>
                  <li>Mentorship programs</li>
                  <li>Priority registration for literary festivals</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">For Readers</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Access to our digital library</li>
                  <li>Invitations to book launches and readings</li>
                  <li>Quarterly newsletter with literary updates</li>
                  <li>Discounted tickets to events</li>
                  <li>Book club membership</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
