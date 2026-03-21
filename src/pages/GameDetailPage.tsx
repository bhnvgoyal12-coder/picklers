import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '../hooks/useGames';
import { useRegisterForGame } from '../hooks/useRegistrations';
import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../hooks/useAuth';
import { SpotsBadge } from '../components/game/SpotsBadge';
import { PlayerList } from '../components/game/PlayerList';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate, formatTime, formatPrice } from '../lib/constants';

export function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, session } = useAuth();
  const { game, loading, error, refetch } = useGame(id!);
  const { register, loading: registering, error: regError } = useRegisterForGame();
  const { createOrderAndPay, loading: paying, error: payError } = usePayment();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const text = game ? `Join me for ${game.title} on ${formatDate(game.date)}!` : 'Check out this pickleball game!';

    if (navigator.share) {
      try {
        await navigator.share({ title: game?.title ?? 'Picklers Game', text, url });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <Spinner className="py-20" />;
  if (error || !game) {
    return <EmptyState icon="😕" title="Game not found" description={error || undefined} />;
  }

  const spotsLeft = game.max_players - (game.spots_taken ?? 0);
  const isFull = spotsLeft <= 0;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !phone.trim()) return;

    const registration = await register({
      game_id: game.id,
      user_id: user.id,
      player_name: name.trim(),
      player_phone: phone.trim(),
      player_email: email.trim(),
      payment_amount: game.price_per_player,
    });

    if (!registration) return;

    if (game.price_per_player > 0) {
      const paid = await createOrderAndPay({
        registrationId: registration.id,
        gameId: game.id,
        gameName: game.title,
        amount: game.price_per_player,
        currency: game.currency,
        playerName: name.trim(),
        playerEmail: email.trim(),
        playerPhone: phone.trim(),
      });

      if (paid) {
        setSuccessMsg('Payment successful! You are registered.');
        setShowForm(false);
        refetch();
      }
    } else {
      setSuccessMsg('You are registered! See you on the court.');
      setShowForm(false);
      refetch();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          {copied ? '✓ Copied!' : '📤 Share'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-5 md:p-6">
          <div className="flex items-start justify-between">
            <h1 className="text-xl md:text-2xl font-bold">{game.title}</h1>
            <SpotsBadge spotsTaken={game.spots_taken ?? 0} maxPlayers={game.max_players} />
          </div>
          {game.description && (
            <p className="mt-2 text-emerald-100 text-sm">{game.description}</p>
          )}
        </div>

        {/* Details */}
        <div className="p-5 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">📅</span>
                <div>
                  <p className="font-medium text-gray-900">{formatDate(game.date)}</p>
                  <p className="text-gray-500">{formatTime(game.start_time)} – {formatTime(game.end_time)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">📍</span>
                <div>
                  <p className="font-medium text-gray-900">{game.location_name}</p>
                  {game.location_address && <p className="text-gray-500">{game.location_address}</p>}
                </div>
              </div>

              {game.court_info && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-lg">🏸</span>
                  <p className="text-gray-700">{game.court_info}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">👥</span>
                <p className="text-gray-700">{game.spots_taken ?? 0} / {game.max_players} players</p>
              </div>

              {game.price_per_player > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-lg">💰</span>
                  <p className="font-semibold text-emerald-700 text-base">{formatPrice(game.price_per_player)} per player</p>
                </div>
              )}

              {game.location_map_url && (
                <a
                  href={game.location_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  📍 Open in Maps →
                </a>
              )}
            </div>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg text-sm font-medium">
              {successMsg}
            </div>
          )}

          {/* Join button — requires login */}
          {!showForm && !successMsg && !isFull && (
            session ? (
              <button
                onClick={() => {
                  setName(profile?.full_name ?? '');
                  setPhone(profile?.phone ?? '');
                  setEmail(user?.email ?? '');
                  setShowForm(true);
                }}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-base hover:bg-emerald-700 active:scale-[0.98] transition-all"
              >
                {game.price_per_player > 0
                  ? `Join Game · ${formatPrice(game.price_per_player)}`
                  : 'Join Game'}
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-base text-center hover:bg-emerald-700"
              >
                Sign in to Join
              </Link>
            )
          )}

          {isFull && !successMsg && (
            <div className="text-center py-3 bg-gray-100 rounded-xl text-gray-500 font-medium">
              This game is full
            </div>
          )}

          {/* Registration form */}
          {showForm && (
            <form onSubmit={handleJoin} className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-900">Your Details</h3>
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                readOnly
              />

              {(regError || payError) && (
                <p className="text-sm text-red-600">{regError || payError}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering || paying}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50"
                >
                  {registering || paying ? 'Processing...' : game.price_per_player > 0 ? `Pay ${formatPrice(game.price_per_player)}` : 'Confirm'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Players list */}
        {game.registrations && game.registrations.length > 0 && (
          <div className="border-t border-gray-100 p-5 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Players ({game.registrations.length})</h3>
            <PlayerList registrations={game.registrations} />
          </div>
        )}
      </div>
    </div>
  );
}
