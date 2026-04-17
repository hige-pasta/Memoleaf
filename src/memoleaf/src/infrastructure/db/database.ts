import { openDB, type IDBPDatabase } from 'idb';
import type { DBSchema } from 'idb';
import type { Leaf } from '../../domain/entities/Leaf';
import type { MemoKind, AppSettings } from '../../domain/entities/MemoKind';

/** IndexedDBのスキーマ定義 */
interface MemoleafDB extends DBSchema {
  leaves: {
    key: string;
    value: Leaf;
    indexes: {
      'by-kindId': string;
      'by-createdAt': Date;
      'by-tags': string; // multiEntry
    };
  };
  memoKinds: {
    key: string;
    value: MemoKind;
    indexes: {
      'by-order': number;
    };
  };
  appSettings: {
    key: string;
    value: { key: string; value: AppSettings[keyof AppSettings] };
  };
}

const DB_NAME = 'memoleaf-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MemoleafDB>> | null = null;

/** IndexedDBを初期化して接続を返す（シングルトン） */
export function getDatabase(): Promise<IDBPDatabase<MemoleafDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MemoleafDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // leavesストア
        const leaveStore = db.createObjectStore('leaves', { keyPath: 'id' });
        leaveStore.createIndex('by-kindId', 'kindId');
        leaveStore.createIndex('by-createdAt', 'createdAt');
        leaveStore.createIndex('by-tags', 'tags', { multiEntry: true });

        // memoKindsストア
        const kindStore = db.createObjectStore('memoKinds', { keyPath: 'id' });
        kindStore.createIndex('by-order', 'order', { unique: true });

        // appSettingsストア（Key-Value形式）
        db.createObjectStore('appSettings', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}
