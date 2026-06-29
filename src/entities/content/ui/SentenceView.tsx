import { resolveSentence, type LessonBundle, type ResolvedToken } from '@/entities/content';
import { TokenRow } from './TokenRow';

interface SentenceViewProps {
  bundle: LessonBundle;
  sentenceId: string;
  highlightSlot?: boolean;
  onTokenClick?: (resolvedToken: ResolvedToken) => void;
}

export function SentenceView({
  bundle,
  sentenceId,
  highlightSlot,
  onTokenClick,
}: SentenceViewProps) {
  const { tokens } = resolveSentence(bundle, sentenceId);

  return <TokenRow tokens={tokens} highlightSlot={highlightSlot} onTokenClick={onTokenClick} />;
}
