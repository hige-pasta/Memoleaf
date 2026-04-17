import type { MemoKindRepository } from '../repositories/MemoKindRepository';

/**
 * メモ種類の表示順を並び替えるユースケース
 * orderedIdsの順序通りにorderフィールドを更新する
 */
export async function reorderMemoKinds(
  orderedIds: string[],
  memoKindRepository: MemoKindRepository,
): Promise<void> {
  await memoKindRepository.reorder(orderedIds);
}
