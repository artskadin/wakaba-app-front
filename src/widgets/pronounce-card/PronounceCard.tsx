import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Disc3, Headphones, Mic, Play, Square } from 'lucide-react';
import {
  resolveSentence,
  SentenceView,
  type LessonBundle,
  type ResolvedToken,
} from '@/entities/content';
import { useVoiceStore } from '@/features/voice';
import { usePronounce } from '@/shared/lib/audio/usePronounce';
import { localize } from '@/shared/lib/localize';
import { Button } from '@/components/ui/button';
import { audioUrl } from '@/shared/lib/audio/url';
import { CopyButton } from '@/shared/ui/CopyButton';
import { FavouriteButton } from '@/shared/ui/FavouriteButton';
import { useSentenceFavourite } from '@/features/favourites';
import { formatTime } from '@/shared/lib/audio/formatTIme';
import { useAudioLockReporter } from '@/shared/lib/audio/useAudioLockReporter';

interface PronounceCardProps {
  bundle: LessonBundle;
  sentenceId: string;
  lockKey?: string;
  bordered?: boolean;
  initialRevealed?: boolean;
  onReveal?: () => void;
  onRecorded?: (data: Blob | null) => void;
  onTokenClick?: (redolvedToken: ResolvedToken) => void;
}

export function PronounceCard({
  bundle,
  sentenceId,
  lockKey,
  bordered = true,
  initialRevealed = false,
  onReveal,
  onRecorded,
  onTokenClick,
}: PronounceCardProps) {
  const { t } = useTranslation();
  const voice = useVoiceStore((s) => s.voice);
  const { sentence, tokens } = resolveSentence(bundle, sentenceId);
  const { isFavourite, toggle, isPending } = useSentenceFavourite(sentenceId);
  const [revealed, setRevealed] = useState(initialRevealed);
  const rec = usePronounce({ onRecorded });
  const lockedByOther = useAudioLockReporter(rec.mode, lockKey);
  const japanese = tokens.map((x) => x.token.surface).join('');

  const showCard = revealed || rec.hasRecording;

  const recordDisabled =
    lockedByOther || rec.mode === 'playing-sentence' || rec.mode === 'playing-self';
  const sentenceDisabled = lockedByOther || rec.mode === 'recording' || rec.mode === 'playing-self';
  const selfDisabled = lockedByOther || rec.mode === 'recording' || rec.mode === 'playing-sentence';

  function reveal() {
    setRevealed(true);
    onReveal?.();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex flex-col gap-2 ${bordered ? 'rounded-lg border px-3.5 py-3' : ''}`}>
        {!showCard && (
          <span className="text-base text-heading">{localize(sentence.translation)}</span>
        )}

        {showCard && (
          <div className="flex items-start justify-between gap-2">
            <SentenceView bundle={bundle} sentenceId={sentenceId} onTokenClick={onTokenClick} />
            <FavouriteButton active={isFavourite} onToggle={toggle} disabled={isPending} />
          </div>
        )}

        <div className="flex items-center gap-1 border-t pt-2 mt-1">
          <Button
            type="button"
            variant="ghost"
            size="default"
            disabled={recordDisabled}
            onClick={() => (rec.mode === 'recording' ? rec.stopRecording() : rec.startRecording())}
            className={`cursor-pointer text-destructive transition-colors`}
          >
            {rec.mode === 'recording' ? <Square /> : <Mic />}
          </Button>

          {rec.mode === 'recording' ? (
            <span className="flex items-center gap-1.5 px-3 text-sm text-destructive">
              <Disc3 className="size-4 animate-spin" />
              {formatTime(rec.recordSeconds)}
            </span>
          ) : (
            rec.hasRecording && (
              <Button
                type="button"
                variant="ghost"
                onClick={rec.playSelf}
                disabled={selfDisabled}
                className="cursor-pointer text-primary transition-colors hover:text-foreground"
              >
                <Disc3 className={`size-4 ${rec.mode === 'playing-self' ? 'animate-spin' : ''}`} />
                {formatTime(rec.mode === 'playing-self' ? rec.selfRemaining : rec.selfDuration)}
                <Play />
              </Button>
            )
          )}

          {showCard && (
            <Button
              type="button"
              variant="ghost"
              size="default"
              disabled={sentenceDisabled}
              onClick={() => rec.playSentence(audioUrl('sentences', sentenceId, voice))}
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              <Headphones />
            </Button>
          )}

          {!showCard && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reveal}
              className="cursor-pointer max-w-fit text-muted-foreground"
            >
              {t('lesson.speak.hint')}
            </Button>
          )}

          {showCard && <CopyButton text={japanese} />}
        </div>
      </div>
    </div>
  );
}
