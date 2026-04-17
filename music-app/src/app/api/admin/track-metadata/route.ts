import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * GET /api/admin/track-metadata — lista todos os títulos personalizados
 * POST /api/admin/track-metadata — guardar/actualizar título de uma faixa
 */

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;

  const { data, error } = await supabase
    .from("track_metadata")
    .select("album_slug, track_number, custom_title, title_source")
    .returns<{ album_slug: string; track_number: number; custom_title: string; title_source: string }[]>();

  if (error) {
    // Table may not exist yet — return empty instead of 500
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      return NextResponse.json({ titles: {} });
    }
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  // Return as Record<"albumSlug-tN", { title, source }>
  const titles: Record<string, { title: string; source: string }> = {};
  for (const row of data || []) {
    if (row.custom_title) {
      titles[`${row.album_slug}-t${row.track_number}`] = {
        title: row.custom_title,
        source: row.title_source || "manual",
      };
    }
  }

  return NextResponse.json({ titles });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;

  const body = await req.json();
  const { albumSlug, trackNumber, title, source } = body;

  if (!albumSlug || !trackNumber || !title) {
    return NextResponse.json({ erro: "albumSlug, trackNumber e title obrigatórios." }, { status: 400 });
  }

  const { error } = await supabase
    .from("track_metadata")
    .upsert({
      album_slug: albumSlug,
      track_number: trackNumber,
      custom_title: title,
      title_source: source || "manual",
      updated_at: new Date().toISOString(),
    }, { onConflict: "album_slug, track_number" });

  if (error) {
    // Table may not exist yet
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      return NextResponse.json({ erro: "Tabela track_metadata ainda não existe. Cria-a no Supabase." }, { status: 503 });
    }
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;
  const body = await req.json();
  const { albumSlug, trackNumber } = body;

  if (!albumSlug || !trackNumber) {
    return NextResponse.json({ erro: "albumSlug e trackNumber obrigatórios." }, { status: 400 });
  }

  const { error } = await supabase
    .from("track_metadata")
    .delete()
    .eq("album_slug", albumSlug)
    .eq("track_number", trackNumber);

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
