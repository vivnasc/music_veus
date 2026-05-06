import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Despoleta o workflow GitHub Actions "render-short.yml" para renderizar
 * um lyric-video short 9:16 30s server-side. O Action faz tudo: download
 * de cover + áudio do Supabase, ffmpeg com Ken Burns + waveform + letra,
 * upload do MP4 para Supabase Storage bucket "social".
 *
 * Env vars necessárias (no Vercel/Next.js):
 *   GITHUB_DISPATCH_TOKEN — PAT clássico ou fine-grained com scope
 *                          "actions: write" no repositório
 *   GITHUB_REPO_OWNER     — ex: "vivnasc"
 *   GITHUB_REPO_NAME      — ex: "music_veus"
 *
 * GitHub secrets do repo (para o workflow):
 *   SUPABASE_URL              (= NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });

  const TOKEN = process.env.GITHUB_DISPATCH_TOKEN;
  const OWNER = process.env.GITHUB_REPO_OWNER || "vivnasc";
  const REPO = process.env.GITHUB_REPO_NAME || "music_veus";

  if (!TOKEN) {
    return NextResponse.json(
      { erro: "GITHUB_DISPATCH_TOKEN não configurado no .env" },
      { status: 500 },
    );
  }

  try {
    const { brand, albumSlug, trackNumber, startSec, durationSec } = await req.json();
    if (!brand || !albumSlug || !trackNumber) {
      return NextResponse.json({ erro: "brand, albumSlug, trackNumber obrigatórios" }, { status: 400 });
    }
    if (!["venna", "nnovva"].includes(String(brand))) {
      return NextResponse.json({ erro: "brand deve ser 'venna' ou 'nnovva'" }, { status: 400 });
    }

    const dispatchUrl = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/render-short.yml/dispatches`;
    const body = {
      ref: "main",
      inputs: {
        brand: String(brand),
        album_slug: String(albumSlug),
        track_number: String(trackNumber),
        start_sec: String(startSec ?? 30),
        duration_sec: String(durationSec ?? 30),
      },
    };

    const r = await fetch(dispatchUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "music_veus-admin",
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return NextResponse.json(
        { erro: `GitHub dispatch falhou (${r.status}): ${txt.slice(0, 200)}` },
        { status: 502 },
      );
    }

    // GitHub workflow_dispatch responde 204 sem body. Não temos run_id directo.
    // O melhor que podemos dar é o link genérico para a lista de runs.
    const runUrl = `https://github.com/${OWNER}/${REPO}/actions/workflows/render-short.yml`;
    return NextResponse.json({ ok: true, runUrl });
  } catch (err) {
    return NextResponse.json(
      { erro: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
