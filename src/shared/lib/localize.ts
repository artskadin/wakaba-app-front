import i18n from '../config/i18n';
import type { LocalizedText } from '@/entities/content';

export function localize(text: LocalizedText): string {
  const lng = i18n.language as keyof LocalizedText;

  return text[lng] ?? text.ru;
}
