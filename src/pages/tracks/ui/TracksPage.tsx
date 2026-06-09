import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/components/ui/button';

export function TracksPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2x1 font-semibold">{t('tracks.title')}</h1>
        <Button variant="outline" onClick={() => setUser(null)}>
          {t('tracks.logout')}
        </Button>
      </div>
      <p className="text-muted-foreground">{user?.email}</p>
    </div>
  );
}
