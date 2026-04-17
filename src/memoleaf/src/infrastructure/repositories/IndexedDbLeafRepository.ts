import type { Leaf, LeafFilter } from '../../domain/entities/Leaf';
import type { LeafRepository } from '../../domain/repositories/LeafRepository';
import { getDatabase } from '../db/database';

/**
 * IndexedDBを使用したLeafリポジトリ実装
 */
export class IndexedDbLeafRepository implements LeafRepository {
  async save(leaf: Leaf): Promise<void> {
    const db = await getDatabase();
    await db.put('leaves', leaf);
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.delete('leaves', id);
  }

  async findById(id: string): Promise<Leaf | null> {
    const db = await getDatabase();
    const leaf = await db.get('leaves', id);
    return leaf ?? null;
  }

  async findAll(filter?: LeafFilter): Promise<Leaf[]> {
    const db = await getDatabase();
    let leaves = await db.getAllFromIndex('leaves', 'by-createdAt');
    // IndexedDB は昇順で返すため、降順（新しい順）に並び替え
    leaves = leaves.reverse();

    // アーカイブフィルタ（デフォルトはアーカイブ除外）
    const isArchivedFilter = filter?.isArchived ?? false;
    leaves = leaves.filter((l) => l.isArchived === isArchivedFilter);

    if (!filter) return leaves;

    // 種類フィルタ（OR）
    if (filter.kindIds && filter.kindIds.length > 0) {
      leaves = leaves.filter((l) => filter.kindIds!.includes(l.kindId));
    }

    // タグフィルタ
    if (filter.tags && filter.tags.length > 0) {
      const mode = filter.tagFilterMode ?? 'or';
      if (mode === 'and') {
        leaves = leaves.filter((l) =>
          filter.tags!.every((tag) => l.tags.includes(tag)),
        );
      } else {
        leaves = leaves.filter((l) =>
          filter.tags!.some((tag) => l.tags.includes(tag)),
        );
      }
    }

    // 日付フィルタ
    if (filter.dateFrom) {
      leaves = leaves.filter((l) => l.createdAt >= filter.dateFrom!);
    }
    if (filter.dateTo) {
      // dateTo は当日の23:59:59まで含める
      const endOfDay = new Date(filter.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      leaves = leaves.filter((l) => l.createdAt <= endOfDay);
    }

    // キーワード検索（本文・タグを対象）
    if (filter.keyword && filter.keyword.trim() !== '') {
      const kw = filter.keyword.trim().toLowerCase();
      leaves = leaves.filter(
        (l) =>
          l.body.toLowerCase().includes(kw) ||
          l.tags.some((t) => t.toLowerCase().includes(kw)),
      );
    }

    return leaves;
  }

  async findRecent(limit: number): Promise<Leaf[]> {
    const all = await this.findAll();
    return all.slice(0, limit);
  }

  async getAllTags(): Promise<string[]> {
    const db = await getDatabase();
    const leaves = await db.getAll('leaves');
    const tagSet = new Set<string>();
    leaves
      .filter((l) => !l.isArchived)
      .forEach((l) => l.tags.forEach((t) => tagSet.add(t)));
    return [...tagSet].sort();
  }
}
