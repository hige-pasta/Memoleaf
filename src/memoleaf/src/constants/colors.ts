/**
 * メモリーフ カラー定数
 * UI のベースカラー（背景・文字・アクセント）は src/index.css の CSS 変数で管理する。
 * ここではデータとして保存されるメモ種類の色のみを扱う。
 */

export const COLORS = {
  // メモ種類プリセットカラー（ライト・ダーク両方で読める落ち着いたトーン）
  kindDiary: '#B86A1F',  // 日記（アンバー）
  kindIdea: '#2378A0',   // アイデア（ブルー）
  kindTask: '#2F7D52',   // タスク（グリーン）
  kindNote: '#6E58B0',   // 感想（バイオレット）

  // 未分類
  kindDefault: '#7A807C', // 未分類（グレー）

  // 落ち葉（将来用）
  fallen: '#C4A882',     // 枯れ葉色
} as const;

/** 種類追加フォームで選べるカラープリセット */
export const KIND_COLOR_PRESETS: string[] = [
  COLORS.kindDiary,
  COLORS.kindIdea,
  COLORS.kindTask,
  COLORS.kindNote,
  '#B4485E', // ローズ
  '#C2612C', // オレンジ
  '#6B8A2E', // ライム
  '#2F7FB8', // スカイ
  '#8A4FB0', // パープル
  '#7D766F', // ストーン
];

/**
 * 旧プリセットカラー → 新プリセットカラーの対応表
 * 既存ユーザーの保存済みの種類色を、起動時に新しいトーンへ置き換えるために使う
 */
export const LEGACY_KIND_COLOR_MAP: Record<string, string> = {
  '#d97706': COLORS.kindDiary,
  '#0891b2': COLORS.kindIdea,
  '#059669': COLORS.kindTask,
  '#7c3aed': COLORS.kindNote,
  '#6b7280': COLORS.kindDefault,
  '#e11d48': '#B4485E',
  '#ea580c': '#C2612C',
  '#65a30d': '#6B8A2E',
  '#0284c7': '#2F7FB8',
  '#7e22ce': '#8A4FB0',
  '#78716c': '#7D766F',
};
