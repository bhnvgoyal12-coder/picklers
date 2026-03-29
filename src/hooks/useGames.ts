import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Game } from '../types';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error: err } = await supabase
        .from('games')
        .select('*, registrations(count)')
        .eq('registrations.payment_status', 'paid')
        .gte('date', today)
        .eq('status', 'upcoming')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (err) throw err;

      const gamesWithSpots = (data ?? []).map((g: Record<string, unknown>) => ({
        ...g,
        spots_taken: (g.registrations as { count: number }[])?.[0]?.count ?? 0,
      })) as Game[];

      setGames(gamesWithSpots);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, loading, error, refetch: fetchGames };
}

export function useGame(id: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('games')
        .select('*, registrations(*)')
        .eq('id', id)
        .single();

      if (err) throw err;

      const spotsCount = (data.registrations as unknown[])?.filter(
        (r: unknown) => {
          const reg = r as { payment_status: string };
          return reg.payment_status === 'paid';
        }
      ).length ?? 0;

      setGame({ ...data, spots_taken: spotsCount } as Game);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  return { game, loading, error, refetch: fetchGame };
}

export function useCreateGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGame = async (gameData: Omit<Game, 'id' | 'created_at' | 'updated_at' | 'spots_taken' | 'registrations' | 'creator'>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('games')
        .insert(gameData)
        .select()
        .single();

      if (err) throw err;
      return data as Game;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create game';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createGame, loading, error };
}

export function useUpdateGame() {
  const [loading, setLoading] = useState(false);

  const updateGame = async (id: string, updates: Partial<Game>) => {
    setLoading(true);
    try {
      const { error: err } = await supabase
        .from('games')
        .update(updates)
        .eq('id', id);

      if (err) throw err;
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateGame, loading };
}

export function useDeleteGame() {
  const [loading, setLoading] = useState(false);

  const deleteGame = async (id: string) => {
    setLoading(true);
    try {
      const { error: err } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

      if (err) throw err;
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteGame, loading };
}
