import { useState, useRef } from 'react';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { UNCATEGORIZED_KIND_ID } from '../../../constants/presets';
import { GripIcon, TrashIcon } from '../shared/icons';

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
      <ul className="divide-y divide-line overflow-hidden rounded-[18px] bg-surface shadow-hair">
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
              className={`flex h-[52px] items-center gap-3 px-4 transition-all
                ${draggingId === kind.id ? 'opacity-40' : ''}
                ${dragOverId === kind.id ? 'bg-moss-soft' : ''}
                ${!isUncategorized ? 'cursor-grab active:cursor-grabbing' : 'pl-11'}
              `}
            >
              {/* ドラッグハンドル */}
              {!isUncategorized && (
                <GripIcon className="size-4 shrink-0 text-ink-3" />
              )}

              {/* カラードットと名前 */}
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: kind.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-[15px] text-ink">{kind.name}</span>
              {isUncategorized && <span className="text-xs text-ink-3">削除できません</span>}

              {/* 未分類は削除不可 */}
              {!isUncategorized && (
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(kind.id)}
                  className="-mr-2 inline-flex size-9 items-center justify-center rounded-full text-ink-3 transition hover:bg-danger-soft hover:text-danger cursor-pointer"
                  aria-label={`「${kind.name}」を削除`}
                >
                  <TrashIcon className="size-[18px]" />
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
