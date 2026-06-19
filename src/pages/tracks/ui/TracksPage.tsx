import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { localize } from '@/shared/lib/localize';
import { progressRepo } from '@/shared/api/progressRepo';

export function TracksPage() {
  const { t } = useTranslation();
  const setUser = useAuthStore((s) => s.setUser);
  const { data: tracks, isPending } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => contentRepo.getTracks(),
  });
  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressRepo.getAll(),
  });

  const completedIds = new Set(
    (progress ?? []).filter((item) => item.status === 'completed').map((item) => item.lessonId),
  );

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
        {tracks?.map((track) => {
          const done = track.lessons.filter((lesson) => completedIds.has(lesson.id)).length;

          return (
            <li key={track.id}>
              <Link
                to={`/tracks/${track.id}`}
                className="block rounded-xl border p-4 transition hover:bg-accent"
              >
                <div className="font-medium">{localize(track.title)}</div>
                <div className="text-sm text-muted-foreground">{localize(track.description)}</div>
                <div className="mt-1 text-xs text-primary">
                  {t('tracks.progress', { done, total: track.lessons.length })}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
