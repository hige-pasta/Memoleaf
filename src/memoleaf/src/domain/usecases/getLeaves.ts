import type { Leaf, LeafFilter } from '../entities/Leaf';
import type { LeafRepository } from '../repositories/LeafRepository';

/**
 * フィルタ条件でLeafを取得するユースケース（createdAt降順）
 */
export async function getLeaves(
  leafRepository: LeafRepository,
  filter?: LeafFilter,
): Promise<Leaf[]> {
  return leafRepository.findAll(filter);
}
