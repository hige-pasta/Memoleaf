import type { MemoKind } from '../../../domain/entities/MemoKind';
import { MemoKindButton } from '../shared/MemoKindButton';
import { TagChip } from '../shared/TagChip';
import { SearchBar } from './SearchBar';

type FilterPanelProps = {
  memoKinds: MemoKind[];
  availableTags: string[];
  selectedKindIds: string[];
  selectedTags: string[];
  tagFilterMode: 'and' | 'or';
  keyword: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onKindFilterChange: (kindIds: string[]) => void;
  onTagFilterChange: (tags: string[]) => void;
  onTagFilterModeChange: (mode: 'and' | 'or') => void;
  onKeywordChange: (keyword: string) => void;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  onClearFilters: () => void;
};

/** Date を input[type="date"] 用の文字列（YYYY-MM-DD）に変換 */
function dateToInputValue(date: Date | undefined): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

/**
 * 絞り込みパネル
 * 種類・タグ・日付・キーワードによるフィルタリングを提供する
 */
export function FilterPanel({
  memoKinds,
  availableTags,
  selectedKindIds,
  selectedTags,
  tagFilterMode,
  keyword,
  dateFrom,
  dateTo,
  onKindFilterChange,
  onTagFilterChange,
  onTagFilterModeChange,
  onKeywordChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: FilterPanelProps) {
  const hasActiveFilters =
    selectedKindIds.length > 0 ||
    selectedTags.length > 0 ||
    keyword !== '' ||
    dateFrom !== undefined ||
    dateTo !== undefined;

  const toggleKind = (id: string) => {
    onKindFilterChange(
      selectedKindIds.includes(id)
        ? selectedKindIds.filter((k) => k !== id)
        : [...selectedKindIds, id],
    );
  };

  const toggleTag = (tag: string) => {
    onTagFilterChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    );
  };

  return (
    <div className="flex flex-col gap-3 bg-amber-50 border border-amber-100 rounded-lg p-4">
      {/* キーワード検索 */}
      <SearchBar value={keyword} onChange={onKeywordChange} />

      {/* 種類フィルタ */}
      <div>
        <div className="flex flex-wrap gap-2">
          {memoKinds.map((kind) => (
            <MemoKindButton
              key={kind.id}
              kind={kind}
              isSelected={selectedKindIds.includes(kind.id)}
              onClick={() => toggleKind(kind.id)}
            />
          ))}
        </div>
      </div>

      {/* タグフィルタ */}
      {availableTags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-stone-500">タグ</span>
            {selectedTags.length > 1 && (
              <button
                type="button"
                onClick={() => onTagFilterModeChange(tagFilterMode === 'and' ? 'or' : 'and')}
                className="text-xs px-2 py-0.5 rounded border border-stone-300 text-stone-500 hover:border-green-600 hover:text-green-700 transition-colors cursor-pointer"
              >
                {tagFilterMode === 'and' ? 'AND' : 'OR'}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                isActive={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 日付フィルタ */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateToInputValue(dateFrom)}
          onChange={(e) =>
            onDateFromChange(e.target.value ? new Date(e.target.value) : undefined)
          }
          className="flex-1 px-2 py-1.5 rounded-md border border-stone-300 bg-white text-sm text-stone-700 focus:outline-none focus:border-green-600"
          aria-label="期間開始日"
        />
        <span className="text-stone-400 text-sm">〜</span>
        <input
          type="date"
          value={dateToInputValue(dateTo)}
          onChange={(e) =>
            onDateToChange(e.target.value ? new Date(e.target.value) : undefined)
          }
          className="flex-1 px-2 py-1.5 rounded-md border border-stone-300 bg-white text-sm text-stone-700 focus:outline-none focus:border-green-600"
          aria-label="期間終了日"
        />
      </div>

      {/* フィルタクリア */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors cursor-pointer text-left"
        >
          フィルタをクリア
        </button>
      )}
    </div>
  );
}
