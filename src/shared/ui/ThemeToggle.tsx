import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  value: 'light' | 'dark';
  onChange: (t: 'light' | 'dark') => void;
}

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  const isDark = value === 'dark';

  return (
    <Button
      type="button"
      aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
      onClick={() => onChange(isDark ? 'light' : 'dark')}
      variant="outline"
      size="icon"
      className="rounded-lg border text-lg font-medium transition-colors cursor-pointer"
    >
      {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </Button>
  );
}
