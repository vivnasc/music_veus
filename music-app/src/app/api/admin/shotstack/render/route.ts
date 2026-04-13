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

  // Lyrics — verse by verse with cinematic timing
  if (verse) {
    const lines = verse.split("\n").map((l: string) => l.trim()).filter(Boolean);
    const lineCount = lines.length;
    if (lineCount > 0) {
      // Show 1-2 lines at a time, spread across the duration
      const marginStart = 2.5; // seconds before first lyric
      const marginEnd = 2;     // seconds after last lyric
      const usableDuration = totalDuration - marginStart - marginEnd;
      const linesPerGroup = lineCount <= 4 ? 1 : 2;
      const groups: string[] = [];
      for (let i = 0; i < lineCount; i += linesPerGroup) {
        groups.push(lines.slice(i, i + linesPerGroup).join("<br/>"));
      }
      // Gap between groups for breathing room
      const gapBetween = 0.3;
      const totalGaps = Math.max(0, groups.length - 1) * gapBetween;
      const groupDuration = Math.max(2.5, (usableDuration - totalGaps) / groups.length);

      for (let i = 0; i < groups.length; i++) {
        textClips.push({
          asset: {
            type: "html",
            html: `<p style="font-family:'Georgia','Palatino Linotype','Book Antiqua',serif;font-style:italic;font-weight:400;font-size:36px;color:rgba(255,255,255,0.95);text-align:center;text-shadow:0 2px 24px rgba(0,0,0,0.95),0 0 60px rgba(0,0,0,0.6),0 4px 8px rgba(0,0,0,0.8);padding:0 50px;line-height:1.8;letter-spacing:0.5px">${groups[i]}</p>`,
            width: 1080,
            height: 360,
          },
          start: marginStart + i * (groupDuration + gapBetween),
          length: groupDuration,
          position: "center",
          offset: { x: 0, y: 0.05 },
          transition: { in: "fade", out: "fade" },
        });
      }
    }
  }

  // Artist + track title + album — bottom with safe margin
  textClips.push({
    asset: {
      type: "html",
      html: `<div style="text-align:center;padding:20px 24px"><p style="font-family:'Georgia','Palatino Linotype',serif;font-weight:bold;font-size:24px;color:rgba(201,169,110,0.95);text-shadow:0 2px 12px rgba(0,0,0,0.8),0 0 30px rgba(0,0,0,0.4);letter-spacing:1.5px">Loranne</p><p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.55);margin-top:6px;letter-spacing:0.8px;text-shadow:0 1px 6px rgba(0,0,0,0.6)">${escapeHtml(trackTitle || "")} &mdash; ${escapeHtml(albumTitle || "")}</p></div>`,
      width: 1080,
      height: 120,
    },
    start: 1.5,
    length: totalDuration - 2,
    position: "bottom",
    offset: { x: 0, y: -0.1 },
    transition: { in: "fade", out: "fade" },
  });

  // Watermark — music.seteveus.space
  textClips.push({
    asset: {
      type: "html",
      html: `<p style="font-family:sans-serif;font-size:12px;color:rgba(255,255,255,0.3);text-shadow:0 1px 3px rgba(0,0,0,0.5);letter-spacing:0.5px">music.seteveus.space</p>`,
      width: 350,
      height: 30,
    },
    start: 0,
    length: totalDuration,
    position: "topRight",
    offset: { x: -0.03, y: 0.03 },
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
