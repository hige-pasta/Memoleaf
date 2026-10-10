import { useState } from 'react';
import type { MemoKind } from '../../../domain/entities/MemoKind';
import { MemoKindButton } from '../shared/MemoKindButton';
import { CloseIcon, FilterIcon } from '../shared/icons';
import { SearchBar } from './SearchBar';
import { FilterSheet } from './FilterSheet';
import { PERIOD_LABELS, periodStart, type PeriodPreset } from './period';

type FilterPanelProps = {
  memoKinds: MemoKind[];
  availableTags: string[];
  resultCount: number;
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

/** 期間指定チップに表示する短い日付（M/D） */
function shortDate(date: Date | undefined): string {
  return date ? `${date.getMonth() + 1}/${date.getDate()}` : '';
}

/**
 * 絞り込みバー
 * 検索と種類チップだけを常時表示し、期間・タグはボトムシートで指定する
 */
export function FilterPanel({
  memoKinds,
  availableTags,
  resultCount,
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('all');

  const hasDateFilter = dateFrom !== undefined || dateTo !== undefined;
  // 日付が外部からクリアされた場合は「すべて」扱いにする（期間指定の入力中は維持）
  const period: PeriodPreset =
    periodPreset === 'custom' ? 'custom' : hasDateFilter ? periodPreset : 'all';
  const sheetFilterCount = (hasDateFilter ? 1 : 0) + selectedTags.length;
  const hasActiveFilters =
    selectedKindIds.length > 0 || selectedTags.length > 0 || keyword !== '' || hasDateFilter;

  const toggleKind = (id: string) => {
    onKindFilterChange(
      selectedKindIds.includes(id)
        ? selectedKindIds.filter((k) => k !== id)
        : [...selectedKindIds, id],
    );
  };

  const changePeriod = (preset: PeriodPreset) => {
    setPeriodPreset(preset);
    if (preset === 'custom') return;
    onDateFromChange(preset === 'all' ? undefined : periodStart(preset));
    onDateToChange(undefined);
  };

  const clearPeriod = () => changePeriod('all');

  const resetSheetFilters = () => {
    clearPeriod();
    onTagFilterChange([]);
    onTagFilterModeChange('or');
  };

  const clearAll = () => {
    setPeriodPreset('all');
    onClearFilters();
  };

  const periodChipLabel =
    period === 'custom' ? `${shortDate(dateFrom)}〜${shortDate(dateTo)}` : PERIOD_LABELS[period];

  return (
    <div className="flex flex-col gap-3">
      {/* 検索＋絞り込みボタン */}
      <div className="flex gap-2">
        <SearchBar value={keyword} onChange={onKeywordChange} />
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          aria-label={sheetFilterCount > 0 ? `絞り込み（${sheetFilterCount}件適用中）` : '絞り込み'}
          className="relative inline-flex size-[46px] shrink-0 items-center justify-center rounded-[14px] bg-surface text-ink shadow-hair transition active:scale-95 cursor-pointer"
        >
          <FilterIcon className="size-5" />
          {sheetFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-moss text-[11px] font-bold text-on-moss tabular-nums">
              {sheetFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* 種類フィルタ（横スクロール） */}
      <div
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-0.5"
        role="group"
        aria-label="種類で絞り込み"
      >
        <button
          type="button"
          onClick={() => onKindFilterChange([])}
          aria-pressed={selectedKindIds.length === 0}
          className={`h-9 shrink-0 rounded-full px-3.5 text-[13px] transition active:scale-95 cursor-pointer ${
            selectedKindIds.length === 0
              ? 'bg-ink font-bold text-paper'
              : 'border-[1.5px] border-line-strong bg-surface font-medium text-ink-2'
          }`}
        >
          すべて
        </button>
        {memoKinds.map((kind) => (
          <MemoKindButton
            key={kind.id}
            kind={kind}
            size="sm"
            isSelected={selectedKindIds.includes(kind.id)}
            onClick={() => toggleKind(kind.id)}
          />
        ))}
      </div>

      {/* 適用中の期間・タグ */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          {hasDateFilter && (
            <AppliedChip label={periodChipLabel} onRemove={clearPeriod} removeLabel="期間の指定を解除" />
          )}
          {selectedTags.map((tag) => (
            <AppliedChip
              key={tag}
              label={`#${tag}`}
              onRemove={() => onTagFilterChange(selectedTags.filter((t) => t !== tag))}
              removeLabel={`タグ「${tag}」の絞り込みを解除`}
            />
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="h-[30px] rounded-full px-2.5 text-[13px] font-medium text-ink-3 transition hover:text-ink cursor-pointer"
          >
            すべてクリア
          </button>
        </div>
      )}

      <FilterSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        resultCount={resultCount}
        period={period}
        onPeriodChange={changePeriod}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
        availableTags={availableTags}
        selectedTags={selectedTags}
        tagFilterMode={tagFilterMode}
        onTagFilterChange={onTagFilterChange}
        onTagFilterModeChange={onTagFilterModeChange}
        onReset={resetSheetFilters}
      />
    </div>
  );
}

type AppliedChipProps = {
  label: string;
  onRemove: () => void;
  removeLabel: string;
};

/** 適用中の条件を示す、外せるチップ */
function AppliedChip({ label, onRemove, removeLabel }: AppliedChipProps) {
  return (
    <span className="inline-flex h-[30px] items-center gap-0.5 rounded-full bg-moss-soft pl-3 pr-1 text-[13px] font-bold text-moss-ink">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="inline-flex size-6 items-center justify-center rounded-full transition hover:bg-moss/15 cursor-pointer"
      >
        <CloseIcon className="size-3.5" />
      </button>
    </span>
  );
}
