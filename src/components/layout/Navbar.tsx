import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { to: '/', label: 'Games' },
  { to: '/my-games', label: 'My Games' },
  { to: '/host/new', label: 'Host Game' },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { session, profile, signOut } = useAuth();

  return (
    <header className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-emerald-700 font-bold text-xl">
          🏓 Picklers
        </Link>
        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {navLinks.map(({ to, label }) => {
              const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-3 pl-3 border-l border-gray-200">
            {session ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold">
                      {(profile?.full_name || '?')[0].toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={signOut}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
