import { Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  resolveSentence,
  SentenceView,
  type LessonBundle,
  type ResolvedToken,
} from '@/entities/content';
import { useSentenceFavourite } from '@/features/favourites';
import { CopyButton, FavouriteButton } from '@/shared/ui';
import { usePronounce } from '@/shared/lib/audio/usePronounce';
import { useAudioLockReporter } from '@/shared/lib/audio/useAudioLockReporter';
import { audioUrl } from '@/shared/lib/audio/url';
import { useVoiceStore } from '@/features/voice';

interface SentenceCardProps {
  bundle: LessonBundle;
  sentenceId: string;
  highlightSlot?: boolean;
  bordered?: boolean;
  lockKey?: string;
  onTokenClick?: (resolvedToken: ResolvedToken) => void;
}

export function SentenceCard({
  bundle,
  sentenceId,
  highlightSlot = false,
  bordered = true,
  lockKey,
  onTokenClick,
}: SentenceCardProps) {
  const { isFavourite, toggle, isPending } = useSentenceFavourite(sentenceId);
  const { tokens } = resolveSentence(bundle, sentenceId);
  const japanese = tokens.map((item) => item.token.surface).join('');

  const voice = useVoiceStore((s) => s.voice);
  const player = usePronounce();
  const lockByOther = useAudioLockReporter(player.mode, lockKey);

  return (
    <div className={`flex flex-col gap-2 ${bordered ? 'rounded-lg border px-3.5 py-3' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <SentenceView
          bundle={bundle}
          sentenceId={sentenceId}
          highlightSlot={highlightSlot}
          onTokenClick={onTokenClick}
        />
        <FavouriteButton active={isFavourite} onToggle={toggle} disabled={isPending} />
      </div>

      <div className="flex items-center gap-1 border-t pt-2 mt-1">
        <Button
          type="button"
          variant="ghost"
          size="default"
          disabled={lockByOther}
          className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          onClick={() => player.playSentence(audioUrl('sentences', sentenceId, voice))}
        >
          <Headphones />
        </Button>

        <CopyButton text={japanese} />
      </div>
    </div>
  );
}
