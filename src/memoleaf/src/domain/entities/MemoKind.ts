/** メモ種類エンティティ */
export type MemoKind = {
  id: string;     // UUID v4（未分類は固定値 'uncategorized'）
  name: string;   // 種類名（1文字以上、重複不可）
  color: string;  // ボタン・表示に使う色（カラーコード）
  order: number;  // 表示順（0始まり、昇順）
};

/** アプリ設定 */
export type AppSettings = {
  defaultKindMode: 'lastUsed' | 'fixed'; // デフォルト種類の決定方法
  fixedDefaultKindId: string | null;     // 固定モード時のメモ種類ID
  lastUsedKindId: string | null;         // 最後に使用した種類ID
};

/** AppSettingsのデフォルト値 */
export const DEFAULT_APP_SETTINGS: AppSettings = {
  defaultKindMode: 'lastUsed',
  fixedDefaultKindId: null,
  lastUsedKindId: null,
};
