import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Registration } from '../types';

export function useMyRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    if (!user) {
      setRegistrations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('registrations')
        .select('*, game:games(*)')
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false });

      if (err) throw err;
      setRegistrations((data ?? []) as Registration[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return { registrations, loading, error, refetch: fetchRegistrations };
}

export function useGameRegistrations(gameId: string) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('registrations')
        .select('*')
        .eq('game_id', gameId)
        .order('registered_at', { ascending: true });

      if (err) throw err;
      setRegistrations((data ?? []) as Registration[]);
    } catch {
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return { registrations, loading, refetch: fetchRegistrations };
}

export function useRegisterForGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (params: {
    game_id: string;
    user_id: string;
    player_name: string;
    player_phone: string;
    player_email: string;
    payment_amount: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('registrations')
        .insert({
          ...params,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (err) throw err;
      return data as Registration;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to register';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}
