import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 30;

/**
 * Send a Shotstack timeline for rendering.
 *
 * POST /api/admin/shotstack/render
 * { clipUrls: string[], audioUrl: string, verse?: string, trackTitle?: string, albumTitle?: string }
 *
 * Returns: { id: string, status: string }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.SHOTSTACK_API_KEY;
  if (!apiKey) return NextResponse.json({ erro: "SHOTSTACK_API_KEY não configurada." }, { status: 500 });

  const baseUrl = "https://api.shotstack.io/v1";

  const { clipUrls, audioUrl, verse, trackTitle, albumTitle } = await req.json();
  if (!clipUrls?.length || !audioUrl) {
    return NextResponse.json({ erro: "clipUrls e audioUrl obrigatórios." }, { status: 400 });
  }

  const clipDuration = 5;
  const totalDuration = clipUrls.length * clipDuration;

  // Track 1 (top): text overlays
  const textClips = [];
  if (verse) {
    textClips.push({
      asset: {
        type: "html",
        html: `<p style="font-family:Georgia,serif;font-style:italic;font-size:42px;color:white;text-align:center;text-shadow:0 2px 15px rgba(0,0,0,0.8);padding:0 60px;line-height:1.5">${escapeHtml(verse)}</p>`,
        width: 1080,
        height: 500,
      },
      start: 1,
      length: totalDuration - 2,
      position: "center",
      offset: { x: 0, y: 0.12 },
      transition: { in: "fade", out: "fade" },
    });
  }
  textClips.push({
    asset: {
      type: "html",
      html: `<div style="text-align:center"><p style="font-family:Georgia,serif;font-weight:bold;font-size:24px;color:rgba(201,169,110,0.9);text-shadow:0 1px 8px rgba(0,0,0,0.6)">Loranne</p><p style="font-family:sans-serif;font-size:16px;color:rgba(255,255,255,0.6);margin-top:4px">${escapeHtml(trackTitle || "")} — ${escapeHtml(albumTitle || "")}</p></div>`,
      width: 1080,
      height: 120,
    },
    start: 1.5,
    length: totalDuration - 2,
    position: "bottom",
    offset: { x: 0, y: -0.03 },
    transition: { in: "fade", out: "fade" },
  });

  // Track 2: video clips in sequence with crossfade
  const videoClips = clipUrls.map((url: string, idx: number) => ({
    asset: {
      type: "video",
      src: url,
      trim: 0,
      volume: 0,
    },
    start: idx * clipDuration,
    length: clipDuration,
    transition: {
      in: idx > 0 ? "fade" : undefined,
      out: "fade",
    },
  }));

  // Track 3: audio
  const audioClips = [{
    asset: {
      type: "audio",
      src: audioUrl,
      trim: 30,
      volume: 1,
    },
    start: 0,
    length: totalDuration,
  }];

  const timeline = {
    background: "#000000",
    tracks: [
      { clips: textClips },
      { clips: videoClips },
      { clips: audioClips },
    ],
  };

  const body = {
    timeline,
    output: {
      format: "mp4",
      resolution: "hd",
      aspectRatio: "9:16",
      fps: 30,
    },
  };

  try {
    const res = await fetch(`${baseUrl}/render`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ erro: `Shotstack: ${res.status} — ${err}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({
      id: data.response?.id,
      status: data.response?.status || "queued",
    });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\n/g, "<br/>");
}
