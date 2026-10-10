import { startOfDay } from '../../utils/date';

/** 期間フィルタのプリセット */
export type PeriodPreset = 'all' | 'today' | 'week' | 'month' | 'custom';

export const PERIOD_LABELS: Record<PeriodPreset, string> = {
  all: 'すべて',
  today: '今日',
  week: '今週',
  month: '今月',
  custom: '期間を指定',
};

/** プリセットに対応する開始日を返す（終了日は指定しない＝現在まで） */
export function periodStart(preset: Exclude<PeriodPreset, 'all' | 'custom'>, now = new Date()): Date {
  const today = startOfDay(now);
  switch (preset) {
    case 'today':
      return today;
    case 'week': {
      // 週の始まりは月曜日
      const offset = (today.getDay() + 6) % 7;
      return new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    }
    case 'month':
      return new Date(today.getFullYear(), today.getMonth(), 1);
  }
}
