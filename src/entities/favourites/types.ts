import type { GrammarNote, LocalizedText, Token } from '@/entities/content';

export type FavouriteItemType = 'token' | 'sentence';

export interface FavouriteSentenceToken {
  token: Token;
  slotType: string | null;
  isFocusSlot: boolean;
}

export interface FavouriteSentence {
  id: string;
  romaji: string;
  translation: LocalizedText;
  cyrillicGuide: LocalizedText;
  tokens: FavouriteSentenceToken[];
}

export interface Favourite {
  id: string;
  itemType: FavouriteItemType;
  tokenId: string | null;
  sentenceId: string | null;
  token: Token | null;
  sentence: FavouriteSentence | null;
  createdAt: string;
}

export interface TokenDetailData {
  token: Token;
  grammarNote: GrammarNote | null;
}
