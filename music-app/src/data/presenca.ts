/**
 * Presença — coleção de meditação cantada (Loranne & Ancient Ground).
 *
 * 7 sub-colecções funcionais × ~7 álbuns × 7 faixas = ~343 mantras.
 * Cada sub-coleção responde a uma necessidade humana concreta.
 *
 * Dados parseados de /PRESENÇA_Project/*.md pelo script
 * scripts/build-presenca.mjs. Para regerar: `node scripts/build-presenca.mjs`.
 *
 * Destino: YouTube e site Sete Ecos. NÃO vai para Apple Music nem DistroKid.
 */

import PRESENCA_DATA from "./presenca-data.json";
import type { Album, AlbumTrack } from "./albums";

// Nota: o bloco [Vocal:]+[CRITICAL:]+[Persona:] está embebido directamente
// no início de cada t.sunoPrompt no source .md (PRESENÇA_Project/*.md).
// Não fazemos wrap em runtime aqui para não duplicar o bloco — a fonte é
// canónica.

// ─── Types ───────────────────────────────────────────────────────────────────

export type PresencaSubSlug =
  | "medo"
  | "magoa"
  | "apatia"
  | "inquietacao"
  | "sufoco"
  | "confusao"
  | "vazio";

export type PresencaInstrumental = {
  sounds: string;
  key: string;
  bpm: string;
};

export type PresencaLayers = {
  ray: string;
  solfeggio: string;
  chakra: string;
  element: string;
  tradition: string;
};

export type PresencaSub = {
  slug: PresencaSubSlug;
  order: number;
  label: string;
  funcao: string;
  albumCount: number;
  instrumental: PresencaInstrumental | null;
  layers: PresencaLayers | null;
  eixo: string;
};

export type PresencaTrack = {
  number: number;
  title: string;
  position: string;
  flag: "aprovada" | null | string;
  concept: string;
  sunoPrompt: string;
  style: string;
};

export type PresencaAlbum = {
  number: number;
  slug: string;
  title: string;
  subLabel: string;
  funcao: string;
  horaInterior: string;
  tracks: PresencaTrack[];
  sourceFile?: string;
};

export type PresencaData = {
  manifestoExcerpt: string;
  subs: PresencaSub[];
  albums: Record<PresencaSubSlug, PresencaAlbum[]>;
};

// ─── Editorial metadata (visual identity) ────────────────────────────────────
// Cor + ícone + descrição curta para cada sub-coleção, usada em /descobre,
// /presenca e /admin/presenca. Inspirado nas tabelas do MAPA-DECIDIDO.md.

export const PRESENCA_SUB_META: Record<PresencaSubSlug, {
  color: string;
  paraQuando: string;
  verbo: string;
}> = {
  medo:         { color: "#6B4A2E", paraQuando: "para enraizar quando estás dispersa", verbo: "Enraizar" },
  magoa:        { color: "#3A6EA5", paraQuando: "para acolher quando o coração dói",   verbo: "Acolher" },
  apatia:       { color: "#C25A2B", paraQuando: "para acender quando estás apagada",   verbo: "Acender" },
  inquietacao:  { color: "#7E9A8C", paraQuando: "para clarear quando a mente está turva", verbo: "Clarear" },
  sufoco:       { color: "#8C7AA5", paraQuando: "para alinhar quando há algo a ser dito", verbo: "Alinhar" },
  confusao:     { color: "#D4B66A", paraQuando: "para ver quando estás cega de tanto ruído", verbo: "Ver" },
  vazio:        { color: "#3D4A5C", paraQuando: "para pousar quando o dia foi muito",   verbo: "Pousar" },
};

// ─── Data accessors ──────────────────────────────────────────────────────────

const TYPED_DATA = PRESENCA_DATA as unknown as PresencaData;

export const PRESENCA_MANIFESTO = TYPED_DATA.manifestoExcerpt;
export const PRESENCA_SUBS: PresencaSub[] = TYPED_DATA.subs;

export function getSub(slug: string): PresencaSub | undefined {
  return PRESENCA_SUBS.find((s) => s.slug === slug);
}

export function getAlbumsForSub(slug: PresencaSubSlug): PresencaAlbum[] {
  return TYPED_DATA.albums[slug] ?? [];
}

export function getAlbum(subSlug: PresencaSubSlug, albumSlug: string): PresencaAlbum | undefined {
  return getAlbumsForSub(subSlug).find((a) => a.slug === albumSlug);
}

/** Cover URL convention — same Supabase bucket as the rest. */
export function presencaSubCoverUrl(sub: PresencaSubSlug, version?: number): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const v = version ?? 1;
  return `${base}/storage/v1/object/public/audios/presenca-covers/${sub}.jpg?v=${v}`;
}

export function presencaAlbumCoverUrl(sub: PresencaSubSlug, albumSlug: string, version?: number): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const v = version ?? 1;
  return `${base}/storage/v1/object/public/audios/presenca-covers/${sub}/${albumSlug}.jpg?v=${v}`;
}

/**
 * Adapta um álbum Presença para o formato `Album` usado pela pipeline
 * /admin/producao da Loranne. Mapeamento:
 *   - slug:    "presenca-{sub}-{album-slug}" — namespace separado no storage
 *   - prompt:  o campo `style` (vai para o input Style do Suno)
 *   - lyrics:  o bloco bracketed completo com [Verse 1 - whispered ...] +
 *              texto (vai para o input Lyrics do Suno em custom mode)
 *
 * A persona já configurada na pipeline (Loranne voice ID) aplica-se
 * automaticamente.
 */
/**
 * Encurta o `concept` (que costuma ser uma explicação literal de várias
 * frases) para algo mais próximo do tom editorial das outras colecções:
 * curto, evocativo, sem explicar demasiado.
 *
 * Estratégia: primeira oração (split por `.`/`!`/`?`), trim, capitalizada.
 * Se ainda for >70 chars, corta na vírgula/travessão.
 */
function shortenConcept(c: string | undefined | null): string {
  if (!c) return "";
  const firstSentence = c.split(/[.!?]/)[0].trim();
  let s = firstSentence.length <= 70
    ? firstSentence
    : firstSentence.split(/[,—–-]/)[0].trim();
  if (s.length > 80) s = s.slice(0, 77) + "…";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getPresencaAlbumsAsAlbums(): Album[] {
  const result: Album[] = [];
  for (const sub of PRESENCA_SUBS) {
    const meta = PRESENCA_SUB_META[sub.slug];
    const albums = getAlbumsForSub(sub.slug);
    for (const album of albums) {
      const tracks: AlbumTrack[] = album.tracks.map((t) => ({
        number: t.number,
        title: t.title,
        description: shortenConcept(t.concept) || album.title,
        lang: "PT",
        energy: "whisper",
        flavor: null,
        vocalMode: "solo",
        // Style instructions → Suno "Style" field
        prompt: t.style || "african meditation, contemplative ambient, presence, grounding, no performance, mantra repetition with development, low female voice, Mozambican Portuguese from Maputo only, hard consonants, no Brazilian",
        // Bracketed Suno custom lyrics block → Suno "Lyrics" field.
        // O bloco [Vocal:]+[CRITICAL:]+[Persona:] já vem embebido no início
        // do sunoPrompt (parseado do .md). Não voltar a aplicar aqui.
        lyrics: t.sunoPrompt,
        durationSeconds: 480,
        audioUrl: null,
        bpm: sub.instrumental ? Number(sub.instrumental.bpm.split("-")[0]) || undefined : undefined,
        signatureElement: sub.instrumental?.sounds,
      }));
      result.push({
        slug: `presenca-${sub.slug}-${album.slug}`,
        title: album.title,
        subtitle: shortenConcept(album.funcao) || sub.label,
        artist: "Loranne & Ancient Ground",
        product: "presenca",
        color: meta.color,
        tracks,
        status: "ready",
        distribution: false,
        distrokidUploadDate: null,
      });
    }
  }
  return result;
}

/**
 * Versão pública dos álbuns Presença — sem o campo `lyrics` (que contém
 * o bloco Suno completo de ~2KB por faixa). Para uso em páginas públicas
 * como NovidadesSection, descobre, etc., que não precisam de letras mas
 * precisam dos álbuns no índice global `ALL_ALBUMS`.
 */
export function getPresencaAlbumsAsAlbumsPublic(): Album[] {
  return getPresencaAlbumsAsAlbums().map((a) => ({
    ...a,
    tracks: a.tracks.map((t) => ({ ...t, lyrics: undefined })),
  }));
}

/** Stats — quantas faixas têm prompt Suno escrito (pronto para geração) vs. ainda por escrever. */
export function presencaStats(): {
  totalAlbumsPlanned: number;
  totalAlbumsWritten: number;
  totalTracksPlanned: number;
  totalTracksWritten: number;
  totalTracksApproved: number;
} {
  const totalAlbumsPlanned = PRESENCA_SUBS.reduce((n, s) => n + s.albumCount, 0);
  const totalTracksPlanned = totalAlbumsPlanned * 7;
  let totalAlbumsWritten = 0;
  let totalTracksWritten = 0;
  let totalTracksApproved = 0;
  for (const sub of PRESENCA_SUBS) {
    const albums = getAlbumsForSub(sub.slug);
    totalAlbumsWritten += albums.length;
    for (const album of albums) {
      for (const t of album.tracks) {
        if (t.sunoPrompt) totalTracksWritten++;
        if (t.flag === "aprovada") totalTracksApproved++;
      }
    }
  }
  return {
    totalAlbumsPlanned,
    totalAlbumsWritten,
    totalTracksPlanned,
    totalTracksWritten,
    totalTracksApproved,
  };
}
