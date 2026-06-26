import type { FavouriteItemType } from '@/entities/favourites';
import { useRepos } from '@/shared/api/repos';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useFavourites(itemType: FavouriteItemType, id: string) {
  const { favourites: favouriteRepos } = useRepos();
  const queryClient = useQueryClient();

  const { data: favourites } = useQuery({
    queryKey: ['favourites'],
    queryFn: () => favouriteRepos.getAll(),
  });

  const ids = new Set(
    (favourites ?? [])
      .filter((f) => f.itemType === itemType)
      .map((f) => (f.itemType === 'token' ? f.tokenId : f.sentenceId)),
  );

  const isFavourite = ids.has(id);

  const mutation = useMutation({
    mutationFn: () =>
      isFavourite
        ? favouriteRepos.remove(itemType, id)
        : favouriteRepos.add(
            itemType === 'token' ? { itemType, tokenId: id } : { itemType, sentenceId: id },
          ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favourites'] }),
  });

  return { isFavourite, toggle: () => mutation.mutate(), isPending: mutation.isPending };
}

export const useTokenFavourite = (tokenId: string) => useFavourites('token', tokenId);
export const useSentenceFavourite = (sentenceId: string) => useFavourites('sentence', sentenceId);
