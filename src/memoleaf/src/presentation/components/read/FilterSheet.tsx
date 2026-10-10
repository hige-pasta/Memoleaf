import { BottomSheet } from '../shared/BottomSheet';
import { FilterChip } from '../shared/FilterChip';
import { TagChip } from '../shared/TagChip';
import { CloseIcon } from '../shared/icons';
import { fromDateInputValue, toDateInputValue } from '../../utils/date';
import { PERIOD_LABELS, type PeriodPreset } from './period';

type FilterSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  resultCount: number;
  period: PeriodPreset;
  onPeriodChange: (preset: PeriodPreset) => void;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  availableTags: string[];
  selectedTags: string[];
  tagFilterMode: 'and' | 'or';
  onTagFilterChange: (tags: string[]) => void;
  onTagFilterModeChange: (mode: 'and' | 'or') => void;
  onReset: () => void;
};

const PERIOD_ORDER: PeriodPreset[] = ['all', 'today', 'week', 'month', 'custom'];

/**
 * 詳細な絞り込み（期間・タグ）を行うボトムシート
 * 変更は即座に一覧へ反映され、「結果を表示」で閉じる
 */
export function FilterSheet({
  isOpen,
  onClose,
  resultCount,
  period,
  onPeriodChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  availableTags,
  selectedTags,
  tagFilterMode,
  onTagFilterChange,
  onTagFilterModeChange,
  onReset,
}: FilterSheetProps) {
  const toggleTag = (tag: string) => {
    onTagFilterChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    );
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} ariaLabel="絞り込み">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-bold text-ink">絞り込み</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onReset}
              className="h-9 rounded-full px-3 text-sm font-bold text-moss-ink transition hover:bg-moss-soft cursor-pointer"
            >
              リセット
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="hidden size-9 items-center justify-center rounded-full bg-sunken text-ink-2 sm:inline-flex cursor-pointer"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>
        </div>

        {/* 期間 */}
        <section className="flex flex-col gap-2.5">
          <h3 className="text-[13px] font-bold text-ink-2">期間</h3>
          <div className="flex flex-wrap gap-2">
            {PERIOD_ORDER.map((p) => (
              <FilterChip key={p} isActive={period === p} onClick={() => onPeriodChange(p)}>
                {PERIOD_LABELS[p]}
                {p === 'custom' && '…'}
              </FilterChip>
            ))}
          </div>
          {period === 'custom' && (
            <div className="flex items-center gap-2 animate-fade-in">
              <input
                type="date"
                value={toDateInputValue(dateFrom)}
                onChange={(e) => onDateFromChange(fromDateInputValue(e.target.value))}
                className="h-11 min-w-0 flex-1 rounded-xl bg-sunken px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-moss/25"
                aria-label="期間開始日"
              />
              <span className="text-sm text-ink-3">〜</span>
              <input
                type="date"
                value={toDateInputValue(dateTo)}
                onChange={(e) => onDateToChange(fromDateInputValue(e.target.value))}
                className="h-11 min-w-0 flex-1 rounded-xl bg-sunken px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-moss/25"
                aria-label="期間終了日"
              />
            </div>
          )}
        </section>

        {/* タグ */}
        {availableTags.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-ink-2">タグ</h3>
              <div role="group" aria-label="タグの条件" className="flex rounded-[10px] bg-sunken p-[3px]">
                {(
                  [
                    ['and', 'すべて含む'],
                    ['or', 'いずれか'],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onTagFilterModeChange(mode)}
                    aria-pressed={tagFilterMode === mode}
                    className={`h-[30px] rounded-lg px-3 text-xs transition cursor-pointer ${
                      tagFilterMode === mode
                        ? 'bg-surface font-bold text-ink shadow-hair'
                        : 'font-medium text-ink-2'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  isActive={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </section>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-1 h-[52px] rounded-2xl bg-moss text-[15px] font-bold text-on-moss transition active:scale-[0.98] cursor-pointer"
        >
          {resultCount}件の結果を表示
        </button>
      </div>
    </BottomSheet>
  );
}
