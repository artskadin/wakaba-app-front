import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';

function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => setDark(el.classList.contains('dark')));

    observer.observe(el, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return dark;
}

export function AppToaster() {
  const isDark = useIsDark();

  return (
    <Toaster
      richColors
      position="top-center"
      theme={isDark ? 'dark' : 'light'}
      closeButton
      duration={2000}
    />
  );
}
