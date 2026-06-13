import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  resolveSentence,
  shuffledIndices,
  TokenView,
  type LessonBundle,
  type LessonStep,
} from '@/entities/content';
import { localize } from '@/shared/lib/localize';

type AssembleStepDef = Extract<LessonStep, { kind: 'assemble' }>;

interface AssembleStepProps {
  bundle: LessonBundle;
  step: AssembleStepDef;
}

export function AssembleStep({ bundle, step }: AssembleStepProps) {
  const { t } = useTranslation();
  const { sentence, tokens } = resolveSentence(bundle, step.sentenceId);
  const tokenCount = tokens.length;
  const shuffledOrder = shuffledIndices(step.sentenceId, tokenCount);
  const [placed, setPlaced] = useState<number[]>([]);

  const isComplete = tokenCount > 0 && placed.length === tokenCount;
  const isCorrect = isComplete && placed.every((value, idx) => value === idx);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {t('lesson.assemble.title')}
      </p>
      <p className="text-sm">
        {t('lesson.assemble.prompt', { translation: localize(sentence.translation) })}
      </p>

      <div className="flex min-h-16 flex-wrap items-start gap-2 rounded-xl border-2 border-dashed p-2">
        {placed.map((tokenIdx) => (
          <button
            key={tokenIdx}
            type="button"
            className="flex flex-col items-center rounded-lg border px-2 py-1 text-lg"
            onClick={() => setPlaced((prev) => prev.filter((value) => value !== tokenIdx))}
          >
            <TokenView token={tokens[tokenIdx].token} />
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {shuffledOrder.map((tokenIdx) => (
          <button
            key={tokenIdx}
            type="button"
            disabled={placed.includes(tokenIdx)}
            className="flex flex-col items-center rounded-lg border px-2 py-1 text-lg disabled:opacity-30"
            onClick={() => setPlaced((prev) => [...prev, tokenIdx])}
          >
            <TokenView token={tokens[tokenIdx].token} />
          </button>
        ))}
      </div>

      {isComplete && (
        <p
          className={`rounded-lg p-3 text-sm font-semibold ${isCorrect ? 'bg-primary/30 text-primary' : 'bg-destructive/10 text-destructive'}`}
        >
          {isCorrect
            ? t('lesson.assemble.correct')
            : `${t('lesson.assemble.wrong')}: ${sentence.romaji}`}
        </p>
      )}
    </div>
  );
}
