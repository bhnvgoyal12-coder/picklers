import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Mobile header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-center h-14">
          <h1 className="text-emerald-700 font-bold text-lg">🏓 Picklers</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
