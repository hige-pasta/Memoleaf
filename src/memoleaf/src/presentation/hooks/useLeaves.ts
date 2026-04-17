import { useState, useEffect, useCallback } from 'react';
import type { Leaf, CreateLeafInput } from '../../domain/entities/Leaf';
import { createLeaf } from '../../domain/usecases/createLeaf';
import { updateLeaf } from '../../domain/usecases/updateLeaf';
import { deleteLeaf } from '../../domain/usecases/deleteLeaf';
import { useRepositories } from '../contexts/RepositoryContext';
import { RECENT_LEAVES_LIMIT } from '../../constants/presets';

/**
 * Leaf CRUD操作・一覧取得を提供するHook
 */
export function useLeaves() {
  const { leafRepository, memoKindRepository } = useRepositories();
  const [recentLeaves, setRecentLeaves] = useState<Leaf[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const leaves = await leafRepository.findRecent(RECENT_LEAVES_LIMIT);
    setRecentLeaves(leaves);
  }, [leafRepository]);

  useEffect(() => {
    setIsLoading(true);
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const create = useCallback(
    async (input: CreateLeafInput): Promise<Leaf> => {
      const leaf = await createLeaf(input, leafRepository, memoKindRepository);
      await refresh();
      return leaf;
    },
    [leafRepository, memoKindRepository, refresh],
  );

  const update = useCallback(
    async (input: Parameters<typeof updateLeaf>[0]): Promise<Leaf> => {
      const leaf = await updateLeaf(input, leafRepository);
      await refresh();
      return leaf;
    },
    [leafRepository, refresh],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await deleteLeaf(id, leafRepository);
      await refresh();
    },
    [leafRepository, refresh],
  );

  return {
    recentLeaves,
    isLoading,
    createLeaf: create,
    updateLeaf: update,
    deleteLeaf: remove,
    refreshLeaves: refresh,
  };
}
