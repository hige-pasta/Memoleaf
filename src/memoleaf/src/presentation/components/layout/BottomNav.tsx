import { NavLink } from 'react-router-dom';
import { PageIcon } from '../shared/PageIcon';

/** ナビゲーション項目の定義 */
const NAV_ITEMS = [
  { to: '/',         label: 'Write',    icon: 'leaf' },
  { to: '/read',     label: 'Read',     icon: 'tree' },
  { to: '/settings', label: 'Settings', icon: 'seed' },
] as const;

/**
 * フッターナビゲーションバー
 * 全ページで常時表示。画面下に浮いたピル型で、現在のページを背景色で示す。
 */
export function BottomNav() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom)+20px)]">
      <nav
        aria-label="メインナビゲーション"
        className="pointer-events-auto flex gap-1 rounded-full border border-line bg-nav p-1.5 shadow-card backdrop-blur-xl"
      >
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex h-[52px] w-[76px] flex-col items-center justify-center gap-0.5 rounded-full transition active:scale-95 ${
                isActive ? 'bg-moss-soft text-moss-ink' : 'text-ink-3 hover:text-ink-2'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <PageIcon name={icon} className="size-[22px]" />
                <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
