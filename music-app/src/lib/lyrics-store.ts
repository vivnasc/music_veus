"use client";

/**
 * Client-side lyrics persistence — POR FAVOR USAR SEMPRE ESTE HELPER.
 *
 * Regra de ouro: nunca deixar letras apenas em React state. Tudo o que o
 * utilizador escreve, cola ou importa tem de passar por aqui.
 *
 * Ordem de escrita:
 *  1. localStorage SEMPRE (backup imediato, nunca se perde).
 *  2. Servidor (Supabase) em paralelo — se falhar, o localStorage fica como
 *     fonte de verdade até conseguir sincronizar.
 *
 * Antes deste ficheiro, o fluxo era:
 *   fetch(POST /api/admin/track-lyrics).catch(() => {})
 * O servidor respondia `ok: true` mesmo quando a tabela não existia, o
 * client engolia erros, e letras importadas desapareciam em silêncio.
 * Agora:
 *   - localStorage é autoritativo até prova em contrário (sobrevive ao F5).
 *   - Erros reais do servidor propagam-se e são mostrados ao utilizador.
 */

import { adminFetch } from "./admin-fetch";

const LS_KEY = "veus:lyrics-cache-v1";
const LS_PENDING_KEY = "veus:lyrics-pending-v1";

export type LyricsCache = Record<string, string>; // "album_slug/track_number" → lyrics
export type PendingWrite = { album_slug: string; track_number: number; lyrics: string; savedAt: string };

// ── localStorage primitives ──────────────────────────────────

function readCache(): LyricsCache {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(LS_KEY) || "{}") as LyricsCache; }
  catch { return {}; }
}

function writeCache(map: LyricsCache): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(map)); } catch {}
}

function readPending(): PendingWrite[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(LS_PENDING_KEY) || "[]") as PendingWrite[]; }
  catch { return []; }
}

function writePending(list: PendingWrite[]): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LS_PENDING_KEY, JSON.stringify(list)); } catch {}
}

function key(albumSlug: string, trackNumber: number): string {
  return `${albumSlug}/${trackNumber}`;
}

// ── API pública ──────────────────────────────────────────────

export function getLocalLyrics(albumSlug: string, trackNumber: number): string | null {
  const cache = readCache();
  return cache[key(albumSlug, trackNumber)] ?? null;
}

export function listLocalLyrics(): LyricsCache {
  return readCache();
}

export function hasPendingWrites(): boolean {
  return readPending().length > 0;
}

/**
 * Guarda uma letra. Nunca lança; devolve o estado do save para a UI mostrar.
 *
 * Se `lyrics` for string vazia/apenas whitespace, interpretamos como pedido
 * para REMOVER o override — o que faz o app cair automaticamente para a
 * versão em código (lyrics-importadas.ts / lyrics-*.ts). Isto garante que
 * apagar na UI não perde a letra de forma definitiva.
 *
 * ETAPA 1 — localStorage (síncrono). Se falhar aqui, algo de muito estranho
 *   se passa (quota cheia?) mas tentamos na mesma a Supabase.
 * ETAPA 2 — Supabase via API. Se falhar, adicionamos à fila pending.
 */
export async function saveLyrics(
  albumSlug: string,
  trackNumber: number,
  lyrics: string,
): Promise<{ localOk: boolean; remoteOk: boolean; error?: string; missingTable?: boolean; deleted?: boolean }> {
  const isEmpty = !lyrics || lyrics.trim() === "";

  // ETAPA 1 — localStorage
  let localOk = false;
  try {
    const cache = readCache();
    if (isEmpty) delete cache[key(albumSlug, trackNumber)];
    else cache[key(albumSlug, trackNumber)] = lyrics;
    writeCache(cache);
    localOk = true;
  } catch (e) {
    return { localOk: false, remoteOk: false, error: `localStorage: ${String(e)}` };
  }

  // ETAPA 2 — servidor
  try {
    const res = await adminFetch("/api/admin/track-lyrics", {
      method: isEmpty ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isEmpty
          ? { album_slug: albumSlug, track_number: trackNumber }
          : { album_slug: albumSlug, track_number: trackNumber, lyrics },
      ),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.erro) {
      enqueuePending({ album_slug: albumSlug, track_number: trackNumber, lyrics, savedAt: new Date().toISOString() });
      return {
        localOk,
        remoteOk: false,
        error: data.erro || `HTTP ${res.status}`,
        missingTable: !!data.missingTable,
      };
    }
    return { localOk, remoteOk: true, deleted: isEmpty };
  } catch (e) {
    enqueuePending({ album_slug: albumSlug, track_number: trackNumber, lyrics, savedAt: new Date().toISOString() });
    return { localOk, remoteOk: false, error: String(e) };
  }
}

function enqueuePending(w: PendingWrite): void {
  const list = readPending();
  // substitui entrada existente para a mesma faixa
  const filtered = list.filter((p) => !(p.album_slug === w.album_slug && p.track_number === w.track_number));
  filtered.push(w);
  writePending(filtered);
}

/** Tenta ressincronizar pending writes para a Supabase. */
export async function flushPending(): Promise<{ sent: number; failed: number }> {
  const list = readPending();
  if (list.length === 0) return { sent: 0, failed: 0 };
  const remaining: PendingWrite[] = [];
  let sent = 0;
  for (const w of list) {
    try {
      const res = await adminFetch("/api/admin/track-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ album_slug: w.album_slug, track_number: w.track_number, lyrics: w.lyrics }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && !data.erro) sent++;
      else remaining.push(w);
    } catch {
      remaining.push(w);
    }
  }
  writePending(remaining);
  return { sent, failed: remaining.length };
}

/**
 * Carrega todas as letras do servidor; se a tabela não existir ou falhar,
 * devolve o que tiver no localStorage.
 */
export async function loadAllLyrics(): Promise<{ map: LyricsCache; source: "server" | "local"; error?: string }> {
  try {
    const res = await adminFetch("/api/admin/track-lyrics");
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.lyrics) {
      // Fundir com o cache local (o local pode ter escritas ainda não sincronizadas)
      const serverMap: LyricsCache = {};
      for (const [k, v] of Object.entries(data.lyrics)) {
        // API legada usava formato "slug-tN" — converter para "slug/N"
        const m = k.match(/^(.+)-t(\d+)$/);
        if (m) serverMap[`${m[1]}/${m[2]}`] = v as string;
        else serverMap[k] = v as string;
      }
      const localMap = readCache();
      const merged = { ...serverMap, ...localMap }; // local tem prioridade — writes pending
      writeCache(merged);
      return { map: merged, source: "server" };
    }
    return { map: readCache(), source: "local", error: data.erro };
  } catch (e) {
    return { map: readCache(), source: "local", error: String(e) };
  }
}

/**
 * Descarrega todas as letras em cache como ficheiro JSON. Último recurso
 * antes de apagar algo ou mudar de browser.
 */
export function downloadBackup(): void {
  if (typeof window === "undefined") return;
  const cache = readCache();
  const blob = new Blob([JSON.stringify(cache, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `veus-lyrics-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
