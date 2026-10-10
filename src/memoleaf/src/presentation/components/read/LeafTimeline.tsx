import type { Leaf } from '../../../domain/entities/Leaf';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { LeafCard } from './LeafCard';
import { EmptyState } from '../shared/EmptyState';
import { formatMonthDay, relativeDayLabel } from '../../utils/date';

type LeafTimelineProps = {
  leaves: Leaf[];
  memoKinds: MemoKind[];
  onLeafClick: (id: string) => void;
};

/** Leafをcreated日付（YYYY-MM-DD）でグループ化 */
function groupLeavesByDate(leaves: Leaf[]): Map<string, Leaf[]> {
  const groups = new Map<string, Leaf[]>();
  for (const leaf of leaves) {
    const key = leaf.createdAt.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(leaf);
  }
  return groups;
}

/**
 * タイムライン表示コンポーネント
 * Leafを日付ごとにグループ化し、新しい順で表示する
 */
export function LeafTimeline({ leaves, memoKinds, onLeafClick }: LeafTimelineProps) {
  const kindMap = new Map(memoKinds.map((k) => [k.id, k]));

  if (leaves.length === 0) {
    return <EmptyState message="条件に一致するメモがありません" />;
  }

  const groups = groupLeavesByDate(leaves);

  return (
    <div className="flex flex-col gap-1.5">
      {[...groups.entries()].map(([dateKey, groupLeaves]) => {
        const date = groupLeaves[0].createdAt;
        const relative = relativeDayLabel(date);
        return (
          <section key={dateKey}>
            {/* 日付ヘッダー（スクロール中も上部に残る） */}
            <h2 className="sticky top-0 z-10 -mx-5 flex items-baseline gap-2 bg-paper/80 px-5 pb-2 pt-2.5 backdrop-blur-md">
              {relative ? (
                <>
                  <span className="text-[15px] font-bold text-ink">{relative}</span>
                  <span className="text-[13px] font-medium text-ink-3">{formatMonthDay(date)}</span>
                </>
              ) : (
                <span className="text-[15px] font-bold text-ink">{formatMonthDay(date)}</span>
              )}
            </h2>
            <div className="flex flex-col gap-2">
              {groupLeaves.map((leaf) => (
                <LeafCard
                  key={leaf.id}
                  leaf={leaf}
                  kind={kindMap.get(leaf.kindId)}
                  onClick={() => onLeafClick(leaf.id)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
