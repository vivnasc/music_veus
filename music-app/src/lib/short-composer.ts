/**
 * Compose a music short from a Runway video + track audio.
 * Loops the video to fill the duration, mixes with track audio,
 * and overlays verse text + branding.
 *
 * Result: a proper 15s music short for Instagram Reels / YouTube Shorts.
 */

import type { Album, AlbumTrack } from "@/data/albums";

const SHORT_DURATION = 15;
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

export type ShortProgress = {
  phase: "loading" | "recording" | "finalizing" | "done" | "error";
  progress: number;
  message: string;
};

export async function composeShort(
  videoUrl: string,
  audioSrc: string,
  track: AlbumTrack,
  album: Album,
  onProgress?: (p: ShortProgress) => void,
  audioStartSeconds?: number,
): Promise<Blob> {
  const report = (phase: ShortProgress["phase"], progress: number, message: string) => {
    onProgress?.({ phase, progress, message });
  };

  report("loading", 0, "A carregar vídeo...");

  // Load video
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  await new Promise<void>((resolve, reject) => {
    video.oncanplaythrough = () => resolve();
    video.onerror = () => reject(new Error("Vídeo não carregou"));
    video.src = videoUrl;
    video.load();
  });

  report("loading", 0.3, "A carregar áudio...");

  // Load audio
  const audioResponse = await fetch(audioSrc);
  if (!audioResponse.ok) throw new Error(`Áudio não disponível (${audioResponse.status})`);
  const audioArrayBuffer = await audioResponse.arrayBuffer();
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer);

  const startOffset = audioStartSeconds !== undefined
    ? Math.min(audioStartSeconds, Math.max(0, audioBuffer.duration - SHORT_DURATION))
    : Math.min(30, Math.max(0, audioBuffer.duration - SHORT_DURATION - 5));

  report("loading", 0.6, "A configurar gravação...");

  // Canvas for compositing
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

  // MediaRecorder
  const mimeType = getMime();
  const recorder = new MediaRecorder(combined, {
    mimeType,
    videoBitsPerSecond: 4_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  // Verse text
  const verse = pickLyric(track);

  // Start recording
  report("recording", 0, "A gravar...");
  recorder.start(100);
  bufferSource.start(0, startOffset, SHORT_DURATION + 0.5);

  // Play video looped
  video.currentTime = 0;
  await video.play();

  const totalFrames = SHORT_DURATION * FPS;
  const videoDuration = video.duration || 5;

  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / FPS;

    // Loop video
    const videoTime = t % videoDuration;
    if (Math.abs(video.currentTime - videoTime) > 0.2) {
      video.currentTime = videoTime;
    }

    // Draw video frame scaled to fill canvas (cover)
    const vw = video.videoWidth || SHORT_W;
    const vh = video.videoHeight || SHORT_H;
    const scale = Math.max(SHORT_W / vw, SHORT_H / vh);
    const dw = vw * scale;
    const dh = vh * scale;
    const dx = (SHORT_W - dw) / 2;
    const dy = (SHORT_H - dh) / 2;
    ctx.drawImage(video, dx, dy, dw, dh);

    // Verse text (fade in at 1s, fade out at 13s)
    if (verse) {
      const fadeIn = Math.min(1, t / 1);
      const fadeOut = t > SHORT_DURATION - 2 ? Math.max(0, (SHORT_DURATION - t) / 2) : 1;
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
      const textY = SHORT_H * 0.7;
      lines.forEach((line, i) => {
        ctx.fillText(line, SHORT_W / 2, textY + i * lineHeight);
      });
      ctx.restore();
    }

    // Branding (bottom)
    ctx.save();
    const brandAlpha = frame > FPS * 2 ? 0.7 : (frame / (FPS * 2)) * 0.7;
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

    // Wait for next frame
    await new Promise(r => setTimeout(r, 1000 / FPS));
  }

  // Stop
  video.pause();
  bufferSource.stop();
  recorder.stop();

  report("finalizing", 0.9, "A finalizar...");

  await new Promise<void>(resolve => {
    recorder.onstop = () => resolve();
  });

  await audioCtx.close();

  const blob = new Blob(chunks, { type: mimeType });
  report("done", 1, "Pronto!");
  return blob;
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
