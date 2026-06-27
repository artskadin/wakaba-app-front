import { useTranslation } from 'react-i18next';
import type { LessonBundle, LessonStep, ResolvedToken } from '@/entities/content';
import { TeachStep } from './steps/TeachStep';
import { AssembleStep } from './steps/AssembleStep';
import { SpeakStep } from './steps/SpeakStep';
import { DialogStep } from './steps/DialogStep';

interface StepViewProps {
  bundle: LessonBundle;
  step: LessonStep;
  solved: boolean;
  onTokenClick: (resolvedToken: ResolvedToken) => void;
  onStepSolvedChange: (solved: boolean) => void;
}

export function StepView({
  bundle,
  step,
  solved,
  onTokenClick,
  onStepSolvedChange,
}: StepViewProps) {
  const { t } = useTranslation();

  switch (step.kind) {
    case 'teach':
      return <TeachStep bundle={bundle} step={step} onTokenClick={onTokenClick} />;
    case 'assemble':
      return (
        <AssembleStep
          bundle={bundle}
          step={step}
          solved={solved}
          onSolvedChange={onStepSolvedChange}
        />
      );
    case 'speak':
      return <SpeakStep bundle={bundle} step={step} onTokenClick={onTokenClick} />;
    case 'dialog':
      return <DialogStep bundle={bundle} step={step} onTokenClick={onTokenClick} />;
    default:
      return (
        <div className="rounded-xl border p-6 text-muted-foreground">
          {t('lesson.stepComingSoon', { kind: step.kind })}
        </div>
      );
  }
}
