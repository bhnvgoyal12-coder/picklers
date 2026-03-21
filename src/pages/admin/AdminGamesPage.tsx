import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatTime, formatPrice } from '../../lib/constants';
import type { Game } from '../../types';

const statusVariant = {
  upcoming: 'success',
  in_progress: 'info',
  completed: 'neutral',
  cancelled: 'danger',
} as const;

export function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAll() {
      const { data } = await supabase
        .from('games')
        .select('*, registrations(count)')
        .order('date', { ascending: false });

      const mapped = (data ?? []).map((g: Record<string, unknown>) => ({
        ...g,
        spots_taken: (g.registrations as { count: number }[])?.[0]?.count ?? 0,
      })) as Game[];

      setGames(mapped);
      setLoading(false);
    }
    fetchAll();
  }, []);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">All Games</h2>
        <Link
          to="/admin/games/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          + New Game
        </Link>
      </div>

      {games.length === 0 ? (
        <EmptyState
          title="No games yet"
          description="Create your first game to get started"
          action={
            <Link to="/admin/games/new" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
              Create Game
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => navigate(`/admin/games/${game.id}`)}
              className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{game.title}</h3>
                    <Badge variant={statusVariant[game.status]}>{game.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(game.date)} · {formatTime(game.start_time)} · {game.location_name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-gray-900">{game.spots_taken}/{game.max_players}</p>
                  <p className="text-xs text-gray-500">{formatPrice(game.price_per_player)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
