import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/hooks/useSession';
import { useState } from 'react';

export const NavLinks = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { isAdmin, isWriter } = useSession();
  const [open, setOpen] = useState(false);

  const sections = [
    { name: 'Our Mission', id: 'our-mission' },
    { name: 'About Organization', id: 'about-organization' },
    { name: 'History', id: 'history' },
    { name: 'Executive Board', id: 'executive-board' },
    { name: 'Founding Members', id: 'founding-members' },
    { name: 'Global Ambassadors', id: 'global-ambassadors' },
    { name: 'Membership', id: 'membership' },
    { name: 'Bylaws', id: 'bylaws' },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {isAdmin && (
        <Link
          to="/admin"
          className={cn(
            'px-2 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors',
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
            'px-2 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors',
            isActiveLink('/dashboard') && 'bg-accent'
          )}
        >
          {t('Writer Dashboard', 'எழுத்தாளர் டாஷ்போர்டு')}
        </Link>
      )}
      <Link
        to="/search-writers"
        className={cn(
          'px-2 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/search-writers') && 'bg-accent'
        )}
      >
        {t('Writers', 'எழுத்தாளர்கள்')}
      </Link>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="px-2 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
        >
          {t('About Us', 'எங்களைப் பற்றி')}
        </button>

        {open && (
          <div className="absolute left-0 mt-2 w-48 transition-colors shadow-lg rounded-md">
            {sections.map((section) => (
              <Link
                key={section.id}
                to={`/about#${section.id}`}
                className="block px-4 py-2 text-sm hover:bg-gray-400"
                onClick={() => setOpen(false)}
              >
                {section.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* <Link
        to="/about"
        className={cn(
          'px-2 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/about') && 'bg-accent'
        )}
      >
        {t('About Us', 'எங்களைப் பற்றி')}
      </Link> */}

      <Link
        to="/blogs"
        className={cn(
          'px-2 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/blogs') && 'bg-accent'
        )}
      >
        {t('Blogs', 'வலைப்பதிவுகள்')}
      </Link>
      <Link
        to="/events"
        className={cn(
          'px-2 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors',
          isActiveLink('/events') && 'bg-accent'
        )}
      >
        {t('Events', 'நிகழ்வுகள்')}
      </Link>
    </>
  );
};
