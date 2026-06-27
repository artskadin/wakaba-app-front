import {
  resolveSentence,
  SentenceView,
  type LessonBundle,
  type ResolvedToken,
} from '@/entities/content';
import { useSentenceFavourite } from '@/features/favourites';
import { CopyButton } from '@/shared/ui/CopyButton';
import { FavouriteButton } from '@/shared/ui/FavouriteButton';

interface SentenceCardProps {
  bundle: LessonBundle;
  sentenceId: string;
  highlightSlot?: boolean;
  onTokenClick?: (resolvedToken: ResolvedToken) => void;
}

export function SentenceCard({
  bundle,
  sentenceId,
  highlightSlot = false,
  onTokenClick,
}: SentenceCardProps) {
  const { isFavourite, toggle, isPending } = useSentenceFavourite(sentenceId);
  const { tokens } = resolveSentence(bundle, sentenceId);
  const japanese = tokens.map((item) => item.token.surface).join('');

  return (
    <div className="flex items-start justify-between gap-2">
      <SentenceView
        bundle={bundle}
        sentenceId={sentenceId}
        highlightSlot={highlightSlot}
        onTokenClick={onTokenClick}
      />
      <div className="flex items-center gap-1">
        <CopyButton text={japanese} />
        <FavouriteButton active={isFavourite} onToggle={toggle} disabled={isPending} />
      </div>
    </div>
  );
}
