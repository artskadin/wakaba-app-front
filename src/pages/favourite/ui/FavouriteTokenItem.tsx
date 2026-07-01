import { Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ResolvedToken, Token } from '@/entities/content';
import { TokenRow } from '@/entities/content/ui/TokenRow';
import { useTokenFavourite } from '@/features/favourites';
import { localize } from '@/shared/lib/localize';
import { CopyButton, FavouriteButton } from '@/shared/ui';
import { useVoiceStore } from '@/features/voice';
import { useListen } from '@/shared/lib/audio/useListen';
import { audioUrl } from '@/shared/lib/audio/url';

interface FavouriteTokenItemProps {
  token: Token;
  onOpenToken: (tokenId: string) => void;
}

export function FavouriteTokenItem({ token, onOpenToken }: FavouriteTokenItemProps) {
  const { isFavourite, toggle, isPending } = useTokenFavourite(token.id);
  const voice = useVoiceStore((s) => s.voice);
  const listen = useListen();

  const resolved: ResolvedToken[] = [{ token, ref: { tokenId: token.id } }];

  return (
    <li className="flex flex-col gap-2 rounded-lg border px-3.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <TokenRow tokens={resolved} onTokenClick={(r) => onOpenToken(r.token.id)} />
          <span className="text-sm text-heading">{localize(token.gloss)}</span>
        </div>
        <FavouriteButton active={isFavourite} onToggle={toggle} disabled={isPending} />
      </div>

      <div className="flex items-center gap-1 border-t pt-2">
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          onClick={() => listen(audioUrl('tokens', token.id, voice))}
        >
          <Headphones />
        </Button>

        <CopyButton text={token.surface} />
      </div>
    </li>
  );
}
