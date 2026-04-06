import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Poll Shotstack render status.
 * GET /api/admin/shotstack/status?id=xxx
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.SHOTSTACK_API_KEY;
  const env = process.env.SHOTSTACK_ENV || "stage";
  if (!apiKey) return NextResponse.json({ erro: "SHOTSTACK_API_KEY não configurada." }, { status: 500 });

  const baseUrl = env === "production"
    ? "https://api.shotstack.io/v1"
    : "https://api.shotstack.io/stage";

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ erro: "id obrigatório." }, { status: 400 });

  try {
    const res = await fetch(`${baseUrl}/render/${id}`, {
      headers: { "x-api-key": apiKey },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ erro: `Shotstack: ${res.status} — ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const status = data.response?.status;
    const videoUrl = data.response?.url;

    if (status === "done" && videoUrl) {
      return NextResponse.json({ status: "done", videoUrl });
    }
    if (status === "failed") {
      return NextResponse.json({ status: "failed", error: data.response?.error || "Render falhou" });
    }

    return NextResponse.json({ status: status || "processing" });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}
