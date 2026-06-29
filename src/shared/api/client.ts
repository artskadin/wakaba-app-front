import { tokenStore } from './token';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:3000';

export const api = axios.create({ baseURL: API_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshing: Promise<string> | null = null;

async function refreshAccess(): Promise<string> {
  const { data } = await axios.post<{ accessToken: string }>(
    `${API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );

  tokenStore.set(data.accessToken);

  return data.accessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const url = original?.url ?? '';
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh');

    if (error.response?.status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;

      try {
        refreshing ??= refreshAccess().finally(() => {
          refreshing = null;
        });

        const token = await refreshing;
        original.headers.Authorization = `Bearer ${token}`;

        return api(original);
      } catch (e) {
        tokenStore.set(null);
        throw e;
      }
    }

    throw error;
  },
);
