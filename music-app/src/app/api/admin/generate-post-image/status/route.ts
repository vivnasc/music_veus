import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Check fal.ai task status.
 * GET /api/admin/generate-post-image/status?taskId=xxx
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });
  }

  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json({ erro: "taskId é obrigatório." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://queue.fal.run/fal-ai/flux-pro/v1.1/requests/${taskId}/status`, {
      headers: { "Authorization": `Key ${falKey}` },
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ erro: `fal.ai error: ${err}` }, { status: 502 });
    }

    const data = await response.json();

    if (data.status === "COMPLETED") {
      // Fetch the result
      const resultRes = await fetch(`https://queue.fal.run/fal-ai/flux-pro/v1.1/requests/${taskId}`, {
        headers: { "Authorization": `Key ${falKey}` },
      });
      const result = await resultRes.json();
      if (result.images?.[0]?.url) {
        return NextResponse.json({ status: "COMPLETED", imageUrl: result.images[0].url });
      }
    }

    return NextResponse.json({ status: data.status || "IN_PROGRESS" });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}
