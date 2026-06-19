import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { localize } from '@/shared/lib/localize';
import { progressRepo } from '@/shared/api/progressRepo';

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
    return <div className="p-6 text-muted-foreground">{t('lesson.loading')}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2x1 font-semibold">{localize(track.title)}</h1>
      <p className="mt-1 text-muted-foreground">{localize(track.description)}</p>
      <ul className="mt-6 flex flex-col gap-3">
        {track.lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              to={`/lesson/${lesson.id}`}
              className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-accent"
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
