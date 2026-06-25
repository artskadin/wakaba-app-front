import { RepoContext, type Repos } from './repos';

export function RepoProvider({ repos, children }: { repos: Repos; children: React.ReactNode }) {
  return <RepoContext.Provider value={repos}>{children}</RepoContext.Provider>;
}
