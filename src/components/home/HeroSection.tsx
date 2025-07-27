import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export function HeroSection() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <img
              src="/lovable-uploads/logo.png"
              alt="NATAWO Logo"
              className="h-64 w-64 object-contain animate-in fade-in zoom-in duration-700"
            />
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-in fade-in slide-in duration-1000">
              {t(
                'Celebrate Thamizh Literature Across North America',
                'வட அமெரிக்காவில் தமிழ் இலக்கியத்தைக் கொண்டாடுங்கள்'
              )}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl animate-in fade-in slide-in duration-1000 delay-200">
              {t(
                'Join our vibrant community of writers and readers celebrating Thamizh literary excellence. By Writers, For Writers, Of Writers, A Thamizh Platform! NATAWO',
                'தமிழ் இலக்கிய சிறப்பை கொண்டாடும் எழுத்தாளர்கள் மற்றும் வாசகர்களின் துடிப்பான சமூகத்தில் இணையுங்கள். எழுத்தாளர்களால், எழுத்தாளர்களுக்காக, எழுத்தாளர்களின், ஒரு தமிழ் தளம்! நடவு'
              )}
            </p>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in duration-1000 delay-300">
              {!isLoggedIn && (
                <Button
                  size="lg"
                  className="group"
                  onClick={() => navigate('/auth')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {t('Join Us', 'எங்களுடன் இணையுங்கள்')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/search-writers')}
              >
                {t('Discover Writers', 'எழுத்தாளர்களைக் கண்டறியுங்கள்')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/events')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {t('Upcoming Events', 'வரவிருக்கும் நிகழ்வுகள்')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
