import { useEffect, useRef, useState } from 'react';

export type PronounceMode = 'idle' | 'recording' | 'playing-sentence' | 'playing-self';

export function usePronounce(opts?: {
  onRecorded?: (blob: Blob | null) => void;
  onError?: (kind: 'record' | 'play') => void;
}) {
  const [mode, setMode] = useState<PronounceMode>('idle');
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [selfDuration, setSelfDuration] = useState(0);
  const [selfRemaining, setSelfRemaining] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recordRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const selfUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tickRef = useRef<number | null>(null);
  const recSecRef = useRef(0);
  const onRecordedRef = useRef(opts?.onRecorded);
  const onErrorRef = useRef(opts?.onError);

  useEffect(() => {
    onRecordedRef.current = opts?.onRecorded;
  });
  useEffect(() => {
    onErrorRef.current = opts?.onError;
  });

  const clearTick = () => {
    if (tickRef.current !== null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const getAudio = () => (audioRef.current ??= new Audio());

  const reset = () => {
    clearTick();
    setMode('idle');
  };

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        blobRef.current = blob;

        if (selfUrlRef.current) {
          URL.revokeObjectURL(selfUrlRef.current);
        }

        selfUrlRef.current = URL.createObjectURL(blob);

        setSelfDuration(recSecRef.current);
        setHasRecording(true);

        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        onRecordedRef.current?.(blob);
      };

      recordRef.current = recorder;
      recorder.start();
      recSecRef.current = 0;
      setRecordSeconds(0);
      setMode('recording');
      clearTick();
      tickRef.current = window.setInterval(() => {
        recSecRef.current += 1;
        setRecordSeconds(recSecRef.current);
      }, 1000);
    } catch {
      reset();
      onErrorRef.current?.('record');
    }
  }

  function stopRecording() {
    recordRef.current?.stop();
    reset();
  }

  function playSelf() {
    if (!selfUrlRef.current) {
      return;
    }

    const audio = getAudio();
    audio.src = selfUrlRef.current;
    setSelfRemaining(selfDuration);

    audio.ontimeupdate = () =>
      setSelfRemaining(Math.max(0, selfDuration - Math.floor(audio.currentTime)));
    audio.onended = () => reset();
    setMode('playing-self');
    audio.play().catch((err: unknown) => {
      reset();
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        onErrorRef.current?.('play');
      }
    });
  }

  function playSentence(url: string) {
    const audio = getAudio();
    audio.src = url;
    audio.ontimeupdate = null;
    audio.onended = () => reset();
    setMode('playing-sentence');
    audio.play().catch((err: unknown) => {
      reset();

      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        onErrorRef.current?.('play');
      }
    });
  }

  function stop() {
    audioRef.current?.pause();
    reset();
  }

  useEffect(
    () => () => {
      clearTick();

      if (recordRef.current) {
        recordRef.current.onstop = null;
      }

      streamRef.current?.getTracks().forEach((t) => t.stop());

      if (selfUrlRef.current) {
        URL.revokeObjectURL(selfUrlRef.current);
      }
    },
    [],
  );

  return {
    mode,
    hasRecording,
    recordSeconds,
    selfDuration,
    selfRemaining,
    startRecording,
    stopRecording,
    playSelf,
    playSentence,
    stop,
    blob: blobRef,
  };
}
