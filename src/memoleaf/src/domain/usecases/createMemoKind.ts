import type { MemoKind } from '../entities/MemoKind';
import type { MemoKindRepository } from '../repositories/MemoKindRepository';

/** メモ種類作成の入力型 */
export type CreateMemoKindInput = {
  name: string;
  color: string;
};

/**
 * メモ種類を新規作成するユースケース
 */
export async function createMemoKind(
  input: CreateMemoKindInput,
  memoKindRepository: MemoKindRepository,
): Promise<MemoKind> {
  // 名前の空チェック
  if (input.name.trim() === '') {
    throw new Error('種類名を入力してください');
  }

  // 重複チェック
  const existing = await memoKindRepository.findAll();
  const isDuplicate = existing.some((k) => k.name === input.name.trim());
  if (isDuplicate) {
    throw new Error(`同じ名前の種類がすでに存在します: ${input.name}`);
  }

  // 新しい表示順を末尾に設定
  const maxOrder = existing.reduce((max, k) => Math.max(max, k.order), -1);

  const kind: MemoKind = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    color: input.color,
    order: maxOrder + 1,
  };

  await memoKindRepository.save(kind);
  return kind;
}
