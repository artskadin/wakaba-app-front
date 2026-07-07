import type { ResolvedToken } from '../lib/resolve';
import { TokenView } from './TokenView';

interface TokenRowProps {
  tokens: ResolvedToken[];
  highlightSlot?: boolean;
  onTokenClick?: (rt: ResolvedToken) => void;
}

export function TokenRow({ tokens, highlightSlot, onTokenClick }: TokenRowProps) {
  return (
    <div className="flex flex-wrap items-start gap-x-1 gap-y-2">
      {tokens.map((resolved, i) => {
        const isSlot = highlightSlot && !!resolved.ref.slotType;

        return (
          <span className="flex items-start">
            {resolved.ref.before && (
              <span className="py-1 text-lg leading-tight">{resolved.ref.before}</span>
            )}

            <button
              key={i}
              type="button"
              onClick={() => onTokenClick?.(resolved)}
              className={`
              flex
              flex-col
              items-center
              rounded-lg
              px-1.5
              py-1
              transition
              cursor-pointer
              hover:bg-muted
              ${isSlot ? 'bg-primary/10' : ''}`}
            >
              <TokenView token={resolved.token} isSlot={isSlot} />
            </button>

            {resolved.ref.after && (
              <span className="py-1 text-lg leading-tight">{resolved.ref.after}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
