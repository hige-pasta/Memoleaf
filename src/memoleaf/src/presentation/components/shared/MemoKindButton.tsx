import type { MemoKind } from '../../../domain/entities/MemoKind';

type MemoKindButtonProps = {
  kind: MemoKind;
  isSelected: boolean;
  onClick: () => void;
};

/**
 * メモ種類選択ボタン
 * 選択時はbackground-colorをkind.colorで塗りつぶし、非選択時はボーダーのみ表示する
 */
export function MemoKindButton({ kind, isSelected, onClick }: MemoKindButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-1 rounded-full text-sm font-medium border-2 transition-colors cursor-pointer"
      style={
        isSelected
          ? { backgroundColor: kind.color, borderColor: kind.color, color: '#fff' }
          : { borderColor: kind.color, color: kind.color, backgroundColor: 'transparent' }
      }
    >
      {kind.name}
    </button>
  );
}
