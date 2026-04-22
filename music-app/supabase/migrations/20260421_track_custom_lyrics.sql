-- Custom track lyrics — per-track edited lyrics saved from the production page.
-- Before this migration, the API /api/admin/track-lyrics silently failed when
-- the table did not exist, causing imported lyrics to vanish.
CREATE TABLE IF NOT EXISTS track_custom_lyrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_slug text NOT NULL,
  track_number int NOT NULL,
  lyrics text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(album_slug, track_number)
);

CREATE INDEX IF NOT EXISTS track_custom_lyrics_album_idx
  ON track_custom_lyrics (album_slug);

-- RLS: only service role (admin) can access. Public reads happen through the
-- /api/music/lyrics endpoint using the service-role Supabase client.
ALTER TABLE track_custom_lyrics ENABLE ROW LEVEL SECURITY;
