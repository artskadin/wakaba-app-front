import { create } from 'zustand';
import { applyTheme } from '../applyTheme';
import type { Theme } from '@/entities/settings';

interface ThemeStore {
  theme: Theme;
  setTheme: (t: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
