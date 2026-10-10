import { Link } from 'react-router-dom';
import type { Leaf } from '../../../domain/entities/Leaf';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { EmptyState } from '../shared/EmptyState';
import { ChevronRightIcon } from '../shared/icons';
import { formatTime } from '../../utils/date';

type RecentLeavesProps = {
  leaves: Leaf[];
  memoKinds: MemoKind[];
  onLeafClick: (id: string) => void;
  /** 投稿直後としてハイライトする leaf の ID */
  highlightId?: string | null;
};

/**
 * 最近の投稿履歴コンポーネント
 * Writeページ下部に直近5件をコンパクトに表示する
 */
export function RecentLeaves({ leaves, memoKinds, onLeafClick, highlightId }: RecentLeavesProps) {
  const kindMap = new Map(memoKinds.map((k) => [k.id, k]));

  return (
    <section className="mt-3">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-ink">最近の leaf</h2>
        {leaves.length > 0 && (
          <Link
            to="/read"
            className="inline-flex items-center gap-0.5 text-[13px] font-medium text-moss-ink hover:underline"
          >
            すべて見る
            <ChevronRightIcon className="size-3.5" />
          </Link>
        )}
      </div>
      {leaves.length === 0 ? (
        <EmptyState message="まだメモがありません。最初の leaf を書いてみましょう！" />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-[18px] bg-surface shadow-hair">
          {leaves.map((leaf) => {
            const kind = kindMap.get(leaf.kindId);
            const isNew = leaf.id === highlightId;
            return (
              <li key={leaf.id} className={isNew ? 'animate-leaf-in' : undefined}>
                <button
                  type="button"
                  onClick={() => onLeafClick(leaf.id)}
                  className={`flex h-12 w-full items-center gap-3 px-4 text-left transition-colors cursor-pointer ${
                    isNew ? 'bg-new' : 'hover:bg-sunken/60'
                  }`}
                >
                  {/* 種類カラードット */}
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: kind?.color }}
                    aria-hidden="true"
                  />
                  {/* 本文（1行で省略） */}
                  <span className="flex-1 truncate text-[15px] text-ink">{leaf.body}</span>
                  {/* 投稿時刻 */}
                  <span
                    className={`shrink-0 text-[13px] tabular-nums ${
                      isNew ? 'font-bold text-moss-ink' : 'text-ink-3'
                    }`}
                  >
                    {isNew ? 'たった今' : formatTime(leaf.createdAt)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
