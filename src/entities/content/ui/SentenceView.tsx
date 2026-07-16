import { resolveSentence, type LessonBundle, type ResolvedToken } from '@/entities/content';
import { TokenRow } from './TokenRow';
import { localize } from '@/shared/lib/localize';

interface SentenceViewProps {
  bundle: LessonBundle;
  sentenceId: string;
  focusTokenIndex?: number;
  onTokenClick?: (resolvedToken: ResolvedToken) => void;
}

export function SentenceView({
  bundle,
  sentenceId,
  focusTokenIndex,
  onTokenClick,
}: SentenceViewProps) {
  const { tokens } = resolveSentence(bundle, sentenceId);
  const { translation } = bundle.sentences[sentenceId];

  return (
    <div className="flex flex-col gap-2">
      <TokenRow tokens={tokens} focusTokenIndex={focusTokenIndex} onTokenClick={onTokenClick} />
      <span className="text-base text-heading">{localize(translation)}</span>
    </div>
  );
}
