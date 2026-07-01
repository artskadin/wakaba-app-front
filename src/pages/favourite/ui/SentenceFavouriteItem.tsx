import { Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ResolvedToken } from '@/entities/content';
import { TokenRow } from '@/entities/content/ui/TokenRow';
import type { FavouriteSentence } from '@/entities/favourites';
import { useSentenceFavourite } from '@/features/favourites';
import { localize } from '@/shared/lib/localize';
import { CopyButton, FavouriteButton } from '@/shared/ui';
import { useListen } from '@/shared/lib/audio/useListen';
import { audioUrl } from '@/shared/lib/audio/url';
import { useVoiceStore } from '@/features/voice';

interface SentenceFavouriteItemProps {
  sentence: FavouriteSentence;
  onOpenToken: (tokenId: string) => void;
}

export function SentenceFavouriteItem({ sentence, onOpenToken }: SentenceFavouriteItemProps) {
  const { isFavourite, toggle, isPending } = useSentenceFavourite(sentence.id);
  const listen = useListen();
  const voice = useVoiceStore((s) => s.voice);

  const resolved: ResolvedToken[] = sentence.tokens.map((st) => ({
    token: st.token,
    ref: { tokenId: st.token.id, slotType: st.slotType ?? undefined, isFocusSlot: st.isFocusSlot },
  }));
  const japanese = sentence.tokens.map((st) => st.token.surface).join('');

  return (
    <li className="flex flex-col gap-2 rounded-lg border px-3.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <TokenRow tokens={resolved} onTokenClick={(r) => onOpenToken(r.token.id)} />
          <span className="text-base text-heading">{localize(sentence.translation)}</span>
        </div>

        <FavouriteButton active={isFavourite} onToggle={toggle} disabled={isPending} />
      </div>

      <div className="flex items-center gap-1 border-t pt-2 mt-1">
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          onClick={() => listen(audioUrl('sentences', sentence.id, voice))}
        >
          <Headphones />
        </Button>

        <CopyButton text={japanese} />
      </div>
    </li>
  );
}
