import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { contentRepo } from '@/shared/api/contentRepo';
import { localize } from '@/shared/lib/localize';
import type { ResolvedToken } from '@/entities/content';
import { Button } from '@/components/ui/button';
import { TokenDetailDrawer } from './TokenDetailDrawer';
import { StepView } from './StepView';

export function LessonPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { data: bundle } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => contentRepo.getLessonBundle(lessonId!),
    enabled: !!lessonId,
  });
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedToken, setSelectedToken] = useState<ResolvedToken | null>(null);

  if (!bundle) {
    return <div className="p-6 text-muted-foreground">{t('lesson.loading')}</div>;
  }

  const steps = bundle.lesson.steps;
  const step = steps[stepIdx];
  const progress = ((stepIdx + 1) / steps.length) * 100;
  const isLastStep = stepIdx === steps.length - 1;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col p-4">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{localize(bundle.lesson.title)}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded bg-muted">
          <div
            className="h-full rounded bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        <StepView key={stepIdx} bundle={bundle} step={step} onTokenClick={setSelectedToken} />
      </div>

      <div className="mt-4 flex gap-3">
        <Button variant="outline" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)}>
          {t('lesson.back')}
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            if (isLastStep) {
              navigate('/tracks');
            } else {
              setStepIdx((prev) => prev + 1);
            }
          }}
        >
          {isLastStep ? t('lesson.finish') : t('lesson.next')}
        </Button>
      </div>

      <TokenDetailDrawer
        resolvedToken={selectedToken}
        bundle={bundle}
        onClose={() => setSelectedToken(null)}
      />
    </div>
  );
}
