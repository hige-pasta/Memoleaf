/**
 * 種類カラーを薄めた色を返す（選択中チップの背景などに使う）
 * 透明と混ぜるため、ライト・ダークどちらの背景にもなじむ
 */
export function tint(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}
