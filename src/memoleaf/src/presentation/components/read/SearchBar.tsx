type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * キーワード検索バー
 * 入力値の変更を親に伝える（デバウンスはHook側で処理）
 */
export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="キーワードで検索..."
        className="w-full pl-9 pr-4 py-2 rounded-md border border-stone-300 bg-white text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-green-600 transition-colors"
        aria-label="キーワード検索"
      />
    </div>
  );
}
