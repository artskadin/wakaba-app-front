import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { localize } from '@/shared/lib/localize';
import type { LessonBundle, ResolvedToken } from '@/entities/content';
import { Button } from '@/components/ui/button';
import { useRepos } from '@/shared/api/repos';
import { StepView } from './StepView';
import { TokenDetailDrawer } from '@/widgets/token-detail';
import { ThemeToggle, VoiceToggle } from '@/shared/ui';
import type { Theme, Voice } from '@/entities/settings';
import { useVoiceStore } from '@/features/voice';
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

  const [showFinish, setShowFinish] = useState(false);

  const selectedNote = selectedToken?.token.grammarNoteId
    ? (bundle?.grammarNotes[selectedToken.token.grammarNoteId] ?? null)
    : null;

  const saveProgress = useMutation({
    mutationFn: (input: { currentStep: number; status: 'completed' }) =>
      progressRepo.save(bundle.lesson.id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress'] }),
  });

  const sentencesCount = Object.values(bundle.sentences).length;
  const steps = bundle.lesson.steps;
  const step = steps[stepIdx];
  const isLastStep = stepIdx === steps.length - 1;
  const requiresCompletion =
    step.kind === 'assemble' || step.kind === 'speak' || step.kind === 'dialog';
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
    setShowFinish(true);
  }

  function confirmFinish() {
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
            aria-label={t('lesson.exitBlock.exit')}
            className="cursor-pointer"
          >
            <ArrowLeft />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('lesson.exitBlock.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('lesson.exitBlock.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              {t('lesson.exitBlock.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer" onClick={onExit}>
              {t('lesson.exitBlock.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showFinish} onOpenChange={setShowFinish}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('lesson.finishBlock.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('lesson.finishBlock.description')}</AlertDialogDescription>
          </AlertDialogHeader>

          {/* место под полезную статистику — пока то, что реально есть */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <span className="max-w-[80%] text-sm text-muted-foreground">
                {t('lesson.finishBlock.sentencesCount')}
              </span>
              <span className="text-sm text-primary">{sentencesCount}</span>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              {t('lesson.finishBlock.stay')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmFinish}
              disabled={saveProgress.isPending}
              className="cursor-pointer"
            >
              {t('lesson.finishBlock.exit')}
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
