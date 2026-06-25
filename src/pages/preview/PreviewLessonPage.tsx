import { useTranslation } from 'react-i18next';
import { previewContentRepo } from '@/features/preview/model/previewContent';
import { usePreviewRepos } from '@/features/preview/model/previewRepos';
import { validateBundle } from '@/features/preview/model/validateBundle';
import { RepoProvider } from '@/shared/api/RepoProvider';
import { useNavigate, useParams } from 'react-router';
import { LessonView } from '../lesson/ui/LessonView';

export function PreviewLessonPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const repos = usePreviewRepos();

  const bundle = previewContentRepo.getLessonBundle(lessonId!);
  const problems = validateBundle(bundle);

  return (
    <RepoProvider repos={repos}>
      {problems.length > 0 && (
        <div className="m-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3">
          <p className="text-sm font-semibold text-destructive">
            {t('preview.integrityProblems', { count: problems.length })}
          </p>
          <ul className="mt-1 list-disc pl-5 text-sm text-destructive">
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
      <LessonView bundle={bundle} onFinish={() => navigate('/preview')} />
    </RepoProvider>
  );
}
