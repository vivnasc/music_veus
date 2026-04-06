import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Step 1: Submit image generation to fal.ai (async queue).
 *
 * POST /api/admin/generate-verse-reel
 * { caption: string, albumSlug?: string, trackNumber?: number }
 *
 * Returns: { falTaskId: string, status: "QUEUED" }
 * Client must then poll /status?falTaskId=xxx
 * When image is ready, client calls /animate to send to Runway.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });

  const { caption, albumSlug, trackNumber } = await req.json();
  if (!caption) return NextResponse.json({ erro: "caption é obrigatório." }, { status: 400 });

  const visualPrompt = buildVisualPrompt(caption);

  try {
    // Submit to fal.ai queue (async — does NOT wait for result)
    const falRes = await fetch("https://queue.fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: visualPrompt,
        image_size: { width: 720, height: 1280 },
        num_images: 1,
        safety_tolerance: "5",
      }),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      return NextResponse.json({ erro: `fal.ai: ${err}` }, { status: 502 });
    }

    const data = await falRes.json();

    // Sync response (unlikely with queue but handle it)
    if (data.images?.[0]?.url) {
      return NextResponse.json({ imageUrl: data.images[0].url, albumSlug, trackNumber });
    }

    // Async — return task ID for polling
    return NextResponse.json({
      falTaskId: data.request_id,
      status: "QUEUED",
      albumSlug,
      trackNumber,
    });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

function buildVisualPrompt(caption: string): string {
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\n/g, " ") : caption.slice(0, 200);

  return [
    "Cinematic vertical frame, moody and atmospheric.",
    "Dark tones with warm golden light accents, film grain, shallow depth of field.",
    "No text, no words, no letters, no watermarks, no people's faces.",
    "Emotionally evocative scene, dreamlike, European art-house cinema aesthetic.",
    `Visual interpretation of: "${verse.slice(0, 250)}"`,
    "Colour palette: deep blacks, warm amber, soft gold, muted earth tones.",
    "9:16 vertical composition, cinematic lighting.",
  ].join(" ");
}
