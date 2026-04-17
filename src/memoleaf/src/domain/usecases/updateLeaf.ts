import type { Leaf, UpdateLeafInput } from '../entities/Leaf';
import type { LeafRepository } from '../repositories/LeafRepository';

/**
 * Leafを更新するユースケース
 * 変更フィールドのみ更新し、updatedAtを現在時刻に更新する
 */
export async function updateLeaf(
  input: UpdateLeafInput,
  leafRepository: LeafRepository,
): Promise<Leaf> {
  const existing = await leafRepository.findById(input.id);
  if (!existing) {
    throw new Error(`Leafが存在しません: ${input.id}`);
  }

  // bodyが指定されている場合は空チェック
  if (input.body !== undefined && input.body.trim() === '') {
    throw new Error('メモ本文を入力してください');
  }

  // タグが指定されている場合は正規化
  const tags =
    input.tags !== undefined
      ? [...new Set(input.tags.map((t) => t.trim()).filter((t) => t !== ''))]
      : existing.tags;

  const updated: Leaf = {
    ...existing,
    body: input.body !== undefined ? input.body : existing.body,
    kindId: input.kindId !== undefined ? input.kindId : existing.kindId,
    tags,
    updatedAt: new Date(),
  };

  await leafRepository.save(updated);
  return updated;
}
