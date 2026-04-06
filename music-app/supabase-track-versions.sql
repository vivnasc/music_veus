-- ============================================
-- TRACK VERSIONS TABLE (Véus Music App)
-- Run this in Supabase SQL Editor
-- ============================================
-- Stores metadata for track versions/remixes.
-- Each version can have its own energy (mood),
-- so a "pulse" remix of a "whisper" track appears
-- in the Pulso mood list.

CREATE TABLE IF NOT EXISTS public.track_versions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_slug text NOT NULL,
  track_number int NOT NULL,
  version_name text NOT NULL,
  energy text NOT NULL DEFAULT 'whisper',
  audio_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(album_slug, track_number, version_name)
);

-- Public read (versions are public like tracks)
ALTER TABLE public.track_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read track versions" ON public.track_versions
  FOR SELECT USING (true);

-- Only service role can insert/update/delete (via admin API)
CREATE POLICY "Service role manages versions" ON public.track_versions
  FOR ALL USING (auth.role() = 'service_role');

-- Index for fast lookups by energy (mood lists)
CREATE INDEX IF NOT EXISTS idx_track_versions_energy
  ON public.track_versions(energy);
