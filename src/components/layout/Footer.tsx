import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Instagram, X, Youtube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (!email) {
      toast({
        title: 'error',
        description: 'Please enter a valid email.',
      });
      return;
    }

    // 🔍 Check if the email already exists in the database
    const { data: existingEmails, error: fetchError } = await supabase
      .from('subscribe')
      .select('email') // Selecting only email column
      .eq('email', email) // Filtering by email
      .limit(1); // We only need to check if one record exists

    if (fetchError) {
      toast({
        title: 'error',
        description: 'Error checking existing email: ' + fetchError.message,
      });
      return;
    }

    // 🚨 If email already exists, show an error
    if (existingEmails.length > 0) {
      toast({
        title: '⚠ Warning:',
        description:
          'This email is already subscribed. If you’re not receiving our emails, check your spam folder or contact support.!',
        className: 'bg-yellow-300 text-black',
      });
      return;
    }

    // ✅ If email does not exist, insert it into Supabase
    const { error: insertError } = await supabase
      .from('subscribe')
      .insert([{ email }]);

    if (insertError) {
      toast({
        title: 'error',
        description: insertError.message,
      });
    } else {
      await fetch('https://formspree.io/f/xeoaezww', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      toast({
        title: 'success',
        description: t(
          'Thank you for subscribing to our newsletter!',
          'எங்கள் செய்திமடலுக்கு பதிவு செய்தமைக்கு நன்றி!'
        ),
      });

      e.currentTarget.reset(); // Reset the form after successful submission
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="flex items-center justify-start">
            <img
              src="/lovable-uploads/logo.png"
              alt="NATAWO Logo"
              className="h-40 w-40 object-contain"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('Quick Links', 'விரைவு இணைப்புகள்')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('About Us', 'எங்களைப் பற்றி')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Contact Us', 'எங்களை தொடர்பு கொள்ள')}
                </Link>
              </li>
              <li>
                <Link
                  to="/search-writers"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Writers Directory', 'எழுத்தாளர்கள் அடைவு')}
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Events', 'நிகழ்வுகள்')}
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Blogs', 'வலைப்பதிவுகள்')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('Community', 'சமூகம்')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/forums"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Forums', 'கலந்துரையாடல்கள்')}
                </Link>
              </li>
              <li>
                <Link
                  to="/workshops"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Writing Workshops', 'எழுத்துப் பயிலரங்குகள்')}
                </Link>
              </li>
              <li>
                <Link
                  to="/mentorship"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Mentorship Program', 'வழிகாட்டல் திட்டம்')}
                </Link>
              </li>
              <li>
                <Link
                  to="/book-clubs"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Book Clubs', 'நூல் வட்டங்கள்')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t('Legal', 'சட்டம்')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Privacy Policy', 'தனியுரிமைக் கொள்கை')}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Terms of Use', 'பயன்பாட்டு விதிமுறைகள்')}
                </Link>
              </li>
              <li>
                <Link
                  to="/guidelines"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('Guidelines', 'வழிகாட்டுதல்கள்')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t('Stay Connected', 'தொடர்பில் இருங்கள்')}
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder={t(
                  'Enter your email',
                  'உங்கள் மின்னஞ்சலை உள்ளிடவும்'
                )}
                required
                className="w-full"
              />
              <Button type="submit" className="w-full">
                {t('Subscribe', 'குழு சேர')}
              </Button>
            </form>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61573118737447"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/NATAWOrg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </a>
              <a
                href="https://www.instagram.com/natawo_tamil/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@NorthAmericaTamilWriters"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground text-center">
            <p>
              © {new Date().getFullYear()} NATAWO.{' '}
              {t(
                'All rights reserved.',
                'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
