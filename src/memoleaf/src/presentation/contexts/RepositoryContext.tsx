import { createContext, useContext } from 'react';
import type { LeafRepository } from '../../domain/repositories/LeafRepository';
import type { MemoKindRepository } from '../../domain/repositories/MemoKindRepository';

/** リポジトリを依存性注入するためのContext型 */
type RepositoryContextType = {
  leafRepository: LeafRepository;
  memoKindRepository: MemoKindRepository;
};

export const RepositoryContext = createContext<RepositoryContextType | null>(null);

/** リポジトリContextを取得するHook */
export function useRepositories(): RepositoryContextType {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error('useRepositories は RepositoryContext.Provider 内で使用してください');
  }
  return ctx;
}
