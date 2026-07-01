import { useState, type ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordInput({ className, ...props }: ComponentProps<typeof Input>) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`pr-10 ${className ?? ''}`}
      />
      <Button
        type="button"
        variant="ghost"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('common.hidePassword') : t('common.showPassword')}
        className="absolute inset-y-0 right-0 items-center pr-3 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
