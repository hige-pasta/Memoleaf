import type { Leaf } from '../../../domain/entities/Leaf';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { TagChip } from '../shared/TagChip';

type LeafCardProps = {
  leaf: Leaf;
  kind: MemoKind | undefined;
  onClick: () => void;
};

/** 相対時間を返す（今日の場合はHH:mm、それ以外はM月D日） */
function formatDateTime(date: Date): string {
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
}

/**
 * Leafカードコンポーネント
 * タイムライン内の1件のメモを表示する
 */
export function LeafCard({ leaf, kind, onClick }: LeafCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg shadow-sm border border-stone-100 p-4 hover:border-stone-200 hover:shadow-md transition-all cursor-pointer"
    >
      {/* 本文（最大3行） */}
      <p className="text-stone-800 text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap mb-3">
        {leaf.body}
      </p>

      {/* フッター：種類ラベル・タグ・時刻 */}
      <div className="flex flex-wrap items-center gap-2">
        {kind && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
            style={{ backgroundColor: kind.color }}
          >
            {kind.name}
          </span>
        )}
        {leaf.tags.map((tag) => (
          <TagChip key={tag} label={tag} />
        ))}
        <span className="ml-auto text-xs text-stone-400">{formatDateTime(leaf.createdAt)}</span>
      </div>
    </button>
  );
}
