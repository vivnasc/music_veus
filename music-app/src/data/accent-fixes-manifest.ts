/**
 * Manifesto de faixas com correcções de acentuação a regenerar.
 *
 * Cada entrada é (albumSlug, trackNumber). A ordem segue a ordem do álbum.
 *
 * Estado:
 * - Incenso (commits 0395c7a) → JÁ REGENERADO E APROVADO.
 *   Removido do manifesto para evitar regenerar tudo outra vez.
 * - Não-Incenso (commit 0d8becf) → pendente.
 */

export type AccentFixEntry = {
  albumSlug: string;
  trackNumber: number;
};

export const ACCENT_FIXES_MANIFEST: AccentFixEntry[] = [
  // ESPELHOS (espelho product)
  { albumSlug: "espelho-ilusao", trackNumber: 2 },
  { albumSlug: "espelho-ilusao", trackNumber: 5 },
  { albumSlug: "espelho-medo", trackNumber: 2 },
  { albumSlug: "espelho-medo", trackNumber: 6 },
  { albumSlug: "espelho-culpa", trackNumber: 3 },
  { albumSlug: "espelho-identidade", trackNumber: 5 },
  { albumSlug: "espelho-controlo", trackNumber: 2 },
  { albumSlug: "espelho-controlo", trackNumber: 7 },
  { albumSlug: "espelho-separacao", trackNumber: 1 },
  { albumSlug: "espelho-separacao", trackNumber: 6 },

  // LIVRO + CURSOS
  { albumSlug: "livro-filosofico", trackNumber: 3 },
  { albumSlug: "livro-filosofico", trackNumber: 5 },
  { albumSlug: "livro-filosofico", trackNumber: 6 },
  { albumSlug: "curso-ouro-proprio", trackNumber: 3 },
  { albumSlug: "curso-ouro-proprio", trackNumber: 5 },
  { albumSlug: "curso-sangue-seda", trackNumber: 1 },
  { albumSlug: "curso-sangue-seda", trackNumber: 3 },
  { albumSlug: "curso-depois-fogo", trackNumber: 1 },
  { albumSlug: "curso-olhos-abertos", trackNumber: 3 },
  { albumSlug: "curso-pele-nua", trackNumber: 1 },
  { albumSlug: "curso-pele-nua", trackNumber: 3 },
  { albumSlug: "curso-limite-sagrado", trackNumber: 1 },
  { albumSlug: "curso-flores-escuro", trackNumber: 1 },
  { albumSlug: "curso-relogio", trackNumber: 3 },
  { albumSlug: "curso-silencio-grita", trackNumber: 1 },
  { albumSlug: "curso-silencio-grita", trackNumber: 3 },
  { albumSlug: "curso-teia", trackNumber: 1 },
  { albumSlug: "curso-mulher-mae", trackNumber: 3 },
  { albumSlug: "curso-oficio-ser", trackNumber: 1 },
  { albumSlug: "curso-oficio-ser", trackNumber: 3 },

  // NOS (no product)
  { albumSlug: "no-heranca", trackNumber: 1 },
  { albumSlug: "no-pertenca", trackNumber: 1 },
  { albumSlug: "no-silencio", trackNumber: 3 },
  { albumSlug: "no-solidao", trackNumber: 2 },
  { albumSlug: "no-vazio", trackNumber: 1 },
  { albumSlug: "no-vergonha", trackNumber: 1 },
  { albumSlug: "no-vergonha", trackNumber: 4 },

  // VIDA não-Incenso (grao, mare, sangue, fibra, nua)
  { albumSlug: "grao-luz-crua", trackNumber: 1 },
  { albumSlug: "grao-pao-sal", trackNumber: 1 },
  { albumSlug: "grao-porcelana", trackNumber: 1 },
  { albumSlug: "grao-porcelana", trackNumber: 6 },
  { albumSlug: "grao-deriva", trackNumber: 3 },
  { albumSlug: "grao-deriva", trackNumber: 4 },
  { albumSlug: "grao-deriva", trackNumber: 5 },
  { albumSlug: "grao-descalca", trackNumber: 5 },
  { albumSlug: "mare-penumbra", trackNumber: 4 },
  { albumSlug: "mare-rendicao", trackNumber: 6 },
  { albumSlug: "mare-viva", trackNumber: 7 },
  { albumSlug: "sangue-linhagem", trackNumber: 2 },
  { albumSlug: "sangue-linhagem", trackNumber: 5 },
  { albumSlug: "fibra-sangue-aceso", trackNumber: 3 },
  { albumSlug: "fibra-sangue-aceso", trackNumber: 7 },
  { albumSlug: "nua-corpo-a-corpo", trackNumber: 5 },
];
