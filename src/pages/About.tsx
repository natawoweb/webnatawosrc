import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function About() {
  const { t } = useLanguage();

  const leadershipTeam = [
    {
      name: 'கவிஞர் Dr. Balamurugan Kuppusamy',
      role: 'Chief Coordinator',
      bio: "நிறுவனத் தலைவர் பிரடெரிக் தமிழ்ப்பள்ளி, அமெரிக்கத் தமிழ்க் கல்விக்கழகத்தின் நெடுநாள் ஆசிரியர் விருது பெற்றவர், தமிழ்க் கல்வியாளர், பேச்சாளர், எழுத்தாளர், தென்றல் முல்லை இதழின் முதன்மை ஆசிரியர், இளம் எழுத்தாளர்களை அறிமுகப் படுத்துபவர், <strong>Maryland, USA</strong>",
      image: '/lovable-uploads/1.jpg',
    },
    {
      name: 'Ms. Manimegalai Ramamourty',
      role: 'Vice Coordinator',
      bio: 'தமிழ்க் கல்வியாளர், தமிழார்வலர், பேச்சாளர், எழுத்தாளர், மயிலைத் திருவள்ளுவர் தமிழ்ச்சங்க ஆட்சிக்குழு உறுப்பினர், வல்லமை மின்னிதழ் ஆசிரியர்குழு, மதிப்பாய்வுக்குழு உறுப்பினர், <strong>Florida, USA</strong>',
      image: '/lovable-uploads/2.jpg',
    },
    {
      name: 'Mr. Manikandan Meenakshi Sundaram',
      role: 'Content Coordinator',
      bio: 'மீ.மணிகண்டன் (புனைப் பெயர்: மணிமீ), தமிழ் ஆர்வலர், எழுத்தாளர், பத்திரிகை மற்றும் ஊடகங்களில் சிறுகதைகள், சந்தக் கவிதைகள், புதுக்கவிதைகள் எழுதுபவர் மற்றும் பாடல்கள் புனைபவர், <strong>Texas, USA</strong>',
      image: '/lovable-uploads/3.jpg',
    },
    {
      name: 'Manikanda Prabu',
      role: 'Networking Coordinator',
      bio: 'A renowned professional and community organizer, Mani focuses on building connections between writers and readers across <strong>Pennsylvania, USA</strong>.',
      image: '/lovable-uploads/4.jpg',
    },
    {
      name: 'Ravi Kumar Potu',
      role: 'Technology Coordinator',
      bio: "An accomplished information technology professional, Ravi manages our organization's day-to-day Technology operations and System improvement initiatives. <strong>Maryland, USA</strong>",
      image: '/lovable-uploads/5.jpg',
    },
  ];

  const foundingMembers = [
    {
      name: 'Mr. Mourougavelou Vaithianathan',
      role: 'Founder',
      bio: 'எழுத்தாளர், செய்தியாளர், நிறுவனர் Fun Cycle Riders Non-profit Organization, <strong> Maryland, USA </strong>',
      image: '/lovable-uploads/6.jpg',
    },
    {
      name: 'Dr. Balamurugan Kuppusamy',
      role: 'Co-founder',
      bio: 'நிறுவனர் பிரடெரிக் தமிழ்ப்பள்ளி, தமிழ்க் கல்வியாளர், பேச்சாளர், எழுத்தாளர், <strong> Maryland, USA </strong>',
      image: '/lovable-uploads/1.jpg',
    },
    {
      name: 'Mr. Manikanda P Lakshmanan',
      role: 'Co-founder',
      bio: 'தமிழார்வலர், தமிழார்வ எழுத்தாளர், இணை-நிறுவனர் வளர்விதை Non-profit Organization, Social Entrepreneur, <strong> Pennsylvania, USA </strong>',
      image: '/lovable-uploads/4.jpg',
    },
    {
      name: 'Mr. Ramprasath Rengasamy',
      role: 'Co-founder',
      bio: 'தமிழ்நாடு அரசின் விருது பெற்ற அறிவியல் புனைவெழுத்தாளர், SFWA - Member (Science Fiction & Fantasy Writers Association), பல்-மொழி எழுத்தாளர், கதாசிரியர், சிறார் அறிபுனை எழுத்தாளர், பதிப்பாளர், கவிஞர், நாவலாசிரியர், சிறப்புரையாளர், Gym Enthusiast, <strong> Georgia, USA </strong>',
      image: '/lovable-uploads/7.jpg',
    },
    {
      name: 'Mr. Siddaarth Shanmugam',
      role: 'Co-founder',
      bio: 'நூலாசிரியர், தமிழாசிரியர், பாவலர், தமிழ் இலக்கணத்திலும், பா எழுதும் யாப்பிலும் தேர்ந்த அறிவும் பயிற்சியும் உடையவர், எழுத்தாளர்,<strong> California, USA </strong>',
      image: '/lovable-uploads/8.jpg',
    },
    {
      name: 'Ms. Manimegalai Ramamourty',
      role: 'Co-founder',
      bio: 'தமிழ்க் கல்வியாளர், தமிழார்வலர், பேச்சாளர், எழுத்தாளர், மயிலைத் திருவள்ளுவர் தமிழ்ச்சங்க ஆட்சிக்குழு உறுப்பினர், வல்லமை மின்னிதழ் ஆசிரியர்குழு, மதிப்பாய்வுக்குழு உறுப்பினர், <strong>Florida, USA</strong>',
      image: '/lovable-uploads/2.jpg',
    },

   {
      name: 'Mr. Sudarshan Meenakshi Sundharam',
      role: 'Co-founder',
      bio: 'சுதர்சன் (ஆற்றல் மறவன்), சிறுநீரக மருத்துவ பொறியியலில் பணி (TGH-UHN), தமிழ்க் கல்வியாளர், எழுத்தாளர், தமிழ் நாடு கலாச்சாரச் சங்கத்தில் முத்தமிழ் பாட சாலையை நிறுவியவர். மருத்துவம் சார்ந்த இவரது பதிவுகள் டொரோண்டோ பொது மருத்துவமனை மூலமாகக் கனடா முழுக்க காட்சிப்படுத்தி  உள்ளார். ஒரு ரூபாய் அறிவியல் தமிழ் மன்றத்தில் உயர் மட்டக் குழுவிலும், தமிழ் நாடு கலாச்சாரச் சங்கத்தின் ஆலோசகராகவும், டோ அறக்கட்டளையின் நிர்வாகத் தலைவராகவும் உள்ளார்,<strong> Toronto, Canada </strong>',
      image: '/lovable-uploads/29.jpg',
    },

  ];

  const globalAmbassadors = [
    {
      name: 'Ms. Vaidhehi Herbert',
      role: 'Global Ambassador - USA',
      bio: 'சங்க இலக்கிய அறிஞர், உரையாசிரியர், சங்க இலக்கியப் பதினெட்டு நூல்களை ஆங்கிலத்தில் மொழி பெயர்த்து உரை எழுதியவர், ஹார்வார்டு தமிழ் இருக்கைக்கு வித்திட்டவர், தமிழ்க் கல்வியாளர், <strong>Hawaii, USA </strong>',
      image: '/lovable-uploads/9.jpg',
    },
    {
      name: 'Mr. Mourougavelou Vaithianathan',
      role: 'Global Ambassador - USA',
      bio: 'புதுவை முருகு, தமிழார்வலர், தமிழ்க் கல்வியாளர், எழுத்தாளர், செய்தியாளர், மொழியியல் ஆர்வலர், மனிதவள சிந்தனையாளர், Social Entrepreneur, World Traveler, <strong>Maryland, USA </strong>',
      image: '/lovable-uploads/6.jpg',
    },
    {
      name: 'Dr. R. Prabhakaran',
      role: 'Global Ambassador - USA',
      bio: 'முனைவர் இர. பிரபாகரன், திருக்குறளார், எழுத்தாளர், தமிழ்க் கல்வியாளர், NASA, US Army போன்ற அமெரிக்க அரசுத்துறைகளில் உயர்ந்த பதவிகளில் பணி புரிந்து ஓய்வு பெற்றவர், Former Vice President of FeTNA, <strong>Maryland, USA </strong>',
      image: '/lovable-uploads/27.jpg',
    },
    {
      name: 'Dr. Arasu Chelliah',
      role: 'Global Ambassador - USA',
      bio: 'முனைவர் அரசு செல்லையா, எழுத்தாளர், தமிழ்க் கல்வியாளர், அமெரிக்க அதிபர் விருது பெற்றவர், Founder President of American Thamizh Academy, Former President of FeTNA, <strong>Maryland, USA </strong>',
      image: '/lovable-uploads/28.jpg',
    },
  ];

  const globalAmbassadorsCanada = [
    {
      name: 'Dr. Selvanayaki Sridas',
      role: 'Global Ambassador - Canada',
      bio: 'தலைவர், தொல்காப்பியமன்றம்-கனடா, பேராசிரியர், நிருவாகப் பொறுப்பாளர், அண்ணாமலைக் கனடா வளாகம், சிரேஷ்ட வரிமதிப்பாளர், உள்நாட்டு இறைவரித் திணைக்களம், ஸ்ரீ லங்கா, இலக்கியவாதி, எழுத்தாளர்,<strong> Toronto, Canada</strong>',
      image: '/lovable-uploads/11.jpg',
    },
    {
      name: 'Dr. Pushpa Christry',
      role: 'Global Ambassador - Canada',
      bio: 'பாவலர் மணி, இலக்கியவாதி, தமிழ்க் கல்வியாளர், எழுத்தாளர், உலகத் திருக்குறள் மையம் (கனடாப் பொறுப்பாளர்), உலகத் திருக்குறள் சமுதாய மையம் (அயலகப் பொறுப்பாளர்), <strong>Toronto, Canada </strong>',
      image: '/lovable-uploads/10.jpg',
    },
    {
      name: 'சொல்லாக்கியன் சு. தீனதயாளன்',
      role: 'Global Ambassador - Canada',
      bio: 'இலக்கியவாதி, தமிழ்க் கல்வியாளர், எழுத்தாளர், உலகத் தமிழ் சங்க 2022 ஆம் ஆண்டு இலக்கண விருதாளர், உலகத் தொல்காப்பிய மன்றமும் தமிழ் காப்புக் கழகமும் இணைந்து 2024 இல் அவருக்கு வழங்கிய விருது “தொல்காப்பிய மணி”,<strong> Alberta, Canada </strong>',
      image: '/lovable-uploads/24.jpg',
    },
    {
      name: 'Mr. Sudarshan Meenakshi Sundharam',
      role: 'Global Ambassador - Canada',
      bio: 'சுதர்சன் (ஆற்றல் மறவன்), சிறுநீரக மருத்துவ பொறியியலில் பணி (TGH-UHN), தமிழ்க் கல்வியாளர், எழுத்தாளர், தமிழ் நாடு கலாச்சாரச் சங்கத்தில் முத்தமிழ் பாட சாலையை நிறுவியவர். மருத்துவம் சார்ந்த இவரது பதிவுகள் டொரோண்டோ பொது மருத்துவமனை மூலமாகக் கனடா முழுக்க காட்சிப்படுத்தி  உள்ளார். ஒரு ரூபாய் அறிவியல் தமிழ் மன்றத்தில் உயர் மட்டக் குழுவிலும், தமிழ் நாடு கலாச்சாரச் சங்கத்தின் ஆலோசகராகவும், டோ அறக்கட்டளையின் நிர்வாகத் தலைவராகவும் உள்ளார்,<strong> Toronto, Canada </strong>',
      image: '/lovable-uploads/29.jpg',
    },
  ];

  const globalAmbassadorsMexico = [
    {
      name: 'Mr. Purushothaman Alagia Manavalan',
      role: 'Global Ambassador - Mexico',
      bio: 'தமிழார்வலர், தமிழார்வ எழுத்தாளர், Social Entrepreneur, <strong>Guadalajara, Mexico </strong>',
      image: '/lovable-uploads/12.jpg',
    },
  ];

  const globalAmbassadorsOtherCountries = [
    {
      name: 'Dr. S. Mohan',
      role: 'Global Ambassador - India',
      bio: 'புதுச்சேரி தொழில்நுட்ப பல்கலைக்கழகத்தின் (Puducherry Technological University - PTU) முதல் துணைவேந்தராக டாக்டர் எஸ். மோகன் அவர்கள் பணியாற்றி வருகிறார். தமிழ் எழுத்தாளர், தமிழார்வலர், பேச்சாளர், <strong>Puducherry, India </strong>',
      image: '/lovable-uploads/13.jpg',
    },
    {
      name: 'Kalaimaamani Ervadi S. Radhakrishnan',
      role: 'Global Ambassador - India',
      bio: 'நாடறிந்த எழுத்தாளர், கவிஞர், நாடகாசிரியர், நாவலாசிரியர், சமூக ஆர்வலர், பேச்சாளர், பத்திரிகை எழுத்தாளர் எனப் பல்வேறு பரிமாணங்களில் திகழும் கலைமாமணி ஏர்வாடி எஸ். இராதாகிருஷ்ணன் 130-க்கும் மேற்பட்ட நூல்களை எழுதியுள்ளார். தமிழ்நாடு அரசின் சிறந்த நூல்களுக்கான பரிசுகள் பெற்றவர், <strong>Thamizh Nadu, India </strong>',
      image: '/lovable-uploads/30.jpg',
    },
    {
      name: 'Kalaimaamani Dr. Cheyon I.B.S.',
      role: 'Global Ambassador - India',
      bio: 'கலைமாமணி சேயோன் (என். முருகன்), தமிழ் இலக்கியம், வானொலி மற்றும் ஊடகத் துறைகளில் முக்கிய பங்களிப்பு செய்தவர். அகில இந்திய வானொலியில் இயக்குநராக பணியாற்றிய இவர், 50-க்கும் மேற்பட்ட நூல்களை எழுதியுள்ளார். கலைமாமணி விருது, திருக்குறள் செம்மல் விருது எனப் பல விருதுகளைப் பெற்றவர், Former Director, All India Radio, MTS Academy, இலக்கியவாதி, தமிழ்க் கல்வியாளர், எழுத்தாளர், <strong>Thamizh Nadu, India </strong>',
      image: '/lovable-uploads/22.jpg',
    },
    {
      name: 'கவிஞர் விஜயகிருஷ்ணன்',
      role: 'Global Ambassador - India',
      bio: 'நெறியாளர், தூர்தர்ஷன் தமிழ்; துணைச்செயலாளர், சென்னை கம்பன் கழகம்; வங்கியாளர்; கிராமவளர் பணியாளர், <strong>Thamizh Nadu,  India</strong>',
      image: '/lovable-uploads/17.jpg',
    },
    {
      name: 'Prof. Dr. K. Thilagavathi',
      role: 'Global Ambassador - India',
      bio: 'Former Director / Head Thamizh Cultural Center, சங்க இலக்கிய ஆராய்ச்சியாளர், உரையாளர், சங்க இலக்கியப் பொருட் களஞ்சியத்தை உருவாக்கியவர், தமிழகப் புலவர்குழு உறுப்பினர், தமிழ் வளர்ச்சிக்கழக உறுப்பினர், மயிலைத் திருவள்ளுவர் தமிழ்ச்சங்க இணைச்செயலாளர், Thamizh University, Thanjavur, <strong>Thamizh Nadu, India </strong>',
      image: '/lovable-uploads/14.jpg',
    },
    {
      name: 'Dr. Murugesan Elangovan',
      role: 'Global Ambassador - India',
      bio: 'Associate Professor, K.M. Government Institute for PG Studies and Research, <strong>Puducherry, India</strong>',
      image: '/lovable-uploads/15.jpg',
    },
    {
      name: 'Dr. Ka. Selvaradjou',
      role: 'Global Ambassador - India',
      bio: 'Professor & Director (Planning and Development), Puducherry Technological University, <strong>Puducherry, India </strong>',
      image: '/lovable-uploads/16.jpg',
    },
    {
      name: 'Dr. A. Alaguselvam (Alaguannavi)',
      role: 'Global Ambassador - India',
      bio: 'Head, Department of Thamizh, Government Arts and science college, Aruppukottai, தமிழ் மரபுக்கலைகள் பயிற்றுநர்/பரப்புநர், <strong>Thamizh Nadu, India </strong>',
      image: '/lovable-uploads/18.jpg',
    },
    {
      name: 'கவிஞர் பிச்சினிக்காடு இளங்கோ',
      role: 'Global Ambassador - Singapore',
      bio: 'சிங்கப்பூர் கவிமாலை நிறுவுநர், மக்கள் மனம் திங்களிதழ் ஆசிரியர், சிங்கப்பூர் வானொலி முன்னாள் ஒலிபரப்பாளர்- படைப்பாளர், கவிதை, கட்டுரை, சிறுகதை, நாடகம்  படைப்பாளர், பாடலாசிரியர், <strong> Singapore </strong>',
      image: '/lovable-uploads/19.jpeg',
    },
    {
      name: 'Dr. Gurusamy Asogan',
      role: 'Global Ambassador - Indonesia',
      bio: 'தமிழ் ஆர்வலர், எழுத்தாளர், <strong>Jakarta Java, Indonesia </strong>',
      image: '/lovable-uploads/20.jpg',
    },
    {
      name: 'Dr. A. Mohamed Mohideen',
      role: 'Global Ambassador - UAE',
      bio: 'தமிழ்க் கல்வியாளர், எழுத்தாளர், National Educational Trust,<strong> Dubai - UAE </strong>',
      image: '/lovable-uploads/21.jpg',
    },
    {
      name: 'பேராசிரியர் மருத்துவர் ஜெயபாலன் வள்ளியப்பன்',
      role: 'Global Ambassador - Malaysia',
      bio: 'இலக்கியவாதி, தமிழறிஞர், மகப்பேறு சோதனைக்குழாய் மருத்துவ நிபுணர், <strong>Eppo, Malaysia</strong>',
      image: '/lovable-uploads/23.jpg',
    },
    {
      name: 'பைந்தமிழ்ச் செம்மல் நிர்மலா சிவராசசிங்கம்',
      role: 'Global Ambassador - Switzerland',
      bio: ' தமிழ்மணிப் புலவர், தமிழ் ஆசிரியர், மரபு கவிஞர், எழுத்தாளர், <strong>Langenthal, Switzerland</strong>',
      image: '/lovable-uploads/25.jpg',
    },
    {
      name: 'முனைவர் மு. இராசேந்திரன் M.A., Ph.D., AMK & AMN',
      role: 'Global Ambassador - Malaysia',
      bio: 'மதிப்புறு பேராசிரியர் (மலாயாப் பல்கலைக்கழகம், மலேசியா), இயக்குநர் (ஏய்ம்ஸ்ட் பல்கலைக்கழகத் தமிழ் மற்றும் இந்திய நாகரிக ஆய்வியல் நடுவம் மலேசியா). ஆய்வியலுக்கு, (மலேசிய) விவேகனந்தர்  நினைவு தங்கப் பதக்கம் பெற்றவர், <strong>Kedah, Malaysia</strong>',
      image: '/lovable-uploads/26.jpg',
    },
  ];

  const milestones = [
    {
      year: 2018,
      event: 'Foundation of Writers Hub North America',
    },
    {
      year: 2019,
      event: 'First Annual Thamizh Literary Festival',
    },
    {
      year: 2020,
      event: 'Launch of Digital Library Initiative',
    },
    {
      year: 2021,
      event: 'Establishment of Writers Mentorship Program',
    },
    {
      year: 2022,
      event: 'Opening of Regional Chapters across Major Cities',
    },
  ];

  const handleDownloadBylaws = () => {
    const pdfUrl =
      'https://yqqfxpvptgcczumqowpc.supabase.co/storage/v1/object/public/Common/NATAWO_ByLaws.pdf';
      
    window.open(pdfUrl, '_blank');
  };

  const location = useLocation();
  const offset = 100; // Adjust this value to add space above the section

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        const yOffset =
          element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: yOffset, behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="container mx-auto py-12 space-y-12">
      {/* Mission Section */}
      <section className="space-y-4" id="our-mission">
        <h1 className="text-4xl font-bold">
          {t('About Us', 'எங்களைப் பற்றி')}
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>
              {t('Our Mission & Vision', 'எங்கள் நோக்கமும் தொலைநோக்கும்')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed">
                {t(
                  'Thamizh literature is a bridge between the past and the future, a voice of identity, culture, and creative expression. North America Thamizh Writers Organization (NATAWO) is committed to nurturing and celebrating Thamizh literary traditions in North America by providing a dynamic platform for Thamizh writers to express their creativity, refine their craft, and share their works with a wider audience.',
                  'தமிழ் இலக்கியம் என்பது கடந்த காலத்திற்கும் எதிர்காலத்திற்கும் இடையேயான பாலம், அடையாளம், கலாச்சாரம் மற்றும் படைப்பாற்றல் வெளிப்பாட்டின் குரல். வட அமெரிக்க தமிழ் எழுத்தாளர்கள் அமைப்பு (நடவு) வட அமெரிக்காவில் தமிழ் இலக்கிய மரபுகளை வளர்த்து, கொண்டாடுவதற்காக அர்ப்பணிப்புடன் செயல்படுகிறது. தமிழ் எழுத்தாளர்கள் தங்கள் படைப்பாற்றலை வெளிப்படுத்தவும், தங்கள் திறமையை மெருகேற்றவும், தங்கள் படைப்புகளை பரந்த வாசகர்களுடன் பகிர்ந்து கொள்ளவும் ஒரு இயங்குமிக்க தளத்தை வழங்குகிறது.'
                )}
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                {t('Vision', 'தொலைநோக்கு')}
              </h2>
              <p className="text-lg leading-relaxed">
                {t(
                  'To nurture and celebrate Thamizh literature and culture in North America by inspiring a global community of Thamizh writers, fostering creativity, and preserving the rich heritage of the Thamizh language promotes cultural identity and literary enhancement for Thamizh diaspora children.',
                  'வட அமெரிக்காவில் தமிழ் இலக்கியம் மற்றும் கலாச்சாரத்தை வளர்த்து, கொண்டாட, உலகளாவிய தமிழ் எழுத்தாளர்கள் சமூகத்தை ஊக்குவித்து, படைப்பாற்றலை வளர்த்து, தமிழ் மொழியின் செழுமையான பாரம்பரியத்தைப் பாதுகாத்து, தமிழ் புலம்பெயர் குழந்தைகளுக்கான கலாச்சார அடையாளம் மற்றும் இலக்கிய மேம்பாட்டை ஊக்குவிப்பது.'
                )}
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">
                {t('Mission', 'நோக்கம்')}
              </h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  {t(
                    'Empower Thamizh Writers: Provide a supportive platform for aspiring and established Thamizh writers in North America to express their ideas, refine their craft, and achieve global recognition.',
                    'தமிழ் எழுத்தாளர்களை மேம்படுத்துதல்: வட அமெரிக்காவில் உள்ள ஆர்வமுள்ள மற்றும் நிலைபெற்ற தமிழ் எழுத்தாளர்கள் தங்கள் கருத்துக்களை வெளிப்படு, தங்கள் திறமையை மெருகேற்ற மற்றும் உலகளாவிய அங்கீகாரத்தைப் பெற ஆதரவான தளத்தை வழங்குதல்.'
                  )}
                </li>
                <li>
                  {t(
                    'Promote Thamizh Literature: Encourage the creation, dissemination, and appreciation of Thamizh literary works across diverse genres and styles.',
                    'தமிழ் இலக்கியத்தை ஊக்குவித்தல்: பல்வேறு வகைகள் மற்றும் பாணிகளில் தமிழ் இலக்கியப் படைப்புகளின் உருவாக்கம், பரவல் மற்றும் பாராட்டுதலை ஊக்குவித்தல்.'
                  )}
                </li>
                <li>
                  {t(
                    'Preserve Heritage: Uphold the timeless traditions and values of Thamizh language and culture while adapting to contemporary themes and expressions.',
                    'பாரம்பரியத்தைப் பாதுகாத்தல்: சமகால கருப்பொருள்கள் மற்றும் வெளிப்பாடுகளுக்கு ஏற்ப மாறும் அதே வேளையில் தமிழ் மொழி மற்றும் கலாச்சாரத்தின் காலத்தால் அழியாத மரபுகள் மற்றும் மதிப்புகளைப் பேணுதல்.'
                  )}
                </li>
                <li>
                  {t(
                    'Engage Communities: Host workshops, literary events, and collaborations to connect writers, readers, and scholars in a vibrant literary community.',
                    'சமூகங்களை ஈடுபடுத்துதல்: துடிப்பான இலக்கிய சமூகத்தில் எழுத்தாளர்கள், வாசகர்கள் மற்றும் அறிஞர்களை இணைக்க பட்டறைகள், இலக்கிய நிகழ்வுகள் மற்றும் கூட்டுமுயற்சிகளை நடத்துதல்.'
                  )}
                </li>
                <li>
                  {t(
                    'Bridge Generations: Inspire younger generations to embrace Thamizh as a medium of creativity, writing and cultural expression through innovative programs and mentorship opportunities. Be a bridge between Thamizh Writers and North American literary publishers and libraries to bring the Thamizh language into the mainstream in North America.',
                    'தலைமுறைகளை இணைத்தல்: புத்தாக்க திட்டங்கள் மற்றும் வழிகாட்டல் வாய்ப்புகள் மூலம் இளைய தலைமுறையினர் தமிழை படைப்பாற்றல், எழுது மற்றும் கலாச்சார வெளிப்பாட்டின் ஊடகமாக ஏற்றுக்கொள்ள ஊக்குவித்தல். வட அமெரிக்காவில் தமிழ் மொழியை முக்கிய நீரோட்டத்திற்கு கொண்டு வர தமிழ் எழுத்தாளர்களுக்கும் வட அமெரிக்க இலக்கிய பதிப்பகங்கள் மற்றும் நூலகங்களுக்கும் இடையே பாலமாக இருத்தல்.'
                  )}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Organization Section */}
      <section className="space-y-4" id="about-organization">
        <Card>
          <CardHeader>
            <CardTitle>
              {t('About the Organization', 'அமைப்பைப் பற்றி')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('Who We Are', 'நாங்கள் யார்')}
              </h3>
              <p className="text-lg leading-relaxed">
                {t(
                  'NATAWO is a non-profit, non-partisan, and secular organization dedicated to promoting Thamizh literary expression, education, and cultural identity in North America. We aim to provide Thamizh writers with the resources, opportunities, and networks they need to thrive in a global literary environment.',
                  'நடவு என்பது வட அமெரிக்காவில் தமிழ் இலக்கிய வெளிப்பாடு, கல்வி மற்றும் கலாச்சார அடையாளத்தை மேம்படுத்துவதற்காக அர்ப்பணிக்கப்பட்ட இலாப நோக்கற்ற, கட்சி சார்பற்ற மற்றும் மதச்சார்பற்ற அமைப்பாகும். உலகளாவிய இலக்கியச் சூழலில் செழிக்க தமிழ் எழுத்தாளர்கள் சமூகத்தை ஊக்குவித்து, படைப்பாற்றலை வளர்த்து, தமிழ் மொழியை மெருகேற்ற மற்றும் உலகளாவிய அங்கீகாரத்தைப் பெற ஆதரவான தளத்தை வழங்குதல்.'
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('Governance & Leadership', 'ஆட்சி & தலைமை')}
              </h3>
              <p className="text-lg leading-relaxed">
                {t(
                  "NATAWO is led by a dedicated Board of Coordinators, Bylaws Committee and Global Ambassadors composed of Thamizh writers, scholars, educators, and community leaders. The leadership team is responsible for shaping the organization's strategic direction, ensuring financial transparency, and fostering a culture of inclusivity and innovation.",
                  'நடவு அமைப்பானது தமிழ் எழுத்தாளர்கள், அறிஞர்கள், கல்வியாளர்கள் மற்றும் சமூகத் தலைவர்களைக் கொண்ட அர்ப்பணிப்புள்ள ஒருங்கிணைப்பாளர்கள் குழு, விதிமுறைகள் குழு மற்றும் உலகளாவிய தூதுவர்களால் வழிநடத்தப்படுகிறது. அமைப்பின் மூலோபாய திசையை வடிவமைப்பது, நிதி வெளிப்படைத்தன்மையை உறுதி செய்வது மற்றும் உள்ளடக்கம் மற்றும் புத்தாக்கக் கலாச்சாரத்தை வளர்ப்பது தலைமைக் குழுவின் பொறுப்பாகும்.'
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('Core Values', 'அடிப்படை மதிப்புகள்')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h4 className="font-semibold">
                      {t('Creativity', 'படைப்பாற்றல்')}
                    </h4>
                    <p>
                      {t(
                        'Encouraging diverse forms of Thamizh literary expression.',
                        'தமிழ் இலக்கிய வெளிப்பாட்டின் பல்வேறு வடிவங்களை ஊக்குவித்தல்.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="font-semibold">
                      {t('Preservation', 'பாதுகாப்பு')}
                    </h4>
                    <p>
                      {t(
                        'Safeguarding and promoting Thamizh literary heritage.',
                        'தமிழ் இலக்கிய பாரம்பரியத்தைப் பாதுகாத்து மேம்படுத்துதல்.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <h4 className="font-semibold">
                      {t('Collaboration', 'கூட்டுறவு')}
                    </h4>
                    <p>
                      {t(
                        'Partnering with local and international literary organizations.',
                        'உள்ளூர் மற்றும் சர்வதேச இலக்கிய அமைப்புகளுடன் கூட்டு சேர்தல்.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <h4 className="font-semibold">
                      {t('Inclusivity', 'உள்ளடக்கம்')}
                    </h4>
                    <p>
                      {t(
                        'Welcoming Thamizh writers from all backgrounds and experiences.',
                        'அனைத்து பின்னணி மற்றும் அனுபவங்களைக் கொண்ட தமிழ் எழுத்தாளர்களை வரவேற்றல்.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-semibold">
                      {t('Innovation', 'புத்தாக்கம்')}
                    </h4>
                    <p>
                      {t(
                        'Using modern platforms to enhance Thamizh literary engagement.',
                        'தமிழ் இலக்கிய ஈடுபாட்டை மேம்படுத்த நவீன தளங்களைப் பயன்படுத்துதல்.'
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
      <section className="space-y-4" id="history">
        <Card>
          <CardHeader>
            <CardTitle>{t('History', 'வரலாறு')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {t(
                    'A Legacy Rooted in Thamizh Literary Passion',
                    'தமிழ் இலக்கிய ஆர்வத்தில் வேரூன்றிய மரபு'
                  )}
                </h3>
                <p className="text-lg leading-relaxed">
                  {t(
                    'Thamizh literature has thrived for over 2,000 years, evolving through poetry, epics, short stories, and modern storytelling. As Thamizh communities flourished in North America, writers sought a dedicated space to share their work, collaborate, and find publishing opportunities.',
                    'தமிழ் இலக்கியம் 2,000 ஆண்டுகளுக்கும் மேலாக கவிதை, காவியங்கள், சிறுகதைகள் மற்றும் நவீன கதை சொல்லல் வழியாக வளர்ந்து வந்துள்ளது. வட அமெரிக்காவில் தமிழ் சமூகங்கள் செழித்தோங்கியதால், எழுத்தாளர்கள் தங்கள் படைப்புகளைப் பகிர்ந்து கொள்ள, ஒத்துழைக்க மற்றும் பதிப்பிக்கும் வாய்ப்புகளைக் கண்டறிய ஒரு அர்ப்பணிக்கப்பட்ட இடத்தைத் தேடினர்.'
                  )}
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  {t(
                    'Recognizing this need, a group of passionate Thamizh literary enthusiasts founded North America Thamizh Writers Incorporated to provide a structured platform for Thamizh writers. Since its inception, NATAWO has grown into a respected institution, hosting literary events, mentorship programs, and collaborations that celebrate Thamizh storytelling.',
                    'இந்த தேவையை உணர்ந்து, ஆர்வமுள்ள தமிழ் இலக்கிய ஆர்வலர்கள் குழு தமிழ் எழுத்தாளர்களுக்கு ஒரு கட்டமைக்கப்பட்ட தளத்தை வழங்க வட அமெரிக்க தமிழ் எழுத்தாளர்கள் நிறுவனத்தை நிறுவினர். தொடக்கம் முதல், நடவு தமிழ் கதை சொல்லலைக் கொண்டாடும் இலக்கிய நிகழ்வுகள், வழிகாட்டல் திட்டங்கள் மற்றும் கூட்டு முயற்சிகளை நடத்தும் மதிப்புமிக்க நிறுவனமாக வளர்ந்துள்ளது.'
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  {t('Founding Story', 'தொடக்கக் கதை')}
                </h3>
                <h4 className="text-xl font-medium mb-4">
                  {t(
                    'The Birth of NATAWO: Uniting Thamizh Writers Across North America',
                    'நடவு-வின் பிறப்பு: வட அமெரிக்கா முழுவதும் தமிழ் எழுத்தாளர்களை ஒன்றிணைத்தல்'
                  )}
                </h4>
                <p className="text-lg leading-relaxed italic mb-6">
                  {t(
                    'The journey of NATAWO began with a simple yet powerful question:',
                    'நடவு-வின் பயணம் ஒரு எளிமையான ஆனால் சக்திவாய்ந்த கேள்வியுடன் தொடங்கியது:'
                  )}
                </p>
                <blockquote className="border-l-4 border-primary pl-4 mb-6">
                  <p className="text-lg font-medium">
                    {t(
                      '"How can we create a lasting impact on Thamizh literature in North America?"',
                      '"வட அமெரிக்காவில் தமிழ் இலக்கியத்தில் நிலையான தாக்கத்தை எவ்வாறு உருவாக்க முடியும்?"'
                    )}
                  </p>
                </blockquote>
                <p className="text-lg leading-relaxed">
                  {t(
                    'A group of dedicated Thamizh writers, scholars, and educators came together to find the answer. They shared a common vision—to create a community-driven platform that nurtures Thamizh literary talent while promoting the rich heritage of Thamizh literature in a globalized world.',
                    'அர்ப்பணிப்புள்ள தமிழ் எழுத்தாளர்கள், அறிஞர்கள் மற்றும் கல்வியாளர்கள் குழு பதிலைக் கண்டறிய ஒன்றிணைந்தனர். உலகமயமாக்கப்பட்ட உலகில் தமிழ் இலக்கியத்தின் செழுமையான பாரம்பரியத்தை மேம்படுத்தும் அதே வேளையில் தமிழ் இலக்கியத் திறமையை வளர்க்கும் சமூகம் சார்ந்த தளத்தை உருவாக்குவது என்ற பொதுவான பார்வையை அவர்கள் பகிர்ந்து கொண்டனர்.'
                  )}
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  {t(
                    'Through countless discussions, planning sessions, and collaborations, North America Thamizh Writers Incorporated was officially formed as a non-profit literary organization with a commitment to fostering Thamizh creativity.',
                    'எண்ணற்ற விவாதங்கள், திட்டமிடல் அமர்வுகள் மற்றும் கூட்டு முயற்சிகள் மூலம், தமிழ் படைப்பாற்றலை வளர்ப்பதற்கான அர்ப்பணிப்புடன் வட அமெரிக்க தமிழ் எழுத்தாளர்கள் நிறுவனம் அதிகாரப்பூர்வமாக இலாப நோக்கற்ற இலக்கிய அமைப்பாக உருவாக்கப்பட்டது.'
                  )}
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  {t(
                    'Today, NATAWO stands as a pioneering force in Thamizh literary development, bridging generations, cultures, and geographies through literature.',
                    'இன்று, நடவு தமிழ் இலக்கிய வளர்ச்சியில் முன்னோடி சக்தியாக நின்று, இலக்கியம் வழியாக தலைமுறைகள், கலாச்சாரங்கள் மற்றும் புவியியல்களை இணைக்கிறது.'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Leadership Section */}
      <section className="space-y-4">
        <Card id="executive-board">
          <CardHeader>
            <CardTitle>{t('Executive Board', 'நிறைவேற்று குழு')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipTeam.map((leader) => (
                <Card key={leader.name} className="overflow-hidden">
                  <img
                    src={leader.image}
                    alt={t(
                      leader.name,
                      leader.name === 'Manikanda Prabu'
                        ? 'மணிகண்ட பிரபு'
                        : leader.name === 'Ravi Kumar Potu'
                        ? 'ரவி குமார் போடு'
                        : 'டாக்டர் பாலமுருகன் குப்புசாமி'
                    )}
                    className="w-full h-64 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">
                      {t(
                        leader.name,
                        leader.name === 'Manikanda Prabu'
                          ? 'மணிகண்ட பிரபு'
                          : leader.name === 'Ravi Kumar Potu'
                          ? 'ரவி குமார் போடு'
                          : 'டாக்டர் பாலமுருகன் குப்புசாமி'
                      )}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(
                        leader.role,
                        leader.role === 'Networking Coordinator'
                          ? 'இணைப்பு ஒருங்கிணைப்பாளர்'
                          : leader.role === 'Technology Coordinator'
                          ? 'தொழில்நுட்ப ஒருங்கிணைப்பாளர்'
                          : 'முதன்மை ஒருங்கிணைப்பாளர்'
                      )}
                    </p>
                    <p
                      className="mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: t(
                          leader.bio,
                          leader.name === 'Manikanda Prabu'
                            ? 'புகழ்பெற்ற தொழில்முறை மற்றும் சமூக அமைப்பாளரான மணி, வட அமெரிக்கா முழுவதும் எழுத்தாளர்களுக்கும் வாசகர்களுக்கும் இடையே இணைப்புகளை உருவாக்குவதில் கவனம் செலுத்துகிறார்.'
                            : leader.name === 'Ravi Kumar Potu'
                            ? 'சிறந்த தகவல் தொழில்நுட்ப நிபுணரான ரவி, எங்கள் அமைப்பின் அன்றாட தொழில்நுட்ப செயல்பாடுகள் மற்றும் அமைப்பு மேம்பாட்டு முயற்சிகளை நிர்வகிக்கிறார்.'
                            : 'தமிழ் இலக்கியம் மற்றும் கல்வியில் 20 ஆண்டுகளுக்கும் மேலான அனுபவம் கொண்ட டாக்டர் குப்புசாமி, தமிழ் இலக்கிய எழுத்துக்களை மேம்படுத்துவதற்கான எங்கள் அமைப்பின் நோக்கத்தை வழிநடத்துகிறார்.'
                        ),
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card id="founding-members">
          <CardHeader>
            <CardTitle>
              {t('Founding Members', 'நிறுவனர் உறுப்பினர்கள்')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundingMembers.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <img
                    src={member.image}
                    alt={t(member.name, member.name)}
                    className="w-full h-64 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">
                      {t(member.name, member.name)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(member.role, member.role)}
                    </p>
                    <p
                      className="mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: t(member.bio, member.bio),
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card id="global-ambassadors">
          <CardHeader>
            <CardTitle>
              {t('Global Ambassadors - USA', 'உலகத் தூதர்கள் - USA')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalAmbassadors.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <img
                    src={member.image}
                    alt={t(member.name, member.name)}
                    className="w-full h-64 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">
                      {t(member.name, member.name)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(member.role, member.role)}
                    </p>
                    <p
                      className="mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: t(member.bio, member.bio),
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {t('Global Ambassadors - Canada', 'உலகத் தூதர்கள் - Canada')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalAmbassadorsCanada.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <img
                    src={member.image}
                    alt={t(member.name, member.name)}
                    className="w-full h-64 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">
                      {t(member.name, member.name)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(member.role, member.role)}
                    </p>
                    <p
                      className="mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: t(member.bio, member.bio),
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {t('Global Ambassadors - Mexico', 'உலகத் தூதர்கள் - Mexico')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalAmbassadorsMexico.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <img
                    src={member.image}
                    alt={t(member.name, member.name)}
                    className="w-full h-64 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">
                      {t(member.name, member.name)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(member.role, member.role)}
                    </p>
                    <p
                      className="mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: t(member.bio, member.bio),
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {t(
                'Global Ambassadors - Others Countries',
                'உலகத் தூதர்கள் - Others Countries'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {globalAmbassadorsOtherCountries.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <img
                    src={member.image}
                    alt={t(member.name, member.name)}
                    className="w-full h-64 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-xl">
                      {t(member.name, member.name)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(member.role, member.role)}
                    </p>
                    <p
                      className="mt-2 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: t(member.bio, member.bio),
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Membership Section */}
      <section className="space-y-4" id="membership">
        <Card>
          <CardHeader>
            <CardTitle>{t('Membership', 'உறுப்பினர்')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* For Writers */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">
                  {t('For Writers', 'எழுத்தாளர்களுக்கு')}
                </h3>

                <div className="space-y-4">
                  <p className="text-lg">
                    {t(
                      'NATAWO consists of four Levels of memberships:',
                      'நடவு நான்கு வகையான உறுப்பினர் நிலைகளைக் கொண்டுள்ளது:'
                    )}
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>{t('Literary Experts', 'இலக்கிய வல்லுநர்கள்')}</li>
                    <li>{t('Aspiring Writers', 'ஆர்வமுள்ள எழுத்தாளர்கள்')}</li>
                    <li>{t('NATAWO Volunteers', 'நடவு தன்னார்வலர்கள்')}</li>
                    <li>
                      {t(
                        'NATAWO Students Writers',
                        'நடவு மாணவர் எழுத்தாளர்கள்'
                      )}
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">
                    {t(
                      'Join the NATAWO Literary Community!',
                      'நடவு இலக்கிய சமூகத்தில் இணையுங்கள்!'
                    )}
                  </h4>
                  <p className="text-lg">
                    {t(
                      'By becoming a NATAWO Member, you gain access to:',
                      'நடவு உறுப்பினராவதன் மூலம், நீங்கள் பின்வரும் வசதிகளைப் பெறலாம்:'
                    )}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <Check className="text-green-600 mt-1" />
                      {t(
                        'Exclusive literary workshops and mentorship programs.',
                        'தனித்துவமான இலக்கிய பட்டறைகள் மற்றும் வழிகாட்டல் திட்டங்கள்.'
                      )}
                    </li>
                    <li className="flex gap-2">
                      <Check className="text-green-600 mt-1" />
                      {t(
                        'Opportunities to publish your work.',
                        'உங்கள் படைப்புகளை வெளியிடும் வாய்ப்புகள்.'
                      )}
                    </li>
                    <li className="flex gap-2">
                      <Check className="text-green-600 mt-1" />
                      {t(
                        'Write your blogs to publish in the our website.',
                        'எங்கள் வலைத்தளத்தில் வெளியிட உங்கள் வலைப்பதிவுகளை எழுதுங்கள்.'
                      )}
                    </li>
                    <li className="flex gap-2">
                      <Check className="text-green-600 mt-1" />
                      {t(
                        'Invitations to Thamizh literary events, festivals, and competitions.',
                        'தமிழ் இலக்கிய நிகழ்வுகள், விழாக்கள் மற்றும் போட்டிகளுக்கான அழைப்புகள்.'
                      )}
                    </li>
                    <li className="flex gap-2">
                      <Check className="text-green-600 mt-1" />
                      {t(
                        'Networking with Thamizh writers, publishers, and scholars.',
                        'தமிழ் எழுத்தாளர்கள், பதிப்பகங்கள் மற்றும் அறிஞர்களுடன் நெட்வொர்க்கிங்.'
                      )}
                    </li>
                    <li className="flex gap-2">
                      <Check className="text-green-600 mt-1" />
                      {t(
                        'Resources and tools to enhance your writing skills.',
                        'உங்கள் எழுத்துத் திறனை மேம்படுத்த வளங்கள் மற்றும் கருவிகள்.'
                      )}
                    </li>
                  </ul>
                </div>
              </div>

              {/* For Readers */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">
                  {t('For Readers', 'வாசகர்களுக்கு')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <Check className="text-green-600 mt-1" />
                    {t(
                      'Access to our digital library',
                      'எங்கள் டிஜிட்டல் நூலகத்திற்கான அணுகல்'
                    )}
                  </li>
                  <li className="flex gap-2">
                    <Check className="text-green-600 mt-1" />
                    {t(
                      'Invitations to book launches and readings',
                      'புத்தக வெளியீடுகள் மற்றும் வாசிப்பு நிகழ்வுகளுக்கான அழைப்புகள்'
                    )}
                  </li>
                  <li className="flex gap-2">
                    <Check className="text-green-600 mt-1" />
                    {t(
                      'Quarterly newsletter with literary updates',
                      'இலக்கிய புதுப்பிப்புகளுடன் காலாண்டு செய்திமடல்'
                    )}
                  </li>
                  <li className="flex gap-2">
                    <Check className="text-green-600 mt-1" />
                    {t(
                      'Discounted tickets to events',
                      'நிகழ்வுகளுக்கான தள்ளுபடி டிக்கெட்டுகள்'
                    )}
                  </li>
                  <li className="flex gap-2">
                    <Check className="text-green-600 mt-1" />
                    {t('Book club membership', 'புத்தக குழு உறுப்பினர்')}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bylaws Section */}
      <section className="space-y-4" id="bylaws">
        <Card>
          <CardHeader>
            <CardTitle>{t('Bylaws', 'விதிமுறைகள்')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              {t(
                "Our bylaws outline the rules and regulations that govern NATAWO's operations, including membership criteria, election procedures, and organizational structure.",
                'எங்கள் விதிமுறைகள் நடவு-வின் செயல்பாடுகளை நிர்வகிக்கும் விதிகள் மற்றும் ஒழுங்குமுறைகளை வரையறுக்கின்றன, இதில் உறுப்பினர் தகுதி, தேர்தல் நடைமுறைகள் மற்றும் அமைப்பு கட்டமைப்பு ஆகியவை அடங்கும்.'
              )}
            </p>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleDownloadBylaws}
                className="flex items-center gap-2"
              >
                <Download size={20} />
                {t('Download NATAWO Bylaws', 'நடவு விதிமுறைகளைப் பதிவிறக்குக')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
