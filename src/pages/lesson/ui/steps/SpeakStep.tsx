import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SentenceView,
  type LessonBundle,
  type LessonStep,
  type ResolvedToken,
} from '@/entities/content';
import { localize } from '@/shared/lib/localize';

type SpeakStepDef = Extract<LessonStep, { kind: 'speak' }>;

interface SpeakStepProps {
  bundle: LessonBundle;
  step: SpeakStepDef;
  onTokenClick: (resolvedToken: ResolvedToken) => void;
}

export function SpeakStep({ bundle, step, onTokenClick }: SpeakStepProps) {
  const { t } = useTranslation();
  const sentence = bundle.sentences[step.sentenceId];
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {t('lesson.speak.title')}
      </p>
      <div className="rounded-2xl border p-4">
        <SentenceView bundle={bundle} sentenceId={step.sentenceId} onTokenClick={onTokenClick} />
        <p className="mt-3 text-base font-semibold">{localize(sentence.translation)}</p>
      </div>

      <button
        type="button"
        onClick={() => {
          if (isRecording) {
            setIsRecording(false);
            setHasRecorded(true);
          } else {
            setIsRecording(true);
          }
        }}
        className={`rounded-xl px-4 py-3 text-base font-semibold text-white ${isRecording ? 'bg-destructive' : 'bg-primary'}`}
      >
        {isRecording ? t('lesson.speak.recording') : t('lesson.speak.record')}
      </button>

      {hasRecorded && <p className="text-sm text-primary">{t('lesson.speak.recorded')}</p>}
      <p className="text-xs text-muted-foreground">{t('lesson.speak.stubNote')}</p>
    </div>
  );
}
