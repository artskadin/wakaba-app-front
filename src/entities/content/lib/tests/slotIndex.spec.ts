import { describe, expect, it } from 'vitest';
import type { Sentence } from '../../types';
import { slotIndexForPattern } from '../slotIndex';

const make = (patterns: Sentence['patterns']): Sentence => ({
  id: 's',
  tokens: [{ tokenId: 'a' }, { tokenId: 'b' }, { tokenId: 'c' }],
  translation: { ru: '' },
  romaji: '',
  cyrillicGuide: { ru: '' },
  patterns,
});

describe('slotIndexForPattern', () => {
  it('одна ссылка -> ее focusTokenIndex', () => {
    expect(
      slotIndexForPattern(make([{ patternId: 'ask-where', focusTokenIndex: 1 }]), 'ask-where'),
    ).toBe(1);
  });

  it('две ссылки -> index паттерна шага, а не первый в массиве', () => {
    const s = make([
      { patternId: 'method-onegai', focusTokenIndex: 0 },
      { patternId: 'aks-favor', focusTokenIndex: 2 },
    ]);

    expect(slotIndexForPattern(s, 'aks-favor')).toBe(2);
  });

  it('нет паттерна шага / нет patterns -> undefiend', () => {
    expect(slotIndexForPattern(make([]), 'ask-where')).toBeUndefined();
    expect(slotIndexForPattern(make(undefined), 'aks-where')).toBeUndefined();
    expect(
      slotIndexForPattern(make([{ patternId: 'x', focusTokenIndex: 0 }]), undefined),
    ).toBeUndefined();
  });
});
