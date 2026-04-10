import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Pending Suno clips — persists generated clips awaiting approval.
 * Allows cross-device production without losing progress.
 *
 * Table: pending_suno_clips
 *   album_slug text, track_number int, clip_id text,
 *   audio_url text, title text, image_url text,
 *   duration int, tags text, model text, created_at timestamptz
 *   UNIQUE(album_slug, track_number, clip_id)
 */

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await auth.supabase
      .from("pending_suno_clips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ clips: [] });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ clips: data });
  } catch (err: unknown) {
    return NextResponse.json({ erro: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { album_slug, track_number, clips } = body;

    if (!album_slug || !track_number || !clips?.length) {
      return NextResponse.json({ erro: "Campos em falta." }, { status: 400 });
    }

    const rows = clips.map((c: { clip_id: string; audio_url: string; title: string; image_url?: string; duration?: number; tags?: string; model?: string }) => ({
      album_slug,
      track_number,
      clip_id: c.clip_id,
      audio_url: c.audio_url,
      title: c.title || "",
      image_url: c.image_url || null,
      duration: c.duration || null,
      tags: c.tags || null,
      model: c.model || null,
    }));

    const { error } = await auth.supabase
      .from("pending_suno_clips")
      .upsert(rows, { onConflict: "album_slug, track_number, clip_id" });

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ erro: "Tabela pending_suno_clips não existe. Cria-a no Supabase." }, { status: 503 });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { album_slug, track_number, clip_id } = await req.json();

    let query = auth.supabase.from("pending_suno_clips").delete();

    if (clip_id) {
      // Delete specific clip
      query = query.eq("clip_id", clip_id);
    } else if (album_slug && track_number) {
      // Delete all clips for a track (on regenerate)
      query = query.eq("album_slug", album_slug).eq("track_number", track_number);
    } else {
      return NextResponse.json({ erro: "clip_id ou album_slug+track_number necessários." }, { status: 400 });
    }

    const { error } = await query;

    if (error && error.code !== "42P01") {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
