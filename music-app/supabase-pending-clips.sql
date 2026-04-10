-- Pending Suno clips: persists generated clips awaiting approval across devices
CREATE TABLE IF NOT EXISTS public.pending_suno_clips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  album_slug text NOT NULL,
  track_number int NOT NULL,
  clip_id text NOT NULL,
  audio_url text NOT NULL,
  title text NOT NULL DEFAULT '',
  image_url text,
  duration int,
  tags text,
  model text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(album_slug, track_number, clip_id)
);

ALTER TABLE public.pending_suno_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages pending clips"
  ON public.pending_suno_clips
  FOR ALL
  USING (auth.role() = 'service_role');
