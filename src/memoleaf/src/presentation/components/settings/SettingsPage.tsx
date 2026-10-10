import { useMemoKinds } from '../../hooks/useMemoKinds';
import { useAppSettings } from '../../hooks/useAppSettings';
import { MemoKindForm } from './MemoKindForm';
import { MemoKindList } from './MemoKindList';
import { DefaultKindSetting } from './DefaultKindSetting';
import { PageHeader } from '../shared/PageHeader';

/**
 * Settingsページ
 * メモ種類の管理とアプリ設定を行う
 */
export function SettingsPage() {
  const { memoKinds, createMemoKind, deleteMemoKind, reorderMemoKinds } = useMemoKinds();
  const { settings, updateDefaultKindMode, updateFixedDefaultKindId } = useAppSettings();

  return (
    <div className="flex flex-col gap-7">
      <PageHeader title="Settings" subtitle="種類と Write の設定" />

      {/* メモ種類管理 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-[15px] font-bold text-ink">メモ種類</h2>
        <MemoKindList
          memoKinds={memoKinds}
          onDelete={deleteMemoKind}
          onReorder={reorderMemoKinds}
        />
        <MemoKindForm onAdd={async (input) => { await createMemoKind(input); }} />
      </section>

      {/* デフォルト種類設定 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-[15px] font-bold text-ink">Write</h2>
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
