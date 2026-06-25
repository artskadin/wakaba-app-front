import { createContext, useContext } from 'react';
import { favouriteRepo } from './favouriteRepo';
import { progressRepo } from './progressRepo';

export interface Repos {
  progress: typeof progressRepo;
  favourites: typeof favouriteRepo;
}

const realRepos: Repos = {
  progress: progressRepo,
  favourites: favouriteRepo,
};

export const RepoContext = createContext<Repos>(realRepos);

export function useRepos(): Repos {
  return useContext(RepoContext);
}
