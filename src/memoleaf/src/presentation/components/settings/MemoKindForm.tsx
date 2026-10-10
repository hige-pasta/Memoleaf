import { useState } from 'react';
import { KIND_COLOR_PRESETS } from '../../../constants/colors';

type MemoKindFormProps = {
  onAdd: (input: { name: string; color: string }) => Promise<void>;
};

/**
 * メモ種類追加フォーム
 * 名前とカラーを入力して新しいメモ種類を作成する
 */
export function MemoKindForm({ onAdd }: MemoKindFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(KIND_COLOR_PRESETS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const canAdd = name.trim() !== '' && !isAdding;

  const handleSubmit = async () => {
    if (!canAdd) return;
    setError('');
    setIsAdding(true);
    try {
      await onAdd({ name: name.trim(), color });
      setName('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '追加に失敗しました');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-[18px] bg-surface p-4 shadow-hair">
      <h3 className="text-sm font-bold text-ink-2">種類を追加</h3>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSubmit()}
            placeholder="種類名"
            maxLength={20}
            aria-label="種類名"
            className="h-11 w-full rounded-xl bg-sunken pl-8 pr-3 text-sm text-ink outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-moss/25"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canAdd}
          className="h-11 rounded-xl bg-moss px-5 text-sm font-bold text-on-moss transition active:scale-95 disabled:bg-sunken disabled:text-ink-3 cursor-pointer disabled:cursor-not-allowed"
        >
          追加
        </button>
      </div>

      {/* カラーピッカー */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="カラー">
        {KIND_COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setColor(preset)}
            className="size-7 rounded-full transition hover:scale-110 cursor-pointer"
            style={{
              backgroundColor: preset,
              outline: color === preset ? `2px solid ${preset}` : 'none',
              outlineOffset: '2px',
            }}
            aria-label={`カラー: ${preset}`}
            aria-pressed={color === preset}
          />
        ))}
        {/* カスタムカラーピッカー */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="size-7 cursor-pointer appearance-none rounded-full border border-line-strong bg-transparent p-0.5 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
          aria-label="カスタムカラーを選択"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
