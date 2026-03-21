import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../../components/ui/Spinner';
import { formatPrice } from '../../lib/constants';

interface Stats {
  totalGames: number;
  upcomingGames: number;
  totalRegistrations: number;
  totalRevenue: number;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [gamesRes, upcomingRes, regsRes, revenueRes] = await Promise.all([
          supabase.from('games').select('id', { count: 'exact', head: true }),
          supabase.from('games').select('id', { count: 'exact', head: true }).eq('status', 'upcoming'),
          supabase.from('registrations').select('id', { count: 'exact', head: true }),
          supabase.from('registrations').select('payment_amount').eq('payment_status', 'paid'),
        ]);

        const revenue = (revenueRes.data ?? []).reduce(
          (sum: number, r: { payment_amount: number }) => sum + r.payment_amount,
          0
        );

        setStats({
          totalGames: gamesRes.count ?? 0,
          upcomingGames: upcomingRes.count ?? 0,
          totalRegistrations: regsRes.count ?? 0,
          totalRevenue: revenue,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <Spinner className="py-20" />;

  const cards = [
    { label: 'Total Games', value: stats?.totalGames ?? 0, icon: '🏓' },
    { label: 'Upcoming', value: stats?.upcomingGames ?? 0, icon: '📅' },
    { label: 'Registrations', value: stats?.totalRegistrations ?? 0, icon: '👥' },
    { label: 'Revenue', value: formatPrice(stats?.totalRevenue ?? 0), icon: '💰' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
        <Link
          to="/admin/games/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          + New Game
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {cards.map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <span className="text-2xl">{icon}</span>
            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          to="/admin/games"
          className="flex-1 text-center py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Manage Games
        </Link>
        <Link
          to="/admin/games/new"
          className="flex-1 text-center py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-100"
        >
          Create Game
        </Link>
      </div>
    </div>
  );
}
