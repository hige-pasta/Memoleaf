import type { ReactNode } from 'react';

type FilterChipProps = {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
};

/**
 * 絞り込み用のトグルチップ（期間・タグなど）
 */
export function FilterChip({ isActive, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`h-[38px] px-3.5 inline-flex items-center gap-1.5 rounded-full border-[1.5px] text-sm transition active:scale-95 cursor-pointer ${
        isActive
          ? 'bg-moss-soft text-moss-ink border-moss font-bold'
          : 'bg-surface text-ink-2 border-line-strong font-medium hover:border-ink-3'
      }`}
    >
      {children}
    </button>
  );
}
