import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 30;

/**
 * Poll fal.ai LoRA training status.
 * On completion, saves active LoRA config to Supabase.
 *
 * GET /api/admin/lora/status?requestId=XXX&triggerWord=loranne_artist
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });

  const requestId = req.nextUrl.searchParams.get("requestId");
  const triggerWord = req.nextUrl.searchParams.get("triggerWord") || "loranne_artist";
  if (!requestId) {
    return NextResponse.json({ erro: "requestId obrigatório." }, { status: 400 });
  }

  try {
    const statusRes = await fetch(
      `https://queue.fal.run/fal-ai/flux-lora-fast-training/requests/${requestId}/status`,
      { headers: { "Authorization": `Key ${falKey}` } }
    );

    if (!statusRes.ok) {
      const err = await statusRes.text();
      return NextResponse.json({ erro: `fal.ai: ${statusRes.status} — ${err}` }, { status: 502 });
    }

    const statusData = await statusRes.json();
    const status = statusData.status;

    if (status === "COMPLETED") {
      // Fetch result
      const resultRes = await fetch(
        `https://queue.fal.run/fal-ai/flux-lora-fast-training/requests/${requestId}`,
        { headers: { "Authorization": `Key ${falKey}` } }
      );

      if (resultRes.ok) {
        const result = await resultRes.json();
        const loraUrl = result.diffusers_lora_file?.url || null;
        const configUrl = result.config_file?.url || null;

        // Save active LoRA to Supabase
        if (loraUrl) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const supabase = createClient(supabaseUrl, supabaseKey);

          const loraConfig = {
            loraUrl,
            configUrl,
            triggerWord,
            trainedAt: new Date().toISOString(),
            requestId,
          };

          await supabase.storage.from("audios").upload(
            "lora/active-lora.json",
            Buffer.from(JSON.stringify(loraConfig, null, 2)),
            { contentType: "application/json", upsert: true }
          );
        }

        return NextResponse.json({ status: "complete", loraUrl, configUrl, triggerWord });
      }
    }

    if (status === "FAILED") {
      return NextResponse.json({ status: "error", error: statusData.error || "Training failed" });
    }

    return NextResponse.json({
      status: "training",
      queueStatus: status,
      progress: statusData.progress || null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
