import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { localize } from '@/shared/lib/localize';
import { progressRepo } from '@/shared/api/progressRepo';
import { PageHeader } from '@/shared/ui';

export function TracksPage() {
  const { t } = useTranslation();
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
    <div data-component="tracks-page" className="mx-auto max-w-2xl p-6">
      <PageHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-heading">{t('tracks.title')}</h1>
        </div>
      </PageHeader>

      {isPending && <p className="text-muted-foreground">{t('tracks.title')}...</p>}

      <ul className="flex flex-col gap-3">
        {tracks?.map((track) => {
          const done = track.lessons.filter((lesson) => completedIds.has(lesson.id)).length;
          const total = track.lessons.length;

          return (
            <li key={track.id}>
              <Link
                to={`/tracks/${track.id}`}
                className="flex flex-col gap-1 text-sm rounded-lg border p-3.5 transition hover:bg-accent"
              >
                <div className="font-medium">{localize(track.title)}</div>
                <div className="text-sm text-muted-foreground">{localize(track.description)}</div>
                <div
                  className={`mt-1 text-xs ${done === total ? 'text-primary' : 'text-accent-foreground'}`}
                >
                  {t('tracks.progress', { done, total })}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
