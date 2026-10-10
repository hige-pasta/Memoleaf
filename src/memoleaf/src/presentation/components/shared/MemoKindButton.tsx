import type { MemoKind } from '../../../domain/entities/MemoKind';
import { tint } from '../../utils/color';

type MemoKindButtonProps = {
  kind: MemoKind;
  isSelected: boolean;
  onClick: () => void;
  /** md: Write の種類選択 / sm: Read の種類フィルタ */
  size?: 'md' | 'sm';
};

/**
 * メモ種類選択チップ
 * 種類の色はドットで示し、選択時は種類の色を薄く敷いた背景＋枠で強調する
 */
export function MemoKindButton({ kind, isSelected, onClick, size = 'md' }: MemoKindButtonProps) {
  const sizeClass = size === 'md' ? 'h-10 px-3.5 gap-2 text-sm' : 'h-9 px-3 gap-1.5 text-[13px]';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`shrink-0 inline-flex items-center rounded-full border-[1.5px] transition active:scale-95 cursor-pointer ${sizeClass} ${
        isSelected
          ? 'font-bold text-ink'
          : 'font-medium text-ink-2 bg-surface border-line-strong hover:border-ink-3'
      }`}
      style={
        isSelected
          ? { backgroundColor: tint(kind.color, 14), borderColor: tint(kind.color, 60) }
          : undefined
      }
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: kind.color }}
      />
      {kind.name}
    </button>
  );
}
