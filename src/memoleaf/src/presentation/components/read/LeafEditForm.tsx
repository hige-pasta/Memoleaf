import { useState } from 'react';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import type { UpdateLeafInput } from '../../../domain/entities/Leaf';
import { MemoKindButton } from '../shared/MemoKindButton';
import { TagInput } from '../shared/TagInput';

type LeafEditFormProps = {
  initialValues: {
    body: string;
    kindId: string;
    tags: string[];
  };
  memoKinds: MemoKind[];
  onSave: (input: Omit<UpdateLeafInput, 'id'>) => Promise<void>;
  onCancel: () => void;
};

/**
 * Leaf編集フォームコンポーネント
 * LeafDetailModal内で編集モード時に表示する
 */
export function LeafEditForm({ initialValues, memoKinds, onSave, onCancel }: LeafEditFormProps) {
  const [body, setBody] = useState(initialValues.body);
  const [kindId, setKindId] = useState(initialValues.kindId);
  const [tags, setTags] = useState(initialValues.tags);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = body.trim() !== '' && !isSaving;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      await onSave({ body, kindId, tags });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[19px] font-bold text-ink">メモを編集</h2>

      <div className="flex flex-wrap gap-2" role="group" aria-label="メモ種類">
        {memoKinds.map((kind) => (
          <MemoKindButton
            key={kind.id}
            kind={kind}
            size="sm"
            isSelected={kindId === kind.id}
            onClick={() => setKindId(kind.id)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2.5 rounded-[20px] border border-line-strong bg-surface p-4 transition focus-within:ring-2 focus-within:ring-moss/25">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-[120px] w-full resize-none bg-transparent text-[17px] leading-relaxed text-ink outline-none"
          aria-label="メモ本文"
        />
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="h-[52px] flex-1 rounded-2xl bg-sunken text-[15px] font-bold text-ink-2 transition active:scale-[0.98] cursor-pointer"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="h-[52px] flex-[2] rounded-2xl bg-moss text-[15px] font-bold text-on-moss transition active:scale-[0.98] disabled:bg-sunken disabled:text-ink-3 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSaving ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  );
}
