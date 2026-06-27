import type { Theme, UserSettings } from '@/entities/settings';
import { settingsRepo } from '@/shared/api/settingsRepo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applyTheme } from './applyTheme';

export function useThemeSetting() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsRepo.get(),
  });
  const theme: Theme = settings?.theme ?? 'light';

  const mutation = useMutation({
    mutationFn: (next: Theme) => settingsRepo.update({ theme: next }),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: ['settings'] });
      const prev = queryClient.getQueryData<UserSettings>(['settings']);
      queryClient.setQueryData(['settings'], (o) => (o ? { ...o, theme: next } : o));
      applyTheme(next);

      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['settings'], ctx.prev);
        applyTheme(ctx.prev.theme);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  return { theme, setTheme: (t: Theme) => mutation.mutate(t) };
}
