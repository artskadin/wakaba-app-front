import type { FavouriteSentence } from '@/entities/favourites';
import { useSentenceFavourite } from '@/features/favourites';
import { localize } from '@/shared/lib/localize';
import { FavouriteButton } from '@/shared/ui/FavouriteButton';

export function SentenceFavouriteItem({ sentence }: { sentence: FavouriteSentence }) {
  const { isFavourite, toggle, isPending } = useSentenceFavourite(sentence.id);

  return (
    <li className="flex items-start justify-between gap-2 rounded-lg border p-3">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{sentence.romaji}</span>
        <span className="text-sm">
          {sentence.cyrillicGuide ? ` · [ ${localize(sentence.cyrillicGuide)} ]` : ''}
        </span>
        <span className="text-sm text-heading">{localize(sentence.translation)}</span>
      </div>
      <FavouriteButton active={isFavourite} onToggle={toggle} disabled={isPending} />
    </li>
  );
}
