import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

type AppLayoutProps = {
  children: ReactNode;
};

/**
 * アプリ全体の共通レイアウト
 * メインコンテンツエリアとフッターナビゲーションを配置する
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-svh">
      {/* メインコンテンツエリア（ナビ分のpaddingを確保） */}
      <main className="flex-1 overflow-y-auto pb-14 max-w-3xl w-full mx-auto px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
