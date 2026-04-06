import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { albumSlug, trackNumber, energy, flavor, duration } = await req.json();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return NextResponse.json({ ok: true }); // silently skip if no DB

    const supabase = createClient(url, key);

    await supabase.from("play_events").insert({
      album_slug: albumSlug,
      track_number: trackNumber,
      energy,
      flavor,
      duration_seconds: duration,
      played_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never fail
  }
}
