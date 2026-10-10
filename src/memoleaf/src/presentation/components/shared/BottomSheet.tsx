import { useEffect, useRef, type ReactNode } from 'react';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  /** ダイアログのアクセシブルな名前 */
  ariaLabel: string;
  /** false の間はバックドロップ・Escape で閉じない（上に確認ダイアログを重ねるときなど） */
  dismissible?: boolean;
  children: ReactNode;
};

/**
 * ボトムシート
 * スマホ幅では画面下からせり上がるシート、sm 以上では中央のダイアログとして表示する。
 * バックドロップクリック・Escape キーで閉じる。
 */
export function BottomSheet({ isOpen, onClose, ariaLabel, dismissible = true, children }: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escapeキーで閉じる
  useEffect(() => {
    if (!isOpen || !dismissible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dismissible, onClose]);

  // 開いている間は背面のスクロールを止め、シートにフォーカスを移す
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* バックドロップ */}
      <div
        className="fixed inset-0 z-50 bg-overlay animate-fade-in"
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />

      {/* シート本体 */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="fixed z-50 inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto bg-surface rounded-t-[28px] shadow-[0_-8px_32px_rgb(0_0_0/0.12)] px-5 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+24px)] outline-none animate-sheet-up
          sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[calc(100%-2rem)] sm:max-w-lg sm:max-h-[80svh] sm:rounded-[24px] sm:pt-6 sm:pb-6 sm:px-6 sm:shadow-card sm:animate-dialog-in"
      >
        {/* つまみ（スマホのみ） */}
        <div aria-hidden="true" className="mx-auto mb-4 h-[5px] w-9 rounded-full bg-line-strong sm:hidden" />
        {children}
      </div>
    </>
  );
}
