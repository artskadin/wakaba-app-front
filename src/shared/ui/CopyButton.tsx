import { useTranslation } from 'react-i18next';
import { useCopy } from '../lib/useCopy';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

export function CopyButton({ text }: { text: string }) {
  const { t } = useTranslation();
  const { copied, copy } = useCopy();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => copy(text)}
      aria-label={copied ? t('common.copied') : t('common.copy')}
      className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="text-primary" /> {t('common.copied')}
        </>
      ) : (
        <>
          <Copy /> {t('common.hieroglyphs')}
        </>
      )}
    </Button>
  );
}
