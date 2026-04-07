/**
 * Loranne artist images — clean photos without text, grouped by mood.
 * Used for reels/shorts to pick a contextually appropriate artist image.
 */

const LORANNE_IMAGES: Record<string, string[]> = {
  spiritual: ["/poses/velas-01.png", "/poses/velas-02.png", "/poses/velas-03.png", "/poses/velas-04.png"],
  intimate: ["/poses/loranne8-01.png", "/poses/loranne8-02.png", "/poses/loranne8-03.png", "/poses/loranne8-04.png", "/poses/loranne6-01.png", "/poses/loranne6-02.png", "/poses/loranne6-03.png"],
  movement: ["/poses/loranne3-01.png", "/poses/loranne3-02.png", "/poses/loranne3-03.png", "/poses/loranne3-04.png", "/poses/loranne3-05.png", "/poses/loranne3-06.png", "/poses/loranne3-07.png", "/poses/loranne3-09.png"],
  contemplative: ["/poses/loranne5-01.png", "/poses/loranne5-02.png", "/poses/loranne5-03.png", "/poses/loranne5-04.png", "/poses/loranne5-05.png", "/poses/loranne5-06.png", "/poses/loranne5-07.png", "/poses/loranne5-08.png"],
  vulnerable: ["/poses/loranne6-04.png", "/poses/loranne6-05.png", "/poses/loranne6-06.png", "/poses/loranne6-07.png", "/poses/loranne6-09.png"],
  warm: ["/poses/loranne4-01.png", "/poses/loranne4-02.png", "/poses/loranne4-03.png", "/poses/loranne4-04.png", "/poses/loranne4-05.png", "/poses/loranne4-06.png", "/poses/loranne4-07.png", "/poses/loranne4-08.png", "/poses/loranne4-09.png"],
  strong: ["/poses/loranne7-01.png", "/poses/loranne7-02.png", "/poses/loranne7-03.png", "/poses/loranne7-04.png"],
  classic: ["/poses/loranne2-01.png", "/poses/loranne2-02.png", "/poses/loranne2-03.png", "/poses/loranne2-04.png", "/poses/loranne2-05.png", "/poses/loranne2-06.png", "/poses/loranne2-07.png", "/poses/loranne2-09.png"],
  iconic: ["/Loranne.png", "/poses/loranne-hero.png"],
};

import { ALL_ALBUMS } from "@/data/albums";

export function getImageMood(albumSlug: string): string {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  if (!album) return "iconic";
  const p = album.product;
  if (p === "incenso") return "spiritual";
  if (p === "nua") return "intimate";
  if (p === "fibra") return "movement";
  if (p === "mare") return "contemplative";
  if (p === "grao") return "warm";
  if (p === "sangue") return "vulnerable";
  if (p === "no") return "strong";
  if (p === "eter") return "contemplative";
  if (p === "espelho") return "classic";
  if (p === "livro" || p === "curso") return "warm";
  return "iconic";
}

export function pickLorannImages(albumSlug: string, trackNumber: number, count: number): string[] {
  const mood = getImageMood(albumSlug);
  const images = LORANNE_IMAGES[mood] || LORANNE_IMAGES.iconic;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(images[(trackNumber - 1 + i) % images.length]);
  }
  return result;
}
