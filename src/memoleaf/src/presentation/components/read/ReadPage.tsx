import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilteredLeaves } from '../../hooks/useFilteredLeaves';
import { useMemoKinds } from '../../hooks/useMemoKinds';
import { useRepositories } from '../../contexts/RepositoryContext';
import { updateLeaf } from '../../../domain/usecases/updateLeaf';
import { deleteLeaf } from '../../../domain/usecases/deleteLeaf';
import { FilterPanel } from './FilterPanel';
import { LeafTimeline } from './LeafTimeline';
import { LeafDetailModal } from './LeafDetailModal';
import type { Leaf } from '../../../domain/entities/Leaf';

/**
 * Readページ
 * 蓄積されたleafをtreeとして俯瞰・閲覧する
 */
export function ReadPage() {
  const { leafRepository } = useRepositories();
  const { memoKinds } = useMemoKinds();
  const {
    filteredLeaves,
    availableTags,
    isLoading,
    refresh,
    selectedKindIds,
    selectedTags,
    tagFilterMode,
    keyword,
    dateFrom,
    dateTo,
    setKindFilter,
    setTagFilter,
    setTagFilterMode,
    setKeyword,
    setDateFrom,
    setDateTo,
    clearFilters,
  } = useFilteredLeaves();

  const [selectedLeaf, setSelectedLeaf] = useState<Leaf | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // URLパラメータにleafIdがある場合は自動的に詳細を開く
  useEffect(() => {
    const leafId = searchParams.get('leafId');
    if (!leafId) return;

    leafRepository.findById(leafId).then((leaf) => {
      if (leaf) setSelectedLeaf(leaf);
      // URLからパラメータを除去
      setSearchParams({}, { replace: true });
    });
  }, [searchParams, leafRepository, setSearchParams]);

  const handleLeafClick = (id: string) => {
    const leaf = filteredLeaves.find((l) => l.id === id) ?? null;
    setSelectedLeaf(leaf);
  };

  const handleUpdate = async (
    id: string,
    data: { body?: string; kindId?: string; tags?: string[] },
  ) => {
    await updateLeaf({ id, ...data }, leafRepository);
    await refresh();
    // 更新後のleafを再取得してmodalを更新
    const updated = await leafRepository.findById(id);
    if (updated) setSelectedLeaf(updated);
  };

  const handleDelete = async (id: string) => {
    await deleteLeaf(id, leafRepository);
    await refresh();
    setSelectedLeaf(null);
  };

  return (
    <div className="py-4 flex flex-col gap-4">
      {/* 絞り込みパネル */}
      <FilterPanel
        memoKinds={memoKinds}
        availableTags={availableTags}
        selectedKindIds={selectedKindIds}
        selectedTags={selectedTags}
        tagFilterMode={tagFilterMode}
        keyword={keyword}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onKindFilterChange={setKindFilter}
        onTagFilterChange={setTagFilter}
        onTagFilterModeChange={setTagFilterMode}
        onKeywordChange={setKeyword}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onClearFilters={clearFilters}
      />

      {/* タイムライン表示エリア */}
      {isLoading ? (
        <div className="text-center text-stone-400 text-sm py-8">読み込み中...</div>
      ) : (
        <LeafTimeline
          leaves={filteredLeaves}
          memoKinds={memoKinds}
          onLeafClick={handleLeafClick}
        />
      )}

      {/* Leaf詳細モーダル */}
      <LeafDetailModal
        leaf={selectedLeaf}
        memoKinds={memoKinds}
        onClose={() => setSelectedLeaf(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
