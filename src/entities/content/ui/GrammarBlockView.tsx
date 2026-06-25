import { localize } from '@/shared/lib/localize';
import type { GrammarBlock } from '../types';
import { GrammarExampleView } from './GrammarExampleView';

export function GrammarBlockView({ block }: { block: GrammarBlock }) {
  return (
    <div className="space-y-2">
      <p className="text-sm">{localize(block.summary)}</p>

      {block.details && block.details.length > 0 && (
        <ul className="space-y-1.5">
          {block.details.map((d, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="select-none text-muted-foreground/50">•</span>
              <span>{localize(d)}</span>
            </li>
          ))}
        </ul>
      )}

      {block.examples && block.examples.length > 0 && (
        <div>
          {block.examples.map((ex, i) => (
            <GrammarExampleView key={i} example={ex} />
          ))}
        </div>
      )}
    </div>
  );
}
