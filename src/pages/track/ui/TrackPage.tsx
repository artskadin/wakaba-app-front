import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Check, InfoIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { contentRepo } from '@/shared/api/contentRepo';
import { localize } from '@/shared/lib/localize';
import { progressRepo } from '@/shared/api/progressRepo';
import { PageHeader } from '@/shared/ui/PageHeader';

export function TrackPage() {
  const { t } = useTranslation();
  const { trackId } = useParams<{ trackId: string }>();
  const { data: tracks } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => contentRepo.getTracks(),
  });
  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressRepo.getAll(),
  });

  const track = tracks?.find((item) => item.id === trackId);
  const completedIds = new Set(
    (progress ?? []).filter((item) => item.status === 'completed').map((item) => item.lessonId),
  );

  if (!track) {
    return (
      <div data-component="track-page" className="p-6 text-muted-foreground">
        {t('lesson.loading')}
      </div>
    );
  }

  return (
    <div data-component="track-page" className="p-6">
      <PageHeader>
        <h1 className="text-lg font-semibold text-heading">
          {t('track.title')} «{localize(track.title)}»
        </h1>
      </PageHeader>

      <p className="text-base text-muted-foreground">{localize(track.description)}</p>

      <Alert className="mt-4">
        <InfoIcon />
        <AlertDescription>{t('track.recomendation')}</AlertDescription>
      </Alert>

      <p className="mt-5 text-sm text-muted-foreground uppercase">{t('track.list')}</p>

      <ul className="mt-2 flex flex-col gap-3">
        {track.lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              to={`/lesson/${lesson.id}`}
              className="flex items-center justify-between text-sm rounded-lg border p-4 transition hover:bg-accent"
            >
              <span className="font-medium">{localize(lesson.title)}</span>
              {completedIds.has(lesson.id) && <Check className="h-5 w-5 text-primary" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
