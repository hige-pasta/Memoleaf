import { useMemoKinds } from '../../hooks/useMemoKinds';
import { useAppSettings } from '../../hooks/useAppSettings';
import { MemoKindForm } from './MemoKindForm';
import { MemoKindList } from './MemoKindList';
import { DefaultKindSetting } from './DefaultKindSetting';

/**
 * Settingsページ
 * メモ種類の管理とアプリ設定を行う
 */
export function SettingsPage() {
  const { memoKinds, createMemoKind, deleteMemoKind, reorderMemoKinds } = useMemoKinds();
  const { settings, updateDefaultKindMode, updateFixedDefaultKindId } = useAppSettings();

  return (
    <div className="py-6 flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-stone-800">Settings</h1>

      {/* メモ種類管理 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-stone-700 border-b border-stone-200 pb-2">
          メモ種類の管理
        </h2>
        <MemoKindForm onAdd={async (input) => { await createMemoKind(input); }} />
        <MemoKindList
          memoKinds={memoKinds}
          onDelete={deleteMemoKind}
          onReorder={reorderMemoKinds}
        />
      </section>

      {/* デフォルト種類設定 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-stone-700 border-b border-stone-200 pb-2">
          Write設定
        </h2>
        <DefaultKindSetting
          settings={settings}
          memoKinds={memoKinds}
          onModeChange={updateDefaultKindMode}
          onFixedKindChange={updateFixedDefaultKindId}
        />
      </section>
    </div>
  );
}
