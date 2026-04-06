-- ============================================
-- TRACK METADATA TABLE (Véus Music App)
-- Run this in Supabase SQL Editor
-- ============================================
-- Stores custom titles and metadata for tracks.
-- When admin edits a title (manually, from Suno, or from MP3 ID3 tags),
-- it persists here and overrides the default title from albums.ts.

CREATE TABLE IF NOT EXISTS public.track_metadata (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_slug text NOT NULL,
  track_number int NOT NULL,
  custom_title text,
  title_source text DEFAULT 'manual', -- 'manual', 'suno', 'id3'
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(album_slug, track_number)
);

-- Public read
ALTER TABLE public.track_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read track metadata" ON public.track_metadata
  FOR SELECT USING (true);

CREATE POLICY "Service role manages metadata" ON public.track_metadata
  FOR ALL USING (auth.role() = 'service_role');
