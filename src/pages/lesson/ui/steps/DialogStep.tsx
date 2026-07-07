import { useTranslation } from 'react-i18next';
import { type LessonBundle, type LessonStep, type ResolvedToken } from '@/entities/content';
import { SentenceCard } from '@/widgets/sentence-card';
import { AudioLockProvider } from '@/shared/lib/audio/AudioLockProvider';
import { PronounceCard } from '@/widgets/pronounce-card';
import { useState } from 'react';
import { localize } from '@/shared/lib/localize';

type DialogStepDef = Extract<LessonStep, { kind: 'dialog' }>;

interface DialogStepProps {
  bundle: LessonBundle;
  step: DialogStepDef;
  solved: boolean;
  onSolvedChange: (solved: boolean) => void;
  onTokenClick: (resolvedToken: ResolvedToken) => void;
}

export function DialogStep({
  bundle,
  step,
  solved,
  onSolvedChange,
  onTokenClick,
}: DialogStepProps) {
  const { t } = useTranslation();
  const dialog = bundle.dialogs[step.dialogId];

  const userTurnIdx = dialog.turns.flatMap((tn, i) => (tn.speaker === 'user' ? [i] : []));

  const [recorded, setRecorded] = useState<Set<number>>(() =>
    solved ? new Set(userTurnIdx) : new Set(),
  );

  const isVisible = (i: number) =>
    dialog.turns.slice(0, i).every((tn, j) => tn.speaker !== 'user' || recorded.has(j));

  function markRecorded(idx: number) {
    setRecorded((prev) => {
      if (prev.has(idx)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(idx);

      if (next.size === userTurnIdx.length) {
        onSolvedChange(true);
      }

      return next;
    });
  }

  return (
    <AudioLockProvider>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 text-sm tracking-wide text-muted-foreground">
          <span className="uppercase">{t('lesson.dialog.title')}</span>
          <span>{localize(dialog.title)}</span>
        </div>

        {dialog.turns.map((turn, idx) => {
          if (!isVisible(idx)) {
            return null;
          }

          const isUser = turn.speaker === 'user';

          return (
            <div
              key={idx}
              className={`animate-turn-in flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[90%] rounded-lg border px-3.5 py-3">
                <p className="mb-2 text-sm tracking-wide text-accent-foreground">
                  {isUser ? t('lesson.dialog.you') : t('lesson.dialog.staff')}
                </p>

                {isUser ? (
                  <PronounceCard
                    bundle={bundle}
                    sentenceId={turn.sentenceId}
                    bordered={false}
                    lockKey={`turn-${idx}`}
                    onRecorded={() => markRecorded(idx)}
                    onTokenClick={onTokenClick}
                  />
                ) : (
                  <SentenceCard
                    bundle={bundle}
                    sentenceId={turn.sentenceId}
                    bordered={false}
                    lockKey={`turn-${idx}`}
                    onTokenClick={onTokenClick}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AudioLockProvider>
  );
}
