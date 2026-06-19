import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{t('home.greeting')}</h1>
      <p className="mt-1 text-muted-foreground">{t('home.subtitle')}</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          to="/tracks"
          className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-accent"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-medium">{t('nav.tracks')}</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-accent"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-medium">{t('nav.profile')}</span>
        </Link>
      </div>
    </div>
  );
}
