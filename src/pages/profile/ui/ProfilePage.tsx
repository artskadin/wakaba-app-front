import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { authRepo, useAuthStore } from '@/features/auth';
import { progressRepo } from '@/shared/api/progressRepo';
import { useQuery } from '@tanstack/react-query';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressRepo.getAll(),
  });
  const completedCount = (progress ?? []).filter((item) => item.status === 'completed').length;

  async function handleLogout() {
    await authRepo.logout();
    setUser(null);
  }

  if (!user) {
    return <div className="p-6">Загрузка информации о пользователе...</div>;
  }

  return (
    <div className="p-6">
      <h1 className=" text-2xl fotfont-semibold">{t('nav.profile')}</h1>
      <div className="mt-6 flex flex-col gap-3 rounded-xl border p-4">
        <Row label={t('profile.email')} value={user.email} />
        <Row
          label={t('profile.registered')}
          value={new Date(user.createdAt).toLocaleDateString()}
        />
        <Row label={t('profile.completed')} value={String(completedCount)} />
      </div>
      <Button variant="outline" className="mt-6 w-full" onClick={handleLogout}>
        {t('tracks.logout')}
      </Button>
    </div>
  );
}
