-- ─────────────────────────────────────────────────────────────
-- ALBUM MANAGER: DB tables for user-uploaded albums
-- Apply this in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- Artists table (supports multiple artists beyond Loranne)
create table if not exists public.artists_db (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  bio text,
  photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Albums table
create table if not exists public.albums_db (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text default '',
  color text default '#C9A96E',
  artist_id uuid references public.artists_db(id) on delete set null,
  collection text not null, -- matches Album.product values ("espelho", "ancient-ground", etc)
  published boolean default false,
  status text default 'draft', -- draft|ready|produced|published
  distribution boolean default false,
  distrokid_upload_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tracks table
create table if not exists public.tracks_db (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.albums_db(id) on delete cascade not null,
  number integer not null,
  title text not null,
  description text default '',
  lang text default 'PT', -- 'PT' | 'EN'
  energy text default 'whisper', -- whisper|steady|pulse|anthem|raw
  flavor text, -- nullable
  vocal_mode text default 'solo', -- solo|duet
  prompt text default '',
  lyrics text default '',
  duration_seconds integer default 240,
  audio_url text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(album_id, number)
);

-- Indices
create index if not exists albums_db_collection_idx on public.albums_db(collection);
create index if not exists albums_db_artist_idx on public.albums_db(artist_id);
create index if not exists albums_db_published_idx on public.albums_db(published);
create index if not exists tracks_db_album_idx on public.tracks_db(album_id);

-- RLS: public can READ published albums/tracks; only admin (service_role) can WRITE
alter table public.artists_db enable row level security;
alter table public.albums_db enable row level security;
alter table public.tracks_db enable row level security;

-- Everyone can read
drop policy if exists "public read artists" on public.artists_db;
create policy "public read artists" on public.artists_db for select using (true);

drop policy if exists "public read albums" on public.albums_db;
create policy "public read albums" on public.albums_db for select using (true);

drop policy if exists "public read tracks" on public.tracks_db;
create policy "public read tracks" on public.tracks_db for select using (true);

-- Only service_role writes (enforced via API routes using service_role key)
-- No INSERT/UPDATE/DELETE policies → effectively blocked for anon/authenticated users
