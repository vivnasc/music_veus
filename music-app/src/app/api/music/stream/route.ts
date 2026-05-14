import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "audios";

/**
 * Allowed origins/referers — only these can stream audio.
 * Blocks direct hotlinking, curl, scraping tools, etc.
 */
const ALLOWED_HOSTS = [
  "music.seteveus.space",
  "seteveus.space",
  "localhost",
  "vercel.app", // preview deployments
];

function isAllowedReferer(req: NextRequest): boolean {
  const referer = req.headers.get("referer") || req.headers.get("origin") || "";
  if (!referer) return false;
  try {
    const url = new URL(referer);
    return ALLOWED_HOSTS.some(host =>
      url.hostname === host || url.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

/**
 * Proxy de streaming de audio e capas.
 * Esconde o URL real do Supabase e adiciona headers anti-download.
 *
 * Audio: GET /api/music/stream?album=espelho-ilusao&track=1
 * Cover: GET /api/music/stream?album=espelho-ilusao&track=1&type=cover
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const album = searchParams.get("album");
  const track = searchParams.get("track");
  const type = searchParams.get("type");

  if (!album || !track) {
    return NextResponse.json({ error: "album e track obrigatorios" }, { status: 400 });
  }

  // Audio streaming requires referer check (covers are OK to be hotlinked)
  if (type !== "cover" && !isAllowedReferer(req)) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const safeAlbum = album.replace(/[^a-z0-9-]/g, "");
  const safeTrack = String(parseInt(track, 10)).padStart(2, "0");

  // ── COVER IMAGE ──
  if (type === "cover") {
    const extensions = ["jpg", "png", "jpeg", "webp"];
    // track=0 → capa do álbum (cover.<ext>) — uploaded à parte (Midjourney
    // etc.). track>=1 → capa Suno por faixa (faixa-XX-cover.<ext>). As duas
    // vivem em paralelo: a capa do álbum NÃO substitui as capas por faixa.
    const isAlbumCover = parseInt(track, 10) === 0;

    // Build candidate URLs. Para slugs Presença, tentar também as pastas
    // dedicadas `presenca-covers/{sub}/{albumSlug}.<ext>` (capa do álbum) e
    // `presenca-covers/{sub}.<ext>` (capa da sub-coleção), porque as capas
    // Presença vivem fora de `albums/...`.
    const candidates: string[] = [];
    const folder = `albums/${safeAlbum}`;
    for (const ext of extensions) {
      candidates.push(
        isAlbumCover
          ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${folder}/cover.${ext}`
          : `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${folder}/faixa-${safeTrack}-cover.${ext}`
      );
    }
    // Presença fallbacks: presenca-{sub}-{...} → presenca-covers/{sub}/{slug}.<ext>
    // e presenca-covers/{sub}.<ext>
    if (safeAlbum.startsWith("presenca-")) {
      const parts = safeAlbum.split("-");
      const sub = parts[1];
      const albumSlugPart = parts.slice(2).join("-");
      if (sub) {
        for (const ext of extensions) {
          if (albumSlugPart) {
            candidates.push(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/presenca-covers/${sub}/${albumSlugPart}.${ext}`);
          }
          candidates.push(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/presenca-covers/${sub}.${ext}`);
        }
      }
    }

    for (const url of candidates) {
      const res = await fetch(url);
      if (res.ok) {
        const ext = url.split(".").pop()?.toLowerCase();
        const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg"
          : ext === "png" ? "image/png"
          : "image/webp";
        return new NextResponse(res.body, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=300, s-maxage=300",
            "Content-Length": res.headers.get("content-length") || "",
          },
        });
      }
    }
    return NextResponse.json({ error: "Cover não encontrada" }, { status: 404 });
  }

  // ── AUDIO ──
  const version = searchParams.get("version");
  const safeVersion = version ? version.replace(/[^a-z0-9-]/g, "") : null;
  const rangeHeader = req.headers.get("range");
  const fetchHeaders: HeadersInit = {};
  if (rangeHeader) fetchHeaders["Range"] = rangeHeader;

  // If specific version requested, serve it directly
  if (safeVersion) {
    const versionUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/albums/${safeAlbum}/faixa-${safeTrack}-${safeVersion}.mp3`;
    const upstream = await fetch(versionUrl, { headers: fetchHeaders });
    if (upstream.ok || upstream.status === 206) {
      return buildResponse(upstream);
    }
    return NextResponse.json({ error: "Versão não encontrada" }, { status: 404 });
  }

  // Try both paths: albums/SLUG/ and SLUG/ (some files stored without albums/ prefix)
  const paths = [
    `albums/${safeAlbum}/faixa-${safeTrack}.mp3`,
    `${safeAlbum}/faixa-${safeTrack}.mp3`,
  ];

  let upstream: Response | null = null;
  for (const path of paths) {
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
    const res = await fetch(url, { headers: fetchHeaders });
    console.log(`[stream] ${path} → ${res.status}`);
    if (res.ok || res.status === 206) {
      upstream = res;
      break;
    }
  }

  if (!upstream) upstream = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${paths[0]}`, { headers: fetchHeaders });

  // If main file doesn't exist, try to find a version in both paths
  if (!upstream.ok && upstream.status !== 206) {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        const sb = createClient(url, key);
        // Try both folder structures
        for (const folder of [`albums/${safeAlbum}`, safeAlbum]) {
          const { data: files } = await sb.storage.from(BUCKET).list(folder, { limit: 50 });
          const versionFile = files?.find(f =>
            f.name.startsWith(`faixa-${safeTrack}-`) && f.name.endsWith(".mp3")
          );
          if (versionFile) {
            const versionUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${folder}/${versionFile.name}`;
            upstream = await fetch(versionUrl, { headers: fetchHeaders });
            if (upstream.ok || upstream.status === 206) break;
          }
        }
      }
    } catch {
      // fallback silently
    }
  }

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json({ error: "Áudio não encontrado" }, { status: 404 });
  }

  return buildResponse(upstream);
}

function buildResponse(upstream: Response) {
  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "audio/mpeg");
  responseHeaders.set("Accept-Ranges", "bytes");
  // Private cache — don't let CDNs cache across users
  responseHeaders.set("Cache-Control", "private, max-age=3600, no-store");
  responseHeaders.set("Content-Disposition", "inline");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  // Block embedding in other sites
  responseHeaders.set("X-Frame-Options", "SAMEORIGIN");
  responseHeaders.set("Referrer-Policy", "same-origin");

  const contentRange = upstream.headers.get("content-range");
  if (contentRange) responseHeaders.set("Content-Range", contentRange);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) responseHeaders.set("Content-Length", contentLength);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
