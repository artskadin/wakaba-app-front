import { useState, type ReactNode } from 'react';
import { AudioLockContext } from './useAudioLockReporter';

export function AudioLockProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <AudioLockContext.Provider value={{ active, setActive }}>{children}</AudioLockContext.Provider>
  );
}
