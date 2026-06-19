export type LessonStatus = 'available' | 'in_progress' | 'completed';

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  currentStep: number;
  completedAt: string | null;
}
