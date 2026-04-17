import { useState, useEffect, useCallback } from 'react';
import type { MemoKind } from '../../domain/entities/MemoKind';
import { useRepositories } from '../contexts/RepositoryContext';
import { createMemoKind } from '../../domain/usecases/createMemoKind';
import { deleteMemoKind } from '../../domain/usecases/deleteMemoKind';
import { reorderMemoKinds } from '../../domain/usecases/reorderMemoKinds';

/**
 * メモ種類の一覧取得・CRUD操作を提供するHook
 */
export function useMemoKinds() {
  const { memoKindRepository, leafRepository } = useRepositories();
  const [memoKinds, setMemoKinds] = useState<MemoKind[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const kinds = await memoKindRepository.findAll();
    setMemoKinds(kinds);
  }, [memoKindRepository]);

  useEffect(() => {
    setIsLoading(true);
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const create = useCallback(
    async (input: { name: string; color: string }): Promise<MemoKind> => {
      const kind = await createMemoKind(input, memoKindRepository);
      await refresh();
      return kind;
    },
    [memoKindRepository, refresh],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await deleteMemoKind(id, memoKindRepository, leafRepository);
      await refresh();
    },
    [memoKindRepository, leafRepository, refresh],
  );

  const reorder = useCallback(
    async (orderedIds: string[]): Promise<void> => {
      await reorderMemoKinds(orderedIds, memoKindRepository);
      await refresh();
    },
    [memoKindRepository, refresh],
  );

  return { memoKinds, isLoading, createMemoKind: create, deleteMemoKind: remove, reorderMemoKinds: reorder };
}
