import { useEffect, useState } from 'react';
import { authRepo } from '../api/authRepo';
import { useAuthStore } from './authStore';

export function useInitAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authRepo
      .me()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, [setUser]);

  return ready;
}
