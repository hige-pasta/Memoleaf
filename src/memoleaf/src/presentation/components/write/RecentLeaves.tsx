import type { Leaf } from '../../../domain/entities/Leaf';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { EmptyState } from '../shared/EmptyState';

type RecentLeavesProps = {
  leaves: Leaf[];
  memoKinds: MemoKind[];
  onLeafClick: (id: string) => void;
};

/** 時刻を HH:mm 形式でフォーマットする */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

/**
 * 最近の投稿履歴コンポーネント
 * Writeページ下部に直近5件をコンパクトに表示する
 */
export function RecentLeaves({ leaves, memoKinds, onLeafClick }: RecentLeavesProps) {
  const kindMap = new Map(memoKinds.map((k) => [k.id, k]));

  return (
    <div className="mt-6">
      <h2 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
        最近の投稿
      </h2>
      {leaves.length === 0 ? (
        <EmptyState message="まだメモがありません。最初のleafを書いてみましょう！" />
      ) : (
        <ul className="flex flex-col gap-1 max-h-48 overflow-y-auto">
          {leaves.map((leaf) => {
            const kind = kindMap.get(leaf.kindId);
            return (
              <li key={leaf.id}>
                <button
                  type="button"
                  onClick={() => onLeafClick(leaf.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-amber-100 transition-colors text-left cursor-pointer"
                >
                  {/* 種類カラードット */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: kind?.color ?? '#6B7280' }}
                    aria-hidden="true"
                  />
                  {/* 本文（最大30文字） */}
                  <span className="flex-1 text-sm text-stone-700 truncate">
                    {leaf.body.slice(0, 30)}
                    {leaf.body.length > 30 && '...'}
                  </span>
                  {/* 投稿時刻 */}
                  <span className="text-xs text-stone-400 flex-shrink-0">
                    {formatTime(leaf.createdAt)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
