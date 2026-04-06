/**
 * Share URL utilities — short URLs for cleaner sharing.
 *
 * music.seteveus.space/o/pele-7  instead of
 * music.seteveus.space/partilha/nua-pele/7
 */

const SLUG_TO_SHORT: Record<string, string> = {
  // Romance
  "nua-pele": "pele",
  "nua-carta": "carta",
  "nua-saudade": "saudade",
  "nua-fogo-lento": "fogo",
  "nua-ninho": "ninho",
  // Cosmic
  "eter-viagem": "viagem",
  "eter-orbita": "orbita",
  "eter-poeira": "poeira",
  "eter-vasto": "vasto",
  "eter-sinal": "sinal",
  "eter": "eter",
  // Espelhos
  "espelho-ilusao": "ilusao",
  "espelho-medo": "medo",
  "espelho-culpa": "culpa",
  "espelho-identidade": "identidade",
  "espelho-controlo": "controlo",
  "espelho-desejo": "desejo",
  "espelho-separacao": "separacao",
  // Nos
  "no-heranca": "heranca",
  "no-silencio": "silencio",
  "no-sacrificio": "sacrificio",
  "no-vergonha": "vergonha",
  "no-solidao": "solidao",
  "no-vazio": "vazio",
  "no-pertenca": "pertenca",
};

// Reverse mapping: short → slug
const SHORT_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_TO_SHORT).map(([slug, short]) => [short, slug])
);

/** Parse a short code like "pele-7" → { albumSlug, trackNumber } */
export function parseShareCode(code: string): { albumSlug: string; trackNumber: number } | null {
  const match = code.match(/^(.+)-(\d+)$/);
  if (!match) return null;
  const [, shortName, trackStr] = match;
  const slug = SHORT_TO_SLUG[shortName] || shortName;
  return { albumSlug: slug, trackNumber: parseInt(trackStr, 10) };
}

/** Build the short share path: /o/pele-7 */
export function getSharePath(albumSlug: string, trackNumber: number): string {
  const short = SLUG_TO_SHORT[albumSlug];
  if (short) {
    return `/o/${short}-${trackNumber}`;
  }
  return `/o/${albumSlug}-${trackNumber}`;
}

/** Build the full share URL */
export function getShareUrl(albumSlug: string, trackNumber: number): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${getSharePath(albumSlug, trackNumber)}`;
}
