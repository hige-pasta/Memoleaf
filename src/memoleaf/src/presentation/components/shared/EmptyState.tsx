import type { ReactNode } from 'react';
import { PageIcon } from './PageIcon';

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
    <div className="flex flex-col items-center justify-center py-14 gap-4 text-ink-3">
      {icon ?? (
        <span className="flex size-16 items-center justify-center rounded-full bg-sunken">
          <PageIcon name="seed" className="size-8 text-ink-3" />
        </span>
      )}
      <p className="text-sm text-center leading-relaxed [word-break:auto-phrase]">{message}</p>
    </div>
  );
}
