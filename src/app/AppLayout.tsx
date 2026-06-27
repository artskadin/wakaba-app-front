import { applyTheme } from '@/features/theme/applyTheme';
import { settingsRepo } from '@/shared/api/settingsRepo';
import { BottomNav } from '@/widgets/bootom-nav';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet } from 'react-router';

export function AppLayout() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsRepo.get(),
  });

  useEffect(() => {
    if (settings?.theme) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme]);

  return (
    <div className="mx-auto min-h-screen max-w-md pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
