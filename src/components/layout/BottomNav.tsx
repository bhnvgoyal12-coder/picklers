import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const tabs = [
  { to: '/', icon: '🏓', label: 'Games' },
  { to: '/my-games', icon: '🎫', label: 'My Games' },
  { to: '/host/new', icon: '➕', label: 'Host' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { profile } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ to, icon, label }) => {
          const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                active ? 'text-emerald-700' : 'text-gray-400'
              }`}
            >
              {to === '/profile' && profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className={`w-6 h-6 rounded-full ${active ? 'ring-2 ring-emerald-600' : ''}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xl">{icon}</span>
              )}
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
