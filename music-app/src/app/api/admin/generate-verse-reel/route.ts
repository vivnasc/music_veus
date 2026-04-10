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

  const { caption, numImages, loraUrl: explicitLoraUrl, triggerWord: explicitTrigger } = await req.json();
  if (!caption) return NextResponse.json({ erro: "caption é obrigatório." }, { status: 400 });
  const count = Math.min(numImages || 1, 4);

  // Auto-detect active LoRA from Supabase if not passed explicitly
  let loraUrl = explicitLoraUrl || null;
  let triggerWord = explicitTrigger || "loranne_artist";

  if (!loraUrl) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const loraConfigUrl = `${supabaseUrl}/storage/v1/object/public/audios/lora/active-lora.json`;
      const loraRes = await fetch(loraConfigUrl, { next: { revalidate: 300 } });
      if (loraRes.ok) {
        const loraConfig = await loraRes.json();
        if (loraConfig.loraUrl) {
          loraUrl = loraConfig.loraUrl;
          triggerWord = loraConfig.triggerWord || "loranne_artist";
        }
      }
    } catch { /* no active LoRA — use Flux Pro without LoRA */ }
  }

  // Use concept LoRA when available (trained with flux-lora-fast-training)
  // This learns the visual identity (veils, silhouette, tones) not a face
  const visualPrompt = buildLorannPrompt(caption, loraUrl ? triggerWord : null);
  const endpoint = loraUrl
    ? "https://fal.run/fal-ai/flux-lora"
    : "https://fal.run/fal-ai/flux-pro/v1.1";

  const body: Record<string, unknown> = {
    prompt: visualPrompt,
    image_size: { width: 720, height: 1280 },
    num_images: count,
    safety_tolerance: 5,
  };

  if (loraUrl) {
    body.loras = [{ path: loraUrl, scale: 0.8 }];
  }

  try {
    const falRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
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
      return NextResponse.json({ erro: "fal.ai não devolveu imagens.", data }, { status: 502 });
    }

    return NextResponse.json({ imageUrls });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

function buildLorannPrompt(caption: string, triggerWord: string | null): string {
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\n/g, " ") : caption.slice(0, 200);

  const trigger = triggerWord ? `${triggerWord}, ` : "";

  return [
    `${verse}.`,
    `${trigger}A woman with golden flowing fabric, face never visible — seen from behind, or as dark silhouette, or only hands and body in frame. She can be any race, any body type — she represents every woman. The identity is the golden fabric and warm amber light.`,
    "Warm golden amber tones, intimate atmosphere.",
    "Fine art editorial photography, dramatic chiaroscuro lighting, no visible face, no text, no watermarks. 9:16 vertical, shallow depth of field.",
  ].join(" ");
}

