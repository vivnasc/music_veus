import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 120;

const RUNWAY_API = "https://api.dev.runwayml.com/v1";
const BUCKET = "audios";

/**
 * Generate a video clip from a track's cover image using Runway Gen-4 Turbo.
 *
 * POST /api/admin/runway/generate
 * { albumSlug, trackNumber, promptText?, duration?, ratio? }
 *
 * Uses the track's Suno cover stored in Supabase (faixa-XX-cover.jpg).
 * If no cover found, falls back to imageUrl or imageBase64 if provided.
 *
 * Flow:
 * 1. Check if hook video already exists → return it
 * 2. Get cover image from Supabase Storage → convert to base64
 * 3. Send to Runway API → return task ID for polling
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.RUNWAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ erro: "RUNWAY_API_KEY não configurada." }, { status: 500 });
  }

  try {
    const { albumSlug, trackNumber, imageBase64, imageUrl, promptText, duration, ratio, force } = await req.json();

    if (!albumSlug || !trackNumber) {
      return NextResponse.json({ erro: "albumSlug e trackNumber obrigatórios." }, { status: 400 });
    }

    const safeAlbum = albumSlug.replace(/[^a-z0-9-]/g, "");
    const safeTrack = String(parseInt(trackNumber, 10)).padStart(2, "0");
    const videoPath = `albums/${safeAlbum}/faixa-${safeTrack}-hook.mp4`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Check if hook video already exists (skip if force=true)
    if (!force) {
      const publicVideoUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${videoPath}`;
      const check = await fetch(publicVideoUrl, { method: "HEAD" });
      if (check.ok) {
        return NextResponse.json({
          status: "exists",
          videoUrl: publicVideoUrl,
          message: "Video hook já existe.",
        });
      }
    }

    // 2. Get the cover image — try Supabase cover first, fallback to provided base64
    let promptImage: string | null = null;

    // Try Supabase cover (jpg, png)
    for (const ext of ["jpg", "png", "jpeg", "webp"]) {
      const coverPath = `albums/${safeAlbum}/faixa-${safeTrack}-cover.${ext}`;
      const coverUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${coverPath}`;
      const coverRes = await fetch(coverUrl);
      if (coverRes.ok) {
        const blob = await coverRes.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        const mimeType = blob.type || `image/${ext === "jpg" ? "jpeg" : ext}`;
        promptImage = `data:${mimeType};base64,${buffer.toString("base64")}`;
        break;
      }
    }

    // Fallback to provided imageUrl (e.g. from fal.ai)
    if (!promptImage && imageUrl) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        const imgRes = await fetch(imageUrl, { signal: controller.signal });
        clearTimeout(timeout);
        if (imgRes.ok) {
          const blob = await imgRes.blob();
          const buffer = Buffer.from(await blob.arrayBuffer());
          promptImage = `data:${blob.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
        } else {
          console.warn(`[runway/generate] imageUrl fetch failed: ${imgRes.status}`);
        }
      } catch (e) {
        console.warn(`[runway/generate] imageUrl fetch error:`, e);
      }
    }

    // Fallback to provided base64
    if (!promptImage && imageBase64) {
      promptImage = imageBase64.startsWith("data:") ? imageBase64 : `data:image/png;base64,${imageBase64}`;
    }

    if (!promptImage) {
      return NextResponse.json({ erro: "Sem capa. Aprova a faixa com capa do Suno primeiro." }, { status: 400 });
    }

    // 3. Send to Runway
    const res = await fetch(`${RUNWAY_API}/image_to_video`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Runway-Version": "2024-11-06",
      },
      body: JSON.stringify({
        model: "gen4_turbo",
        promptImage,
        promptText: promptText || "figure swaying gently, veils flowing rhythmically, golden particles pulsing, slow camera orbit, warm light breathing",
        duration: duration || 10,
        ratio: ratio || "720:1280",
        watermark: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[runway/generate] Error:", res.status, err);
      return NextResponse.json({ erro: `Runway API: ${res.status} — ${err}` }, { status: 502 });
    }

    const data = await res.json();

    return NextResponse.json({
      status: "generating",
      taskId: data.id,
      albumSlug: safeAlbum,
      trackNumber: parseInt(trackNumber, 10),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
