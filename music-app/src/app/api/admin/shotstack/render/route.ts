import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 30;

/**
 * Send a Shotstack timeline for rendering.
 *
 * POST /api/admin/shotstack/render
 * { clipUrls, audioUrl, audioTrim?, verse?, trackTitle?, albumTitle? }
 *
 * Produces a 9:16 vertical Short with:
 * - Video clips in sequence with crossfade
 * - Audio from the track (trimmed to selected excerpt)
 * - Lyrics overlay (verse text, centered, fading in/out)
 * - Artist + track info at bottom
 * - music.seteveus.space watermark
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.SHOTSTACK_API_KEY;
  if (!apiKey) return NextResponse.json({ erro: "SHOTSTACK_API_KEY não configurada." }, { status: 500 });

  const baseUrl = "https://api.shotstack.io/v1";

  const { clipUrls, audioUrl, audioTrim, clipDuration: clipDur, verse, trackTitle, albumTitle } = await req.json();
  if (!clipUrls?.length || !audioUrl) {
    return NextResponse.json({ erro: "clipUrls e audioUrl obrigatórios." }, { status: 400 });
  }

  const clipDuration = clipDur || 5;
  const totalDuration = clipUrls.length * clipDuration;
  const trimStart = typeof audioTrim === "number" ? audioTrim : 30;

  // Track 1 (top layer): text overlays
  const textClips = [];

  // Lyrics verse — centered, larger, italic
  if (verse) {
    textClips.push({
      asset: {
        type: "html",
        html: `<p style="font-family:Georgia,serif;font-style:italic;font-size:38px;color:white;text-align:center;text-shadow:0 2px 20px rgba(0,0,0,0.9),0 0 40px rgba(0,0,0,0.5);padding:0 50px;line-height:1.6;letter-spacing:0.3px">${escapeHtml(verse)}</p>`,
        width: 1080,
        height: 600,
      },
      start: 2,
      length: totalDuration - 4,
      position: "center",
      offset: { x: 0, y: 0.05 },
      transition: { in: "fade", out: "fade" },
    });
  }

  // Artist name + track title — bottom
  textClips.push({
    asset: {
      type: "html",
      html: `<div style="text-align:center"><p style="font-family:Georgia,serif;font-weight:bold;font-size:26px;color:rgba(201,169,110,0.95);text-shadow:0 1px 10px rgba(0,0,0,0.7);letter-spacing:1px">Loranne</p><p style="font-family:sans-serif;font-size:15px;color:rgba(255,255,255,0.7);margin-top:6px;letter-spacing:0.5px">${escapeHtml(trackTitle || "")} — ${escapeHtml(albumTitle || "")}</p></div>`,
      width: 1080,
      height: 130,
    },
    start: 1.5,
    length: totalDuration - 2,
    position: "bottom",
    offset: { x: 0, y: -0.06 },
    transition: { in: "fade", out: "fade" },
  });

  // Watermark — music.seteveus.space — subtle, top right
  textClips.push({
    asset: {
      type: "html",
      html: `<p style="font-family:sans-serif;font-size:13px;color:rgba(255,255,255,0.35);text-shadow:0 1px 4px rgba(0,0,0,0.5);letter-spacing:0.5px">music.seteveus.space</p>`,
      width: 400,
      height: 40,
    },
    start: 0,
    length: totalDuration,
    position: "topRight",
    offset: { x: -0.02, y: 0.02 },
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
      trim: trimStart,
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
