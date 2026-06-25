let current: HTMLAudioElement | null = null;

export function playAudio(url: string): Promise<void> {
  if (current) {
    current.pause();
    current = null;
  }

  const audio = new Audio(url);
  current = audio;

  return audio.play().catch(() => {});
}
