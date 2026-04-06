import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Save/load edited lyrics per track.
 * Uses track_custom_lyrics table (album_slug, track_number, lyrics).
 * Falls back gracefully if table doesn't exist.
 */

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await auth.supabase
      .from("track_custom_lyrics")
      .select("album_slug, track_number, lyrics");

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ lyrics: {} });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    const map: Record<string, string> = {};
    for (const row of data || []) {
      map[`${row.album_slug}-t${row.track_number}`] = row.lyrics;
    }
    return NextResponse.json({ lyrics: map });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { album_slug, track_number, lyrics } = await req.json();
    if (!album_slug || !track_number || !lyrics) {
      return NextResponse.json({ erro: "Campos em falta." }, { status: 400 });
    }

    const { error } = await auth.supabase
      .from("track_custom_lyrics")
      .upsert(
        { album_slug, track_number, lyrics },
        { onConflict: "album_slug, track_number" }
      );

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        // Store in localStorage as fallback — return success
        return NextResponse.json({ ok: true, fallback: "localStorage" });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
