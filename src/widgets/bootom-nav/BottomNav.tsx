import { NavLink } from 'react-router';
import { BookOpen, Home, Star, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const items = [
  { to: '/', icon: Home, key: 'nav.home', end: true },
  { to: '/tracks', icon: BookOpen, key: 'nav.tracks', end: false },
  { to: '/favourites', icon: Star, key: 'nav.favourites', end: false },
  { to: '/profile', icon: User, key: 'nav.profile', end: false },
];

export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-md justify-around border-t bg-background py-2">
      {items.map(({ to, icon: Icon, key, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'} hover:text-primary/90`
          }
        >
          <Icon className="h-5 w-5" />
          {t(key)}
        </NavLink>
      ))}
    </nav>
  );
}
