import type { Leaf, CreateLeafInput } from '../entities/Leaf';
import type { LeafRepository } from '../repositories/LeafRepository';
import type { MemoKindRepository } from '../repositories/MemoKindRepository';

/**
 * Leafを新規作成するユースケース
 * バリデーション・タグ正規化・保存・lastUsedKindId更新を行う
 */
export async function createLeaf(
  input: CreateLeafInput,
  leafRepository: LeafRepository,
  memoKindRepository: MemoKindRepository,
): Promise<Leaf> {
  // 本文バリデーション
  if (input.body.trim() === '') {
    throw new Error('メモ本文を入力してください');
  }

  // kindIdの存在検証
  const kind = await memoKindRepository.findById(input.kindId);
  if (!kind) {
    throw new Error(`指定されたメモ種類が存在しません: ${input.kindId}`);
  }

  // タグを正規化（トリム・空文字除去・重複排除）
  const tags = [...new Set(input.tags.map((t) => t.trim()).filter((t) => t !== ''))];

  const now = new Date();
  const leaf: Leaf = {
    id: crypto.randomUUID(),
    body: input.body,
    kindId: input.kindId,
    tags,
    createdAt: now,
    updatedAt: now,
    isArchived: false,
    archivedAt: null,
  };

  await leafRepository.save(leaf);
  return leaf;
}
