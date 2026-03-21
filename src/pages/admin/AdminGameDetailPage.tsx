import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame, useDeleteGame } from '../../hooks/useGames';
import { useGameRegistrations } from '../../hooks/useRegistrations';
import { useAuth } from '../../hooks/useAuth';
import { PlayerList } from '../../components/game/PlayerList';
import { SpotsBadge } from '../../components/game/SpotsBadge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, formatTime, formatPrice } from '../../lib/constants';

export function AdminGameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { game, loading } = useGame(id!);
  const { registrations, loading: regsLoading } = useGameRegistrations(id!);
  const { deleteGame, loading: deleting } = useDeleteGame();
  const [copied, setCopied] = useState(false);

  if (loading) return <Spinner className="py-20" />;
  if (!game) return <EmptyState icon="😕" title="Game not found" />;

  // Only the creator can manage this game
  if (game.created_by && user?.id !== game.created_by) {
    return <EmptyState icon="🔒" title="Access denied" description="Only the game host can manage this game" />;
  }

  const shareUrl = `${window.location.origin}/games/${game.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: game.title,
          text: `Join me for ${game.title} on ${formatDate(game.date)}!`,
          url: shareUrl,
        });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this game? This cannot be undone.')) return;
    const ok = await deleteGame(game.id);
    if (ok) navigate('/my-games');
  };

  const paidCount = registrations.filter((r) => r.payment_status === 'paid').length;
  const totalRevenue = registrations
    .filter((r) => r.payment_status === 'paid')
    .reduce((sum, r) => sum + r.payment_amount, 0);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-emerald-600 text-white p-5">
          <div className="flex items-start justify-between">
            <h1 className="text-xl font-bold">{game.title}</h1>
            <SpotsBadge spotsTaken={game.spots_taken ?? 0} maxPlayers={game.max_players} />
          </div>
          <p className="text-emerald-100 text-sm mt-1">
            {formatDate(game.date)} · {formatTime(game.start_time)} – {formatTime(game.end_time)}
          </p>
          <p className="text-emerald-100 text-sm">{game.location_name}</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          <div className="p-4 text-center">
            <p className="text-lg font-bold text-gray-900">{registrations.length}</p>
            <p className="text-xs text-gray-500">Registered</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-lg font-bold text-emerald-600">{paidCount}</p>
            <p className="text-xs text-gray-500">Paid</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-lg font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
        </div>

        {/* Registrations */}
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Registrations</h3>
          {regsLoading ? (
            <Spinner className="py-8" />
          ) : (
            <PlayerList registrations={registrations} />
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 p-5 space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            {copied ? '✓ Link Copied!' : '📤 Share Game Link'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full py-3 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Game'}
          </button>
        </div>
      </div>
    </div>
  );
}
