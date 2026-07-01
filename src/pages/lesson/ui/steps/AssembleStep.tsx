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
  solved: boolean;
  onSolvedChange: (solved: boolean) => void;
}

export function AssembleStep({ bundle, step, solved, onSolvedChange }: AssembleStepProps) {
  const { t } = useTranslation();
  const { sentence, tokens } = resolveSentence(bundle, step.sentenceId);
  const tokenCount = tokens.length;
  const shuffledOrder = shuffledIndices(step.sentenceId, tokenCount);
  const [placed, setPlaced] = useState<number[]>(() =>
    solved ? Array.from({ length: tokenCount }, (_, i) => i) : [],
  );

  const isSolved = (order: number[]) =>
    order.length === tokenCount && order.every((v, idx) => v === idx);

  function place(tokenIdx: number) {
    const next = [...placed, tokenIdx];
    setPlaced(next);
    onSolvedChange(isSolved(next));
  }

  function remove(tokenIdx: number) {
    const next = placed.filter((v) => v !== tokenIdx);
    setPlaced(next);
    onSolvedChange(isSolved(next));
  }

  const isComplete = tokenCount > 0 && placed.length === tokenCount;
  const isCorrect = isSolved(placed);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        {t('lesson.assemble.title')}
      </p>
      <p className="text-base text-heading">{localize(sentence.translation)}</p>

      <div className="flex min-h-16 flex-wrap items-start gap-2 rounded-xl border-2 border-dashed p-2">
        {placed.map((tokenIdx) => (
          <button
            key={tokenIdx}
            type="button"
            className="flex flex-col items-center rounded-lg border px-2 py-1 text-lg cursor-pointer hover:bg-muted"
            onClick={() => remove(tokenIdx)}
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
            className="flex flex-col items-center rounded-lg border px-2 py-1 text-lg disabled:opacity-30 cursor-pointer hover:bg-muted"
            onClick={() => place(tokenIdx)}
          >
            <TokenView token={tokens[tokenIdx].token} />
          </button>
        ))}
      </div>

      {isComplete && (
        <p
          className={`rounded-lg p-3 text-sm font-semibold ${isCorrect ? 'bg-accent text-accent-foreground' : 'bg-destructive/10 text-destructive'}`}
        >
          {isCorrect
            ? t('lesson.assemble.correct')
            : `${t('lesson.assemble.wrong')}: ${sentence.romaji}`}
        </p>
      )}
    </div>
  );
}
