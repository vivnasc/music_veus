import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Poll fal.ai task status for verse reel image generation.
 * GET /api/admin/generate-verse-reel/status?falTaskId=xxx
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });

  const falTaskId = req.nextUrl.searchParams.get("falTaskId");
  if (!falTaskId) return NextResponse.json({ erro: "falTaskId é obrigatório." }, { status: 400 });

  try {
    // Check status
    const statusRes = await fetch(
      `https://queue.fal.run/fal-ai/flux-pro/v1.1/requests/${falTaskId}/status`,
      { headers: { "Authorization": `Key ${falKey}` } }
    );

    if (!statusRes.ok) {
      const err = await statusRes.text();
      return NextResponse.json({ erro: `fal.ai status: ${err}` }, { status: 502 });
    }

    const statusData = await statusRes.json();

    if (statusData.status === "COMPLETED") {
      // Fetch the result
      const resultRes = await fetch(
        `https://queue.fal.run/fal-ai/flux-pro/v1.1/requests/${falTaskId}`,
        { headers: { "Authorization": `Key ${falKey}` } }
      );
      const result = await resultRes.json();
      if (result.images?.[0]?.url) {
        return NextResponse.json({ status: "COMPLETED", imageUrl: result.images[0].url });
      }
      return NextResponse.json({ status: "COMPLETED", erro: "Sem imagem no resultado." });
    }

    return NextResponse.json({ status: statusData.status || "IN_PROGRESS" });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}
