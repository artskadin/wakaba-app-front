import { Button } from '@/components/ui/button';
import type { Voice } from '@/entities/settings';

interface VoiceToggleProps {
  value: Voice;
  onChange: (v: Voice) => void;
}

export function VoiceToggle({ value, onChange }: VoiceToggleProps) {
  const isMale = value === 'm';

  return (
    <Button
      type="button"
      title={isMale ? '男 (otoko) — мужской голос' : '女 (onna) — женский голос'}
      aria-label={
        isMale ? 'Мужской голос, нажми для женского' : 'Женский голос, нажми для мужского'
      }
      onClick={() => onChange(isMale ? 'f' : 'm')}
      variant="outline"
      size="icon"
      className={`rounded-lg text-lg font-medium transition-colors cursor-pointer ${
        isMale
          ? 'border-voice-male dark:border-voice-male bg-voice-male/15 dark:bg-voice-male/15 text-voice-male hover:bg-voice-male/25 dark:hover:bg-voice-male/25 hover:text-voice-male dark:hover:text-voice-male'
          : 'border-voice-female dark:border-voice-female bg-voice-female/15 dark:bg-voice-female/15 text-voice-female hover:bg-voice-female/25 dark:hover:bg-voice-female/25 hover:text-voice-female dark:hover:text-voice-female'
      }`}
    >
      {isMale ? '男' : '女'}
    </Button>
  );
}
