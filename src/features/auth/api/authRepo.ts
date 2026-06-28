import { api } from '@/shared/api/client';
import { tokenStore } from '@/shared/api/token';
import type { User } from '@/entities/user';

export interface AuthRepo {
  register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  me(): Promise<User>;
  updateProfile(input: { firstName?: string; lastName?: string }): Promise<User>;
}

export const authRepo: AuthRepo = {
  async register(input) {
    const { data } = await api.post<{ accessToken: string; user: User }>('/auth/register', input);
    tokenStore.set(data.accessToken);

    return data.user;
  },

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

  async updateProfile(input: { firstName?: string; lastName?: string }) {
    const { data } = await api.patch<User>('/auth/me', input);

    return data;
  },
};

export const mockAuthRepo: AuthRepo = {
  async register(input) {
    await new Promise((res) => setTimeout(res, 400));

    return {
      id: '1',
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      createdAt: new Date().toISOString(),
    };
  },

  async login(email) {
    await new Promise((res) => setTimeout(res, 400));

    return {
      id: '1',
      email,
      firstName: 'Pupa',
      lastName: 'Lupov',
      createdAt: new Date().toISOString(),
    };
  },

  async logout() {},

  async me() {
    return {
      id: '1',
      email: 'pupa@lupa.com',
      firstName: 'Pupa',
      lastName: 'Lupov',
      createdAt: new Date().toISOString(),
    };
  },

  async updateProfile(input: { firstName?: string; lastName?: string }): Promise<User> {
    return {
      id: '1',
      email: 'pupa@lupa.com',
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      createdAt: new Date().toISOString(),
    };
  },
};
