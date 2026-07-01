import { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { useLogin } from '@/features/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/shared/ui';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    console.log('LoginPage');
    e.preventDefault();
    login.mutate({ email, password }, { onSuccess: () => navigate('/tracks') });
  }

  return (
    <div
      data-component="login-page"
      className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6"
    >
      <h1 className="text-base font-semibold text-heading">{t('login.title')}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t('login.email')}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t('login.password')}</Label>
          <PasswordInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {login.isError && <p className="text-sm text-destructive">{t('login.error')}</p>}

        <p className="mt-4 text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary hover:underline">
            {t('auth.toRegister')}
          </Link>
        </p>

        <Button type="submit" disabled={login.isPending} className="cursor-pointer">
          {login.isPending ? '...' : t('login.submit')}
        </Button>
      </form>
    </div>
  );
}
