import { useTranslation } from 'react-i18next';
import { type LessonBundle, type LessonStep, type ResolvedToken } from '@/entities/content';
import { PronounceCard } from '@/widgets/pronounce-card';

type SpeakStepDef = Extract<LessonStep, { kind: 'speak' }>;

interface SpeakStepProps {
  bundle: LessonBundle;
  step: SpeakStepDef;
  solved: boolean;
  onSolvedChange: (solved: boolean) => void;
  onTokenClick: (resolvedToken: ResolvedToken) => void;
}

export function SpeakStep({ bundle, step, solved, onSolvedChange, onTokenClick }: SpeakStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        {t('lesson.speak.title')}
      </p>

      <PronounceCard
        bundle={bundle}
        sentenceId={step.sentenceId}
        initialRevealed={solved}
        onRecorded={() => onSolvedChange(true)}
        onTokenClick={onTokenClick}
      />
    </div>
  );
}
