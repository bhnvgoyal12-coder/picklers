ALTER TABLE registrations ADD COLUMN IF NOT EXISTS game_title TEXT;

-- Backfill existing registrations with game titles
UPDATE registrations r
SET game_title = g.title
FROM games g
WHERE r.game_id = g.id AND r.game_title IS NULL;
