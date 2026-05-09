/**
 * Static lyrics index — separated from albums.ts so that public pages
 * (descobre, lista, coleccao, etc.) don't pull ~2.4MB of lyric strings
 * into the client bundle. Only modules that actually need the lyrics
 * (FullPlayer's lyrics tab, admin tools, FraseDoDia) should import
 * `getLyrics` from here.
 */

import { ESPELHO_LYRICS } from "./lyrics-espelhos";
import { NO_LYRICS } from "./lyrics-nos";
import { LIVRO_LYRICS, CURSO_LYRICS } from "./lyrics-livro-cursos";
import { ESPIRITUAL_LYRICS } from "./lyrics-espirituais";
import { VIDA_LYRICS } from "./lyrics-vida";
import { COSMIC_LYRICS } from "./lyrics-cosmic";
import { ROMANCE_LYRICS } from "./lyrics-romance";
import { EXPANSAO_LYRICS } from "./lyrics-expansao";
import { FASE1_LYRICS } from "./lyrics-fase1";
import { FASE1B_LYRICS } from "./lyrics-fase1b";
import { FASE2_LYRICS } from "./lyrics-fase2";
import { FIBRA_CORRIDA_LYRICS } from "./lyrics-fibra-corrida";
import { NOVOS_LYRICS } from "./lyrics-novos";
import { IMPORTADAS_LYRICS } from "./lyrics-importadas";
import { ELEVAR_LYRICS } from "./lyrics-elevar";

export const ALL_LYRICS: Record<string, string> = {
  ...ESPELHO_LYRICS,
  ...NO_LYRICS,
  ...LIVRO_LYRICS,
  ...CURSO_LYRICS,
  ...ESPIRITUAL_LYRICS,
  ...VIDA_LYRICS,
  ...COSMIC_LYRICS,
  ...ROMANCE_LYRICS,
  ...EXPANSAO_LYRICS,
  ...FASE1_LYRICS,
  ...FASE1B_LYRICS,
  ...FASE2_LYRICS,
  ...FIBRA_CORRIDA_LYRICS,
  ...NOVOS_LYRICS,
  ...IMPORTADAS_LYRICS,
  ...ELEVAR_LYRICS,
};

export function getLyrics(albumSlug: string, trackNumber: number): string {
  return ALL_LYRICS[`${albumSlug}/${trackNumber}`] || "";
}
