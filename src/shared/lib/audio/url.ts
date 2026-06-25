import type { Voice } from '@/entities/settings';

const BASE = import.meta.env.VITE_AUDIO_BASE_URL ?? '/audio';

export function audioUrl(category: 'samples' | 'tokens' | 'sentences', id: string, voice: Voice) {
  return `${BASE}/${category}/${id}.${voice}.mp3`;
}
