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
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full min-h-[120px] p-3 rounded-md border border-stone-300 bg-white text-base text-stone-800 resize-none focus:outline-none focus:border-green-600 transition-colors"
        aria-label="メモ本文"
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="メモ種類">
        {memoKinds.map((kind) => (
          <MemoKindButton
            key={kind.id}
            kind={kind}
            isSelected={kindId === kind.id}
            onClick={() => setKindId(kind.id)}
          />
        ))}
      </div>

      <TagInput tags={tags} onChange={setTags} />

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-stone-200 disabled:text-stone-400 transition-colors cursor-pointer"
        >
          {isSaving ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  );
}
