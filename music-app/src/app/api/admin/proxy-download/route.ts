import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Proxy download — downloads a file from an external URL server-side.
 * Bypasses CORS issues when downloading from Suno CDN.
 * POST /api/admin/proxy-download { url: "https://cdn.suno.ai/..." }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ erro: "URL em falta." }, { status: 400 });
    }

    // Force no-cache to avoid stale CDN responses
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { erro: `Download falhou: ${res.status} ${res.statusText}` },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "audio/mpeg";
    const buffer = await res.arrayBuffer();

    if (buffer.byteLength < 1000) {
      return NextResponse.json(
        { erro: `Ficheiro vazio ou demasiado pequeno (${buffer.byteLength} bytes)` },
        { status: 502 }
      );
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.byteLength),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
