/**
 * Generate animated reels (Canvas + Audio) for social media sharing.
 * Creates a 15s video with cover animation + track audio.
 */

import type { Album, AlbumTrack } from "@/data/albums";
import { getSharePath } from "@/lib/share-utils";

const REEL_DURATION = 15;
const FPS = 24;

// Presets
export const REEL_SIZE_STATUS = { w: 720, h: 1280 } as const;  // WhatsApp Status (9:16)
export const REEL_SIZE_INSTA = { w: 1080, h: 1350 } as const;  // Instagram Post (4:5)

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
    if (src.startsWith("http") && !src.includes(location.host)) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Imagem falhou: ${src}`));
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

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function getBestMime(): string {
  // MP4 first — WhatsApp/Instagram don't support WebM
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

// Floating light particles
type Particle = { x: number; y: number; r: number; speed: number; opacity: number; phase: number };

function createParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 1 + Math.random() * 3,
    speed: 0.3 + Math.random() * 0.8,
    opacity: 0.1 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
  }));
}

export type ReelProgress = {
  phase: "loading" | "recording" | "finalizing" | "done" | "error";
  progress: number;
  message: string;
};

/**
 * @param audioStartSeconds — second to start the audio clip from (default: 30)
 */
export async function generateReel(
  track: AlbumTrack,
  album: Album,
  coverSrc: string,
  audioSrc: string,
  onProgress?: (p: ReelProgress) => void,
  audioStartSeconds?: number,
  size: { w: number; h: number } = REEL_SIZE_STATUS,
): Promise<Blob> {
  const REEL_W = size.w;
  const REEL_H = size.h;
  const report = (phase: ReelProgress["phase"], progress: number, message: string) => {
    onProgress?.({ phase, progress, message });
  };

  report("loading", 0, "A carregar imagem...");
  const coverImg = await loadImage(coverSrc);

  report("loading", 0.3, "A carregar audio...");

  const audioResponse = await fetch(audioSrc);
  if (!audioResponse.ok) throw new Error(`Audio nao disponivel (${audioResponse.status} — ${audioSrc})`);
  const audioArrayBuffer = await audioResponse.arrayBuffer();

  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer);

  const startOffset = audioStartSeconds !== undefined
    ? Math.min(audioStartSeconds, Math.max(0, audioBuffer.duration - REEL_DURATION))
    : Math.min(30, Math.max(0, audioBuffer.duration - REEL_DURATION - 5));

  report("loading", 0.6, "A configurar gravacao...");

  const canvas = document.createElement("canvas");
  canvas.width = REEL_W;
  canvas.height = REEL_H;
  const ctx = canvas.getContext("2d")!;

  const canvasStream = canvas.captureStream(FPS);

  const bufferSource = audioCtx.createBufferSource();
  bufferSource.buffer = audioBuffer;
  const destination = audioCtx.createMediaStreamDestination();
  bufferSource.connect(destination);

  const combined = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...destination.stream.getAudioTracks(),
  ]);

  const mimeType = getBestMime();
  const recorder = new MediaRecorder(combined, {
    mimeType,
    videoBitsPerSecond: 2_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const color = album.color || "#C9A96E";
  const lyric = pickLyric(track);
  const isSquare = REEL_W === REEL_H;
  const coverSize = Math.round(REEL_W * (isSquare ? 0.55 : 0.75));
  const coverBaseX = (REEL_W - coverSize) / 2;
  const coverBaseY = Math.round(REEL_H * (isSquare ? 0.05 : 0.12));
  const particles = createParticles(30, REEL_W, REEL_H);

  function drawFrame(elapsed: number) {
    const t = elapsed / REEL_DURATION;

    // Background
    ctx.fillStyle = "#0D0D1A";
    ctx.fillRect(0, 0, REEL_W, REEL_H);

    // Pulsing glow behind cover
    const glowPulse = 0.15 + 0.1 * Math.sin(elapsed * 1.2);
    const glowSize = REEL_W * (0.5 + 0.1 * Math.sin(elapsed * 0.6));
    const glow = ctx.createRadialGradient(REEL_W / 2, coverBaseY + coverSize / 2, coverSize * 0.3, REEL_W / 2, coverBaseY + coverSize / 2, glowSize);
    glow.addColorStop(0, color + Math.round(glowPulse * 255).toString(16).padStart(2, "0"));
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, REEL_W, REEL_H);

    // Floating particles
    ctx.save();
    for (const p of particles) {
      const py = (p.y - elapsed * p.speed * 40 + REEL_H * 2) % REEL_H;
      const flickr = 0.5 + 0.5 * Math.sin(elapsed * 2 + p.phase);
      ctx.globalAlpha = p.opacity * flickr * clamp(t * 4, 0, 1);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, py, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Cover — visible zoom (1.0 → 1.2) + slight vertical drift
    const zoom = 1 + 0.2 * easeInOut(t);
    const zoomedSize = coverSize * zoom;
    const zoomOffsetX = (zoomedSize - coverSize) / 2;
    const driftY = -15 * easeInOut(t); // slow upward drift

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(coverBaseX, coverBaseY, coverSize, coverSize, 20);
    ctx.clip();

    // Shadow inside
    const scale = Math.max(zoomedSize / coverImg.width, zoomedSize / coverImg.height);
    const dw = coverImg.width * scale;
    const dh = coverImg.height * scale;
    ctx.drawImage(
      coverImg,
      coverBaseX - zoomOffsetX - (dw - zoomedSize) / 2,
      coverBaseY + driftY - (dh - zoomedSize) / 2,
      dw,
      dh,
    );

    // Subtle color wash
    ctx.fillStyle = color + "08";
    ctx.fillRect(coverBaseX, coverBaseY, coverSize, coverSize);
    ctx.restore();

    // Cover shadow
    ctx.save();
    ctx.globalAlpha = 0.3;
    const shadowGrad = ctx.createLinearGradient(0, coverBaseY + coverSize - 10, 0, coverBaseY + coverSize + 40);
    shadowGrad.addColorStop(0, "#0D0D1A");
    shadowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(coverBaseX, coverBaseY + coverSize - 10, coverSize, 50);
    ctx.restore();

    // ── Text ──
    ctx.textAlign = "center";
    const textGap = isSquare ? 25 : 50;
    const textBaseY = coverBaseY + coverSize + textGap;
    const fontScale = isSquare ? 0.75 : 1;

    // Album name — slides up + fades in (0.5s-1.5s)
    const albumProgress = clamp((elapsed - 0.5) / 1, 0, 1);
    if (albumProgress > 0) {
      const slideUp = 20 * (1 - easeInOut(albumProgress));
      ctx.globalAlpha = albumProgress;
      ctx.font = `500 ${Math.round(18 * fontScale)}px sans-serif`;
      ctx.fillStyle = "#666680";
      ctx.fillText(album.title.toUpperCase(), REEL_W / 2, textBaseY + slideUp);
    }

    // Track title — slides up + fades in (1.5s-2.5s)
    const titleProgress = clamp((elapsed - 1.5) / 1, 0, 1);
    if (titleProgress > 0) {
      const slideUp = 25 * (1 - easeInOut(titleProgress));
      ctx.globalAlpha = titleProgress;
      const titleSize = Math.round(44 * fontScale);
      ctx.font = `bold ${titleSize}px serif`;
      ctx.fillStyle = "#F5F0E6";
      const titleLines = wrapText(ctx, track.title, REEL_W - 60);
      let y = textBaseY + Math.round(50 * fontScale) + slideUp;
      for (const line of titleLines) { ctx.fillText(line, REEL_W / 2, y); y += Math.round(54 * fontScale); }
    }

    // Lyric — slides up + fades in (3s-4.5s)
    if (lyric) {
      const lyricProgress = clamp((elapsed - 3) / 1.5, 0, 1);
      if (lyricProgress > 0) {
        const slideUp = 20 * (1 - easeInOut(lyricProgress));
        ctx.globalAlpha = lyricProgress;
        ctx.font = `italic ${Math.round(22 * fontScale)}px serif`;
        ctx.fillStyle = color + "cc";
        const lyricLines = wrapText(ctx, `"${lyric}"`, REEL_W - 80);
        let y = textBaseY + Math.round(140 * fontScale) + slideUp;
        for (const line of lyricLines) { ctx.fillText(line, REEL_W / 2, y); y += Math.round(30 * fontScale); }
      }
    }

    // Artist — elegant serif
    const artistProgress = clamp((elapsed - 2.5) / 1, 0, 1);
    if (artistProgress > 0) {
      ctx.globalAlpha = artistProgress;
      ctx.font = `italic ${Math.round(28 * fontScale)}px 'Cormorant Garamond', 'Georgia', serif`;
      ctx.fillStyle = "#C9A96E";
      ctx.fillText("L o r a n n e", REEL_W / 2, textBaseY + Math.round((lyric ? 200 : 130) * fontScale));
    }

    // Branding + link
    const brandProgress = clamp((elapsed - 4) / 1, 0, 1);
    if (brandProgress > 0) {
      ctx.globalAlpha = brandProgress;
      const brandY = REEL_H - 80;
      ctx.strokeStyle = color + "40";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(REEL_W / 2 - 40, brandY - 20);
      ctx.lineTo(REEL_W / 2 + 40, brandY - 20);
      ctx.stroke();
      ctx.font = "500 16px sans-serif";
      ctx.fillStyle = "#666680";
      ctx.fillText("VÉUS", REEL_W / 2, brandY);
      // Link
      const sharePath = getSharePath(album.slug, track.number);
      ctx.font = "400 16px sans-serif";
      ctx.fillStyle = "#a0a0b0";
      ctx.fillText(`music.seteveus.space${sharePath}`, REEL_W / 2, brandY + 25);
    }

    // NO fade-in from black — first frame shows cover (Instagram thumbnail)

    // Fade out to black (last 2s)
    if (elapsed > REEL_DURATION - 2) {
      ctx.globalAlpha = 1 - clamp((REEL_DURATION - elapsed) / 2, 0, 1);
      ctx.fillStyle = "#0D0D1A";
      ctx.fillRect(0, 0, REEL_W, REEL_H);
    }

    ctx.globalAlpha = 1;
  }

  // Try WebCodecs + mp4-muxer for real MP4 (Chrome/Edge 94+)
  // Wrapped in try-catch: mobile Safari may have VideoEncoder but mp4-muxer
  // crashes on null decoderConfig.colorSpace — fallback to MediaRecorder
  let webCodecsOk = false;
  if (typeof VideoEncoder !== "undefined") {
    try {
    report("recording", 0, "A gravar reel (MP4)...");
    const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
    const target = new ArrayBufferTarget();
    const muxer = new Muxer({
      target,
      video: { codec: "avc", width: REEL_W, height: REEL_H },
      audio: { codec: "aac", numberOfChannels: audioBuffer.numberOfChannels, sampleRate: audioBuffer.sampleRate },
      fastStart: "in-memory",
    });

    // Encode video frames
    const encoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (err) => { console.error("VideoEncoder error:", err); },
    });
    // Level 3.1 for 720x1280, level 4.0 for 1080x1920
    const avcCodec = REEL_W * REEL_H > 921600 ? "avc1.640028" : "avc1.42001f";
    encoder.configure({
      codec: avcCodec,
      width: REEL_W,
      height: REEL_H,
      bitrate: REEL_W > 720 ? 4_000_000 : 2_000_000,
      framerate: FPS,
    });

    const totalFrames = REEL_DURATION * FPS;
    for (let i = 0; i < totalFrames; i++) {
      const elapsed = i / FPS;
      drawFrame(elapsed);
      const frame = new VideoFrame(canvas, { timestamp: i * (1_000_000 / FPS) });
      encoder.encode(frame, { keyFrame: i % (FPS * 2) === 0 });
      frame.close();
      if (i % FPS === 0) report("recording", i / totalFrames, `A gravar... ${Math.round(elapsed)}s / ${REEL_DURATION}s`);
    }
    await encoder.flush();
    encoder.close();

    // Encode audio
    report("finalizing", 0.8, "A processar audio...");
    const audioEncoder = new AudioEncoder({
      output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
      error: () => {},
    });
    audioEncoder.configure({
      codec: "mp4a.40.2",
      numberOfChannels: audioBuffer.numberOfChannels,
      sampleRate: audioBuffer.sampleRate,
      bitrate: 128000,
    });

    // Extract audio samples for the reel duration (planar layout)
    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(startOffset * sampleRate);
    const numSamples = Math.floor(REEL_DURATION * sampleRate);
    const audioData = new Float32Array(numSamples * channels);
    for (let ch = 0; ch < channels; ch++) {
      const channelData = audioBuffer.getChannelData(ch);
      for (let i = 0; i < numSamples; i++) {
        const srcIdx = startSample + i;
        if (srcIdx < channelData.length) {
          audioData[ch * numSamples + i] = channelData[srcIdx];
        }
      }
    }

    const chunkSize = sampleRate; // 1 second chunks
    for (let offset = 0; offset < numSamples; offset += chunkSize) {
      const size = Math.min(chunkSize, numSamples - offset);
      const planarChunk = new Float32Array(size * channels);
      for (let ch = 0; ch < channels; ch++) {
        planarChunk.set(audioData.subarray(ch * numSamples + offset, ch * numSamples + offset + size), ch * size);
      }
      const chunk = new AudioData({
        format: "f32-planar" as AudioSampleFormat,
        sampleRate,
        numberOfFrames: size,
        numberOfChannels: channels,
        timestamp: (offset / sampleRate) * 1_000_000,
        data: planarChunk,
      });
      audioEncoder.encode(chunk);
      chunk.close();
    }
    await audioEncoder.flush();
    audioEncoder.close();

    muxer.finalize();
    const blob = new Blob([target.buffer], { type: "video/mp4" });
    try { bufferSource.disconnect(); audioCtx.close(); } catch {}
    report("done", 1, `Reel MP4 pronto! (${(blob.size / 1024 / 1024).toFixed(1)}MB)`);
    return blob;
    } catch (webCodecsErr) {
      console.warn("WebCodecs failed, falling back to MediaRecorder:", webCodecsErr);
      report("recording", 0, "MP4 falhou — a tentar WebM...");
    }
  }

  // Fallback: MediaRecorder (WebM)
  report("recording", 0, "A gravar reel (WebM)...");
  return new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      report("finalizing", 0.95, "A finalizar...");
      try { bufferSource.stop(); bufferSource.disconnect(); audioCtx.close(); } catch {}
      const blob = new Blob(chunks, { type: "video/mp4" });
      if (blob.size < 1000) {
        reject(new Error(`Reel vazio (${blob.size} bytes).`));
        return;
      }
      report("done", 1, `Reel pronto! (${(blob.size / 1024 / 1024).toFixed(1)}MB)`);
      resolve(blob);
    };

    recorder.onerror = () => {
      try { bufferSource.stop(); audioCtx.close(); } catch {}
      reject(new Error("Gravacao falhou."));
    };

    recorder.start(500);
    bufferSource.start(0, startOffset, REEL_DURATION);

    const startTs = performance.now();
    const interval = setInterval(() => {
      const elapsed = (performance.now() - startTs) / 1000;
      if (elapsed >= REEL_DURATION) {
        clearInterval(interval);
        recorder.stop();
        return;
      }
      report("recording", elapsed / REEL_DURATION, `A gravar... ${Math.round(elapsed)}s / ${REEL_DURATION}s`);
      drawFrame(elapsed);
    }, 1000 / FPS);

    drawFrame(0);
  });
}
