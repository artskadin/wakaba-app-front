import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type LessonBundle, type LessonStep, type ResolvedToken } from '@/entities/content';
import { localize } from '@/shared/lib/localize';
import { SentenceCard } from '@/widgets/sentence-card';

type DialogStepDef = Extract<LessonStep, { kind: 'dialog' }>;

interface DialogStepProps {
  bundle: LessonBundle;
  step: DialogStepDef;
  onTokenClick: (resolvedToken: ResolvedToken) => void;
}

export function DialogStep({ bundle, step, onTokenClick }: DialogStepProps) {
  const { t } = useTranslation();
  const dialog = bundle.dialogs[step.dialogId];
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {t('lesson.dialog.title')}
      </p>

      {dialog.turns.map((turn, idx) => {
        const sentence = bundle.sentences[turn.sentenceId];
        const isUser = turn.speaker === 'user';

        return (
          <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl border p-3 ${isUser ? 'bg-primary/5' : 'bg-muted'}`}
            >
              <p className="mb-1 text-sm text-muted-foreground">
                {isUser ? t('lesson.dialog.you') : t('lesson.dialog.staff')}
              </p>

              {isUser && !revealed[idx] ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    {t('lesson.dialog.yourLine', { translation: localize(sentence.translation) })}
                  </p>
                  <button
                    type="button"
                    className="self-start rounded-lg border px-2 py-1 text-xs"
                    onClick={() => setRevealed((prev) => ({ ...prev, [idx]: true }))}
                  >
                    {t('lesson.dialog.hint')}
                  </button>
                </div>
              ) : (
                <>
                  <SentenceCard
                    bundle={bundle}
                    sentenceId={turn.sentenceId}
                    onTokenClick={onTokenClick}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {localize(sentence.translation)}
                  </p>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
