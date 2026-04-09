import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 120;

/**
 * Train a concept/style LoRA via fal.ai fast training.
 * Learns the overall visual identity (veils, silhouette, tones, composition)
 * rather than facial features.
 *
 * POST /api/admin/lora/train
 * JSON: { zipUrl: string, triggerWord?: string, steps?: number }
 *
 * zipUrl comes from /api/admin/lora/create-zip
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });

  try {
    const { zipUrl, triggerWord, steps } = await req.json();

    if (!zipUrl) {
      return NextResponse.json({ erro: "zipUrl obrigatório." }, { status: 400 });
    }

    const tw = triggerWord || "loranne_artist";
    const st = steps || 1000;

    const falRes = await fetch("https://queue.fal.run/fal-ai/flux-lora-fast-training", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images_data_url: zipUrl,
        trigger_word: tw,
        steps: st,
        is_style: true,
        create_masks: false,
      }),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      return NextResponse.json({ erro: `fal.ai: ${falRes.status} — ${err}` }, { status: 502 });
    }

    const data = await falRes.json();

    return NextResponse.json({
      status: "training",
      requestId: data.request_id,
      triggerWord: tw,
      steps: st,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
