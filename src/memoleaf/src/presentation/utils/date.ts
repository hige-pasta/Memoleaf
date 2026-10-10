/** 2つの日付が同じ日かどうか */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** その日の 0:00 を返す */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** 時刻を HH:mm 形式でフォーマットする */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

/** 「10月10日（土）」形式。今年以外は年も付ける */
export function formatMonthDay(date: Date, now: Date = new Date()): string {
  const md = `${date.getMonth() + 1}月${date.getDate()}日`;
  const weekday = date.toLocaleDateString('ja-JP', { weekday: 'short' });
  const year = date.getFullYear() === now.getFullYear() ? '' : `${date.getFullYear()}年`;
  return `${year}${md}（${weekday}）`;
}

/** 「今日」「昨日」の相対表記。それ以外は null */
export function relativeDayLabel(date: Date, now: Date = new Date()): string | null {
  if (isSameDay(date, now)) return '今日';
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (isSameDay(date, yesterday)) return '昨日';
  return null;
}

/** Date を input[type="date"] 用の文字列（YYYY-MM-DD・ローカル時刻）に変換 */
export function toDateInputValue(date: Date | undefined): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** input[type="date"] の値（YYYY-MM-DD）をローカル時刻の 0:00 として解釈する */
export function fromDateInputValue(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}
