import { useRepos } from '@/shared/api/repos';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTokenFavourite(tokenId: string) {
  const { favourites: favouriteRepo } = useRepos();
  const queryClient = useQueryClient();

  const { data: favourites } = useQuery({
    queryKey: ['favourites'],
    queryFn: () => favouriteRepo.getAll(),
  });
  const favouriteTokenIds = new Set((favourites ?? []).map((f) => f.tokenId));
  const isFavourite = favouriteTokenIds.has(tokenId);

  const mutation = useMutation({
    mutationFn: () =>
      isFavourite
        ? favouriteRepo.remove('token', tokenId)
        : favouriteRepo.add({ itemType: 'token', tokenId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favourites'] }),
  });

  return { isFavourite, toggle: () => mutation.mutate(), isPending: mutation.isPending };
}
