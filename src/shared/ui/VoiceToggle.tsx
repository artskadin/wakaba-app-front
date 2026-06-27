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
      className={`rounded-lg border text-lg font-medium transition-colors cursor-pointer ${
        isMale
          ? 'border-heading bg-heading/20 text-heading/80 hover:bg-heading/35 hover:text-heading'
          : 'border-fuchsia-400 bg-fuchsia-400/20 text-fuchsia-800 hover:bg-fuchsia-400/35 hover:text-fuchsia-800'
      }`}
    >
      {isMale ? '男' : '女'}
    </Button>
  );
}
