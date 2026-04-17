import type { ReactNode } from 'react';
import seedIcon from '../../../assets/icons/seed.svg';

type EmptyStateProps = {
  message: string;
  icon?: ReactNode;
};

/**
 * 空状態の表示コンポーネント
 * leafが0件の場合などに「まだ芽が出ていない」イメージで表示する
 */
export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-stone-400">
      {icon ?? (
        <img src={seedIcon} alt="" className="w-16 h-16 opacity-40" aria-hidden="true" />
      )}
      <p className="text-sm text-center">{message}</p>
    </div>
  );
}
