import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { LessonView } from './LessonView';

export function LessonPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();

  const { data: bundle } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => contentRepo.getLessonBundle(lessonId!),
    enabled: !!lessonId,
  });

  if (!bundle) {
    return <div className="p-6 text-muted-foreground">{t('lesson.loading')}</div>;
  }

  return <LessonView bundle={bundle} onFinish={() => navigate('/tracks')} />;
}
