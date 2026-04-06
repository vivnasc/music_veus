-- ============================================
-- MUSIC LIBRARY TABLES (Véus Music App)
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. music_favorites: tracks favorited by users
CREATE TABLE IF NOT EXISTS public.music_favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_number int NOT NULL,
  album_slug text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, track_number, album_slug)
);

-- 2. music_recents: recently played tracks
CREATE TABLE IF NOT EXISTS public.music_recents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_number int NOT NULL,
  album_slug text NOT NULL,
  played_at timestamptz DEFAULT now()
);

-- Unique constraint: one entry per user+track (upsert replaces on replay)
ALTER TABLE public.music_recents
  ADD CONSTRAINT music_recents_user_track_unique UNIQUE (user_id, track_number, album_slug);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_music_recents_user_played
  ON public.music_recents(user_id, played_at DESC);

-- 3. music_playlists: user-created playlists
CREATE TABLE IF NOT EXISTS public.music_playlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. music_playlist_tracks: tracks in playlists
CREATE TABLE IF NOT EXISTS public.music_playlist_tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id uuid NOT NULL REFERENCES public.music_playlists(id) ON DELETE CASCADE,
  track_number int NOT NULL,
  album_slug text NOT NULL,
  position int NOT NULL DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, track_number, album_slug)
);

-- 5. music_listening_stats: aggregate listening data (for recommendations)
CREATE TABLE IF NOT EXISTS public.music_listening_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  album_slug text NOT NULL,
  track_number int NOT NULL,
  listen_count int DEFAULT 1,
  total_seconds int DEFAULT 0,
  last_listened_at timestamptz DEFAULT now(),
  UNIQUE(user_id, album_slug, track_number)
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.music_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_recents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_listening_stats ENABLE ROW LEVEL SECURITY;

-- music_favorites: users see/manage their own
CREATE POLICY "Users manage own favorites" ON public.music_favorites
  FOR ALL USING (auth.uid() = user_id);

-- music_recents: users see/manage their own
CREATE POLICY "Users manage own recents" ON public.music_recents
  FOR ALL USING (auth.uid() = user_id);

-- music_playlists: users manage own, see public ones
CREATE POLICY "Users manage own playlists" ON public.music_playlists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone sees public playlists" ON public.music_playlists
  FOR SELECT USING (is_public = true);

-- music_playlist_tracks: based on playlist ownership
CREATE POLICY "Users manage own playlist tracks" ON public.music_playlist_tracks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.music_playlists
      WHERE id = playlist_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone sees public playlist tracks" ON public.music_playlist_tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.music_playlists
      WHERE id = playlist_id AND is_public = true
    )
  );

-- music_listening_stats: users see/manage their own
CREATE POLICY "Users manage own stats" ON public.music_listening_stats
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER: auto-update updated_at on playlists
-- ============================================
CREATE OR REPLACE FUNCTION update_music_playlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER music_playlists_updated_at
  BEFORE UPDATE ON public.music_playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_music_playlist_updated_at();
