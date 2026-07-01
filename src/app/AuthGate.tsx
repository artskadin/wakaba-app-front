import { useInitAuth } from '@/features/auth';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectionError } from './ConnectionError';

export function AuthGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { status, retry } = useInitAuth();

  if (status === 'checking') {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

  if (status === 'error') {
    return <ConnectionError onRetry={retry} />;
  }

  return <>{children}</>;
}
