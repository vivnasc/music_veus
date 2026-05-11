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

const HYDRATED: Album[] = ALL_ALBUMS.map((a) => ({
  ...a,
  tracks: a.tracks.map((t) => ({
    ...t,
    lyrics: t.lyrics || getLyrics(a.slug, t.number),
  })),
}));

// Presença tracks already carry the full Suno custom-lyrics block in their
// `lyrics` field (built by getPresencaAlbumsAsAlbums), so no rehydration is
// needed.
const PRESENCA_AS_ALBUMS = getPresencaAlbumsAsAlbums();

export const ALL_ALBUMS_WITH_LYRICS: Album[] = [...HYDRATED, ...PRESENCA_AS_ALBUMS];
