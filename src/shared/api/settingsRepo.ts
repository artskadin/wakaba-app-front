import type { UserSettings } from '@/entities/settings';
import { api } from './client';

export const settingsRepo = {
  async get(): Promise<UserSettings> {
    const { data } = await api.get<UserSettings>('/settings');

    return data;
  },

  async update(input: Partial<UserSettings>): Promise<UserSettings> {
    const { data } = await api.patch<UserSettings>('/settings', input);

    return data;
  },
};
