import { useEffect } from 'react';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

/**
 * 確認ダイアログ
 * 削除などの危険な操作の前に確認を求める
 * バックドロップクリックまたはEscapeキーでキャンセル
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = '削除する',
  cancelLabel = 'キャンセル',
}: ConfirmDialogProps) {
  // Escapeキーでキャンセル
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay px-6 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[24px] bg-surface p-6 shadow-card animate-dialog-in"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <h2 id="confirm-dialog-title" className="mb-2 text-lg font-bold text-ink">
          {title}
        </h2>
        <p id="confirm-dialog-message" className="mb-6 text-sm leading-relaxed text-ink-2">
          {message}
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 flex-1 rounded-2xl bg-sunken text-sm font-bold text-ink-2 transition active:scale-[0.98] cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex-1 rounded-2xl bg-danger text-sm font-bold text-surface transition active:scale-[0.98] cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
