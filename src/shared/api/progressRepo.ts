import type { LessonProgress, LessonStatus } from '@/entities/progress';
import { api } from './client';

export const progressRepo = {
  async getAll(): Promise<LessonProgress[]> {
    const { data } = await api.get<LessonProgress[]>('/progress');

    return data;
  },

  async save(
    lessonId: string,
    input: { currentStep: number; status: LessonStatus },
  ): Promise<LessonProgress> {
    const { data } = await api.put<LessonProgress>(`/progress/${lessonId}`, input);

    return data;
  },
};
