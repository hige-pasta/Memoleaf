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
    <div className="rounded-[18px] bg-surface p-4 shadow-hair">
      <h3 className="mb-3 text-sm font-bold text-ink-2">起動時に選ばれている種類</h3>

      <div className="flex flex-col gap-3">
        {/* 最後に使った種類 */}
        <label className="flex min-h-9 items-center gap-2.5 cursor-pointer">
          <input
            type="radio"
            name="defaultKindMode"
            value="lastUsed"
            checked={settings.defaultKindMode === 'lastUsed'}
            onChange={() => onModeChange('lastUsed')}
            className="size-[18px] accent-moss"
          />
          <span className="text-[15px] text-ink">最後に使った種類（自動）</span>
        </label>

        {/* 固定 */}
        <label className="flex min-h-9 items-center gap-2.5 cursor-pointer">
          <input
            type="radio"
            name="defaultKindMode"
            value="fixed"
            checked={settings.defaultKindMode === 'fixed'}
            onChange={() => onModeChange('fixed')}
            className="size-[18px] accent-moss"
          />
          <span className="text-[15px] text-ink">固定:</span>
          {settings.defaultKindMode === 'fixed' && (
            <select
              value={settings.fixedDefaultKindId ?? ''}
              onChange={(e) => onFixedKindChange(e.target.value || null)}
              className="ml-1 h-9 rounded-lg bg-sunken px-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-moss/25"
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
