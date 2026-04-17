import type { MemoKindRepository } from '../domain/repositories/MemoKindRepository';
import { PRESET_MEMO_KINDS, UNCATEGORIZED_MEMO_KIND } from '../constants/presets';

/**
 * 初回起動時にプリセットのメモ種類を投入する
 * 既にデータが存在する場合はスキップする
 */
export async function seedInitialData(
  memoKindRepository: MemoKindRepository,
): Promise<void> {
  const existing = await memoKindRepository.findAll();
  if (existing.length > 0) return;

  // 未分類（削除不可の特別種類）を最初に保存
  await memoKindRepository.save(UNCATEGORIZED_MEMO_KIND);

  // プリセットの4種類を順番に保存
  for (const preset of PRESET_MEMO_KINDS) {
    await memoKindRepository.save({
      ...preset,
      id: crypto.randomUUID(),
    });
  }
}
