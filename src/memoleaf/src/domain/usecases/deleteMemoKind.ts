import type { LeafRepository } from '../repositories/LeafRepository';
import type { MemoKindRepository } from '../repositories/MemoKindRepository';
import { UNCATEGORIZED_KIND_ID } from '../../constants/presets';

/**
 * メモ種類を削除するユースケース
 * 削除された種類に属する全LeafのkindIdを「未分類」に変更する
 */
export async function deleteMemoKind(
  id: string,
  memoKindRepository: MemoKindRepository,
  leafRepository: LeafRepository,
): Promise<void> {
  // 削除対象の存在確認
  const kind = await memoKindRepository.findById(id);
  if (!kind) {
    throw new Error(`メモ種類が存在しません: ${id}`);
  }

  // 該当種類を持つ全LeafのkindIdを「未分類」に変更
  const leaves = await leafRepository.findAll({ kindIds: [id] });
  await Promise.all(
    leaves.map((leaf) =>
      leafRepository.save({
        ...leaf,
        kindId: UNCATEGORIZED_KIND_ID,
        updatedAt: new Date(),
      }),
    ),
  );

  await memoKindRepository.delete(id);
}
