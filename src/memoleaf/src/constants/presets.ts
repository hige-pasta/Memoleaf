import type { MemoKind } from '../domain/entities/MemoKind';
import { COLORS } from './colors';

/** 削除不可の特別な種類ID */
export const UNCATEGORIZED_KIND_ID = 'uncategorized';

/** 初回起動時に投入するプリセットメモ種類 */
export const PRESET_MEMO_KINDS: Omit<MemoKind, 'id'>[] = [
  { name: '日記',     color: COLORS.kindDiary, order: 0 },
  { name: 'アイデア', color: COLORS.kindIdea,  order: 1 },
  { name: 'タスク',   color: COLORS.kindTask,  order: 2 },
  { name: '感想',     color: COLORS.kindNote,  order: 3 },
];

/** 未分類の特別なメモ種類 */
export const UNCATEGORIZED_MEMO_KIND: MemoKind = {
  id: UNCATEGORIZED_KIND_ID,
  name: '未分類',
  color: COLORS.kindDefault,
  order: 9999,
};

/** 最近の投稿履歴の表示件数 */
export const RECENT_LEAVES_LIMIT = 5;

/** キーワード検索のデバウンス時間（ミリ秒） */
export const SEARCH_DEBOUNCE_MS = 300;
