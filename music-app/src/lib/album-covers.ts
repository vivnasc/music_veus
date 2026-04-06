/**
 * Mapeamento de imagens da Loranne por espelho.
 *
 * Todas as collages foram cropadas em poses individuais em /poses/.
 * 63 poses extraidas + 1 hero = 64 imagens individuais.
 *
 * Collages originais (mantidas como referencia):
 * Loranne.png  — retrato principal (hero, ja individual)
 * Loranne2.png — 9 poses: corpo inteiro, movimento, danca
 * Loranne3.png — 9 poses: contemplativa, oracao
 * Loranne4.png — 9 poses: coberta, misteriosa, escondida
 * Loranne5.png — 8 poses: intima, deitada, vulneravel
 * Loranne6.png — 9 poses: close-ups introspectivos
 * Loranne7.png — 4 poses: retratos refinados
 * Loranne8.png — 4 poses: close-ups finais, revelacao
 * Loranne-velas.png — 4 poses: cenario cinematografico com velas
 * Loranne-veus-coloridos.png — 6 poses: cores por espelho
 */

import type { Album } from "@/data/albums";

// Nomes dos espelhos (sem prefixo "Véu" ou "Espelho")
export const ESPELHO_NAMES: Record<number, string> = {
  1: "Ilusão",
  2: "Medo",
  3: "Culpa",
  4: "Identidade",
  5: "Controlo",
  6: "Desejo",
  7: "Separação",
};

// Nomes como array indexado (posicao 0 vazia para alinhar com veu 1-7)
export const ESPELHO_NAMES_ARRAY = ["", "Ilusão", "Medo", "Culpa", "Identidade", "Controlo", "Desejo", "Separação"];

// Capa principal de cada espelho (melhor pose individual)
const ESPELHO_COVERS: Record<number, string> = {
  1: "/poses/loranne7-01.png",   // Ilusao — mao no rosto, revelacao elegante
  2: "/poses/loranne4-05.png",   // Medo — completamente coberta, de pe
  3: "/poses/loranne3-05.png",   // Culpa — oracao, maos juntas
  4: "/poses/loranne6-05.png",   // Identidade — sentada, maos no colo, introspectiva
  5: "/poses/loranne2-03.png",   // Controlo — danca com braco alto
  6: "/poses/loranne5-02.png",   // Desejo — intima, deitada, veu fluindo
  7: "/poses/loranne8-02.png",   // Separacao — mao no rosto, veu a soltar
};

// Capa de cada No (distinta do Espelho correspondente)
const NO_COVERS: Record<number, string> = {
  1: "/poses/loranne6-01.png",   // Heranca — close-up introspectivo, olhar maternal
  2: "/poses/loranne4-02.png",   // Silencio — coberta, misteriosa
  3: "/poses/loranne3-02.png",   // Sacrificio — contemplativa, entrega
  4: "/poses/loranne6-08.png",   // Vergonha — close-up, revelacao
  5: "/poses/loranne4-08.png",   // Solidao — coberta, isolamento
  6: "/poses/loranne5-05.png",   // Vazio — intima, vulneravel
  7: "/poses/loranne8-04.png",   // Pertenca — revelacao final
};

// Capa de cada curso (explicita, sem colisoes)
const CURSO_COVERS: Record<string, string> = {
  "curso-ouro-proprio":    "/poses/coloridos-01.png",   // Ouro Proprio — cores, dourado
  "curso-sangue-seda":     "/poses/loranne3-01.png",    // Sangue e Seda — contemplativa
  "curso-arte-inteireza":  "/poses/loranne2-01.png",    // Arte da Inteireza — movimento
  "curso-depois-fogo":     "/poses/velas-01.png",       // Depois do Fogo — velas, fogo
  "curso-olhos-abertos":   "/poses/loranne4-01.png",    // Olhos Abertos — coberta, nevoeiro
  "curso-pele-nua":        "/poses/loranne5-01.png",    // Pele Nua — intima, corpo
  "curso-limite-sagrado":  "/poses/loranne2-05.png",    // Limite Sagrado — movimento, forca
  "curso-flores-escuro":   "/poses/loranne3-07.png",    // Flores no Escuro — contemplacao profunda
  "curso-peso-chao":       "/poses/loranne4-03.png",    // Peso e o Chao — coberta, peso
  "curso-voz-dentro":      "/poses/loranne6-02.png",    // Voz de Dentro — close-up, voz
  "curso-fio-invisivel":   "/poses/loranne5-04.png",    // Fio Invisivel — intima, ligacao
  "curso-espelho-outro":   "/poses/loranne6-07.png",    // Espelho do Outro — close-up, reflexo
  "curso-silencio-grita":  "/poses/loranne4-06.png",    // Silencio que Grita — coberta, silencio
  "curso-teia":            "/poses/loranne3-03.png",    // Teia — contemplativa, ligacao
  "curso-chama":           "/poses/velas-03.png",       // Chama — velas, fogo
  "curso-mulher-mae":      "/poses/loranne5-06.png",    // Mulher Antes de Mae — intima
  "curso-oficio-ser":      "/poses/loranne2-07.png",    // Oficio de Ser — movimento, trabalho
  "curso-relogio":         "/poses/coloridos-03.png",   // Relogio Partido — cores, tempo
  "curso-coroa":           "/poses/loranne7-03.png",    // Coroa Escondida — retrato refinado
  "curso-fome":            "/poses/coloridos-05.png",   // Fome — cores, corpo
};

// Todas as poses disponiveis por serie (para rodar nos cursos e faixas)
export const ALL_POSES = [
  // Hero
  "/poses/loranne-hero.png",
  // Loranne2: movimento, danca (9 poses)
  "/poses/loranne2-01.png", "/poses/loranne2-02.png", "/poses/loranne2-03.png",
  "/poses/loranne2-04.png", "/poses/loranne2-05.png", "/poses/loranne2-06.png",
  "/poses/loranne2-07.png", "/poses/loranne2-08.png", "/poses/loranne2-09.png",
  // Loranne3: contemplacao, oracao (9 poses)
  "/poses/loranne3-01.png", "/poses/loranne3-02.png", "/poses/loranne3-03.png",
  "/poses/loranne3-04.png", "/poses/loranne3-05.png", "/poses/loranne3-06.png",
  "/poses/loranne3-07.png", "/poses/loranne3-08.png", "/poses/loranne3-09.png",
  // Loranne4: misteriosa, coberta (9 poses)
  "/poses/loranne4-01.png", "/poses/loranne4-02.png", "/poses/loranne4-03.png",
  "/poses/loranne4-04.png", "/poses/loranne4-05.png", "/poses/loranne4-06.png",
  "/poses/loranne4-07.png", "/poses/loranne4-08.png", "/poses/loranne4-09.png",
  // Loranne5: intima, vulneravel (8 poses)
  "/poses/loranne5-01.png", "/poses/loranne5-02.png", "/poses/loranne5-03.png",
  "/poses/loranne5-04.png", "/poses/loranne5-05.png", "/poses/loranne5-06.png",
  "/poses/loranne5-07.png", "/poses/loranne5-08.png",
  // Loranne6: close-ups introspectivos (9 poses)
  "/poses/loranne6-01.png", "/poses/loranne6-02.png", "/poses/loranne6-03.png",
  "/poses/loranne6-04.png", "/poses/loranne6-05.png", "/poses/loranne6-06.png",
  "/poses/loranne6-07.png", "/poses/loranne6-08.png", "/poses/loranne6-09.png",
  // Loranne7: retratos refinados (4 poses)
  "/poses/loranne7-01.png", "/poses/loranne7-02.png",
  "/poses/loranne7-03.png", "/poses/loranne7-04.png",
  // Loranne8: revelacao final (4 poses)
  "/poses/loranne8-01.png", "/poses/loranne8-02.png",
  "/poses/loranne8-03.png", "/poses/loranne8-04.png",
  // Velas: cenario cinematografico (4 poses)
  "/poses/velas-01.png", "/poses/velas-02.png",
  "/poses/velas-03.png", "/poses/velas-04.png",
  // Coloridos: cores por espelho (6 poses)
  "/poses/coloridos-01.png", "/poses/coloridos-02.png", "/poses/coloridos-03.png",
  "/poses/coloridos-04.png", "/poses/coloridos-05.png", "/poses/coloridos-06.png",
];

export function getAlbumCover(album: Album): string {
  // Espelhos — pose fixa por veu
  if (album.product === "espelho" && album.veu && ESPELHO_COVERS[album.veu]) {
    return ESPELHO_COVERS[album.veu];
  }
  // Nos — pose distinta do espelho correspondente
  if (album.product === "no" && album.veu && NO_COVERS[album.veu]) {
    return NO_COVERS[album.veu];
  }
  // Livro filosofico
  if (album.product === "livro") {
    return "/poses/velas-02.png";
  }
  // Cursos — pose explicita por slug
  if (album.product === "curso" && CURSO_COVERS[album.slug]) {
    return CURSO_COVERS[album.slug];
  }
  return "/poses/loranne-hero.png";
}

/**
 * URL para a capa de uma track via stream proxy.
 * O proxy tenta .jpg, .png, .jpeg, .webp no Supabase.
 * Retorna sempre um URL — o caller deve fazer probe (Image onload/onerror).
 */
export function getTrackCoverUrl(albumSlug: string, trackNumber: number): string {
  // Cache-bust every 5 minutes so new covers appear quickly after approval
  const cb = Math.floor(Date.now() / 300000);
  return `/api/music/stream?album=${encodeURIComponent(albumSlug)}&track=${trackNumber}&type=cover&v=${cb}`;
}

/** Label para o badge do album — so o nome, sem prefixo */
export function getAlbumBadge(album: Album): string | null {
  if (!album.veu) return null;
  return ESPELHO_NAMES[album.veu] || null;
}
