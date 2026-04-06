import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy an external image through our server.
 * GET /api/admin/proxy-image?url=https://cdn.suno.ai/...
 *
 * This makes external images same-origin so canvas.toBlob() works.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return new NextResponse("Fetch failed", { status: 502 });

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
