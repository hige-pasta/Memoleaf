import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RepositoryContext } from './presentation/contexts/RepositoryContext';
import { AppLayout } from './presentation/components/layout/AppLayout';
import { IndexedDbLeafRepository } from './infrastructure/repositories/IndexedDbLeafRepository';
import { IndexedDbMemoKindRepository } from './infrastructure/repositories/IndexedDbMemoKindRepository';
import { seedInitialData } from './infrastructure/seed';

// WriteページはInitial bundleに含める（起動直後に表示するため）
import { WritePage } from './presentation/components/write/WritePage';

// Read・SettingsページはLazy loadで遅延ロード（起動速度最適化）
const ReadPage = lazy(() =>
  import('./presentation/components/read/ReadPage').then((m) => ({ default: m.ReadPage })),
);
const SettingsPage = lazy(() =>
  import('./presentation/components/settings/SettingsPage').then((m) => ({
    default: m.SettingsPage,
  })),
);

// リポジトリインスタンスをシングルトンで生成
const leafRepository = new IndexedDbLeafRepository();
const memoKindRepository = new IndexedDbMemoKindRepository();

/**
 * アプリケーションのルートコンポーネント
 * リポジトリDI・ルーティング・初期データ投入を担う
 */
export default function App() {
  const [isReady, setIsReady] = useState(false);

  // DBの初期化・シードデータ投入
  useEffect(() => {
    seedInitialData(memoKindRepository).finally(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-svh bg-amber-50 text-stone-400 text-sm">
        読み込み中...
      </div>
    );
  }

  return (
    <RepositoryContext.Provider value={{ leafRepository, memoKindRepository }}>
      <BrowserRouter>
        <AppLayout>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16 text-stone-400 text-sm">
                読み込み中...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<WritePage />} />
              <Route path="/read" element={<ReadPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </RepositoryContext.Provider>
  );
}

