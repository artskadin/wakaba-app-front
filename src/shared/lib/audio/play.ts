let current: HTMLAudioElement | null = null;

export function playAudio(url: string): Promise<void> {
  if (current) {
    current.pause();
    current = null;
  }

  const audio = new Audio(url);
  current = audio;

  return audio.play().catch((err: unknown) => {
    if (err instanceof DOMException && err.name === 'AbortError') return;

    throw err;
  });
}
