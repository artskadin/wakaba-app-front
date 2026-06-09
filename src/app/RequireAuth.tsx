import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/features/auth';

export function RequireAuth() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
