/** Leaf（メモ1件）エンティティ */
export type Leaf = {
  id: string;              // UUID v4
  body: string;            // メモ本文（1文字以上）
  kindId: string;          // 紐づくメモ種類のID
  tags: string[];          // タグ配列（0個以上）
  createdAt: Date;         // 作成日時
  updatedAt: Date;         // 最終更新日時
  isArchived: boolean;     // アーカイブフラグ（プロトタイプではfalse固定）
  archivedAt: Date | null; // アーカイブ日時
};

/** Leaf作成の入力型 */
export type CreateLeafInput = {
  body: string;
  kindId: string;
  tags: string[];
};

/** Leaf更新の入力型 */
export type UpdateLeafInput = {
  id: string;
  body?: string;
  kindId?: string;
  tags?: string[];
};

/** Leaf絞り込み条件 */
export type LeafFilter = {
  kindIds?: string[];           // メモ種類ID（複数指定=OR）
  tags?: string[];              // タグ（複数指定=AND or ORをtagFilterModeで切替）
  tagFilterMode?: 'and' | 'or'; // タグフィルタのAND/OR（デフォルトOR）
  keyword?: string;             // 本文・タグを対象としたキーワード
  dateFrom?: Date;              // 期間開始
  dateTo?: Date;                // 期間終了
  isArchived?: boolean;         // アーカイブフラグ（省略時=false）
};
