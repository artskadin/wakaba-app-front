import { Star } from 'lucide-react';
import { GrammarNoteView, type GrammarNote, type Token } from '@/entities/content';
import { useTokenFavourite } from '@/features/favourites/model/useTokenFavourite';
import { localize } from '@/shared/lib/localize';

interface TokenDetailProps {
  token: Token;
  note: GrammarNote | null;
}

export function TokenDetail({ token, note }: TokenDetailProps) {
  const { isFavourite, toggle, isPending } = useTokenFavourite(token.id);

  return (
    <div className="mx-auto w-full max-w-md pb-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl">{token.surface}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {token.reading} · {token.romaji} · [ {token.cyrillic} ]
          </div>
          <div className="mt-2 text-lg fonfont-semibold">{localize(token.gloss)}</div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          className="p-2"
          aria-label="favourite"
        >
          <Star
            className={`h-6 w-6 ${isFavourite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
          />
        </button>
      </div>
      {note && <GrammarNoteView note={note} />}
    </div>
  );
}
