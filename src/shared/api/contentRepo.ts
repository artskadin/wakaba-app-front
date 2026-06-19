import type { ContentManifest, LessonBundle, TrackManifest } from '@/entities/content';
import { api } from './client';

let manifest: ContentManifest | null = null;
const lessons = new Map<string, LessonBundle>();

async function loadManifest(): Promise<ContentManifest> {
  if (!manifest) {
    const { data } = await api.get<ContentManifest>('/content/manifest');
    manifest = data;
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

    const { data } = await api.get<LessonBundle>(`/content/lessons/${id}`);

    lessons.set(id, data);

    return data;
  },
};
