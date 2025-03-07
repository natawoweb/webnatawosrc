import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/hooks/useSession';

export const NavLinks = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { isAdmin, isWriter } = useSession();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {isAdmin && (
        <Link
          to="/admin"
          className={cn(
            'px-4 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors',
            isActiveLink('/admin') && 'bg-accent'
          )}
        >
          {t('Admin Dashboard', 'நிர்வாக டாஷ்போர்டு')}
        </Link>
      )}
      {isWriter && !isAdmin && (
        <Link
          to="/dashboard"
          className={cn(
            'px-4 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors',
            isActiveLink('/dashboard') && 'bg-accent'
          )}
        >
          {t('Writer Dashboard', 'எழுத்தாளர் டாஷ்போர்டு')}
        </Link>
      )}
      <Link
        to="/search-writers"
        className={cn(
          'px-4 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/search-writers') && 'bg-accent'
        )}
      >
        {t('Writers', 'எழுத்தாளர்கள்')}
      </Link>

      <Link
        to="/contact"
        className={cn(
          'px-4 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/contact') && 'bg-accent'
        )}
      >
        {t('Contact Us', 'எங்களை தொடர்பு கொள்ள')}
      </Link>

      <Link
        to="/about"
        className={cn(
          'px-4 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/about') && 'bg-accent'
        )}
      >
        {t('About Us', 'எங்களைப் பற்றி')}
      </Link>

      <Link
        to="/blogs"
        className={cn(
          'px-4 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/blogs') && 'bg-accent'
        )}
      >
        {t('Blogs', 'வலைப்பதிவுகள்')}
      </Link>
      <Link
        to="/events"
        className={cn(
          'px-4 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/events') && 'bg-accent'
        )}
      >
        {t('Events', 'நிகழ்வுகள்')}
      </Link>
    </>
  );
};
