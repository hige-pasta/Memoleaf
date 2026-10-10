import type { Leaf } from '../../../domain/entities/Leaf';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { formatTime } from '../../utils/date';

type LeafCardProps = {
  leaf: Leaf;
  kind: MemoKind | undefined;
  onClick: () => void;
};

/**
 * Leafカードコンポーネント
 * タイムライン内の1件のメモを表示する（日付は見出し側で示すため時刻のみ）
 */
export function LeafCard({ leaf, kind, onClick }: LeafCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-2 rounded-2xl bg-surface px-4 py-3.5 text-left shadow-hair transition hover:shadow-card active:scale-[0.99] cursor-pointer"
    >
      {/* 本文（最大3行） */}
      <p className="line-clamp-3 whitespace-pre-wrap text-[15px] leading-[1.65] text-ink">
        {leaf.body}
      </p>

      {/* メタ情報：種類・タグ・時刻 */}
      <div className="flex w-full items-center gap-2.5 text-xs">
        {kind && (
          <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-ink-2">
            <span
              aria-hidden="true"
              className="size-[7px] rounded-full"
              style={{ backgroundColor: kind.color }}
            />
            {kind.name}
          </span>
        )}
        {leaf.tags.length > 0 && (
          <span className="min-w-0 truncate text-ink-3">
            {leaf.tags.map((tag) => `#${tag}`).join('  ')}
          </span>
        )}
        <span className="ml-auto shrink-0 text-ink-3 tabular-nums">{formatTime(leaf.createdAt)}</span>
      </div>
    </button>
  );
}
