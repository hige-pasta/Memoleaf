import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../../domain/entities/MemoKind';
import { DEFAULT_APP_SETTINGS } from '../../domain/entities/MemoKind';
import { getDatabase } from '../../infrastructure/db/database';

/**
 * アプリ設定を管理するHook
 * IndexedDBのappSettingsストアに永続化する
 */
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  // 設定をDBから読み込む
  const load = useCallback(async () => {
    const db = await getDatabase();
    const modeRecord = await db.get('appSettings', 'defaultKindMode');
    const fixedIdRecord = await db.get('appSettings', 'fixedDefaultKindId');
    const lastUsedRecord = await db.get('appSettings', 'lastUsedKindId');

    setSettings({
      defaultKindMode: (modeRecord?.value as AppSettings['defaultKindMode']) ?? 'lastUsed',
      fixedDefaultKindId: (fixedIdRecord?.value as string | null) ?? null,
      lastUsedKindId: (lastUsedRecord?.value as string | null) ?? null,
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveSetting = async (key: string, value: AppSettings[keyof AppSettings]) => {
    const db = await getDatabase();
    await db.put('appSettings', { key, value });
  };

  const updateDefaultKindMode = useCallback(
    async (mode: 'lastUsed' | 'fixed') => {
      await saveSetting('defaultKindMode', mode);
      setSettings((prev) => ({ ...prev, defaultKindMode: mode }));
    },
    [],
  );

  const updateFixedDefaultKindId = useCallback(
    async (kindId: string | null) => {
      await saveSetting('fixedDefaultKindId', kindId);
      setSettings((prev) => ({ ...prev, fixedDefaultKindId: kindId }));
    },
    [],
  );

  const updateLastUsedKindId = useCallback(
    async (kindId: string) => {
      await saveSetting('lastUsedKindId', kindId);
      setSettings((prev) => ({ ...prev, lastUsedKindId: kindId }));
    },
    [],
  );

  /** 現在の設定に基づくデフォルト種類IDを返す（memoKindsが必要な呼び出し元で使う） */
  const getDefaultKindId = useCallback(
    (memoKindIds: string[]): string | null => {
      if (settings.defaultKindMode === 'fixed' && settings.fixedDefaultKindId) {
        if (memoKindIds.includes(settings.fixedDefaultKindId)) {
          return settings.fixedDefaultKindId;
        }
      }
      if (settings.lastUsedKindId && memoKindIds.includes(settings.lastUsedKindId)) {
        return settings.lastUsedKindId;
      }
      return memoKindIds[0] ?? null;
    },
    [settings],
  );

  return {
    settings,
    updateDefaultKindMode,
    updateFixedDefaultKindId,
    updateLastUsedKindId,
    getDefaultKindId,
  };
}
