import { Button } from '@/components/ui/button';
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
    <Button
      type="button"
      onClick={onToggle}
      variant="ghost"
      size="icon"
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? t('favourite.remove') : t('favourite.add')}
      className="cursor-pointer"
    >
      <Star className={`${active ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
    </Button>
  );
}
