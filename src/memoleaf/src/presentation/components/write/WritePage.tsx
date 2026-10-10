import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaves } from '../../hooks/useLeaves';
import { useMemoKinds } from '../../hooks/useMemoKinds';
import { useAppSettings } from '../../hooks/useAppSettings';
import { LeafForm, type LeafFormHandle } from './LeafForm';
import { RecentLeaves } from './RecentLeaves';
import { PageHeader } from '../shared/PageHeader';
import { Toast } from '../shared/Toast';
import { formatMonthDay } from '../../utils/date';
import type { CreateLeafInput } from '../../../domain/entities/Leaf';

/** 投稿直後に表示するトーストの状態 */
type PostedToast = {
  leafId: string;
  input: CreateLeafInput;
};

/**
 * Writeページ
 * アプリ起動直後に表示されるメインページ。最速でメモを投稿できることを目的とする。
 */
export function WritePage() {
  const navigate = useNavigate();
  const { recentLeaves, createLeaf, deleteLeaf } = useLeaves();
  const { memoKinds } = useMemoKinds();
  const { getDefaultKindId, updateLastUsedKindId } = useAppSettings();
  const formRef = useRef<LeafFormHandle>(null);
  const [posted, setPosted] = useState<PostedToast | null>(null);

  const kindIds = memoKinds.map((k) => k.id);
  const defaultKindId = getDefaultKindId(kindIds);

  const handleSubmit = async (input: CreateLeafInput) => {
    const leaf = await createLeaf(input);
    // 最後に使った種類として記録
    await updateLastUsedKindId(input.kindId);
    setPosted({ leafId: leaf.id, input });
  };

  // 投稿を取り消し、入力内容をフォームへ戻す
  const handleUndo = async () => {
    if (!posted) return;
    setPosted(null);
    await deleteLeaf(posted.leafId);
    formRef.current?.restore(posted.input);
  };

  const closeToast = useCallback(() => setPosted(null), []);

  const handleLeafClick = (id: string) => {
    // ReadページにIDを渡して詳細表示へ遷移
    navigate(`/read?leafId=${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Write" subtitle={formatMonthDay(new Date())} />
      <LeafForm
        ref={formRef}
        memoKinds={memoKinds}
        defaultKindId={defaultKindId}
        onSubmit={handleSubmit}
      />
      <RecentLeaves
        leaves={recentLeaves}
        memoKinds={memoKinds}
        onLeafClick={handleLeafClick}
        highlightId={posted?.leafId}
      />
      {posted && (
        <Toast
          key={posted.leafId}
          message="leaf を追加しました"
          actionLabel="元に戻す"
          onAction={handleUndo}
          onClose={closeToast}
        />
      )}
    </div>
  );
}
