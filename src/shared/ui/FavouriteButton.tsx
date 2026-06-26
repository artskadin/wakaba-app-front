import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FavouriteButtonProps {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function FavouriteButton({ active, onToggle, disabled }: FavouriteButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? t('favourite.remove') : t('favourite.add')}
    >
      <Star
        className={`h-5 w-5 ${active ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
      />
    </button>
  );
}
