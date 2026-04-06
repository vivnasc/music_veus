/**
 * Professional share card generator.
 * Creates stunning images for Instagram Stories (1080x1920) and Posts (1080x1080).
 *
 * Features:
 * - Album cover with play button overlay
 * - Bold typography with proper hierarchy
 * - Lyric line as hook
 * - Artist branding
 * - Track link for discovery
 * - Album color glow and particles
 */

import type { Album, AlbumTrack } from "@/data/albums";
import { getSharePath } from "@/lib/share-utils";

type CardFormat = "story" | "square";

function pickLyric(track: AlbumTrack): string | null {
  if (!track.lyrics) return null;
  const lines = track.lyrics.split("\n").filter(l => {
    const t = l.trim();
    return t.length > 15 && t.length < 80 && !t.startsWith("[");
  });
  if (lines.length === 0) return null;
  const day = Math.floor(Date.now() / 86400000);
  return lines[day % lines.length].trim();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith("http") && !src.includes(window.location.host)) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateShareCard(
  track: AlbumTrack,
  album: Album,
  coverSrc: string,
  format: CardFormat = "story",
): Promise<Blob> {
  const W = 1080;
  const H = format === "story" ? 1920 : 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const color = album.color || "#C9A96E";
  const lyric = pickLyric(track);

  // ── Background ──
  ctx.fillStyle = "#0D0D1A";
  ctx.fillRect(0, 0, W, H);

  // Background gradient (album color wash)
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, color + "15");
  bgGrad.addColorStop(0.5, "transparent");
  bgGrad.addColorStop(1, color + "08");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Top glow
  const glow = ctx.createRadialGradient(W / 2, H * 0.2, 0, W / 2, H * 0.2, W * 0.7);
  glow.addColorStop(0, color + "25");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Album cover ──
  const coverSize = format === "story" ? 600 : 520;
  const coverX = (W - coverSize) / 2;
  const coverY = format === "story" ? 300 : 100;
  const radius = 32;

  try {
    const img = await loadImage(coverSrc);
    // Shadow behind cover
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 20;
    ctx.beginPath();
    ctx.roundRect(coverX, coverY, coverSize, coverSize, radius);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();

    // Cover image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(coverX, coverY, coverSize, coverSize, radius);
    ctx.clip();
    const scale = Math.max(coverSize / img.width, coverSize / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, coverX - (dw - coverSize) / 2, coverY - (dh - coverSize) / 2, dw, dh);
    ctx.restore();

    // Play button overlay (center of cover)
    const playSize = 72;
    const playX = W / 2;
    const playY = coverY + coverSize / 2;
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.arc(playX, playY, playSize / 2, 0, Math.PI * 2);
    ctx.fill();
    // Play triangle
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.moveTo(playX - 10, playY - 16);
    ctx.lineTo(playX - 10, playY + 16);
    ctx.lineTo(playX + 16, playY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } catch {
    // Cover failed — draw colored placeholder
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(coverX, coverY, coverSize, coverSize, radius);
    ctx.fillStyle = color + "30";
    ctx.fill();
    ctx.restore();
  }

  // ── Text section ──
  ctx.textAlign = "center";
  const textY = coverY + coverSize + (format === "story" ? 70 : 50);

  // Album name
  ctx.font = "600 24px sans-serif";
  ctx.fillStyle = color;
  ctx.letterSpacing = "4px";
  ctx.fillText(album.title.toUpperCase(), W / 2, textY);
  ctx.letterSpacing = "0px";

  // Track title
  ctx.font = "bold 72px serif";
  ctx.fillStyle = "#F5F0E6";
  const titleLines = wrapText(ctx, track.title, W - 120);
  let titleY = textY + 80;
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, titleY);
    titleY += 84;
  }

  // Lyric line
  let afterLyricY = titleY + 20;
  if (lyric) {
    ctx.font = "italic 34px serif";
    ctx.fillStyle = "#F5F0E6";
    ctx.globalAlpha = 0.7;
    const lyricLines = wrapText(ctx, `"${lyric}"`, W - 160);
    for (const line of lyricLines) {
      ctx.fillText(line, W / 2, afterLyricY);
      afterLyricY += 44;
    }
    ctx.globalAlpha = 1;
  }

  // Artist name — elegant
  ctx.font = "italic 32px 'Georgia', serif";
  ctx.fillStyle = "#C9A96E";
  ctx.fillText("L o r a n n e", W / 2, afterLyricY + 40);

  // ── Footer ──
  const footerY = H - (format === "story" ? 100 : 50);

  // Decorative line
  ctx.strokeStyle = color + "50";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 80, footerY - 35);
  ctx.lineTo(W / 2 + 80, footerY - 35);
  ctx.stroke();

  // VÉUS branding
  ctx.font = "600 20px sans-serif";
  ctx.fillStyle = "#666680";
  ctx.letterSpacing = "6px";
  ctx.fillText("VÉUS", W / 2, footerY);
  ctx.letterSpacing = "0px";

  // Link
  const sharePath = getSharePath(album.slug, track.number);
  ctx.font = "400 18px sans-serif";
  ctx.fillStyle = "#a0a0b0";
  ctx.fillText(`music.seteveus.space${sharePath}`, W / 2, footerY + 30);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      "image/png",
      1,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const safe = filename.replace(/[<>:"/\\|?*]/g, "-");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = safe;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareImage(blob: Blob, track: AlbumTrack) {
  const safe = track.title.replace(/[<>:"/\\|?*]/g, "-");
  if (navigator.share && navigator.canShare?.({ files: [new File([blob], "card.png", { type: "image/png" })] })) {
    try {
      await navigator.share({
        files: [new File([blob], `${safe} — Loranne.png`, { type: "image/png" })],
        title: track.title,
        text: `${track.title} — Loranne`,
      });
      return true;
    } catch { /* cancelled */ }
  }
  return false;
}
