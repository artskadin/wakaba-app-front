import type { Voice } from '@/entities/settings';

interface VoiceToggleProps {
  value: Voice;
  onChange: (v: Voice) => void;
}

export function VoiceToggle({ value, onChange }: VoiceToggleProps) {
  const isMale = value === 'm';

  return (
    <button
      type="button"
      title={isMale ? '男 (otoko) — мужской голос' : '女 (onna) — женский голос'}
      aria-label={
        isMale ? 'Мужской голос, нажми для женского' : 'Женский голос, нажми для мужского'
      }
      onClick={() => onChange(isMale ? 'f' : 'm')}
      className={`size-10 rounded-full border text-lg font-medium text-white transition-colors ${
        isMale ? 'border-blue-500 bg-blue-500' : 'border-pink-500 bg-pink-500'
      }`}
    >
      {isMale ? '男' : '女'}
    </button>
  );
}
