import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Generate a post image via fal.ai based on the caption text.
 *
 * POST /api/admin/generate-post-image
 * { caption: string, albumTitle?: string }
 *
 * Returns: { imageUrl: string } or { taskId: string, status: "IN_QUEUE" }
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

  // Extract the poetic/emotional essence from the caption for the image prompt
  const visualPrompt = buildVisualPrompt(caption, albumTitle);

  try {
    // Use fal.ai flux-pro for high-quality image generation
    const response = await fetch("https://queue.fal.run/fal-ai/flux-pro/v1.1", {
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
      return NextResponse.json({ erro: `fal.ai error: ${err}` }, { status: 502 });
    }

    const data = await response.json();

    // queue.fal.run returns request_id for async processing
    if (data.request_id && !data.images) {
      return NextResponse.json({ taskId: data.request_id, status: "IN_QUEUE" });
    }

    // If we get images directly (sync response)
    if (data.images?.[0]?.url) {
      return NextResponse.json({ imageUrl: data.images[0].url });
    }

    return NextResponse.json({ erro: "Resposta inesperada do fal.ai", data }, { status: 502 });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

/**
 * Transform a Portuguese/English caption into a visual prompt for image generation.
 * Extracts the emotional mood and creates a cinematic scene description.
 */
function buildVisualPrompt(caption: string, albumTitle?: string): string {
  // Extract just the quoted verse/poetry part (between quotes)
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\n/g, " ") : "";

  // Use the verse for emotional context, the rest for theme
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
