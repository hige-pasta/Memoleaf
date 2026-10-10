/** スケルトンカードの行幅パターン */
const CARD_WIDTHS = [
  ['92%', '58%'],
  ['80%', '44%'],
  ['96%', '70%'],
  ['74%', '36%'],
];

/**
 * leaf 一覧の読み込み中プレースホルダー
 */
export function LeafListSkeleton() {
  return (
    <div aria-busy="true" aria-label="読み込み中" className="flex flex-col gap-2 pt-3">
      <div className="skeleton mb-1.5 h-4 w-24" />
      {CARD_WIDTHS.map(([w1, w2], i) => (
        <div key={i} className="flex flex-col gap-2.5 rounded-2xl bg-surface p-4 shadow-hair">
          <div className="skeleton h-3.5" style={{ width: w1 }} />
          <div className="skeleton h-3.5" style={{ width: w2 }} />
          <div className="flex gap-2.5 pt-1">
            <div className="skeleton h-2.5 w-13" />
            <div className="skeleton h-2.5 w-10" />
            <div className="skeleton ml-auto h-2.5 w-9" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ページ全体の読み込み中プレースホルダー（見出し＋一覧）
 */
export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-3 pt-6">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-7 w-28" />
      <LeafListSkeleton />
    </div>
  );
}
