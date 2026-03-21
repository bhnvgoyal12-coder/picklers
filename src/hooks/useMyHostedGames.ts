import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Game } from '../types';

export function useMyHostedGames() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = useCallback(async () => {
    if (!user) {
      setGames([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase
        .from('games')
        .select('*, registrations(count)')
        .eq('created_by', user.id)
        .order('date', { ascending: false });

      const mapped = (data ?? []).map((g: Record<string, unknown>) => ({
        ...g,
        spots_taken: (g.registrations as { count: number }[])?.[0]?.count ?? 0,
      })) as Game[];

      setGames(mapped);
    } catch {
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, loading, refetch: fetchGames };
}
