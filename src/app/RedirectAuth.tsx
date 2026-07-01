import { useAuthStore } from '@/features/auth';
import { Navigate, Outlet } from 'react-router';

export function RedirectAuth() {
  const user = useAuthStore((s) => s.user);

  return user ? <Navigate to="/" replace /> : <Outlet />;
}
