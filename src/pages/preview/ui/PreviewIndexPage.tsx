import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { previewContentRepo } from '@/features/preview/model/previewContent';
import { localize } from '@/shared/lib/localize';

export function PreviewIndexPage() {
  const { t } = useTranslation();
  const lessons = previewContentRepo.list();

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-3 text-lg font-semibold">{t('preview.title')}</h1>
      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('preview.empty')}</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-3">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                to={`/preview/lessons/${lesson.id}`}
                className="flex items-center justify-between text-sm rounded-lg border p-3.5 transition hover:bg-accent"
              >
                <div className="flex flex-col gap-1 max-w-[90%]">
                  <span className="font-medium">{localize(lesson.title)}</span>
                  <span className="text-muted-foreground">{localize(lesson.context)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
