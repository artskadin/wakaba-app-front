import type { ResolvedToken } from '@/entities/content';

export function buildJpSentence(tokens: ResolvedToken[]): string {
  return tokens.map((t) => (t.ref.before ?? '') + t.token.surface + (t.ref.after ?? '')).join('');
}
