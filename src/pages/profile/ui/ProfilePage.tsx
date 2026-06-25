import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { authRepo, useAuthStore } from '@/features/auth';
import { progressRepo } from '@/shared/api/progressRepo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserSettings, Voice } from '@/entities/settings';
import { settingsRepo } from '@/shared/api/settingsRepo';
import { playAudio } from '@/shared/lib/audio/play';
import { audioUrl } from '@/shared/lib/audio/url';
import { VoiceToggle } from '@/shared/ui/VoiceToggle';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function ProfilePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressRepo.getAll(),
  });
  const completedCount = (progress ?? []).filter((item) => item.status === 'completed').length;

  const { data: settings, isPending: isSettingsPending } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsRepo.get(),
  });

  const updateVoice = useMutation({
    mutationFn: (voice: Voice) => settingsRepo.update({ voice }),
    onMutate: async (voice) => {
      await queryClient.cancelQueries({ queryKey: ['settings'] });
      const prev = queryClient.getQueryData<UserSettings>(['settings']);
      queryClient.setQueryData<UserSettings>(['settings'], (old) =>
        old ? { ...old, voice } : old,
      );

      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['settings'], ctx.prev);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  function handleVoiceChange(voice: Voice) {
    updateVoice.mutate(voice);
    playAudio(audioUrl('samples', 'force', voice));
  }

  async function handleLogout() {
    await authRepo.logout();
    setUser(null);
  }

  if (!user) {
    return <div className="p-6">Загрузка информации о пользователе...</div>;
  }

  return (
    <div className="p-6">
      <h1 className=" text-2xl font-semibold">{t('nav.profile')}</h1>
      <div className="mt-6 flex flex-col gap-3 rounded-xl border p-4">
        <Row label={t('profile.email')} value={user.email} />
        <Row
          label={t('profile.registered')}
          value={new Date(user.createdAt).toLocaleDateString()}
        />
        <Row label={t('profile.completed')} value={String(completedCount)} />

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">{t('profile.voiceTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('profile.voiceHint')}</p>

          {isSettingsPending ? (
            <div className="size-10 animate-pulse rounded-full bg-muted" />
          ) : (
            <VoiceToggle value={settings?.voice ?? 'f'} onChange={handleVoiceChange} />
          )}
        </section>
      </div>
      <Button variant="outline" className="mt-6 w-full" onClick={handleLogout}>
        {t('tracks.logout')}
      </Button>
    </div>
  );
}
