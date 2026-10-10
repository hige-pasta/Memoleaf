import { useEffect } from 'react';
import { PageIcon } from './PageIcon';

/** トーストの表示時間（ミリ秒） */
const TOAST_DURATION_MS = 4000;

type ToastProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
};

/**
 * 画面下部（ナビの上）に一定時間だけ表示する通知
 * 表示し直すときは key を変えて再マウントするとタイマーがリセットされる
 */
export function Toast({ message, actionLabel, onAction, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-5 bottom-[calc(env(safe-area-inset-bottom)+104px)]"
    >
      <div className="pointer-events-auto inline-flex h-11 items-center gap-2.5 rounded-full bg-toast pl-3.5 pr-2 text-sm font-medium text-toast-fg shadow-[0_8px_24px_rgb(0_0_0/0.18)] animate-toast-in">
        <PageIcon name="seed" className="size-[18px] text-toast-accent" />
        <span>{message}</span>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="h-8 rounded-full px-3 text-[13px] font-bold text-toast-accent transition hover:bg-toast-fg/10 active:scale-95 cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
