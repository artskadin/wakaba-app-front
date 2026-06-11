import type { ContentManifest, LessonBundle, TrackManifest } from '@/entities/content';

let manifest: ContentManifest | null = null;
const lessons = new Map<string, LessonBundle>();

async function loadManifest(): Promise<ContentManifest> {
  if (!manifest) {
    const res = await fetch('/content/manifest.json');
    manifest = (await res.json()) as ContentManifest;
  }

  return manifest;
}

export const contentRepo = {
  async getTracks(): Promise<TrackManifest[]> {
    return (await loadManifest()).tracks;
  },

  async getLessonBundle(id: string): Promise<LessonBundle> {
    const cache = lessons.get(id);

    if (cache) {
      return cache;
    }

    const res = await fetch(`/content/lessons/${id}.json`);
    if (!res) {
      throw new Error(`Lesson ${id} not found`);
    }

    const bundle = (await res.json()) as LessonBundle;
    lessons.set(id, bundle);

    return bundle;
  },
};
