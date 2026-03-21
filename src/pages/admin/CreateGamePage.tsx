import { useNavigate } from 'react-router-dom';
import { useCreateGame } from '../../hooks/useGames';
import { useAuth } from '../../hooks/useAuth';
import { GameForm } from '../../components/game/GameForm';

export function CreateGamePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createGame, loading, error } = useCreateGame();

  const handleSubmit = async (data: Parameters<typeof createGame>[0]) => {
    const game = await createGame({ ...data, created_by: user!.id });
    if (game) {
      navigate('/my-games');
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Host a Game</h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
        <GameForm onSubmit={handleSubmit} loading={loading} />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
