import { api } from '@/shared/api/client';
import { tokenStore } from '@/shared/api/token';
import type { User } from '@/entities/user';

export interface AuthRepo {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  me(): Promise<User>;
}

export const authRepo: AuthRepo = {
  async login(email, password) {
    const { data } = await api.post<{ accessToken: string; user: User }>('/auth/login', {
      email,
      password,
    });

    tokenStore.set(data.accessToken);

    return data.user;
  },

  async logout() {
    await api.post('/auth/logout');
    tokenStore.set(null);
  },

  async me() {
    const { data } = await api.get<User>('/auth/me');

    return data;
  },
};

export const mockAuthRepo: AuthRepo = {
  async login(email) {
    await new Promise((res) => setTimeout(res, 400));

    return { id: '1', email };
  },

  async logout() {},

  async me() {
    return { id: '1', email: 'pupa@lupa.com' };
  },
};
