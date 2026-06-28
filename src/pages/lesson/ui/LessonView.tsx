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
import type { Theme, Voice } from '@/entities/settings';
import { useVoiceStore } from '@/features/voice';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft } from 'lucide-react';

interface LessonViewProps {
  bundle: LessonBundle;
  initialVoice?: Voice;
  onFinish: () => void;
  onExit: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
}

export function LessonView({
  bundle,
  initialVoice = 'm',
  onFinish,
  onExit,
  theme,
  onThemeChange,
}: LessonViewProps) {
  const { t } = useTranslation();
  const { progress: progressRepo } = useRepos();
  const queryClient = useQueryClient();

  const voice = useVoiceStore((s) => s.voice);
  const setVoice = useVoiceStore((s) => s.setVoice);

  const [stepIdx, setStepIdx] = useState(0);
  const [selectedToken, setSelectedToken] = useState<ResolvedToken | null>(null);
  const [solvedSteps, setSolvedSteps] = useState<Set<number>>(new Set());

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
  const isLastStep = stepIdx === steps.length - 1;
  const requiresCompletion = step.kind === 'assemble';
  const canAdvance = !requiresCompletion || solvedSteps.has(stepIdx);

  function handleStepSolvedChange(solved: boolean) {
    setSolvedSteps((prev) => {
      if (prev.has(stepIdx) === solved) {
        return prev;
      }

      const next = new Set(prev);
      if (solved) {
        next.add(stepIdx);
      } else {
        next.delete(stepIdx);
      }

      return next;
    });
  }

  function goToStep(index: number) {
    setStepIdx(index);
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
    <div data-component="lesson-view" className="mx-auto flex h-dvh max-w-md flex-col p-4">
      <AlertDialog>
        <AlertDialogTrigger asChild className="mb-3">
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={t('lesson.exit')}
            className="cursor-pointer"
          >
            <ArrowLeft />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('lesson.exitTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('lesson.exitDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              {t('lesson.exitCancel')}
            </AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer" onClick={onExit}>
              {t('lesson.exitConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col gap-2 mb-2">
        <div className="mt-2 flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < stepIdx ? 'bg-primary' : i === stepIdx ? 'bg-primary/40' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-medium text-heading">{localize(bundle.lesson.title)}</h2>
          <div className="flex items-center gap-2">
            <ThemeToggle value={theme} onChange={onThemeChange} />
            <VoiceToggle value={voice} onChange={setVoice} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <StepView
          key={stepIdx}
          bundle={bundle}
          step={step}
          solved={solvedSteps.has(stepIdx)}
          onTokenClick={setSelectedToken}
          onStepSolvedChange={handleStepSolvedChange}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          className="cursor-pointer"
          variant="outline"
          disabled={stepIdx === 0}
          onClick={() => goToStep(stepIdx - 1)}
        >
          {t('lesson.back')}
        </Button>
        <Button
          className="cursor-pointer flex-1"
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
