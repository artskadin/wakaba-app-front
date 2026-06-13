import type { Token } from '../types';

interface TokenViewProps {
  token: Token;
  isSlot?: boolean;
  isGrammar?: boolean;
}

export function TokenView({ token, isSlot, isGrammar }: TokenViewProps) {
  return (
    <>
      <span
        className={`text-xl leading-tight ${isSlot ? 'text-primary' : 'text-foreground'} ${isGrammar ? 'border-b-2 border-dotted border-purple-400' : ''}`}
      >
        {token.surface}
      </span>
      <span className={`text-sm ${isSlot ? 'text-primary' : 'text-muted-foreground'}`}>
        {token.romaji}
      </span>
      <span className="text-sm italic">{token.cyrillic}</span>
    </>
  );
}
