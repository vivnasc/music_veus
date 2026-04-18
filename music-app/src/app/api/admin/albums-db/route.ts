import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * GET  /api/admin/albums-db            → list all DB albums (with tracks + artist)
 * POST /api/admin/albums-db            → create album (and tracks) from parsed payload
 */

type TrackInput = {
  number: number;
  title: string;
  description?: string;
  lang?: "PT" | "EN";
  energy?: string;
  flavor?: string | null;
  vocal_mode?: string;
  prompt?: string;
  lyrics?: string;
  duration_seconds?: number;
  audio_url?: string | null;
  published?: boolean;
};

type AlbumInput = {
  slug: string;
  title: string;
  subtitle?: string;
  color?: string;
  artist: { slug: string; name: string; bio?: string; photo_url?: string };
  collection: string;
  published?: boolean;
  status?: string;
  distribution?: boolean;
  distrokid_upload_date?: string | null;
  tracks: TrackInput[];
};

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  const supabase = auth.supabase;

  const { data: albums, error: aErr } = await supabase
    .from("albums_db")
    .select("*, artists_db(slug, name, photo_url), tracks_db(*)")
    .order("created_at", { ascending: false });

  if (aErr) return NextResponse.json({ erro: aErr.message }, { status: 500 });
  return NextResponse.json({ albums });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  const supabase = auth.supabase;

  const body = (await req.json()) as AlbumInput;
  if (!body?.slug || !body?.title || !Array.isArray(body.tracks) || body.tracks.length === 0) {
    return NextResponse.json({ erro: "slug, title e tracks[] são obrigatórios." }, { status: 400 });
  }

  // 1. Upsert artist
  const { data: artist, error: aErr } = await supabase
    .from("artists_db")
    .upsert(
      { slug: body.artist.slug, name: body.artist.name, bio: body.artist.bio ?? null, photo_url: body.artist.photo_url ?? null },
      { onConflict: "slug" }
    )
    .select("id")
    .single();
  if (aErr || !artist) return NextResponse.json({ erro: "artist upsert: " + (aErr?.message ?? "?") }, { status: 500 });

  // 2. Upsert album
  const { data: album, error: albErr } = await supabase
    .from("albums_db")
    .upsert(
      {
        slug: body.slug,
        title: body.title,
        subtitle: body.subtitle ?? "",
        color: body.color ?? "#C9A96E",
        artist_id: artist.id,
        collection: body.collection,
        published: body.published ?? false,
        status: body.status ?? "draft",
        distribution: body.distribution ?? false,
        distrokid_upload_date: body.distrokid_upload_date ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();
  if (albErr || !album) return NextResponse.json({ erro: "album upsert: " + (albErr?.message ?? "?") }, { status: 500 });

  // 3. Replace tracks (delete existing + insert new)
  await supabase.from("tracks_db").delete().eq("album_id", album.id);

  const tracksPayload = body.tracks.map((t) => ({
    album_id: album.id,
    number: t.number,
    title: t.title,
    description: t.description ?? "",
    lang: t.lang ?? "PT",
    energy: t.energy ?? "whisper",
    flavor: t.flavor ?? null,
    vocal_mode: t.vocal_mode ?? "solo",
    prompt: t.prompt ?? "",
    lyrics: t.lyrics ?? "",
    duration_seconds: t.duration_seconds ?? 240,
    audio_url: t.audio_url ?? null,
    published: t.published ?? false,
  }));

  const { error: tErr } = await supabase.from("tracks_db").insert(tracksPayload);
  if (tErr) return NextResponse.json({ erro: "tracks insert: " + tErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, album_id: album.id, artist_id: artist.id });
}
