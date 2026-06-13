import {
  resolveSentence,
  TokenView,
  type LessonBundle,
  type ResolvedToken,
} from '@/entities/content';

interface SentenceViewProps {
  bundle: LessonBundle;
  sentenceId: string;
  onTokenClick?: (resolvedToken: ResolvedToken) => void;
}

export function SentenceView({ bundle, sentenceId, onTokenClick }: SentenceViewProps) {
  const { tokens } = resolveSentence(bundle, sentenceId);

  return (
    <div className="flex flex-wrap items-start gap-x-1 gap-y-2">
      {tokens.map((resolved, i) => {
        const isSlot = !!resolved.ref.slotType;
        const isGrammar = !!resolved.token.grammarNoteId;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onTokenClick?.(resolved)}
            className={`flex flex-col items-center rounded-lg px-1.5 py-1 transition hover:bg-muted ${isSlot ? 'bg-primary/10' : ''}`}
          >
            <TokenView token={resolved.token} isSlot={isSlot} isGrammar={isGrammar} />
          </button>
        );
      })}
    </div>
  );
}
