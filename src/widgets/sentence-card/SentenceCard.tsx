import { SentenceView, type LessonBundle, type ResolvedToken } from '@/entities/content';
import { useSentenceFavourite } from '@/features/favourites';
import { FavouriteButton } from '@/shared/ui/FavouriteButton';

interface SentenceCardProps {
  bundle: LessonBundle;
  sentenceId: string;
  onTokenClick?: (resolvedToken: ResolvedToken) => void;
}

export function SentenceCard({ bundle, sentenceId, onTokenClick }: SentenceCardProps) {
  const { isFavourite, toggle, isPending } = useSentenceFavourite(sentenceId);

  return (
    <div className="flex items-start justify-between gap-2">
      <SentenceView bundle={bundle} sentenceId={sentenceId} onTokenClick={onTokenClick} />
      <FavouriteButton active={isFavourite} onToggle={toggle} disabled={isPending} />
    </div>
  );
}
