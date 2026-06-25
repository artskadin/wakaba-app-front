import type { Favourite } from '@/entities/favourites';
import type { LessonProgress } from '@/entities/progress';
import type { Repos } from '@/shared/api/repos';
import { useMemo, useRef } from 'react';

export function usePreviewRepos(): Repos {
  const favouritesRef = useRef<Favourite[]>([]);
  const progressRef = useRef<Record<string, LessonProgress>>({});

  return useMemo<Repos>(
    () => ({
      progress: {
        async getAll() {
          return Object.values(progressRef.current);
        },
        async save(lessonId, input) {
          const record: LessonProgress = {
            lessonId,
            currentStep: input.currentStep,
            status: input.status,
            completedAt: input.status === 'completed' ? new Date().toISOString() : null,
          };

          progressRef.current = { ...progressRef.current, [lessonId]: record };

          return record;
        },
      },
      favourites: {
        async getAll() {
          return favouritesRef.current;
        },
        async add(input) {
          favouritesRef.current = [...favouritesRef.current, { ...input } as Favourite];
        },
        async remove(itemType, id) {
          favouritesRef.current = favouritesRef.current.filter(
            (f) => !(f.itemType === itemType && (f.tokenId === id || f.sentenceId === id)),
          );
        },
      },
    }),
    [],
  );
}
