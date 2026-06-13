import type { LessonBundle, Sentence, Token, TokenRef } from '../types';

export interface ResolvedToken {
  ref: TokenRef;
  token: Token;
}

export function resolveSentence(
  bundle: LessonBundle,
  sentenceId: string,
): { sentence: Sentence; tokens: ResolvedToken[] } {
  const sentence = bundle.sentences[sentenceId];
  const tokens = sentence.tokens.map((ref) => ({ ref, token: bundle.tokens[ref.tokenId] }));

  return { sentence, tokens };
}
