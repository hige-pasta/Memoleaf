import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  type KeyboardEvent,
  type Ref,
} from 'react';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import type { CreateLeafInput } from '../../../domain/entities/Leaf';
import { MemoKindButton } from '../shared/MemoKindButton';
import { TagInput } from '../shared/TagInput';
import { ArrowUpIcon } from '../shared/icons';

/** 親から操作するためのハンドル */
export type LeafFormHandle = {
  /** 投稿を取り消したときなどに、入力内容をフォームへ戻す */
  restore: (input: CreateLeafInput) => void;
};

type LeafFormProps = {
  memoKinds: MemoKind[];
  defaultKindId: string | null;
  onSubmit: (data: CreateLeafInput) => Promise<void>;
  ref?: Ref<LeafFormHandle>;
};

/** 修飾キーの表示（Mac は ⌘、それ以外は Ctrl） */
const MOD_KEY_LABEL =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl';

/**
 * メモ入力フォームコンポーネント
 * メモ種類選択・本文入力・タグ入力・投稿ボタンを1枚のカードにまとめて提供する
 * Ctrl+Enter（Cmd+Enter）でも投稿できる
 */
export function LeafForm({ memoKinds, defaultKindId, onSubmit, ref }: LeafFormProps) {
  const [body, setBody] = useState('');
  // ユーザーが明示的に選んだ種類（未選択ならデフォルト種類を使う）
  const [selectedKindId, setSelectedKindId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const kindId = selectedKindId || defaultKindId || '';

  useImperativeHandle(ref, () => ({
    restore: (input) => {
      setBody(input.body);
      setSelectedKindId(input.kindId);
      setTags(input.tags);
      textareaRef.current?.focus();
    },
  }));

  // ページ表示時に自動フォーカス
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // 入力量に合わせてテキストエリアの高さを伸縮する
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [body]);

  const canSubmit = body.trim() !== '' && kindId !== '' && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ body, kindId, tags });
      // 投稿後はフォームをクリア（種類は保持）
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
    <div className="flex flex-col gap-3">
      {/* メモ種類選択（横スクロール） */}
      <div
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-0.5"
        role="group"
        aria-label="メモ種類"
      >
        {memoKinds.map((kind) => (
          <MemoKindButton
            key={kind.id}
            kind={kind}
            isSelected={kindId === kind.id}
            onClick={() => setSelectedKindId(kind.id)}
          />
        ))}
      </div>

      {/* 書くカード */}
      <div className="flex flex-col gap-2.5 rounded-[22px] bg-surface p-4 pb-3 shadow-card transition focus-within:ring-2 focus-within:ring-moss/25">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="いま、なにを残す？"
          rows={3}
          className="min-h-[104px] max-h-[45svh] w-full resize-none bg-transparent text-[19px] leading-relaxed text-ink outline-none placeholder:text-ink-3"
          aria-label="メモ本文"
        />

        <TagInput tags={tags} onChange={setTags} />

        <div className="flex items-center justify-between pt-1">
          {/* キーボードショートカットのヒント（マウス・トラックパッド環境のみ） */}
          <span className="hidden items-center gap-1 text-xs text-ink-3 pointer-fine:inline-flex">
            <kbd className="rounded-md border border-line-strong px-1.5 py-px font-sans text-[11px] text-ink-2">
              {MOD_KEY_LABEL}
            </kbd>
            <span>+</span>
            <kbd className="rounded-md border border-line-strong px-1.5 py-px font-sans text-[11px] text-ink-2">
              Enter
            </kbd>
            <span className="ml-0.5">で投稿</span>
          </span>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            aria-label="投稿する"
            aria-busy={isSubmitting}
            className="ml-auto inline-flex size-11 items-center justify-center rounded-full bg-moss text-on-moss shadow-primary transition active:scale-90 disabled:bg-sunken disabled:text-ink-3 disabled:shadow-none disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowUpIcon className="size-5" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
