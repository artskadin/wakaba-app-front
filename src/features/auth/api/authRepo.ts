import type { User } from '@/entities/user';

export interface AuthRepo {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
}

export const mockAuthRepo: AuthRepo = {
  async login(email) {
    await new Promise((res) => setTimeout(res, 400));

    return { id: '1', email };
  },
  async logout() {},
};
