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
  const baseClass =
    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors';

  if (onClick) {
    // フィルタ用（クリック可能）
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} border cursor-pointer ${
          isActive
            ? 'bg-green-700 text-white border-green-700'
            : 'bg-transparent text-stone-500 border-stone-300 hover:border-green-700 hover:text-green-700'
        }`}
      >
        #{label}
      </button>
    );
  }

  // 入力フォーム用（削除ボタン付き）
  return (
    <span className={`${baseClass} bg-amber-100 text-amber-800 border border-amber-200`}>
      #{label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 text-amber-600 hover:text-amber-900 leading-none cursor-pointer"
          aria-label={`タグ「${label}」を削除`}
        >
          ×
        </button>
      )}
    </span>
  );
}
