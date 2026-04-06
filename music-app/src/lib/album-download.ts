"use client";

/**
 * Download a complete album as ZIP ready for DistroKid.
 * Contains: WAV files + cover 3000x3000 + metadata.txt
 *
 * Flow:
 * 1. Download MP3s from Supabase
 * 2. Convert to WAV in browser (AudioContext)
 * 3. Download/upscale cover to 3000x3000
 * 4. Generate metadata.txt
 * 5. Pack into ZIP and download
 */

import JSZip from "jszip";
import type { Album } from "@/data/albums";

/** Convert MP3 blob to WAV blob using AudioContext */
async function mp3ToWav(mp3Blob: Blob): Promise<Blob> {
  const arrayBuffer = await mp3Blob.arrayBuffer();
  const audioCtx = new OfflineAudioContext(2, 1, 44100);

  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // Create offline context with correct duration
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const rendered = await offlineCtx.startRendering();

  // Encode as WAV
  const numChannels = rendered.numberOfChannels;
  const sampleRate = rendered.sampleRate;
  const length = rendered.length;
  const bytesPerSample = 2; // 16-bit
  const dataSize = length * numChannels * bytesPerSample;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave channels and write samples
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, rendered.getChannelData(ch)[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/** Upscale cover image to 3000x3000 */
async function upscaleCover(coverUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 3000;
      canvas.height = 3000;
      const ctx = canvas.getContext("2d")!;
      // Draw scaled to fill
      const scale = Math.max(3000 / img.width, 3000 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (3000 - w) / 2, (3000 - h) / 2, w, h);
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error("Cover export failed")),
        "image/jpeg",
        0.95
      );
    };
    img.onerror = () => reject(new Error("Cover failed to load"));
    img.src = coverUrl;
  });
}

export type DownloadProgress = {
  phase: string;
  current: number;
  total: number;
};

export async function downloadAlbumForDistribution(
  album: Album,
  onProgress?: (p: DownloadProgress) => void,
  getTitle?: (slug: string, num: number, fallback: string) => string,
  coverTrackNumber?: number,
): Promise<void> {
  const zip = new JSZip();
  const total = album.tracks.length;
  const artistName = "Loranne";
  const folderName = `${artistName} - ${album.title}`;

  // 1. Download and convert each track to WAV
  for (let i = 0; i < album.tracks.length; i++) {
    const track = album.tracks[i];
    const padNum = String(track.number).padStart(2, "0");
    const title = getTitle ? getTitle(album.slug, track.number, track.title) : track.title;
    onProgress?.({ phase: `A converter faixa ${padNum} — ${title}`, current: i + 1, total: total + 2 });

    const streamUrl = `/api/music/stream?album=${encodeURIComponent(album.slug)}&track=${track.number}`;
    const mp3Res = await fetch(streamUrl);
    if (!mp3Res.ok) continue;
    const mp3Blob = await mp3Res.blob();
    const wavBlob = await mp3ToWav(mp3Blob);

    const safeTitle = title.replace(/[<>:"/\\|?*]/g, "-");
    zip.file(`${folderName}/${padNum} - ${safeTitle}.wav`, wavBlob);
  }

  // 2. Cover image (3000x3000)
  onProgress?.({ phase: "A preparar capa (3000x3000)", current: total + 1, total: total + 2 });
  try {
    const coverNum = coverTrackNumber || 1;
    const coverUrl = `/api/music/stream?album=${encodeURIComponent(album.slug)}&track=${coverNum}&type=cover`;
    const coverBlob = await upscaleCover(coverUrl);
    zip.file(`${folderName}/cover.jpg`, coverBlob);
  } catch {
    // If no Suno cover, skip
  }

  // 3. Metadata file
  const metadata = [
    `Artista: ${artistName}`,
    `Album: ${album.title}`,
    `Subtitulo: ${album.subtitle}`,
    `Genero: Alternative / World`,
    `Ano: ${new Date().getFullYear()}`,
    ``,
    `Faixas:`,
    ...album.tracks.map(t => {
      const title = getTitle ? getTitle(album.slug, t.number, t.title) : t.title;
      return `${String(t.number).padStart(2, "0")}. ${title} (${t.lang === "PT" ? "Português" : "English"}) — ${Math.floor(t.durationSeconds / 60)}:${String(t.durationSeconds % 60).padStart(2, "0")}`;
    }),
    ``,
    `Distribuido via DistroKid`,
    `© ${new Date().getFullYear()} ${artistName}`,
  ].join("\n");
  zip.file(`${folderName}/metadata.txt`, metadata);

  // 4. Generate ZIP and download
  onProgress?.({ phase: "A criar ficheiro ZIP", current: total + 2, total: total + 2 });
  const zipBlob = await zip.generateAsync({ type: "blob" }, (meta) => {
    if (meta.percent) {
      onProgress?.({ phase: `A comprimir... ${Math.round(meta.percent)}%`, current: total + 2, total: total + 2 });
    }
  });

  // Download
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
