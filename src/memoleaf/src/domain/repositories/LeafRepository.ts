import type { Leaf, LeafFilter } from '../entities/Leaf';

/** Leaf永続化リポジトリ インターフェース */
export interface LeafRepository {
  /** Leafを保存（新規作成・更新どちらも同一メソッド） */
  save(leaf: Leaf): Promise<void>;

  /** 指定IDのLeafを削除 */
  delete(id: string): Promise<void>;

  /** IDでLeafを1件取得 */
  findById(id: string): Promise<Leaf | null>;

  /** フィルタ条件を指定してLeafを一覧取得（createdAt降順） */
  findAll(filter?: LeafFilter): Promise<Leaf[]>;

  /** 直近N件のLeafを取得（Write画面の履歴表示用） */
  findRecent(limit: number): Promise<Leaf[]>;

  /** 使用中のタグ一覧を重複なしで返す（Readページのタグフィルタ用） */
  getAllTags(): Promise<string[]>;
}
