import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { localize } from '@/shared/lib/localize';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { data: bundle } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => contentRepo.getLessonBundle(lessonId!),
    enabled: !!lessonId,
  });

  if (!bundle) {
    return <div className="p-6 text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{localize(bundle.lesson.title)}</h1>
      <p className="text-muted-foreground">{localize(bundle.lesson.context)}</p>
      <p className="mt-4 text-sm">Шагов: {bundle.lesson.steps.length}</p>
    </div>
  );
}
