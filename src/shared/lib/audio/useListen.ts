import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { playAudio } from './play';

export function useListen() {
  const { t } = useTranslation();

  return (url: string) => {
    playAudio(url).catch(() => toast.error(t('common.playbackFailed')));
  };
}
