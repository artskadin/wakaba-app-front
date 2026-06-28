import type { Token } from '../types';

interface TokenViewProps {
  token: Token;
  isSlot?: boolean;
}

export function TokenView({ token, isSlot }: TokenViewProps) {
  const isParticle = token.type === 'particle' || token.type === 'ending';

  return (
    <>
      <span
        className={`text-lg leading-tight  ${isSlot ? 'text-primary' : 'text-foreground'} ${isParticle ? 'border-b-2 border-dotted border-purple-400' : ''}`}
      >
        {token.surface}
      </span>
      <span className={`text-sm ${isSlot ? 'text-primary/80' : 'text-muted-foreground'}`}>
        {token.romaji}
      </span>
      <span className="text-sm">{token.cyrillic}</span>
    </>
  );
}
