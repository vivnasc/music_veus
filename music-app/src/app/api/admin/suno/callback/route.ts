import { NextRequest, NextResponse } from "next/server";

/**
 * Callback endpoint for API.box Suno.
 * API.box POSTs here when music generation completes.
 * For now we just acknowledge — the frontend polls /status anyway.
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Log for debugging (visible in Vercel function logs)
    console.log("[suno/callback]", JSON.stringify(data).slice(0, 500));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
