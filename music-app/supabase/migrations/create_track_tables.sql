-- Track metadata: custom titles saved from the production page
CREATE TABLE IF NOT EXISTS track_metadata (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_slug text NOT NULL,
  track_number int NOT NULL,
  custom_title text,
  title_source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(album_slug, track_number)
);

-- Track versions: alternative audio versions (v2, remix, acoustic, etc.)
CREATE TABLE IF NOT EXISTS track_versions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_slug text NOT NULL,
  track_number int NOT NULL,
  version_name text NOT NULL,
  energy text DEFAULT 'whisper',
  audio_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(album_slug, track_number, version_name)
);

-- RLS: only service role (admin) can access
ALTER TABLE track_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_versions ENABLE ROW LEVEL SECURITY;
