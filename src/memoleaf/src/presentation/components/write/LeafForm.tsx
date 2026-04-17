import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import type { CreateLeafInput } from '../../../domain/entities/Leaf';
import { MemoKindButton } from '../shared/MemoKindButton';
import { TagInput } from '../shared/TagInput';

type LeafFormProps = {
  memoKinds: MemoKind[];
  defaultKindId: string | null;
  onSubmit: (data: CreateLeafInput) => Promise<void>;
};

/**
 * メモ入力フォームコンポーネント
 * 本文入力・メモ種類選択・タグ入力・投稿ボタンを提供する
 * Ctrl+Enter（Cmd+Enter）でも投稿できる
 */
export function LeafForm({ memoKinds, defaultKindId, onSubmit }: LeafFormProps) {
  const [body, setBody] = useState('');
  const [selectedKindId, setSelectedKindId] = useState<string>(defaultKindId ?? '');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // defaultKindId が変わったときにのみ初期化（フォームが空の場合のみ）
  useEffect(() => {
    if (defaultKindId && !selectedKindId) {
      setSelectedKindId(defaultKindId);
    }
  }, [defaultKindId, selectedKindId]);

  // ページ表示時に自動フォーカス
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const canSubmit = body.trim() !== '' && selectedKindId !== '' && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ body, kindId: selectedKindId, tags });
      // 投稿後はフォームをクリア（種類・タグは保持）
      setBody('');
      setTags([]);
      textareaRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 本文入力 */}
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メモを書く..."
        className="w-full min-h-[120px] p-3 rounded-md border border-stone-300 bg-white text-lg text-stone-800 placeholder-stone-400 resize-none focus:outline-none focus:border-green-600 transition-colors"
        aria-label="メモ本文"
      />

      {/* メモ種類選択 */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="メモ種類">
        {memoKinds.map((kind) => (
          <MemoKindButton
            key={kind.id}
            kind={kind}
            isSelected={selectedKindId === kind.id}
            onClick={() => setSelectedKindId(kind.id)}
          />
        ))}
      </div>

      {/* タグ入力 */}
      <TagInput tags={tags} onChange={setTags} />

      {/* 投稿ボタン */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-3 rounded-lg bg-green-700 text-white font-medium text-sm transition-colors hover:bg-green-800 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? '投稿中...' : '投稿する'}
        <span className="ml-2 text-xs opacity-60">Ctrl+Enter</span>
      </button>
    </div>
  );
}
