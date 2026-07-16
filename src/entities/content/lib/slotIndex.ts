import type { Sentence } from '../types';

export function slotIndexForPattern(
  sentence: Sentence,
  patternId: string | undefined,
): number | undefined {
  if (!patternId) {
    return undefined;
  }

  return sentence.patterns?.find((p) => p.patternId === patternId)?.focusTokenIndex;
}
