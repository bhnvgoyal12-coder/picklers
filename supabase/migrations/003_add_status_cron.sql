-- Enable pg_cron extension (available on Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function to auto-transition game statuses
CREATE OR REPLACE FUNCTION update_game_statuses()
RETURNS void AS $$
BEGIN
  -- Move upcoming games to completed if end time has passed
  UPDATE games
  SET status = 'completed', updated_at = now()
  WHERE status IN ('upcoming', 'in_progress')
    AND (date + end_time) <= now();

  -- Move upcoming games to in_progress if start time has passed (but end time hasn't)
  UPDATE games
  SET status = 'in_progress', updated_at = now()
  WHERE status = 'upcoming'
    AND (date + start_time) <= now()
    AND (date + end_time) > now();
END;
$$ LANGUAGE plpgsql;

-- Schedule the function to run every 5 minutes
SELECT cron.schedule(
  'update-game-statuses',
  '*/5 * * * *',
  $$SELECT update_game_statuses()$$
);
