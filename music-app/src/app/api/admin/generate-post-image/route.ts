import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// Allow up to 60s for fal.ai to generate the image
export const maxDuration = 60;

/**
 * Generate a post image via fal.ai based on the caption text.
 * Uses synchronous fal.run — waits for the image and returns it directly.
 *
 * POST /api/admin/generate-post-image
 * { caption: string, albumTitle?: string }
 * Returns: { imageUrl: string }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });
  }

  const { caption, albumTitle } = await req.json();
  if (!caption) {
    return NextResponse.json({ erro: "caption é obrigatório." }, { status: 400 });
  }

  const visualPrompt = buildVisualPrompt(caption, albumTitle);

  try {
    // Synchronous call — fal.run waits for the result
    const response = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: visualPrompt,
        image_size: { width: 1080, height: 1080 },
        num_images: 1,
        safety_tolerance: "5",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ erro: `fal.ai: ${response.status} — ${err}` }, { status: 502 });
    }

    const data = await response.json();

    if (data.images?.[0]?.url) {
      return NextResponse.json({ imageUrl: data.images[0].url });
    }

    return NextResponse.json({ erro: "fal.ai não devolveu imagem.", data }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

function buildVisualPrompt(caption: string, albumTitle?: string): string {
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\n/g, " ") : "";

  const cleanCaption = caption
    .replace(/"[^"]*"/g, "")
    .replace(/#\w+/g, "")
    .replace(/music\.seteveus\.space/g, "")
    .replace(/Loranne/g, "")
    .replace(/\n+/g, " ")
    .trim();

  return [
    "Cinematic, moody, editorial photography style.",
    "Dark atmospheric tones, warm golden accents, film grain.",
    "No text, no words, no letters, no watermarks.",
    "Emotionally evocative scene inspired by:",
    verse ? `"${verse.slice(0, 200)}"` : "",
    cleanCaption ? `Context: ${cleanCaption.slice(0, 150)}` : "",
    albumTitle ? `Album mood: ${albumTitle}` : "",
    "Style: intimate, poetic, European art-house cinema aesthetic.",
    "Colour palette: deep blacks, warm amber, soft gold, muted earth tones.",
    "Square format 1:1 composition.",
  ].filter(Boolean).join(" ");
}
