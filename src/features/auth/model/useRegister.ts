import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from './authStore';
import { authRepo } from '../api/authRepo';

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (input: { email: string; password: string; firstName: string; lastName: string }) =>
      authRepo.register(input),
    onSuccess: (user) => setUser(user),
  });
}
