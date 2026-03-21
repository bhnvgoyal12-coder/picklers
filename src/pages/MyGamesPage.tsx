import { useNavigate } from 'react-router-dom';
import { useMyRegistrations } from '../hooks/useRegistrations';
import { useMyHostedGames } from '../hooks/useMyHostedGames';
import { PaymentStatusBadge } from '../components/payment/PaymentStatusBadge';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate, formatTime, formatPrice } from '../lib/constants';

export function MyGamesPage() {
  const { registrations, loading: regsLoading } = useMyRegistrations();
  const { games: hostedGames, loading: hostedLoading } = useMyHostedGames();
  const navigate = useNavigate();

  const loading = regsLoading || hostedLoading;

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-8">
      {/* Hosted Games */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Games I'm Hosting</h2>
        {hostedGames.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No hosted games yet"
            description="Create a game and share it with your group"
            action={
              <button
                onClick={() => navigate('/host/new')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Host a Game
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {hostedGames.map((game) => (
              <button
                key={game.id}
                onClick={() => navigate(`/host/${game.id}`)}
                className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{game.title}</h3>
                      <Badge variant={game.status === 'upcoming' ? 'success' : 'neutral'}>{game.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(game.date)} · {formatTime(game.start_time)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-gray-900">{game.spots_taken}/{game.max_players}</p>
                    {game.price_per_player > 0 && (
                      <p className="text-xs text-gray-500">{formatPrice(game.price_per_player)}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Registered Games */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Games I've Joined</h2>
        {registrations.length === 0 ? (
          <EmptyState
            icon="🎫"
            title="No registrations yet"
            description="Browse upcoming games and join one!"
            action={
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Browse Games
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {registrations.map((reg) => (
              <button
                key={reg.id}
                onClick={() => navigate(`/games/${reg.game_id}`)}
                className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {reg.game?.title ?? 'Game'}
                    </h3>
                    {reg.game && (
                      <div className="mt-1 space-y-0.5">
                        <p className="text-sm text-gray-600">
                          📅 {formatDate(reg.game.date)} · {formatTime(reg.game.start_time)}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          📍 {reg.game.location_name}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <PaymentStatusBadge status={reg.payment_status} />
                    {reg.payment_amount > 0 && (
                      <span className="text-xs text-gray-500">{formatPrice(reg.payment_amount)}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
