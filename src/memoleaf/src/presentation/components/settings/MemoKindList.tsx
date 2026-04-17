import { useState, useRef } from 'react';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { UNCATEGORIZED_KIND_ID } from '../../../constants/presets';

type MemoKindListProps = {
  memoKinds: MemoKind[];
  onDelete: (id: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
};

/**
 * メモ種類一覧コンポーネント
 * HTML Drag and Drop APIによる並び替えと削除をサポートする
 */
export function MemoKindList({ memoKinds, onDelete, onReorder }: MemoKindListProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragItemRef = useRef<string | null>(null);

  const deleteTarget = memoKinds.find((k) => k.id === deleteTargetId);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
    dragItemRef.current = id;
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== draggingId) setDragOverId(id);
  };

  const handleDrop = async (targetId: string) => {
    const fromId = dragItemRef.current;
    if (!fromId || fromId === targetId) return;

    // 並び替え後の順序を計算
    const ids = memoKinds
      .filter((k) => k.id !== UNCATEGORIZED_KIND_ID)
      .map((k) => k.id);
    const fromIndex = ids.indexOf(fromId);
    const toIndex = ids.indexOf(targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const newIds = [...ids];
    newIds.splice(fromIndex, 1);
    newIds.splice(toIndex, 0, fromId);

    setDraggingId(null);
    setDragOverId(null);
    dragItemRef.current = null;
    await onReorder(newIds);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <>
      <ul className="flex flex-col gap-2">
        {memoKinds.map((kind) => {
          const isUncategorized = kind.id === UNCATEGORIZED_KIND_ID;
          return (
            <li
              key={kind.id}
              draggable={!isUncategorized}
              onDragStart={() => handleDragStart(kind.id)}
              onDragOver={(e) => !isUncategorized && handleDragOver(e, kind.id)}
              onDrop={() => !isUncategorized && handleDrop(kind.id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 bg-white rounded-lg border px-4 py-3 transition-all
                ${draggingId === kind.id ? 'opacity-40' : ''}
                ${dragOverId === kind.id ? 'border-green-500 shadow-sm' : 'border-stone-200'}
                ${!isUncategorized ? 'cursor-grab active:cursor-grabbing' : ''}
              `}
            >
              {/* ドラッグハンドル */}
              {!isUncategorized && (
                <svg className="w-4 h-4 text-stone-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6-12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
              )}

              {/* カラードットと名前 */}
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: kind.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-sm text-stone-700">{kind.name}</span>

              {/* 未分類は削除不可 */}
              {!isUncategorized && (
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(kind.id)}
                  className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label={`「${kind.name}」を削除`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title={`「${deleteTarget?.name}」を削除しますか？`}
        message="この種類のメモは「未分類」に変更されます。この操作は取り消せません。"
        onConfirm={async () => {
          if (deleteTargetId) await onDelete(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}
