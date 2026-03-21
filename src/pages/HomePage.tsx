import { useGames } from '../hooks/useGames';
import { GameCard } from '../components/game/GameCard';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

export function HomePage() {
  const { games, loading, error, refetch } = useGames();

  if (loading) return <Spinner className="py-20" />;

  if (error) {
    return (
      <EmptyState
        icon="😕"
        title="Something went wrong"
        description={error}
        action={
          <button onClick={refetch} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
            Try Again
          </button>
        }
      />
    );
  }

  if (games.length === 0) {
    return (
      <EmptyState
        title="No upcoming games"
        description="Check back later for new games!"
      />
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Games</h2>
      <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
