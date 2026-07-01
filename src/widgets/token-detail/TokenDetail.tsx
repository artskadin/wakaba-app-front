import { GrammarNoteView, type GrammarNote, type Token } from '@/entities/content';
import { localize } from '@/shared/lib/localize';
import { useTokenFavourite } from '@/features/favourites';
import { CopyButton, FavouriteButton } from '@/shared/ui';

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
          <div className="flex items-center gap-1">
            <div className="text-2xl">{token.surface}</div>
            <CopyButton text={token.surface} />
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {token.reading} • {token.romaji} • [ {token.cyrillic} ]
          </div>
          <div className="mt-1 text-lg font-medium text-heading">{localize(token.gloss)}</div>
        </div>
        <FavouriteButton active={isFavourite} onToggle={toggle} disabled={isPending} />
      </div>
      {note && <GrammarNoteView note={note} />}
    </div>
  );
}
