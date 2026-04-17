import type { Leaf } from '../../../domain/entities/Leaf';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { LeafCard } from './LeafCard';
import { EmptyState } from '../shared/EmptyState';

type LeafTimelineProps = {
  leaves: Leaf[];
  memoKinds: MemoKind[];
  onLeafClick: (id: string) => void;
};

/** 日付を「YYYY年M月D日（曜日）」形式にフォーマット */
function formatDateHeader(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

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
    <div className="flex flex-col gap-6">
      {[...groups.entries()].map(([dateKey, groupLeaves]) => (
        <section key={dateKey}>
          {/* 日付ヘッダー */}
          <h2 className="text-xs font-medium text-stone-400 mb-2 sticky top-0 bg-amber-50 py-1">
            {formatDateHeader(groupLeaves[0].createdAt)}
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
      ))}
    </div>
  );
}
