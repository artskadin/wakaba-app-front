import { BottomNav } from '@/widgets/bootom-nav';
import { Outlet } from 'react-router';

export function AppLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-md pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
