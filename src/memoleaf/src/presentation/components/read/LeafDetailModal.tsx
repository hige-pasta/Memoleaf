import { useState } from 'react';
import type { Leaf } from '../../../domain/entities/Leaf';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { LeafEditForm } from './LeafEditForm';
import { BottomSheet } from '../shared/BottomSheet';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { TagChip } from '../shared/TagChip';
import { ClockIcon, CloseIcon, PencilIcon, TrashIcon } from '../shared/icons';
import { tint } from '../../utils/color';
import { formatMonthDay, formatTime } from '../../utils/date';

type LeafUpdateData = { body?: string; kindId?: string; tags?: string[] };

type LeafDetailModalProps = {
  leaf: Leaf | null;
  memoKinds: MemoKind[];
  onClose: () => void;
  onUpdate: (id: string, data: LeafUpdateData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

/** 日時を「10月10日（土） 08:42」でフォーマット */
function formatFullDateTime(date: Date): string {
  return `${formatMonthDay(date)} ${formatTime(date)}`;
}

/**
 * Leaf詳細表示シート
 * leafをクリックした際に開き、詳細表示・編集・削除が可能
 * スマホではボトムシート、広い画面では中央のダイアログとして表示する
 */
export function LeafDetailModal({ leaf, memoKinds, onClose, onUpdate, onDelete }: LeafDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!leaf) return;
    await onDelete(leaf.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <BottomSheet
        isOpen={leaf !== null}
        onClose={onClose}
        ariaLabel="メモ詳細"
        dismissible={!showDeleteConfirm}
      >
        {leaf && (
          // leafが変わったら編集状態をリセットするため key を付ける
          <LeafDetailContent
            key={leaf.id}
            leaf={leaf}
            memoKinds={memoKinds}
            onClose={onClose}
            onUpdate={onUpdate}
            onRequestDelete={() => setShowDeleteConfirm(true)}
          />
        )}
      </BottomSheet>

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

type LeafDetailContentProps = {
  leaf: Leaf;
  memoKinds: MemoKind[];
  onClose: () => void;
  onUpdate: (id: string, data: LeafUpdateData) => Promise<void>;
  onRequestDelete: () => void;
};

/** シートの中身（閲覧・編集の切り替え） */
function LeafDetailContent({ leaf, memoKinds, onClose, onUpdate, onRequestDelete }: LeafDetailContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const kind = memoKinds.find((k) => k.id === leaf.kindId);

  const handleSave = async (data: LeafUpdateData) => {
    await onUpdate(leaf.id, data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <LeafEditForm
        initialValues={{ body: leaf.body, kindId: leaf.kindId, tags: leaf.tags }}
        memoKinds={memoKinds}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ヘッダー：種類・閉じるボタン */}
      <div className="flex items-center justify-between">
        {kind ? (
          <span
            className="inline-flex h-[30px] items-center gap-1.5 rounded-full px-3 text-[13px] font-bold text-ink"
            style={{ backgroundColor: tint(kind.color, 14) }}
          >
            <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: kind.color }} />
            {kind.name}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-10 items-center justify-center rounded-full bg-sunken text-ink-2 transition hover:text-ink active:scale-95 cursor-pointer"
          aria-label="閉じる"
        >
          <CloseIcon className="size-[18px]" />
        </button>
      </div>

      {/* 本文 */}
      <p className="whitespace-pre-wrap text-[19px] leading-[1.75] text-ink">{leaf.body}</p>

      {/* タグ */}
      {leaf.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {leaf.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
      )}

      {/* 日時情報 */}
      <div className="flex flex-col gap-1 text-[13px] text-ink-3 tabular-nums">
        <p className="inline-flex items-center gap-1.5">
          <ClockIcon className="size-[15px]" />
          {formatFullDateTime(leaf.createdAt)} に作成
        </p>
        {leaf.updatedAt.getTime() !== leaf.createdAt.getTime() && (
          <p className="pl-[21px]">{formatFullDateTime(leaf.updatedAt)} に更新</p>
        )}
      </div>

      {/* 操作ボタン */}
      <div className="mt-2 flex gap-2.5">
        <button
          type="button"
          onClick={onRequestDelete}
          className="inline-flex size-[52px] shrink-0 items-center justify-center rounded-2xl border border-danger-line bg-surface text-danger transition hover:bg-danger-soft active:scale-95 cursor-pointer"
          aria-label="削除"
        >
          <TrashIcon className="size-5" strokeWidth={1.9} />
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-moss text-[15px] font-bold text-on-moss transition active:scale-[0.98] cursor-pointer"
        >
          <PencilIcon className="size-[18px]" />
          編集する
        </button>
      </div>
    </div>
  );
}
