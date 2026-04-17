import { useState } from 'react';
import { COLORS } from '../../../constants/colors';

type MemoKindFormProps = {
  onAdd: (input: { name: string; color: string }) => Promise<void>;
};

/** カラープリセット（設計書のプリセットカラーを流用） */
const COLOR_PRESETS = [
  COLORS.kindDiary,
  COLORS.kindIdea,
  COLORS.kindTask,
  COLORS.kindNote,
  '#E11D48', // ローズ
  '#EA580C', // オレンジ
  '#65A30D', // ライム
  '#0284C7', // スカイ
  '#7E22CE', // パープル
  '#78716C', // ストーン
];

/**
 * メモ種類追加フォーム
 * 名前とカラーを入力して新しいメモ種類を作成する
 */
export function MemoKindForm({ onAdd }: MemoKindFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(COLORS.kindDiary);
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
    <div className="bg-white rounded-lg border border-stone-200 p-4">
      <h2 className="text-sm font-semibold text-stone-700 mb-3">種類を追加</h2>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="種類名"
            maxLength={20}
            className="w-full px-3 py-2 text-sm rounded-md border border-stone-300 bg-white text-stone-700 placeholder-stone-400 focus:outline-none focus:border-green-600 transition-colors"
          />
        </div>

        {/* カラーピッカー */}
        <div className="flex items-center gap-1.5">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setColor(preset)}
              className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
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
            className="w-6 h-6 rounded cursor-pointer border border-stone-300"
            aria-label="カスタムカラーを選択"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canAdd}
          className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-stone-200 disabled:text-stone-400 transition-colors cursor-pointer"
        >
          追加
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
