import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function ConnectionError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="grid min-h-dvh place-items-center p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="font-semibold text-heading">{t('common.connectionError.title')}</p>
        <p className="text-sm text-muted-foreground">{t('common.connectionError.hint')}</p>
        <Button onClick={onRetry}>{t('common.retry')}</Button>
      </div>
    </div>
  );
}
