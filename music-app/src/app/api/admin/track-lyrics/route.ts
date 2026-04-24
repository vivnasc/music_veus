import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Save/load edited lyrics per track.
 *
 * Persists to `track_custom_lyrics` table (album_slug, track_number, lyrics).
 * Migration: supabase/migrations/20260421_track_custom_lyrics.sql
 *
 * Antes desta versão a API respondia `ok: true` quando a tabela não existia
 * e retornava `fallback: "localStorage"` — mas NENHUMA escrita acontecia
 * (nem no servidor, nem no client, que usava `.catch(() => {})`). O resultado
 * era perda silenciosa de letras. Agora falha explicitamente quando algo
 * corre mal para o client poder fazer fallback real no browser.
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
        // Tabela em falta — corre a migration em
        // supabase/migrations/20260421_track_custom_lyrics.sql.
        return NextResponse.json(
          {
            erro: "Tabela track_custom_lyrics não existe. Corre a migration.",
            missingTable: true,
            lyrics: {},
          },
          { status: 500 },
        );
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
    if (!album_slug || !track_number || typeof lyrics !== "string") {
      return NextResponse.json({ erro: "Campos em falta." }, { status: 400 });
    }

    const { error } = await auth.supabase
      .from("track_custom_lyrics")
      .upsert(
        { album_slug, track_number, lyrics, updated_at: new Date().toISOString() },
        { onConflict: "album_slug, track_number" },
      );

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        // Falha explicitamente — o client deve reconhecer `missingTable` e
        // escrever no localStorage para não perder os dados.
        return NextResponse.json(
          {
            erro: "Tabela track_custom_lyrics não existe. Corre a migration.",
            missingTable: true,
          },
          { status: 500 },
        );
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { album_slug, track_number } = await req.json();
    if (!album_slug || !track_number) {
      return NextResponse.json({ erro: "Campos em falta." }, { status: 400 });
    }
    const { error } = await auth.supabase
      .from("track_custom_lyrics")
      .delete()
      .eq("album_slug", album_slug)
      .eq("track_number", track_number);
    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ ok: true, missingTable: true });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
