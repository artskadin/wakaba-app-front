import { create } from 'zustand';
import { applyTheme } from '../applyTheme';
import type { Theme } from '@/entities/settings';

interface ThemeStore {
  theme: Theme;
  setTheme: (t: 'light' | 'dark') => void;
}

function getStoredTheme(): Theme {
  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
