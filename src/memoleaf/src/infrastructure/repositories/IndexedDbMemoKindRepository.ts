import type { MemoKind } from '../../domain/entities/MemoKind';
import type { MemoKindRepository } from '../../domain/repositories/MemoKindRepository';
import { getDatabase } from '../db/database';

/**
 * IndexedDBを使用したMemoKindリポジトリ実装
 */
export class IndexedDbMemoKindRepository implements MemoKindRepository {
  async save(kind: MemoKind): Promise<void> {
    const db = await getDatabase();
    await db.put('memoKinds', kind);
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.delete('memoKinds', id);
  }

  async findById(id: string): Promise<MemoKind | null> {
    const db = await getDatabase();
    const kind = await db.get('memoKinds', id);
    return kind ?? null;
  }

  async findAll(): Promise<MemoKind[]> {
    const db = await getDatabase();
    const kinds = await db.getAllFromIndex('memoKinds', 'by-order');
    return kinds;
  }

  async reorder(orderedIds: string[]): Promise<void> {
    const db = await getDatabase();
    const tx = db.transaction('memoKinds', 'readwrite');
    await Promise.all(
      orderedIds.map(async (id, index) => {
        const kind = await tx.store.get(id);
        if (kind) {
          await tx.store.put({ ...kind, order: index });
        }
      }),
    );
    await tx.done;
  }
}
