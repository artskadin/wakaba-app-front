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
        <ul className="space-y-1">
          {lessons.map((l) => (
            <li key={l.id}>
              <Link to={`/preview/lessons/${l.id}`} className="text-primary hover:underline">
                {localize(l.title)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
