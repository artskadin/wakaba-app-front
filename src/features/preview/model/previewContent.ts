import type { LessonBundle } from '@/entities/content';

const modules = import.meta.glob('./drafts/*.json', { eager: true });

const drafts: Record<string, LessonBundle> = {};

for (const path in modules) {
  const bundle = (modules[path] as { default: LessonBundle }).default;
  drafts[bundle.lesson.id] = bundle;
}

export const previewContentRepo = {
  list() {
    return Object.values(drafts).map((b) => ({
      id: b.lesson.id,
      title: b.lesson.title,
      context: b.lesson.context,
    }));
  },
  getLessonBundle(id: string): LessonBundle {
    const bundle = drafts[id];

    if (!bundle) {
      throw new Error(`Lesson bundle not found: ${id}`);
    }

    return bundle;
  },
};
