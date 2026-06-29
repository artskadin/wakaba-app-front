import { useEffect, useState } from 'react';

export function usePersistanceState<T extends string>(
  key: string,
  initial: T,
  allowed: readonly T[],
) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);

    return allowed.includes(saved as T) ? (saved as T) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
