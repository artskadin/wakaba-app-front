import { useCallback, useEffect, useState } from 'react';
import { authRepo } from '../api/authRepo';
import { useAuthStore } from './authStore';
import { isAxiosError } from 'axios';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated' | 'error';

export function useInitAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    let alive = true;

    authRepo
      .me()
      .then((user) => {
        if (!alive) return;

        setUser(user);
        setStatus('authenticated');
      })
      .catch((err: unknown) => {
        if (!alive) return;

        setUser(null);
        setStatus(isAxiosError(err) && err.response?.status === 401 ? 'unauthenticated' : 'error');
      });

    return () => {
      alive = false;
    };
  }, [setUser, attempts]);

  const retry = useCallback(() => {
    setStatus('checking');
    setAttempts((n) => n + 1);
  }, []);

  return { status, retry };
}
