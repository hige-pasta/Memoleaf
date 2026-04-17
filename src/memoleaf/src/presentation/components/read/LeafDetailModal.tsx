import { useState, useEffect } from 'react';
import type { Leaf } from '../../../domain/entities/Leaf';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { LeafEditForm } from './LeafEditForm';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { TagChip } from '../shared/TagChip';

type LeafDetailModalProps = {
  leaf: Leaf | null;
  memoKinds: MemoKind[];
  onClose: () => void;
  onUpdate: (id: string, data: { body?: string; kindId?: string; tags?: string[] }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

/** 日時を「YYYY年M月D日 HH:mm」でフォーマット */
function formatFullDateTime(date: Date): string {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Leaf詳細表示モーダル
 * leafをクリックした際に開き、詳細表示・編集・削除が可能
 */
export function LeafDetailModal({ leaf, memoKinds, onClose, onUpdate, onDelete }: LeafDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // leafが変わったら編集モードをリセット
  useEffect(() => {
    setIsEditing(false);
  }, [leaf?.id]);

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    if (!leaf) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [leaf, onClose]);

  if (!leaf) return null;

  const kindMap = new Map(memoKinds.map((k) => [k.id, k]));
  const kind = kindMap.get(leaf.kindId);

  const handleSave = async (data: { body?: string; kindId?: string; tags?: string[] }) => {
    await onUpdate(leaf.id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(leaf.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      {/* バックドロップ */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* モーダル本体 */}
      <div
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-amber-50 rounded-xl shadow-xl max-w-lg mx-auto p-6 max-h-[80vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="メモ詳細"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー：閉じるボタン */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
            aria-label="閉じる"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isEditing ? (
          <LeafEditForm
            initialValues={{ body: leaf.body, kindId: leaf.kindId, tags: leaf.tags }}
            memoKinds={memoKinds}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            {/* 本文 */}
            <p className="text-stone-800 text-base leading-relaxed whitespace-pre-wrap mb-4">
              {leaf.body}
            </p>

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
              {kind && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: kind.color }}
                >
                  {kind.name}
                </span>
              )}
              {leaf.tags.map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </div>

            {/* 日時情報 */}
            <div className="text-xs text-stone-400 mb-6 space-y-1">
              <p>作成: {formatFullDateTime(leaf.createdAt)}</p>
              {leaf.updatedAt.getTime() !== leaf.createdAt.getTime() && (
                <p>更新: {formatFullDateTime(leaf.updatedAt)}</p>
              )}
            </div>

            {/* 操作ボタン */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                削除
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors cursor-pointer"
              >
                編集
              </button>
            </div>
          </>
        )}
      </div>

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="メモを削除しますか？"
        message="この操作は取り消せません。"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
