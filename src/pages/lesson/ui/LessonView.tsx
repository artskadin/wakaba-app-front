import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { localize } from '@/shared/lib/localize';
import type { LessonBundle, ResolvedToken } from '@/entities/content';
import { Button } from '@/components/ui/button';
import { useRepos } from '@/shared/api/repos';
import { StepView } from './StepView';
import { TokenDetailDrawer } from '@/widgets/token-detail';
import { VoiceToggle } from '@/shared/ui/VoiceToggle';
import type { Voice } from '@/entities/settings';
import { useVoiceStore } from '@/features/voice/model/voiceStore';

interface LessonViewProps {
  bundle: LessonBundle;
  initialVoice?: Voice;
  onFinish: () => void;
}

export function LessonView({ bundle, initialVoice = 'm', onFinish }: LessonViewProps) {
  const { t } = useTranslation();
  const { progress: progressRepo } = useRepos();
  const queryClient = useQueryClient();

  const voice = useVoiceStore((s) => s.voice);
  const setVoice = useVoiceStore((s) => s.setVoice);

  const [stepIdx, setStepIdx] = useState(0);
  const [selectedToken, setSelectedToken] = useState<ResolvedToken | null>(null);
  const [stepSolved, setStepSolved] = useState(false);

  const selectedNote = selectedToken?.token.grammarNoteId
    ? (bundle?.grammarNotes[selectedToken.token.grammarNoteId] ?? null)
    : null;

  const saveProgress = useMutation({
    mutationFn: (input: { currentStep: number; status: 'completed' }) =>
      progressRepo.save(bundle.lesson.id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress'] }),
  });

  const steps = bundle.lesson.steps;
  const step = steps[stepIdx];
  const progress = ((stepIdx + 1) / steps.length) * 100;
  const isLastStep = stepIdx === steps.length - 1;
  const requiresCompletion = step.kind === 'assemble';
  const canAdvance = !requiresCompletion || stepSolved;

  function goToStep(index: number) {
    setStepIdx(index);
    setStepSolved(false);
  }

  function handleNext() {
    if (!isLastStep) {
      goToStep(stepIdx + 1);
      return;
    }

    saveProgress.mutate({ currentStep: stepIdx, status: 'completed' }, { onSuccess: onFinish });
  }

  useEffect(() => {
    setVoice(initialVoice);
  }, [initialVoice, setVoice]);

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col p-4">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{localize(bundle.lesson.title)}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded bg-muted">
          <div
            className="h-full rounded bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{localize(bundle.lesson.title)}</p>
          <VoiceToggle value={voice} onChange={setVoice} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <StepView
          key={stepIdx}
          bundle={bundle}
          step={step}
          onTokenClick={setSelectedToken}
          onStepSolvedChange={setStepSolved}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <Button variant="outline" disabled={stepIdx === 0} onClick={() => goToStep(stepIdx - 1)}>
          {t('lesson.back')}
        </Button>
        <Button
          className="flex-1"
          disabled={!canAdvance || saveProgress.isPending}
          onClick={handleNext}
        >
          {isLastStep ? t('lesson.finish') : t('lesson.next')}
        </Button>
      </div>

      <TokenDetailDrawer
        open={!!selectedToken}
        token={selectedToken?.token ?? null}
        note={selectedNote}
        onClose={() => setSelectedToken(null)}
      />
    </div>
  );
}
