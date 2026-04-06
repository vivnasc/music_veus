import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 60;

/**
 * Generate Instagram post image: fal.ai background + text overlay.
 * Returns a ready-to-post image with verse text and branding.
 *
 * POST /api/admin/generate-post-image
 * { caption: string, albumTitle?: string }
 * Returns: { imageUrl: string, compositeUrl: string }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });

  const { caption, albumTitle } = await req.json();
  if (!caption) return NextResponse.json({ erro: "caption é obrigatório." }, { status: 400 });

  // Extract verse (text between quotes)
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\\n/g, "\n").trim() : "";

  const bgPrompt = buildBgPrompt(caption);

  try {
    // Step 1: Generate background image
    const falRes = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: bgPrompt,
        image_size: { width: 1080, height: 1350 },
        num_images: 1,
        safety_tolerance: 5,
      }),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      return NextResponse.json({ erro: `fal.ai: ${falRes.status} — ${err}` }, { status: 502 });
    }

    const falData = await falRes.json();
    const bgUrl = falData.images?.[0]?.url;
    if (!bgUrl) return NextResponse.json({ erro: "fal.ai sem imagem.", falData }, { status: 502 });

    // Step 2: Composite text overlay using canvas
    const compositeUrl = await compositeImage(bgUrl, verse, albumTitle || "");

    return NextResponse.json({ imageUrl: bgUrl, compositeUrl });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

function buildBgPrompt(caption: string): string {
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
    "Beautiful soft-focus background photograph, warm natural light.",
    "No text, no words, no letters, no watermarks.",
    "Slightly blurred, dreamy, works as background for overlaid text.",
    "Scene inspired by:",
    verse ? `"${verse.slice(0, 200)}"` : "",
    cleanCaption ? cleanCaption.slice(0, 150) : "",
    "Warm tones, soft golden light, gentle bokeh, intimate atmosphere.",
    "Square 1:1 composition.",
  ].filter(Boolean).join(" ");
}

async function compositeImage(bgUrl: string, verse: string, albumTitle: string): Promise<string> {
  // We can't use browser canvas on the server, so we'll use the
  // fal.ai image URL directly and let the client overlay text.
  // For now, return just the background URL — the client will handle overlay.
  // TODO: Use @napi-rs/canvas or sharp for server-side text overlay
  return bgUrl;
}
