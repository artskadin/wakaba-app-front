import type { Favourite, FavouriteItemType } from '@/entities/favourites';
import { api } from './client';

export const favouriteRepo = {
  async getAll(): Promise<Favourite[]> {
    const { data } = await api.get('/favourites');

    return data;
  },

  async add(input: {
    itemType: FavouriteItemType;
    tokenId?: string;
    sentenceId?: string;
  }): Promise<void> {
    await api.post('/favourites', input);
  },

  async remove(itemType: FavouriteItemType, id: string): Promise<void> {
    await api.delete(`/favourites/${itemType}/${id}`);
  },
};
