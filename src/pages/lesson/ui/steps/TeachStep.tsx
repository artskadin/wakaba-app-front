import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GrammarNoteView,
  SentenceView,
  type LessonBundle,
  type LessonStep,
  type ResolvedToken,
} from '@/entities/content';
import { localize } from '@/shared/lib/localize';

type TeachStepDef = Extract<LessonStep, { kind: 'teach' }>;

interface TeachStepProps {
  bundle: LessonBundle;
  step: TeachStepDef;
  onTokenClick: (resolvedToken: ResolvedToken) => void;
}

export function TeachStep({ bundle, step, onTokenClick }: TeachStepProps) {
  const { t } = useTranslation();
  const siblings = step.siblingSentenceIds ?? [step.sentenceId];
  const [activeSentenceId, setActiveSentenceId] = useState(step.sentenceId);
  const activeSentence = bundle.sentences[activeSentenceId];
  const pattern = step.patternId ? bundle.patterns[step.patternId] : undefined;
  const sentence = bundle.sentences[step.sentenceId];

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {t('lesson.mainPhrase')}
      </p>

      <div className="rounded-2xl border p-4">
        <SentenceView bundle={bundle} sentenceId={activeSentenceId} onTokenClick={onTokenClick} />
        <p className="mt-3 text-base font-semibold">{localize(activeSentence.translation)}</p>
      </div>

      {pattern && (
        <div className="rounded-xl border border-dashed p-3 text-sm">
          {localize(pattern.explanation)}
        </div>
      )}

      {sentence.grammarNoteIds?.map((id) => {
        const note = bundle.grammarNotes[id];

        return note ? <GrammarNoteView key={id} note={note} /> : null;
      })}

      {siblings.length > 1 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
            {t('lesson.substitute')}
          </p>
          <div className="flex flex-wrap gap-2">
            {siblings.map((sentenceId) => {
              const sentence = bundle.sentences[sentenceId];
              const focusRef = sentence.tokens.find((t) => t.isFocusSlot);
              const focusWord = focusRef ? bundle.tokens[focusRef.tokenId] : undefined;
              const isActive = sentenceId === activeSentenceId;

              return (
                <button
                  key={sentenceId}
                  type="button"
                  onClick={() => setActiveSentenceId(sentenceId)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${isActive ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                >
                  {focusWord ? focusWord.cyrillic : localize(sentence.translation)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
