/** メモリーフ カラーパレット定数 */

export const COLORS = {
  // ベースカラー
  paper: '#FAF6F0',      // 背景（日焼けた紙色）
  paperDark: '#F0EAE0',  // 背景（やや濃い）
  ink: '#3E2723',        // メインテキスト（ダークブラウン）
  inkLight: '#6D4C41',   // サブテキスト
  inkMuted: '#A1887F',   // プレースホルダー等

  // アクセント
  moss: '#4A6741',       // プライマリアクセント（モスグリーン）
  mossLight: '#6B8F63',  // ホバー等
  mossPale: '#E8F0E6',   // 薄い背景

  // メモ種類プリセットカラー
  kindDiary: '#D97706',  // 日記（アンバー）
  kindIdea: '#0891B2',   // アイデア（シアン）
  kindTask: '#059669',   // タスク（エメラルド）
  kindNote: '#7C3AED',   // 感想（バイオレット）

  // 未分類
  kindDefault: '#6B7280', // 未分類（グレー）

  // 落ち葉（将来用）
  fallen: '#C4A882',     // 枯れ葉色
} as const;
