import { SearchIcon } from '../shared/icons';

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
    <div className="relative flex-1">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-ink-3" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="キーワードで検索"
        className="h-[46px] w-full rounded-[14px] bg-surface pl-[42px] pr-3.5 text-[15px] text-ink shadow-hair outline-none transition placeholder:text-ink-3 focus:ring-2 focus:ring-moss/25"
        aria-label="キーワード検索"
      />
    </div>
  );
}
