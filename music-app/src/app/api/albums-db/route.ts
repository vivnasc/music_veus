import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL } from "@/lib/admin-auth";

/**
 * Public endpoint: list all PUBLISHED DB albums in the same shape as Album
 * (so they can be merged into ALL_ALBUMS at runtime).
 *
 * If an admin access token is provided in Authorization header, DRAFT albums
 * are also returned — so the admin can listen to them via the normal app
 * player (album page, queue, etc).
 *
 * GET /api/albums-db
 * Returns: { albums: Album[] }
 */

async function isAdmin(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return false;
  try {
    const userClient = createClient(url, anonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    return user?.email === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

type DbTrack = {
  id: string;
  number: number;
  title: string;
  description: string | null;
  lang: string | null;
  energy: string | null;
  flavor: string | null;
  vocal_mode: string | null;
  prompt: string | null;
  lyrics: string | null;
  duration_seconds: number | null;
  audio_url: string | null;
  published: boolean;
};

type DbAlbum = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  color: string | null;
  collection: string;
  published: boolean;
  status: string | null;
  distribution: boolean | null;
  distrokid_upload_date: string | null;
  artists_db: { slug: string; name: string } | null;
  tracks_db: DbTrack[];
};

// NOTE: no ISR revalidate here — admin responses must not be cached at the
// edge/CDN, otherwise drafts could leak to anonymous visitors.

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ albums: [] });

  const admin = await isAdmin(req);

  try {
    const supabase = createClient(url, key);
    let query = supabase
      .from("albums_db")
      .select("*, artists_db(slug, name), tracks_db(*)");
    if (!admin) {
      query = query.eq("published", true);
    }
    const { data, error } = await query.returns<DbAlbum[]>();

    if (error) {
      // Table may not exist yet — return empty
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ albums: [] });
      }
      return NextResponse.json({ albums: [], erro: error.message });
    }

    // Map to the same shape as static Album type
    const albums = (data || []).map((a) => ({
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle ?? "",
      artist: a.artists_db?.name,
      product: a.collection,
      color: a.color ?? "#C9A96E",
      status: a.status ?? "draft",
      distribution: a.distribution ?? false,
      distrokidUploadDate: a.distrokid_upload_date,
      _isDbAlbum: true, // sentinel so consumers can distinguish if needed
      tracks: (a.tracks_db || [])
        .sort((x, y) => x.number - y.number)
        .map((t) => ({
          number: t.number,
          title: t.title,
          description: t.description ?? "",
          lang: (t.lang === "EN" ? "EN" : "PT"),
          energy: t.energy ?? "whisper",
          flavor: t.flavor,
          vocalMode: (t.vocal_mode === "duet" ? "duet" : "solo"),
          prompt: t.prompt ?? "",
          lyrics: t.lyrics ?? "",
          durationSeconds: t.duration_seconds ?? 240,
          audioUrl: t.audio_url,
          published: t.published,
        })),
    }));

    return NextResponse.json(
      { albums },
      {
        headers: admin
          // Admin response may contain drafts — MUST NOT be cached anywhere
          ? { "Cache-Control": "private, no-store" }
          : { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
      }
    );
  } catch (e) {
    return NextResponse.json({ albums: [], erro: e instanceof Error ? e.message : "?" });
  }
}
