import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

type AppLayoutProps = {
  children: ReactNode;
};

/**
 * アプリ全体の共通レイアウト
 * メインコンテンツエリアとフッターナビゲーションを配置する
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-svh">
      {/* メインコンテンツエリア（浮いたナビ分の余白を下に確保） */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 pb-[calc(env(safe-area-inset-bottom)+120px)]">
        {/* ページ切り替え時にふわっと表示する */}
        <div key={pathname} className="animate-page-in">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
