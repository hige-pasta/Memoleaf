import type { MemoKind } from '../entities/MemoKind';

/** メモ種類永続化リポジトリ インターフェース */
export interface MemoKindRepository {
  /** メモ種類を保存（新規作成・更新どちらも同一メソッド） */
  save(kind: MemoKind): Promise<void>;

  /** 指定IDのメモ種類を削除 */
  delete(id: string): Promise<void>;

  /** IDでメモ種類を1件取得 */
  findById(id: string): Promise<MemoKind | null>;

  /** 全メモ種類をorder昇順で返す */
  findAll(): Promise<MemoKind[]>;

  /** 並び替え：orderedIdsの順序でorderフィールドを一括更新 */
  reorder(orderedIds: string[]): Promise<void>;
}
