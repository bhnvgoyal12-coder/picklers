import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime, formatPrice } from '../../lib/constants';
import { SpotsBadge } from './SpotsBadge';
import type { Game } from '../../types';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/games/${game.id}`)}
      className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 active:scale-[0.98] transition-transform hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{game.title}</h3>
          <div className="mt-1.5 space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <span>📅</span>
              {formatDate(game.date)}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <span>🕐</span>
              {formatTime(game.start_time)} – {formatTime(game.end_time)}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <span>📍</span>
              <span className="truncate">{game.location_name}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <SpotsBadge spotsTaken={game.spots_taken ?? 0} maxPlayers={game.max_players} />
          {game.price_per_player > 0 && (
            <span className="text-sm font-semibold text-emerald-700">
              {formatPrice(game.price_per_player)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
