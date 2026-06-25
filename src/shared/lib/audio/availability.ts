import { useEffect, useState } from 'react';

const cache = new Map<string, Promise<boolean>>();

export function checkAudioAvailable(url: string): Promise<boolean> {
  let result = cache.get(url);

  if (!result) {
    result = fetch(url, { method: 'HEAD' })
      .then((res) => res.ok)
      .catch(() => false);

    cache.set(url, result);
  }

  return result;
}

export function useAudioAvailable(url: string | null) {
  const [status, setStatus] = useState<'unknown' | 'available' | 'missing'>('unknown');

  useEffect(() => {
    if (!url) {
      return;
    }

    let alive = true;
    checkAudioAvailable(url).then((ok) => {
      if (alive) {
        setStatus(ok ? 'available' : 'missing');
      }
    });

    return () => {
      alive = false;
    };
  }, [url]);

  return url ? status : 'missing';
}
