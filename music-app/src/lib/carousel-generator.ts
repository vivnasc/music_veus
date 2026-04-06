/**
 * Generate Instagram carousel slides (1080x1080 each).
 * Slide 1: Album cover full
 * Slide 2: Lyric quote
 * Slide 3: Track list
 * Slide 4: CTA
 */

import type { Album } from "@/data/albums";
import JSZip from "jszip";

const W = 1080;
const H = 1080;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith("http") && !src.includes(location.host)) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed"));
    img.src = src;
  });
}

function pickLyric(lyrics: string): string {
  const lines = lyrics.split("\n").filter(l => {
    const t = l.trim();
    return t.length > 15 && t.length < 80 && !t.startsWith("[");
  });
  if (lines.length === 0) return "";
  const day = Math.floor(Date.now() / 86400000);
  return lines[day % lines.length].trim();
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

function drawBackground(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = "#0D0D1A";
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
  glow.addColorStop(0, color + "20");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
}

function drawBranding(ctx: CanvasRenderingContext2D) {
  ctx.textAlign = "center";
  ctx.font = "italic 28px 'Georgia', serif";
  ctx.fillStyle = "#C9A96E";
  ctx.fillText("L o r a n n e", W / 2, H - 50);
}

async function slide1Cover(album: Album, coverSrc: string): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx, album.color);

  try {
    const img = await loadImage(coverSrc);
    const coverSize = 620;
    const x = (W - coverSize) / 2;
    const y = 80;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 15;
    ctx.beginPath();
    ctx.roundRect(x, y, coverSize, coverSize, 28);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, coverSize, coverSize, 28);
    ctx.clip();
    const scale = Math.max(coverSize / img.width, coverSize / img.height);
    ctx.drawImage(img, x - (img.width * scale - coverSize) / 2, y - (img.height * scale - coverSize) / 2, img.width * scale, img.height * scale);
    ctx.restore();
  } catch {}

  ctx.textAlign = "center";
  ctx.font = "600 22px sans-serif";
  ctx.fillStyle = album.color;
  ctx.letterSpacing = "4px";
  ctx.fillText(album.title.toUpperCase(), W / 2, 770);
  ctx.letterSpacing = "0px";

  ctx.font = "400 18px sans-serif";
  ctx.fillStyle = "#a0a0b0";
  ctx.fillText(`${album.tracks.length} faixas`, W / 2, 800);

  drawBranding(ctx);

  return new Promise(r => canvas.toBlob(b => r(b!), "image/jpeg", 0.95));
}

async function slide2Lyric(album: Album, lyric: string): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx, album.color);
  ctx.textAlign = "center";

  // Big quote
  ctx.font = "italic 48px 'Georgia', serif";
  ctx.fillStyle = "#F5F0E6";
  const lines = wrapText(ctx, `"${lyric}"`, W - 160);
  let y = H / 2 - (lines.length * 60) / 2;
  for (const line of lines) {
    ctx.fillText(line, W / 2, y);
    y += 60;
  }

  // Album reference
  ctx.font = "400 20px sans-serif";
  ctx.fillStyle = "#666680";
  ctx.fillText(album.title, W / 2, y + 40);

  drawBranding(ctx);

  return new Promise(r => canvas.toBlob(b => r(b!), "image/jpeg", 0.95));
}

async function slide3TrackList(album: Album, getTitle?: (s: string, n: number, f: string) => string): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx, album.color);
  ctx.textAlign = "center";

  ctx.font = "600 20px sans-serif";
  ctx.fillStyle = album.color;
  ctx.letterSpacing = "4px";
  ctx.fillText("FAIXAS", W / 2, 80);
  ctx.letterSpacing = "0px";

  ctx.textAlign = "left";
  const startY = 140;
  const lineH = Math.min(80, (H - 200) / album.tracks.length);

  album.tracks.forEach((t, i) => {
    const title = getTitle ? getTitle(album.slug, t.number, t.title) : t.title;
    const y = startY + i * lineH;

    ctx.font = "500 18px sans-serif";
    ctx.fillStyle = "#666680";
    ctx.fillText(String(t.number).padStart(2, "0"), 80, y);

    ctx.font = "500 24px sans-serif";
    ctx.fillStyle = "#F5F0E6";
    ctx.fillText(title, 130, y);

    ctx.font = "400 16px sans-serif";
    ctx.fillStyle = "#666680";
    ctx.fillText(t.lang, W - 120, y);
  });

  drawBranding(ctx);

  return new Promise(r => canvas.toBlob(b => r(b!), "image/jpeg", 0.95));
}

async function slide4CTA(album: Album): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  drawBackground(ctx, album.color);
  ctx.textAlign = "center";

  ctx.font = "italic 44px 'Georgia', serif";
  ctx.fillStyle = "#F5F0E6";
  ctx.fillText("Ouve agora", W / 2, H / 2 - 60);

  ctx.font = "400 22px sans-serif";
  ctx.fillStyle = "#a0a0b0";
  ctx.fillText("e vê o que estava invisível.", W / 2, H / 2);

  // Link
  ctx.font = "500 24px sans-serif";
  ctx.fillStyle = album.color;
  ctx.fillText("music.seteveus.space", W / 2, H / 2 + 80);

  // Decorative line
  ctx.strokeStyle = album.color + "40";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 100, H / 2 + 40);
  ctx.lineTo(W / 2 + 100, H / 2 + 40);
  ctx.stroke();

  drawBranding(ctx);

  return new Promise(r => canvas.toBlob(b => r(b!), "image/jpeg", 0.95));
}

export async function generateCarousel(
  album: Album,
  coverSrc: string,
  onProgress?: (msg: string) => void,
  getTitle?: (s: string, n: number, f: string) => string,
): Promise<void> {
  onProgress?.("Slide 1 — Capa...");
  const s1 = await slide1Cover(album, coverSrc);

  onProgress?.("Slide 2 — Verso...");
  const firstLyric = album.tracks.find(t => t.lyrics)?.lyrics || "";
  const lyric = pickLyric(firstLyric) || album.subtitle;
  const s2 = await slide2Lyric(album, lyric);

  onProgress?.("Slide 3 — Faixas...");
  const s3 = await slide3TrackList(album, getTitle);

  onProgress?.("Slide 4 — CTA...");
  const s4 = await slide4CTA(album);

  onProgress?.("A criar ZIP...");
  const zip = new JSZip();
  zip.file("01-capa.jpg", s1);
  zip.file("02-verso.jpg", s2);
  zip.file("03-faixas.jpg", s3);
  zip.file("04-ouve.jpg", s4);

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Carrossel — ${album.title}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
