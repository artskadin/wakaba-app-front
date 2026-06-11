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

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      try {
        refreshing ??= refreshAccess();
        const token = await refreshing;
        original.headers.Authorization = `Bearer ${token}`;

        return api(original);
      } catch (e) {
        tokenStore.set(null);
        throw e;
      } finally {
        refreshing = null;
      }
    }

    throw error;
  },
);
