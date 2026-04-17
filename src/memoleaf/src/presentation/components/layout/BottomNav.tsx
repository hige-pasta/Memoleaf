import { NavLink } from 'react-router-dom';
import leafIcon from '../../../assets/icons/leaf.svg';
import treeIcon from '../../../assets/icons/tree.svg';
import seedIcon from '../../../assets/icons/seed.svg';

/** ナビゲーション項目の定義 */
const NAV_ITEMS = [
  { to: '/',         label: 'Write',    icon: leafIcon  },
  { to: '/read',     label: 'Read',     icon: treeIcon  },
  { to: '/settings', label: 'Settings', icon: seedIcon  },
] as const;

/**
 * フッターナビゲーションバー
 * 全ページで常時表示。現在のページをアクティブ状態で視覚的に示す。
 */
export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-amber-50 border-t border-amber-200 flex items-center justify-around z-50">
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
              isActive ? 'text-green-700' : 'text-stone-400'
            }`
          }
        >
          <img src={icon} alt="" className="w-6 h-6" aria-hidden="true" />
          <span className="text-xs font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
