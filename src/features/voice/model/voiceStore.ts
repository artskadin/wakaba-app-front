import { create } from 'zustand';
import type { Voice } from '@/entities/settings';

interface VoiceState {
  voice: Voice;
  setVoice: (v: Voice) => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  voice: 'm',
  setVoice: (voice) => set({ voice }),
}));
