export type Voice = 'm' | 'f';
export type Theme = 'light' | 'dark';

export interface UserSettings {
  voice: Voice;
  theme: Theme;
}
