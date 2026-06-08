import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2x1 font-semibold">{t('login.title')}</h1>
      <Link to="/tracks" className="text-primary underline">
        к трекам →
      </Link>
    </div>
  );
}
