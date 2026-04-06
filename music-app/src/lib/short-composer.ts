/**
 * Compose a music short from multiple Runway video clips + track audio.
 * Plays clips in sequence, overlays verse text + branding, records with MediaRecorder.
 *
 * Result: 15s video with multiple scenes + track music.
 */

import type { Album, AlbumTrack } from "@/data/albums";

const FPS = 30;
const SHORT_W = 1080;
const SHORT_H = 1920;

function pickLyric(track: AlbumTrack): string {
  if (!track.lyrics) return "";
  const lines = track.lyrics.split("\n").filter(l => {
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

function getMime(): string {
  const candidates = [
    'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  for (const mime of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return "video/webm";
}

async function loadVideo(url: string): Promise<HTMLVideoElement> {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  await new Promise<void>((resolve, reject) => {
    video.oncanplaythrough = () => resolve();
    video.onerror = () => reject(new Error(`Vídeo não carregou: ${url}`));
    video.src = url;
    video.load();
  });
  return video;
}

export type ShortProgress = {
  phase: string;
  progress: number;
  message: string;
};

/**
 * @param clipUrls — Array of Runway video URLs (each ~5s)
 * @param audioSrc — Track audio URL
 */
export async function composeShort(
  clipUrls: string[],
  audioSrc: string,
  track: AlbumTrack,
  album: Album,
  onProgress?: (p: ShortProgress) => void,
  audioStartSeconds?: number,
): Promise<Blob> {
  const report = (phase: string, progress: number, message: string) => {
    onProgress?.({ phase, progress, message });
  };

  if (clipUrls.length === 0) throw new Error("Sem clips de vídeo");

  // Load all video clips
  report("loading", 0, "A carregar clips...");
  const clips = await Promise.all(clipUrls.map(url => loadVideo(url)));
  const clipDurations = clips.map(v => v.duration || 5);
  const totalDuration = clipDurations.reduce((a, b) => a + b, 0);

  // Load audio
  report("loading", 0.4, "A carregar áudio...");
  const audioResponse = await fetch(audioSrc);
  if (!audioResponse.ok) throw new Error(`Áudio não disponível (${audioResponse.status})`);
  const audioArrayBuffer = await audioResponse.arrayBuffer();
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer);

  const startOffset = audioStartSeconds !== undefined
    ? Math.min(audioStartSeconds, Math.max(0, audioBuffer.duration - totalDuration))
    : Math.min(30, Math.max(0, audioBuffer.duration - totalDuration - 5));

  // Canvas
  report("loading", 0.7, "A configurar...");
  const canvas = document.createElement("canvas");
  canvas.width = SHORT_W;
  canvas.height = SHORT_H;
  const ctx = canvas.getContext("2d")!;

  // Streams
  const canvasStream = canvas.captureStream(FPS);
  const bufferSource = audioCtx.createBufferSource();
  bufferSource.buffer = audioBuffer;
  const destination = audioCtx.createMediaStreamDestination();
  bufferSource.connect(destination);

  const combined = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...destination.stream.getAudioTracks(),
  ]);

  const mimeType = getMime();
  const recorder = new MediaRecorder(combined, {
    mimeType,
    videoBitsPerSecond: 4_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  const verse = pickLyric(track);

  // Start recording
  report("recording", 0, "A gravar...");
  recorder.start(100);
  bufferSource.start(0, startOffset, totalDuration + 0.5);

  // Play clips in sequence
  const totalFrames = Math.round(totalDuration * FPS);
  let currentClipIdx = 0;
  let clipStartTime = 0;

  // Start first clip
  clips[0].currentTime = 0;
  await clips[0].play();

  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / FPS;

    // Determine which clip to show
    let elapsed = 0;
    for (let i = 0; i < clips.length; i++) {
      if (t < elapsed + clipDurations[i]) {
        if (i !== currentClipIdx) {
          // Switch clip
          clips[currentClipIdx].pause();
          currentClipIdx = i;
          clipStartTime = elapsed;
          clips[i].currentTime = 0;
          await clips[i].play();
        }
        break;
      }
      elapsed += clipDurations[i];
    }

    const activeClip = clips[currentClipIdx];

    // Draw video frame (cover fit)
    const vw = activeClip.videoWidth || SHORT_W;
    const vh = activeClip.videoHeight || SHORT_H;
    const scale = Math.max(SHORT_W / vw, SHORT_H / vh);
    const dw = vw * scale;
    const dh = vh * scale;
    const dx = (SHORT_W - dw) / 2;
    const dy = (SHORT_H - dh) / 2;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SHORT_W, SHORT_H);
    ctx.drawImage(activeClip, dx, dy, dw, dh);

    // Verse text (fade in/out)
    if (verse) {
      const fadeIn = Math.min(1, t / 1.5);
      const fadeOut = t > totalDuration - 2 ? Math.max(0, (totalDuration - t) / 2) : 1;
      const alpha = fadeIn * fadeOut;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "italic 42px Georgia, serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 15;

      const lines = wrapText(ctx, verse, SHORT_W - 120);
      const lineHeight = 58;
      const textY = SHORT_H * 0.72;
      lines.forEach((line, i) => {
        ctx.fillText(line, SHORT_W / 2, textY + i * lineHeight);
      });
      ctx.restore();
    }

    // Branding
    ctx.save();
    const brandAlpha = Math.min(0.8, t / 2);
    ctx.globalAlpha = brandAlpha;
    ctx.font = "bold 24px Georgia, serif";
    ctx.fillStyle = "rgba(201, 169, 110, 1)";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 8;
    ctx.fillText("Loranne", SHORT_W / 2, SHORT_H - 80);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillText(track.title + " — " + album.title, SHORT_W / 2, SHORT_H - 52);
    ctx.restore();

    // Progress
    if (frame % (FPS * 2) === 0) {
      report("recording", frame / totalFrames, `A gravar... ${Math.round((frame / totalFrames) * 100)}%`);
    }

    await new Promise(r => setTimeout(r, 1000 / FPS));
  }

  // Stop
  clips.forEach(v => v.pause());
  bufferSource.stop();
  recorder.stop();

  report("finalizing", 0.95, "A finalizar...");
  await new Promise<void>(resolve => { recorder.onstop = () => resolve(); });
  await audioCtx.close();

  const blob = new Blob(chunks, { type: mimeType });
  report("done", 1, "Pronto!");
  return blob;
}
