import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTranslation } from 'react-i18next';

export type FavFilter = 'all' | 'tokens' | 'sentences';

interface FavouriteFilterProps {
  value: FavFilter;
  counts: Record<FavFilter, number>;
  onChange: (v: FavFilter) => void;
}

const OPTIONS: { value: FavFilter; key: string }[] = [
  { value: 'all', key: 'favourites.all' },
  { value: 'tokens', key: 'favourites.tokens' },
  { value: 'sentences', key: 'favourites.sentences' },
];

export function FavouriteFilter({ value, counts, onChange }: FavouriteFilterProps) {
  const { t } = useTranslation();

  return (
    <ToggleGroup
      type="single"
      value={value}
      variant="outline"
      size="sm"
      spacing={1}
      onValueChange={(v) => v && onChange(v as FavFilter)}
    >
      {OPTIONS.map((o) => (
        <ToggleGroupItem key={o.value} value={o.value}>
          <span>{t(o.key)}</span>
          <span className="text-accent-foreground">{counts[o.value]}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
