import { createContext, useContext, useEffect, type Dispatch, type SetStateAction } from 'react';
import type { PronounceMode } from './usePronounce';

export interface AudioLock {
  active: string | null;
  setActive: Dispatch<SetStateAction<string | null>>;
}

export const AudioLockContext = createContext<AudioLock>({ active: null, setActive: () => {} });

export function useAudioLockReporter(mode: PronounceMode, lockKey?: string) {
  const { active, setActive } = useContext(AudioLockContext);

  useEffect(() => {
    if (!lockKey) {
      return;
    }

    if (mode !== 'idle') {
      setActive(lockKey);
    } else {
      setActive((cur) => (cur === lockKey ? null : cur));
    }
  }, [mode, lockKey, setActive]);

  return !!lockKey && active !== null && active !== lockKey;
}
