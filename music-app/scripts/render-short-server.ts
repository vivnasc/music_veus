#!/usr/bin/env tsx
/**
 * render-short-server — render server-side de lyric-video short 9:16 30s.
 * Corre dentro do GitHub Action render-short.yml.
 *
 * Pipeline:
 *   1. Lê inputs de env (BRAND, ALBUM_SLUG, TRACK_NUMBER, START_SEC, DURATION_SEC)
 *   2. Resolve audio + cover URLs no Supabase
 *   3. Download dos dois para .render-input/
 *   4. Recorta 30s do áudio (ffmpeg)
 *   5. Gera ASS subtitles a partir da letra (auto-distribuído)
 *   6. ffmpeg compose: cover scaled+cropped 1080x1920 + zoompan (Ken Burns)
 *      + showwaves overlay + ass burn-in + audio AAC
 *   7. Upload do MP4 final para Supabase Storage bucket "social"
 *
 * Env:
 *   BRAND               = venna | nnovva
 *   ALBUM_SLUG          = ex venna-mango-hour
 *   TRACK_NUMBER        = 1..10
 *   START_SEC           = 30 (default)
 *   DURATION_SEC        = 30 (default)
 *   SUPABASE_URL        = NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { execFileSync, spawnSync } from "child_process";
import { writeFileSync, mkdirSync, readFileSync, existsSync, unlinkSync } from "fs";
import { join, resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { ALL_ALBUMS } from "../src/data/albums";

const REPO_ROOT = resolve(__dirname, "..", "..");
const WORK = join(resolve(__dirname, ".."), ".render-input");
const OUT = join(resolve(__dirname, ".."), ".render-output");

// ── Brand → palette/font ──────────────────────────────────

const BRANDS: Record<string, { name: string; colorHex: string }> = {
  venna:  { name: "VENNA",  colorHex: "F4E4D1" }, // cream
  nnovva: { name: "NNOVVA", colorHex: "C0B8E0" }, // soft violet-cream
};

// ── Helpers ───────────────────────────────────────────────

function env(name: string, fallback?: string): string {
  const v = process.env[name];
  if (!v && fallback === undefined) throw new Error(`Env ${name} obrigatório`);
  return v ?? fallback!;
}

function pad(n: number, w: number): string {
  return String(n).padStart(w, "0");
}

function fmtAssTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = (seconds % 60);
  const cs = Math.floor((s - Math.floor(s)) * 100);
  return `${h}:${pad(m, 2)}:${pad(Math.floor(s), 2)}.${pad(cs, 2)}`;
}

function extractSingableLines(lyrics: string): string[] {
  const lines = lyrics.split("\n");
  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("[") && line.endsWith("]")) continue;
    if (line.startsWith("(") && line.endsWith(":)")) continue;
    if (line.startsWith("(") && line.endsWith(")")) continue;
    if (/^\.{2,}$/.test(line)) continue;
    out.push(line);
  }
  return out;
}

function buildAss(lines: string[], duration: number, fontHexBgr: string, brandName: string): string {
  const intro = Math.min(2, duration * 0.05);
  const outro = Math.min(2, duration * 0.05);
  const usable = duration - intro - outro;
  const perLine = usable / lines.length;

  const events: string[] = [];
  // Brand watermark (top-left, persistente)
  events.push(
    `Dialogue: 0,${fmtAssTime(0)},${fmtAssTime(duration)},Brand,,0,0,0,,${brandName}`,
  );
  // Lyrics
  for (let i = 0; i < lines.length; i++) {
    const start = intro + i * perLine;
    const end = intro + (i + 1) * perLine - 0.1;
    const text = lines[i].replace(/[{}]/g, "");
    events.push(
      `Dialogue: 0,${fmtAssTime(start)},${fmtAssTime(end)},Lyric,,0,0,0,,${text}`,
    );
  }

  return `[Script Info]
ScriptType: v4.00+
WrapStyle: 2
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Lyric,Liberation Serif,64,&H00${fontHexBgr},&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,5,80,80,0,1
Style: Brand,Liberation Sans,32,&H00${fontHexBgr},&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,2,1,7,60,0,80,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${events.join("\n")}
`;
}

function hexBgr(hexRrggbb: string): string {
  // ffmpeg/ASS espera BGR: ex cream #F4E4D1 → D1E4F4
  return hexRrggbb.slice(4, 6) + hexRrggbb.slice(2, 4) + hexRrggbb.slice(0, 2);
}

async function downloadTo(url: string, dest: string): Promise<void> {
  console.log(`  GET ${url}`);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Download falhou ${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  writeFileSync(dest, buf);
}

async function resolveCoverUrl(supabaseUrl: string, albumSlug: string, trackNumber: number): Promise<string> {
  const tn = pad(trackNumber, 2);
  const candidates = [
    `${supabaseUrl}/storage/v1/object/public/audios/albums/${albumSlug}/cover.jpg`,
    `${supabaseUrl}/storage/v1/object/public/audios/albums/${albumSlug}/cover.png`,
    `${supabaseUrl}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${tn}-cover.jpg`,
    `${supabaseUrl}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${tn}-cover.png`,
  ];
  for (const u of candidates) {
    const r = await fetch(u, { method: "HEAD" });
    if (r.ok) return u;
  }
  throw new Error(`Sem capa no Supabase para ${albumSlug}/faixa-${tn}`);
}

function ffmpeg(args: string[]): void {
  console.log(`  ffmpeg ${args.slice(0, 5).join(" ")} …`);
  const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg saiu com ${r.status}`);
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  const brand = env("BRAND").toLowerCase();
  const albumSlug = env("ALBUM_SLUG");
  const trackNumber = Number(env("TRACK_NUMBER"));
  const startSec = Number(env("START_SEC", "30"));
  const durationSec = Number(env("DURATION_SEC", "30"));
  const supabaseUrl = env("SUPABASE_URL");
  const supabaseKey = env("SUPABASE_SERVICE_ROLE_KEY");

  const brandCfg = BRANDS[brand];
  if (!brandCfg) throw new Error(`Brand desconhecida: ${brand}`);

  // 1. Lyrics
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  if (!album) throw new Error(`Album '${albumSlug}' não existe em ALL_ALBUMS`);
  const track = album.tracks.find(t => t.number === trackNumber);
  if (!track) throw new Error(`Track ${trackNumber} não existe em ${albumSlug}`);
  const lines = extractSingableLines(track.lyrics);
  if (lines.length === 0) throw new Error("Sem linhas cantáveis");

  // 2. Workspace
  mkdirSync(WORK, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  // 3. Resolve URLs + download
  const tn = pad(trackNumber, 2);
  const audioUrl = `${supabaseUrl}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${tn}.mp3`;
  const coverUrl = await resolveCoverUrl(supabaseUrl, albumSlug, trackNumber);
  await downloadTo(audioUrl, join(WORK, "audio-full.mp3"));
  await downloadTo(coverUrl, join(WORK, "cover.jpg"));

  // 4. Trim audio
  ffmpeg([
    "-y",
    "-ss", String(startSec),
    "-t", String(durationSec),
    "-i", join(WORK, "audio-full.mp3"),
    "-c:a", "copy",
    join(WORK, "audio.mp3"),
  ]);

  // 5. Build ASS subtitles
  const ass = buildAss(lines, durationSec, hexBgr(brandCfg.colorHex), brandCfg.name);
  writeFileSync(join(WORK, "lyrics.ass"), ass, "utf-8");

  // 6. ffmpeg compose
  // Inputs:
  //   0 = cover.jpg (looped)
  //   1 = audio.mp3 (provides audio + waveform)
  // Filtergraph:
  //   - cover scaled + cropped 1080x1920
  //   - zoompan Ken Burns 1.0 → 1.15 ao longo do clip
  //   - dim overlay para legibilidade
  //   - showwaves do áudio: 900x150 line mode
  //   - overlay waveform a y=1500
  //   - subtitles ASS burn-in
  const filter = [
    "[0:v]scale=1200:2100:force_original_aspect_ratio=increase,crop=1080:1920,",
    `zoompan=z='1+0.0035*on':d=1:s=1080x1920:fps=30[bg];`,
    "[bg]colorchannelmixer=rr=0.85:gg=0.85:bb=0.85[bg2];",
    `[1:a]showwaves=s=900x150:mode=line:rate=30:colors=0x${brandCfg.colorHex}@0.9[wf];`,
    "[bg2][wf]overlay=90:1500:format=auto[bg3];",
    `[bg3]subtitles=${join(WORK, "lyrics.ass").replace(/\\/g, "/").replace(/:/g, "\\\\:")}[v]`,
  ].join("");

  const outputMp4 = join(OUT, `${brand}-${albumSlug}-faixa-${tn}-short.mp4`);

  ffmpeg([
    "-y",
    "-loop", "1",
    "-t", String(durationSec),
    "-i", join(WORK, "cover.jpg"),
    "-i", join(WORK, "audio.mp3"),
    "-filter_complex", filter,
    "-map", "[v]",
    "-map", "1:a",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "20",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-r", "30",
    "-shortest",
    "-movflags", "+faststart",
    outputMp4,
  ]);

  // 7. Upload to Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);
  const buf = readFileSync(outputMp4);
  const supaPath = `${brand}/${albumSlug}-faixa-${tn}-short.mp4`;
  console.log(`  upload → social/${supaPath}`);
  const { error } = await supabase.storage.from("social").upload(supaPath, buf, {
    contentType: "video/mp4",
    upsert: true,
  });
  if (error) throw new Error(`Upload falhou: ${error.message}`);

  const finalUrl = `${supabaseUrl}/storage/v1/object/public/social/${supaPath}`;
  console.log(`\n✓ ${finalUrl}`);

  // 8. Cleanup audio fontes (mantém output mp4 como artifact)
  for (const f of ["audio-full.mp3", "audio.mp3", "cover.jpg", "lyrics.ass"]) {
    const p = join(WORK, f);
    if (existsSync(p)) unlinkSync(p);
  }
}

main().catch(e => {
  console.error("\n✗", e instanceof Error ? e.message : e);
  process.exit(1);
});
