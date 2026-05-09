/**
 * Same as ALL_ALBUMS but with each track's `lyrics` field hydrated from
 * the static lyrics index. Use this in admin tools and any code that needs
 * to read or iterate lyrics; public pages should keep using the lyric-less
 * `ALL_ALBUMS` from "@/data/albums" to avoid bundling ~2.4MB of strings.
 */

import { ALL_ALBUMS, type Album } from "./albums";
import { getLyrics } from "./all-lyrics";

export const ALL_ALBUMS_WITH_LYRICS: Album[] = ALL_ALBUMS.map((a) => ({
  ...a,
  tracks: a.tracks.map((t) => ({
    ...t,
    lyrics: t.lyrics || getLyrics(a.slug, t.number),
  })),
}));
