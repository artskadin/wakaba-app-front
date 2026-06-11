import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { localize } from '@/shared/lib/localize';

export function TracksPage() {
  const { t } = useTranslation();
  const setUser = useAuthStore((s) => s.setUser);
  const { data: tracks, isPending } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => contentRepo.getTracks(),
  });

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2x1 font-semibold">{t('tracks.title')}</h1>
        <Button variant="outline" onClick={() => setUser(null)}>
          {t('tracks.logout')}
        </Button>
      </div>

      {isPending && <p className="text-muted-foreground">{t('tracks.title')}...</p>}

      <ul className="flex flex-col gap-3">
        {tracks?.map((track) => (
          <li key={track.id}>
            <Link
              to={`/lesson/${track.lessons[0].id}`}
              className="block rounded-xl border p-4 transition hover:bg-accent"
            >
              <div className="font-medium">{localize(track.title)}</div>
              <div className="text-sm text-muted-foreground">{localize(track.description)}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
