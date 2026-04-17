import type { MemoKind } from '../../../domain/entities/MemoKind';
import type { AppSettings } from '../../../domain/entities/MemoKind';
import { UNCATEGORIZED_KIND_ID } from '../../../constants/presets';

type DefaultKindSettingProps = {
  settings: AppSettings;
  memoKinds: MemoKind[];
  onModeChange: (mode: 'lastUsed' | 'fixed') => Promise<void>;
  onFixedKindChange: (kindId: string | null) => Promise<void>;
};

/**
 * デフォルトメモ種類設定コンポーネント
 * Write起動時に自動選択する種類の決定方法を設定する
 */
export function DefaultKindSetting({ settings, memoKinds, onModeChange, onFixedKindChange }: DefaultKindSettingProps) {
  const selectableKinds = memoKinds.filter((k) => k.id !== UNCATEGORIZED_KIND_ID);

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4">
      <h2 className="text-sm font-semibold text-stone-700 mb-3">デフォルトのメモ種類</h2>

      <div className="flex flex-col gap-3">
        {/* 最後に使った種類 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="defaultKindMode"
            value="lastUsed"
            checked={settings.defaultKindMode === 'lastUsed'}
            onChange={() => onModeChange('lastUsed')}
            className="accent-green-700"
          />
          <span className="text-sm text-stone-700">最後に使った種類（自動）</span>
        </label>

        {/* 固定 */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="defaultKindMode"
            value="fixed"
            checked={settings.defaultKindMode === 'fixed'}
            onChange={() => onModeChange('fixed')}
            className="accent-green-700"
          />
          <span className="text-sm text-stone-700">固定:</span>
          {settings.defaultKindMode === 'fixed' && (
            <select
              value={settings.fixedDefaultKindId ?? ''}
              onChange={(e) => onFixedKindChange(e.target.value || null)}
              className="ml-1 px-2 py-1 text-sm rounded-md border border-stone-300 bg-white text-stone-700 focus:outline-none focus:border-green-600"
            >
              <option value="">選択してください</option>
              {selectableKinds.map((kind) => (
                <option key={kind.id} value={kind.id}>
                  {kind.name}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>
    </div>
  );
}
