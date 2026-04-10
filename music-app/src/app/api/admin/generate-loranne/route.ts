import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 120;

/**
 * Generate Loranne images via Flux Pro (NO LoRA) for training or content.
 *
 * When useLoRA=false (default): Uses Flux Pro without LoRA — for generating
 * clean training images with strong identity constraints.
 *
 * When useLoRA=true: Uses active LoRA for content generation.
 *
 * POST /api/admin/generate-loranne
 * { prompt: string, numImages?: number, useLoRA?: boolean }
 */

// Loranne identity: face NEVER in the image.
// Flux ignores "face not visible" — so we force PHYSICAL composition that excludes face:
// BACK TO CAMERA, over-shoulder from behind, hands/body only, extreme backlight silhouette.
const IDENTITY = [
  "Woman seen FROM BEHIND, back facing the camera.",
  "Camera is positioned BEHIND the woman. We see her back, her shoulders, the back of her head with golden fabric flowing.",
  "Her face is physically impossible to see because the camera is BEHIND her. She is NOT turning around.",
  "Her race and ethnicity are completely ambiguous and undefined — she could be any race. No distinguishable skin tone or racial features.",
  "Golden flowing translucent fabric draped on her body. Warm golden amber tones.",
].join(" ");

const STYLE = "Fine art editorial photography, rear view, from behind, dramatic chiaroscuro lighting, warm golden amber, shallow depth of field, cinematic. No text, no watermarks.";

const NEGATIVE = "face, frontal, front view, looking at camera, turning around, portrait, eyes, nude, naked, white skin, black skin, asian, caucasian, african, specific ethnicity, text, watermark";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) return NextResponse.json({ erro: "FAL_KEY nao configurada." }, { status: 500 });

  const { prompt, numImages, useLoRA } = await req.json();
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ erro: "prompt e obrigatorio." }, { status: 400 });
  }

  const count = Math.min(Math.max(numImages || 2, 1), 4);
  const fullPrompt = `${prompt.trim()}. ${IDENTITY} ${STYLE}`;

  // Decide endpoint + LoRA
  let endpoint = "https://fal.run/fal-ai/flux-pro/v1.1";
  const body: Record<string, unknown> = {
    prompt: fullPrompt,
    negative_prompt: NEGATIVE,
    image_size: { width: 1024, height: 1024 },
    num_images: count,
    safety_tolerance: 5,
    output_format: "jpeg",
  };

  if (useLoRA) {
    // Try to use active LoRA
    let loraUrl = process.env.FAL_LORANNE_LORA_URL || null;
    if (!loraUrl) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const configRes = await fetch(`${supabaseUrl}/storage/v1/object/public/audios/lora/active-lora.json`, { next: { revalidate: 300 } });
        if (configRes.ok) {
          const config = await configRes.json();
          if (config.loraUrl) loraUrl = config.loraUrl;
        }
      } catch {}
    }
    if (loraUrl) {
      endpoint = "https://fal.run/fal-ai/flux-lora";
      body.loras = [{ path: loraUrl, scale: 0.7 }];
      // Prepend trigger word
      body.prompt = `loranne_artist, ${fullPrompt}`;
    }
  }

  try {
    const falRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      return NextResponse.json({ erro: `fal.ai: ${falRes.status} — ${err}` }, { status: 502 });
    }

    const data = await falRes.json();
    const imageUrls = (data.images || []).map((img: { url: string }) => img.url).filter(Boolean);

    if (imageUrls.length === 0) {
      return NextResponse.json({ erro: "Nenhuma imagem gerada.", data }, { status: 502 });
    }

    return NextResponse.json({ imageUrls });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}
