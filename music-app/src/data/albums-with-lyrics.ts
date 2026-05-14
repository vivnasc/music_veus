/**
 * Same as ALL_ALBUMS but with each track's `lyrics` field hydrated from
 * the static lyrics index. Use this in admin tools and any code that needs
 * to read or iterate lyrics; public pages should keep using the lyric-less
 * `ALL_ALBUMS` from "@/data/albums" to avoid bundling ~2.4MB of strings.
 *
 * Inclui os álbuns Presença (Loranne & Ancient Ground) adaptados ao
 * formato Album, para que /admin/producao consiga gerar via Suno usando
 * a mesma persona da Loranne (LORANNE_VOICE_ID).
 */

import { ALL_ALBUMS, type Album } from "./albums";
import { getLyrics } from "./all-lyrics";
import { getPresencaAlbumsAsAlbums } from "./presenca";

// ALL_ALBUMS já contém Presença via getPresencaAlbumsAsAlbumsPublic (versão
// SEM lyrics, para reduzir o bundle das páginas públicas). Aqui filtramos
// essas entradas antes de re-adicionar a versão completa COM lyrics — caso
// contrário ficavam ambas e .find() encontrava primeiro a versão vazia.
const HYDRATED: Album[] = ALL_ALBUMS
  .filter((a) => a.product !== "presenca")
  .map((a) => ({
    ...a,
    tracks: a.tracks.map((t) => ({
      ...t,
      lyrics: t.lyrics || getLyrics(a.slug, t.number),
    })),
  }));

// Versão Presença COM lyrics completos (bloco Suno custom-mode em cada track).
const PRESENCA_AS_ALBUMS = getPresencaAlbumsAsAlbums();

export const ALL_ALBUMS_WITH_LYRICS: Album[] = [...HYDRATED, ...PRESENCA_AS_ALBUMS];
