import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 120;

/**
 * Generate Loranne photos via fal.ai with LoRA.
 *
 * POST /api/admin/generate-loranne
 * { prompt: string, numImages?: number (1-4) }
 * Returns: { imageUrls: string[] }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) return NextResponse.json({ erro: "FAL_KEY nao configurada." }, { status: 500 });

  const loraUrl = process.env.FAL_LORANNE_LORA_URL;
  if (!loraUrl) return NextResponse.json({ erro: "FAL_LORANNE_LORA_URL nao configurada." }, { status: 500 });

  const { prompt, numImages } = await req.json();
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ erro: "prompt e obrigatorio." }, { status: 400 });
  }

  const count = Math.min(Math.max(numImages || 1, 1), 4);

  // Build prompt: LoRA trigger + identity constraints + user scene
  const identityPrefix =
    "loranne_artist, feminine silhouette draped in translucent golden veil, " +
    "face completely hidden by fabric, no visible facial features, " +
    "no defined race, the veil IS the identity";
  const styleSuffix =
    "warm golden light, cinematic editorial photography, " +
    "ethereal atmosphere, shallow depth of field";
  const fullPrompt = `${identityPrefix}, ${prompt.trim()}, ${styleSuffix}`;

  try {
    const falRes = await fetch("https://fal.run/fal-ai/flux-lora", {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        negative_prompt:
          "visible face, facial features, eyes, nose, mouth, clear face, portrait, " +
          "defined race, skin color, uncovered face, text, watermark, logo",
        loras: [{ path: loraUrl, scale: 1 }],
        image_size: { width: 1024, height: 1024 },
        num_images: count,
        safety_tolerance: 5,
        output_format: "jpeg",
      }),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      return NextResponse.json({ erro: `fal.ai: ${falRes.status} — ${err}` }, { status: 502 });
    }

    const data = await falRes.json();
    const imageUrls = (data.images || [])
      .map((img: { url: string }) => img.url)
      .filter(Boolean);

    if (imageUrls.length === 0) {
      return NextResponse.json({ erro: "fal.ai nao devolveu imagens.", data }, { status: 502 });
    }

    return NextResponse.json({ imageUrls });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}
