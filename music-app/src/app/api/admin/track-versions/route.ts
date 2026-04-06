import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;

  try {
    const body = await req.json();
    const { album_slug, track_number, version_name, energy, audio_url } = body;

    if (!album_slug || !track_number || !version_name || !energy || !audio_url) {
      return NextResponse.json({ erro: "Campos em falta." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("track_versions")
      .upsert(
        { album_slug, track_number, version_name, energy, audio_url },
        { onConflict: "album_slug, track_number, version_name" }
      )
      .select()
      .single();

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ erro: "Tabela track_versions ainda não existe. Cria-a no Supabase." }, { status: 503 });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ version: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;

  try {
    const { data, error } = await supabase
      .from("track_versions")
      .select("*")
      .order("album_slug")
      .order("track_number");

    if (error) {
      // Table may not exist yet — return empty instead of 500
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ versions: [] });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ versions: data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
