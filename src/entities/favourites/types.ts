import type { GrammarNote, LocalizedText, Token } from '@/entities/content';

export type FavouriteItemType = 'token' | 'sentence';

export interface FavouriteToken {
  id: string;
  surface: string;
  romaji: string;
  cyrillic: string;
  gloss: LocalizedText;
}

export interface FavouriteSentence {
  id: string;
  romaji: string;
  translation: LocalizedText;
  cyrillicGuide: LocalizedText;
}

export interface Favourite {
  id: string;
  itemType: FavouriteItemType;
  tokenId: string | null;
  sentenceId: string | null;
  token: FavouriteToken | null;
  sentence: FavouriteSentence | null;
  createdAt: string;
}

export interface TokenDetailData {
  token: Token;
  grammarNote: GrammarNote | null;
}
