import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export function TracksPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2x1 font-semibold">{t('tracks.title')}</h1>
      <Link to="/login" className="text-primary underline">
        ← к входу
      </Link>
    </div>
  );
}
