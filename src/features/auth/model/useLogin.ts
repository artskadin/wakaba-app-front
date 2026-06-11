import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from './authStore';
import { authRepo } from '../api/authRepo';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      authRepo.login(creds.email, creds.password),
    onSuccess: (user) => setUser(user),
  });
}
