import { localize } from '@/shared/lib/localize';
import type { GrammarExample } from '../types';

interface GrammarExampleProps {
  example: GrammarExample;
}

export function GrammarExampleView({ example }: GrammarExampleProps) {
  if (example.kind === 'transform') {
    return (
      <div className="mt-1 text-base">
        {example.from.surface}{' '}
        <span className="text-xs text-muted-foreground">{example.from.romaji}</span> →{' '}
        {example.to.surface}{' '}
        <span className="text-xs text-muted-foreground">{example.to.romaji}</span>
      </div>
    );
  }

  if (example.kind === 'phrase') {
    return (
      <div className="mt-1 text-base">
        {example.forms.map((f) => f.surface).join(' ')}{' '}
        <span className="text-xs text-muted-foreground">
          {example.forms.map((f) => f.romaji).join(' ')}
        </span>
      </div>
    );
  }

  return <div className="mt-1 text-sm">{localize(example.text)}</div>;
}
