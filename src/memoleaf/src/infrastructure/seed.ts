import type { MemoKindRepository } from '../domain/repositories/MemoKindRepository';
import { PRESET_MEMO_KINDS, UNCATEGORIZED_MEMO_KIND } from '../constants/presets';
import { LEGACY_KIND_COLOR_MAP } from '../constants/colors';

/**
 * 初回起動時にプリセットのメモ種類を投入する
 * 既にデータが存在する場合は、旧プリセット色の置き換えのみ行う
 */
export async function seedInitialData(
  memoKindRepository: MemoKindRepository,
): Promise<void> {
  const existing = await memoKindRepository.findAll();
  if (existing.length > 0) {
    await migrateLegacyKindColors(memoKindRepository);
    return;
  }

  // 未分類（削除不可の特別種類）を最初に保存
  await memoKindRepository.save(UNCATEGORIZED_MEMO_KIND);

  // プリセットの4種類を順番に保存
  for (const preset of PRESET_MEMO_KINDS) {
    await memoKindRepository.save({
      ...preset,
      id: crypto.randomUUID(),
    });
  }
}

/**
 * 旧デザインのプリセット色のまま保存されている種類を、新しいプリセット色に置き換える
 * ユーザーが自分で選んだ色（プリセット以外）はそのまま残す
 */
async function migrateLegacyKindColors(memoKindRepository: MemoKindRepository): Promise<void> {
  const kinds = await memoKindRepository.findAll();
  for (const kind of kinds) {
    const next = LEGACY_KIND_COLOR_MAP[kind.color.toLowerCase()];
    if (next) {
      await memoKindRepository.save({ ...kind, color: next });
    }
  }
}
