import type { LeafRepository } from '../repositories/LeafRepository';

/**
 * Leafを削除するユースケース
 */
export async function deleteLeaf(
  id: string,
  leafRepository: LeafRepository,
): Promise<void> {
  const existing = await leafRepository.findById(id);
  if (!existing) {
    throw new Error(`Leafが存在しません: ${id}`);
  }

  await leafRepository.delete(id);
}
