-- Which track's cover to use as the album cover
CREATE TABLE IF NOT EXISTS album_cover_track (
  album_slug text PRIMARY KEY,
  track_number int NOT NULL DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE album_cover_track ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read" ON album_cover_track FOR SELECT USING (true);
CREATE POLICY "Service can manage" ON album_cover_track FOR ALL USING (true);
