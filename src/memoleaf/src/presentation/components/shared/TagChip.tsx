import { CloseIcon } from './icons';
import { FilterChip } from './FilterChip';

type TagChipProps = {
  label: string;
  /** 指定時に × ボタンを表示し、クリックで呼び出す */
  onRemove?: () => void;
  /** フィルタチップとして使う場合のアクティブ状態 */
  isActive?: boolean;
  /** フィルタチップとして使う場合のクリックハンドラ */
  onClick?: () => void;
};

/**
 * タグチップ
 * 入力フォームの確定済みタグ表示と、フィルタパネルのタグ選択の両方で使う
 */
export function TagChip({ label, onRemove, isActive, onClick }: TagChipProps) {
  if (onClick) {
    // フィルタ用（クリック可能）
    return (
      <FilterChip isActive={isActive ?? false} onClick={onClick}>
        #{label}
      </FilterChip>
    );
  }

  // 表示用・入力フォーム用（削除ボタン付き）
  return (
    <span
      className={`inline-flex h-[30px] items-center gap-0.5 rounded-full bg-sunken text-[13px] font-medium text-ink-2 ${
        onRemove ? 'pl-2.5 pr-1' : 'px-3'
      }`}
    >
      #{label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex size-6 items-center justify-center rounded-full text-ink-3 transition hover:bg-line hover:text-ink cursor-pointer"
          aria-label={`タグ「${label}」を削除`}
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </span>
  );
}
