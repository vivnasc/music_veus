/**
 * Manifesto de faixas com correcções de acentuação aplicadas na branch
 * claude/fix-album-accents-1htRZ. Lista usada pelo painel "Regenerar faixas
 * com letra corrigida" em /admin/producao para refazer apenas as faixas
 * afectadas, sem ter de procurar uma a uma.
 *
 * Cada entrada é (albumSlug, trackNumber). A ordem segue a ordem do álbum.
 */

export type AccentFixEntry = {
  albumSlug: string;
  trackNumber: number;
};

export const ACCENT_FIXES_MANIFEST: AccentFixEntry[] = [
  // HÚMUS
  { albumSlug: "incenso-humus", trackNumber: 1 },
  { albumSlug: "incenso-humus", trackNumber: 3 },
  { albumSlug: "incenso-humus", trackNumber: 5 },
  { albumSlug: "incenso-humus", trackNumber: 6 },
  { albumSlug: "incenso-humus", trackNumber: 7 },
  { albumSlug: "incenso-humus", trackNumber: 9 },

  // TRAVESSIA
  { albumSlug: "incenso-travessia", trackNumber: 1 },
  { albumSlug: "incenso-travessia", trackNumber: 3 },
  { albumSlug: "incenso-travessia", trackNumber: 5 },
  { albumSlug: "incenso-travessia", trackNumber: 6 },
  { albumSlug: "incenso-travessia", trackNumber: 7 },
  { albumSlug: "incenso-travessia", trackNumber: 8 },
  { albumSlug: "incenso-travessia", trackNumber: 9 },
  { albumSlug: "incenso-travessia", trackNumber: 10 },

  // DEMORA
  { albumSlug: "incenso-demora", trackNumber: 1 },
  { albumSlug: "incenso-demora", trackNumber: 3 },
  { albumSlug: "incenso-demora", trackNumber: 5 },
  { albumSlug: "incenso-demora", trackNumber: 7 },
  { albumSlug: "incenso-demora", trackNumber: 8 },
  { albumSlug: "incenso-demora", trackNumber: 9 },
  { albumSlug: "incenso-demora", trackNumber: 11 },

  // CORPO CELESTE
  { albumSlug: "incenso-corpo-celeste", trackNumber: 1 },
  { albumSlug: "incenso-corpo-celeste", trackNumber: 5 },
  { albumSlug: "incenso-corpo-celeste", trackNumber: 7 },
  { albumSlug: "incenso-corpo-celeste", trackNumber: 9 },

  // CORRENTEZA
  { albumSlug: "incenso-correnteza", trackNumber: 1 },
  { albumSlug: "incenso-correnteza", trackNumber: 3 },
  { albumSlug: "incenso-correnteza", trackNumber: 5 },
  { albumSlug: "incenso-correnteza", trackNumber: 7 },
  { albumSlug: "incenso-correnteza", trackNumber: 9 },
  { albumSlug: "incenso-correnteza", trackNumber: 10 },

  // O QUE RESTA
  { albumSlug: "incenso-o-que-resta", trackNumber: 1 },
  { albumSlug: "incenso-o-que-resta", trackNumber: 3 },
  { albumSlug: "incenso-o-que-resta", trackNumber: 5 },
  { albumSlug: "incenso-o-que-resta", trackNumber: 7 },
  { albumSlug: "incenso-o-que-resta", trackNumber: 9 },
  { albumSlug: "incenso-o-que-resta", trackNumber: 10 },
  { albumSlug: "incenso-o-que-resta", trackNumber: 11 },

  // LIMIAR
  { albumSlug: "incenso-limiar", trackNumber: 1 },
  { albumSlug: "incenso-limiar", trackNumber: 2 },
  { albumSlug: "incenso-limiar", trackNumber: 3 },
  { albumSlug: "incenso-limiar", trackNumber: 4 },
  { albumSlug: "incenso-limiar", trackNumber: 5 },
  { albumSlug: "incenso-limiar", trackNumber: 6 },
  { albumSlug: "incenso-limiar", trackNumber: 7 },
  { albumSlug: "incenso-limiar", trackNumber: 8 },
  { albumSlug: "incenso-limiar", trackNumber: 9 },
  { albumSlug: "incenso-limiar", trackNumber: 10 },

  // O CÍRCULO
  { albumSlug: "incenso-o-circulo", trackNumber: 1 },
  { albumSlug: "incenso-o-circulo", trackNumber: 5 },
  { albumSlug: "incenso-o-circulo", trackNumber: 7 },
  { albumSlug: "incenso-o-circulo", trackNumber: 9 },

  // O GESTO
  { albumSlug: "incenso-o-gesto", trackNumber: 1 },
  { albumSlug: "incenso-o-gesto", trackNumber: 3 },
  { albumSlug: "incenso-o-gesto", trackNumber: 4 },
  { albumSlug: "incenso-o-gesto", trackNumber: 5 },
  { albumSlug: "incenso-o-gesto", trackNumber: 6 },
  { albumSlug: "incenso-o-gesto", trackNumber: 7 },
  { albumSlug: "incenso-o-gesto", trackNumber: 8 },
  { albumSlug: "incenso-o-gesto", trackNumber: 9 },
  { albumSlug: "incenso-o-gesto", trackNumber: 10 },
  { albumSlug: "incenso-o-gesto", trackNumber: 11 },

  // NEVOEIRO
  { albumSlug: "incenso-nevoeiro", trackNumber: 7 },

  // SILÊNCIO FÉRTIL
  { albumSlug: "incenso-silencio-fertil", trackNumber: 1 },
  { albumSlug: "incenso-silencio-fertil", trackNumber: 3 },
  { albumSlug: "incenso-silencio-fertil", trackNumber: 7 },
  { albumSlug: "incenso-silencio-fertil", trackNumber: 8 },

  // DILÚVIO MANSO
  { albumSlug: "incenso-diluvio-manso", trackNumber: 1 },
  { albumSlug: "incenso-diluvio-manso", trackNumber: 3 },
  { albumSlug: "incenso-diluvio-manso", trackNumber: 5 },
  { albumSlug: "incenso-diluvio-manso", trackNumber: 7 },

  // ÂNCORA
  { albumSlug: "incenso-ancora", trackNumber: 1 },
  { albumSlug: "incenso-ancora", trackNumber: 3 },
  { albumSlug: "incenso-ancora", trackNumber: 5 },

  // RESCALDO
  { albumSlug: "incenso-rescaldo", trackNumber: 1 },
  { albumSlug: "incenso-rescaldo", trackNumber: 3 },
  { albumSlug: "incenso-rescaldo", trackNumber: 4 },
  { albumSlug: "incenso-rescaldo", trackNumber: 5 },

  // RAIZ MUDA
  { albumSlug: "incenso-raiz-muda", trackNumber: 1 },
  { albumSlug: "incenso-raiz-muda", trackNumber: 2 },
  { albumSlug: "incenso-raiz-muda", trackNumber: 4 },

  // RESSONÂNCIA
  { albumSlug: "incenso-ressonancia", trackNumber: 1 },
  { albumSlug: "incenso-ressonancia", trackNumber: 2 },
  { albumSlug: "incenso-ressonancia", trackNumber: 3 },
  { albumSlug: "incenso-ressonancia", trackNumber: 5 },
  { albumSlug: "incenso-ressonancia", trackNumber: 7 },

  // LUTO
  { albumSlug: "incenso-luto", trackNumber: 9 },
];
