-- Album cover track selection
-- Stores which track number to use as the album cover image
CREATE TABLE IF NOT EXISTS public.album_cover_track (
  album_slug TEXT PRIMARY KEY,
  track_number INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read
ALTER TABLE public.album_cover_track ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.album_cover_track FOR SELECT USING (true);
CREATE POLICY "Admin insert/update" ON public.album_cover_track FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
