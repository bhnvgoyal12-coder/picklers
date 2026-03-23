import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      {/* Mobile header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-center h-14">
          <h1 className="text-emerald-700 font-bold text-lg">🏓 Picklers</h1>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-24 md:pb-6 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
        <Link to="/policies" className="hover:text-emerald-600 transition-colors">
          Privacy Policy · Refund Policy · Terms of Service
        </Link>
      </footer>

      <BottomNav />
    </div>
  );
}
