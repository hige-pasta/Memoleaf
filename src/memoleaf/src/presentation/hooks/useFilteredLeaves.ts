import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Leaf } from '../../domain/entities/Leaf';
import { useRepositories } from '../contexts/RepositoryContext';
import { SEARCH_DEBOUNCE_MS } from '../../constants/presets';

/**
 * フィルタリング付きLeaf一覧を管理するHook
 * フィルタ変更時にリアルタイムで結果を再計算する
 */
export function useFilteredLeaves() {
  const { leafRepository } = useRepositories();
  const [allLeaves, setAllLeaves] = useState<Leaf[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // フィルタ状態
  const [selectedKindIds, setSelectedKindIds] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagFilterMode, setTagFilterMode] = useState<'and' | 'or'>('or');
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // キーワードのデバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword]);

  // 全leaf・タグ一覧を読み込む
  const refresh = useCallback(async () => {
    const [leaves, tags] = await Promise.all([
      leafRepository.findAll({ isArchived: false }),
      leafRepository.getAllTags(),
    ]);
    setAllLeaves(leaves);
    setAvailableTags(tags);
  }, [leafRepository]);

  useEffect(() => {
    setIsLoading(true);
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  // フィルタを適用したleaf一覧（クライアント側でフィルタリング）
  const filteredLeaves = useMemo(() => {
    let leaves = allLeaves;

    // 種類フィルタ（OR）
    if (selectedKindIds.length > 0) {
      leaves = leaves.filter((l) => selectedKindIds.includes(l.kindId));
    }

    // タグフィルタ
    if (selectedTags.length > 0) {
      if (tagFilterMode === 'and') {
        leaves = leaves.filter((l) => selectedTags.every((t) => l.tags.includes(t)));
      } else {
        leaves = leaves.filter((l) => selectedTags.some((t) => l.tags.includes(t)));
      }
    }

    // 日付フィルタ
    if (dateFrom) {
      leaves = leaves.filter((l) => l.createdAt >= dateFrom);
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      leaves = leaves.filter((l) => l.createdAt <= endOfDay);
    }

    // キーワード検索
    if (debouncedKeyword.trim() !== '') {
      const kw = debouncedKeyword.trim().toLowerCase();
      leaves = leaves.filter(
        (l) =>
          l.body.toLowerCase().includes(kw) ||
          l.tags.some((t) => t.toLowerCase().includes(kw)),
      );
    }

    return leaves;
  }, [allLeaves, selectedKindIds, selectedTags, tagFilterMode, dateFrom, dateTo, debouncedKeyword]);

  const clearFilters = useCallback(() => {
    setSelectedKindIds([]);
    setSelectedTags([]);
    setTagFilterMode('or');
    setKeyword('');
    setDebouncedKeyword('');
    setDateFrom(undefined);
    setDateTo(undefined);
  }, []);

  return {
    filteredLeaves,
    availableTags,
    isLoading,
    refresh,
    // フィルタ状態
    selectedKindIds,
    selectedTags,
    tagFilterMode,
    keyword,
    dateFrom,
    dateTo,
    // フィルタ操作
    setKindFilter: setSelectedKindIds,
    setTagFilter: setSelectedTags,
    setTagFilterMode,
    setKeyword,
    setDateFrom,
    setDateTo,
    clearFilters,
  };
}
