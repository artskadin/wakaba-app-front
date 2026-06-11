import i18n from '../config/i18n';
import type { LocallizedText } from '@/entities/content';

export function localize(text: LocallizedText): string {
  const lng = i18n.language as keyof LocallizedText;

  return text[lng] ?? text.ru;
}
