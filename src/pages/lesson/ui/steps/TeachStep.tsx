import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoIcon } from 'lucide-react';
import {
  GrammarNoteView,
  type LessonBundle,
  type LessonStep,
  type ResolvedToken,
} from '@/entities/content';
import { localize } from '@/shared/lib/localize';
import { SentenceCard } from '@/widgets/sentence-card';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const pattern = step.patternId ? bundle.patterns[step.patternId] : undefined;
  const sentence = bundle.sentences[step.sentenceId];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        {t('lesson.mainPhrase')}
      </p>

      <SentenceCard
        bundle={bundle}
        sentenceId={activeSentenceId}
        highlightSlot={true}
        onTokenClick={onTokenClick}
      />

      {pattern && (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3 text-sm">
          <div className="flex items-center gap-1">
            <p className="tracking-wide text-muted-foreground">{t('lesson.pattern.title')}</p>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  aria-label={t('lesson.pattern.infoLabel')}
                  variant="ghost"
                  className="cursor-pointer"
                >
                  <InfoIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent align="start" className="max-w-xs text-sm">
                <PopoverDescription>{t('lesson.pattern.info')}</PopoverDescription>
              </PopoverContent>
            </Popover>
          </div>
          <p>{localize(pattern.explanation)}</p>
        </div>
      )}

      {siblings.length > 1 && (
        <div>
          <p className="mb-2 text-sm uppercase tracking-wide text-muted-foreground">
            {t('lesson.substitute')}
          </p>
          <div className="flex flex-wrap gap-2">
            {siblings.map((sentenceId) => {
              const sentence = bundle.sentences[sentenceId];
              const focusRef = sentence.tokens.find((t) => t.isFocusSlot);
              const focusWord = focusRef ? bundle.tokens[focusRef.tokenId] : undefined;
              const isActive = sentenceId === activeSentenceId;

              return (
                <Button
                  key={sentenceId}
                  type="button"
                  onClick={() => setActiveSentenceId(sentenceId)}
                  variant="outline"
                  className={`
                    rounded-lg
                    text-sm
                    transition
                    font-normal
                    cursor-pointer
                    hover:border-primary/15
                    ${
                      isActive
                        ? 'border-primary/80 bg-primary/10 text-primary hover:border-primary/10 hover:bg-primary/10 hover:text-primary'
                        : 'hover:border-primary/10 hover:text-primary hover:bg-primary/10'
                    }`}
                >
                  {focusWord ? focusWord.cyrillic : localize(sentence.translation)}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {pattern?.grammarNoteIds.map((id) => {
        const note = bundle.grammarNotes[id];

        return note ? <GrammarNoteView key={id} note={note} /> : null;
      })}

      {sentence.grammarNoteIds?.map((id) => {
        const note = bundle.grammarNotes[id];

        return note ? <GrammarNoteView key={id} note={note} /> : null;
      })}
    </div>
  );
}
