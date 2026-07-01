import { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { useRegister } from '@/features/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/shared/ui';

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useRegister();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [mismatch, setMismatch] = useState(false);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirm) {
      setMismatch(true);
      return;
    }

    register.mutate({ firstName, lastName, email, password }, { onSuccess: () => navigate('/') });
  }

  function onPassword(v: string) {
    setPassword(v);
    if (mismatch) setMismatch(false);
  }

  function onConfirm(v: string) {
    setConfirm(v);
    if (mismatch) setMismatch(false);
  }

  return (
    <div
      data-component="register-page"
      className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center p-6 gap-4"
    >
      <h1 className="text-base font-semibold text-heading">{t('auth.registerTitle')}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">{t('profile.firstName')}</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">{t('profile.lastName')}</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <PasswordInput
            id="password"
            minLength={8}
            value={password}
            onChange={(e) => onPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm">{t('auth.confirmPassword')}</Label>
          <PasswordInput
            id="confirm"
            minLength={8}
            value={confirm}
            onChange={(e) => onConfirm(e.target.value)}
            required
            aria-invalid={mismatch}
          />
          {mismatch && <p className="text-sm text-destructive">{t('auth.passwordMismatch')}</p>}
        </div>

        {register.isError && <p className="text-sm text-destructive">{t('auth.registerError')}</p>}

        <p className="mt-4 text-sm text-muted-foreground">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="text-primary hover:underline">
            {t('auth.toLogin')}
          </Link>
        </p>

        <Button type="submit" disabled={register.isPending} className="mt-2 cursor-pointer">
          {register.isPending ? t('auth.registerPending') : t('auth.registerSubmit')}
        </Button>
      </form>
    </div>
  );
}
