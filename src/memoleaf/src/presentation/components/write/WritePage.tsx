import { useNavigate } from 'react-router-dom';
import { useLeaves } from '../../hooks/useLeaves';
import { useMemoKinds } from '../../hooks/useMemoKinds';
import { useAppSettings } from '../../hooks/useAppSettings';
import { LeafForm } from './LeafForm';
import { RecentLeaves } from './RecentLeaves';
import type { CreateLeafInput } from '../../../domain/entities/Leaf';

/**
 * Writeページ
 * アプリ起動直後に表示されるメインページ。最速でメモを投稿できることを目的とする。
 */
export function WritePage() {
  const navigate = useNavigate();
  const { recentLeaves, createLeaf } = useLeaves();
  const { memoKinds } = useMemoKinds();
  const { getDefaultKindId, updateLastUsedKindId } = useAppSettings();

  const kindIds = memoKinds.map((k) => k.id);
  const defaultKindId = getDefaultKindId(kindIds);

  const handleSubmit = async (input: CreateLeafInput) => {
    await createLeaf(input);
    // 最後に使った種類として記録
    await updateLastUsedKindId(input.kindId);
  };

  const handleLeafClick = (id: string) => {
    // ReadページにIDを渡して詳細表示へ遷移
    navigate(`/read?leafId=${id}`);
  };

  return (
    <div className="py-6">
      <LeafForm
        memoKinds={memoKinds}
        defaultKindId={defaultKindId}
        onSubmit={handleSubmit}
      />
      <RecentLeaves
        leaves={recentLeaves}
        memoKinds={memoKinds}
        onLeafClick={handleLeafClick}
      />
    </div>
  );
}
