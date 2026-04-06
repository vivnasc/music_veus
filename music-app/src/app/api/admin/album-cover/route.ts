import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

/**
 * Get/set which track's cover to use as the album cover.
 * Uses track_metadata table with a special track_number = 0 row.
 * The custom_title field stores the track number to use as cover.
 */

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public GET — no auth required
export async function GET() {
  if (!PUBLIC_URL || !SERVICE_KEY) return NextResponse.json({ covers: {} });

  try {
    const supabase = createClient(PUBLIC_URL, SERVICE_KEY);
    const { data, error } = await supabase
      .from("album_cover_track")
      .select("album_slug, track_number");

    if (error) return NextResponse.json({ covers: {} });

    const covers: Record<string, number> = {};
    for (const row of data || []) {
      covers[row.album_slug] = row.track_number;
    }
    return NextResponse.json(
      { covers },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  } catch {
    return NextResponse.json({ covers: {} });
  }
}

// Admin POST — set album cover track
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { album_slug, track_number } = await req.json();
    if (!album_slug || !track_number) {
      return NextResponse.json({ erro: "Campos em falta." }, { status: 400 });
    }

    const { error } = await auth.supabase
      .from("album_cover_track")
      .upsert(
        { album_slug, track_number },
        { onConflict: "album_slug" }
      );

    if (error) {
      // Table doesn't exist yet — create it on the fly
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        try {
          await auth.supabase.rpc("exec_sql", { sql: `
            CREATE TABLE IF NOT EXISTS public.album_cover_track (
              album_slug TEXT PRIMARY KEY,
              track_number INT NOT NULL DEFAULT 1
            );
          `});
          await auth.supabase.from("album_cover_track").upsert({ album_slug, track_number }, { onConflict: "album_slug" });
        } catch { /* table creation may fail without exec_sql RPC — that's OK */ }
        return NextResponse.json({ ok: true, note: "Table may need manual creation" });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
