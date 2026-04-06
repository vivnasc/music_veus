import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// Allow up to 60s for fal.ai to generate the image
export const maxDuration = 60;

/**
 * Generate a verse reel image via fal.ai (synchronous).
 *
 * POST /api/admin/generate-verse-reel
 * { caption: string, albumSlug?: string, trackNumber?: number }
 * Returns: { imageUrl: string }
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
    const falRes = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: visualPrompt,
        image_size: { width: 720, height: 1280 },
        num_images: 1,
        safety_tolerance: 5,
      }),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      return NextResponse.json({ erro: `fal.ai: ${falRes.status} — ${err}` }, { status: 502 });
    }

    const data = await falRes.json();
    const imageUrl = data.images?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ erro: "fal.ai não devolveu imagem.", data }, { status: 502 });
    }

    return NextResponse.json({ imageUrl, albumSlug, trackNumber });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

function buildVisualPrompt(caption: string): string {
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\n/g, " ") : caption.slice(0, 200);

  return [
    "Beautiful editorial photograph, warm natural light, high quality.",
    "No text, no words, no letters, no watermarks, no logos.",
    "Show a concrete, real scene that illustrates this story:",
    `"${verse.slice(0, 250)}"`,
    "The image should feel like a moment captured — intimate, real, warm.",
    "Soft warm tones, natural light, slightly desaturated film look.",
    "9:16 vertical composition, shallow depth of field.",
  ].join(" ");
}
