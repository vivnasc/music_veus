/**
 * Calendário de Distribuição — Loranne
 *
 * 39 álbuns com datas explícitas de lançamento no Spotify.
 *
 * Ritmo:
 *  - Já publicados: eter-raiz-vermelha (13 Abr), sangue-raiz (15 Abr),
 *    sangue-origem (17 Abr), nua-inteira (20 Abr).
 *  - Próximo: nua-por-dentro (sexta 24 Abr).
 *  - Férias — pausa depois de 24 Abr.
 *  - Regresso: nua-boa (terça 5 Mai) e nua-pele (sexta 8 Mai).
 *  - A partir daí, 1×/semana todas as sextas-feiras.
 *
 * Este ficheiro é a fonte de verdade para o calendário do Spotify.
 * O calendário de redes sociais e a página de lançamentos lêem daqui.
 */

export type LoranneRelease = {
  date: string; // YYYY-MM-DD — dia em que o álbum fica disponível no Spotify
  albumSlug: string;
  theme: string;
  description: string;
};

export type ProductionTheme = {
  id: string;
  theme: string;
  description: string;
  slugs: string[];
};

export const LORANNE_RELEASES: LoranneRelease[] = [
  // ─── Diáspora & Raiz — já publicados ───────────────────
  { date: "2026-04-13", albumSlug: "eter-raiz-vermelha", theme: "Diáspora & Raiz", description: "de onde vim, o que corre nas veias, o orgulho da origem" },
  { date: "2026-04-15", albumSlug: "sangue-raiz", theme: "Diáspora & Raiz", description: "de onde vim, o que corre nas veias, o orgulho da origem" },
  { date: "2026-04-17", albumSlug: "sangue-origem", theme: "Diáspora & Raiz", description: "de onde vim, o que corre nas veias, o orgulho da origem" },

  // ─── Mulher Inteira — transição para 1×/semana ─────────
  { date: "2026-04-20", albumSlug: "nua-inteira", theme: "Mulher Inteira", description: "ser mulher sem pedir desculpa — o que ninguém vê, o que se permite" },
  { date: "2026-04-24", albumSlug: "nua-por-dentro", theme: "Mulher Inteira", description: "ser mulher sem pedir desculpa — o que ninguém vê, o que se permite" },
  // férias
  { date: "2026-05-05", albumSlug: "nua-boa", theme: "Mulher Inteira", description: "ser mulher sem pedir desculpa — o que ninguém vê, o que se permite" },

  // ─── Mulher Inteira II ─────────────────────────────────
  { date: "2026-05-08", albumSlug: "nua-pele", theme: "Mulher Inteira II", description: "solteira como estado completo, pele como história, o corpo que é só teu" },
  { date: "2026-05-15", albumSlug: "nua-so", theme: "Mulher Inteira II", description: "solteira como estado completo, pele como história, o corpo que é só teu" },
  { date: "2026-05-22", albumSlug: "nua-meu", theme: "Mulher Inteira II", description: "solteira como estado completo, pele como história, o corpo que é só teu" },

  // ─── Amor Que Dói ──────────────────────────────────────
  { date: "2026-05-29", albumSlug: "nua-traco", theme: "Amor Que Dói", description: "traição, erosão, o amor que ficou pequeno" },
  { date: "2026-06-05", albumSlug: "nua-nao-era-amor", theme: "Amor Que Dói", description: "traição, erosão, o amor que ficou pequeno" },
  { date: "2026-06-12", albumSlug: "nua-pequeno-demais", theme: "Amor Que Dói", description: "traição, erosão, o amor que ficou pequeno" },

  // ─── Amor Que Dói II ───────────────────────────────────
  { date: "2026-06-19", albumSlug: "nua-romance", theme: "Amor Que Dói II", description: "o que não era amor, cartas não enviadas, romance que murcha" },
  { date: "2026-06-26", albumSlug: "nua-carta", theme: "Amor Que Dói II", description: "o que não era amor, cartas não enviadas, romance que murcha" },
  { date: "2026-07-03", albumSlug: "nua-longe-e-bem", theme: "Amor Que Dói II", description: "o que não era amor, cartas não enviadas, romance que murcha" },

  // ─── Maternidade ───────────────────────────────────────
  { date: "2026-07-10", albumSlug: "sangue-mae", theme: "Maternidade", description: "o corpo que gera, o luto sem funeral, os pais que ficam" },
  { date: "2026-07-17", albumSlug: "sangue-o-que-nao-nasceu", theme: "Maternidade", description: "o corpo que gera, o luto sem funeral, os pais que ficam" },
  { date: "2026-07-24", albumSlug: "sangue-ventre", theme: "Maternidade", description: "o corpo que gera, o luto sem funeral, os pais que ficam" },

  // ─── Raiva & Sombra ────────────────────────────────────
  { date: "2026-07-31", albumSlug: "incenso-fogo-engolido", theme: "Raiva & Sombra", description: "fogo engolido, cinzento, o espelho partido" },
  { date: "2026-08-07", albumSlug: "incenso-cinzento", theme: "Raiva & Sombra", description: "fogo engolido, cinzento, o espelho partido" },
  { date: "2026-08-14", albumSlug: "incenso-pele-exposta", theme: "Raiva & Sombra", description: "fogo engolido, cinzento, o espelho partido" },

  // ─── Saudade & Perda ───────────────────────────────────
  { date: "2026-08-21", albumSlug: "eter-fotografia-velha", theme: "Saudade & Perda", description: "fotografia velha, luto, sala vazia" },
  { date: "2026-08-28", albumSlug: "incenso-luto", theme: "Saudade & Perda", description: "fotografia velha, luto, sala vazia" },
  { date: "2026-09-04", albumSlug: "eter-sala-vazia", theme: "Saudade & Perda", description: "fotografia velha, luto, sala vazia" },

  // ─── Recomeço ──────────────────────────────────────────
  { date: "2026-09-11", albumSlug: "grao-segunda-vez", theme: "Recomeço", description: "segunda vez, fissuras, o primeiro passo depois do fim" },
  { date: "2026-09-18", albumSlug: "incenso-raiz-muda", theme: "Recomeço", description: "segunda vez, fissuras, o primeiro passo depois do fim" },
  { date: "2026-09-25", albumSlug: "incenso-teimosa", theme: "Recomeço", description: "segunda vez, fissuras, o primeiro passo depois do fim" },

  // ─── Ambição ───────────────────────────────────────────
  { date: "2026-10-02", albumSlug: "grao-fome-boa", theme: "Ambição", description: "fome boa, moeda, o tear, insónia de quem constrói" },
  { date: "2026-10-09", albumSlug: "grao-moeda", theme: "Ambição", description: "fome boa, moeda, o tear, insónia de quem constrói" },
  { date: "2026-10-16", albumSlug: "grao-insonia", theme: "Ambição", description: "fome boa, moeda, o tear, insónia de quem constrói" },

  // ─── Corpo & Tempo ─────────────────────────────────────
  { date: "2026-10-23", albumSlug: "nua-tempo-no-corpo", theme: "Corpo & Tempo", description: "corpo que envelhece, autocuidado, o prazer que é só teu" },
  { date: "2026-10-30", albumSlug: "nua-corpo-a-corpo", theme: "Corpo & Tempo", description: "corpo que envelhece, autocuidado, o prazer que é só teu" },
  { date: "2026-11-06", albumSlug: "nua-fogo-lento", theme: "Corpo & Tempo", description: "corpo que envelhece, autocuidado, o prazer que é só teu" },

  // ─── Alegria & Leveza ──────────────────────────────────
  { date: "2026-11-13", albumSlug: "grao-ferias", theme: "Alegria & Leveza", description: "férias, combustão, alegria que não pede licença" },
  { date: "2026-11-20", albumSlug: "grao-combustao", theme: "Alegria & Leveza", description: "férias, combustão, alegria que não pede licença" },
  { date: "2026-11-27", albumSlug: "mare-viva", theme: "Alegria & Leveza", description: "férias, combustão, alegria que não pede licença" },

  // ─── Quietude & Maré ───────────────────────────────────
  { date: "2026-12-04", albumSlug: "incenso-silencio-fertil", theme: "Quietude & Maré", description: "silêncio fértil, companhia própria, a maré que não se controla" },
  { date: "2026-12-11", albumSlug: "mare-companhia-propria", theme: "Quietude & Maré", description: "silêncio fértil, companhia própria, a maré que não se controla" },
  { date: "2026-12-18", albumSlug: "mare-brasa-lenta", theme: "Quietude & Maré", description: "silêncio fértil, companhia própria, a maré que não se controla" },
];

/**
 * Temas derivados automaticamente das LORANNE_RELEASES — preserva a ordem e
 * a agrupação temática usada pela UI (capítulos no calendário de produção).
 */
export const PRODUCTION_THEMES: ProductionTheme[] = (() => {
  const themes: ProductionTheme[] = [];
  const byTheme = new Map<string, ProductionTheme>();
  for (const r of LORANNE_RELEASES) {
    let t = byTheme.get(r.theme);
    if (!t) {
      t = { id: slugifyTheme(r.theme), theme: r.theme, description: r.description, slugs: [] };
      byTheme.set(r.theme, t);
      themes.push(t);
    }
    t.slugs.push(r.albumSlug);
  }
  return themes;
})();

function slugifyTheme(theme: string): string {
  return theme
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Lookup rápido: slug → data de lançamento ISO. */
export const LORANNE_RELEASE_DATES: Record<string, string> = Object.fromEntries(
  LORANNE_RELEASES.map((r) => [r.albumSlug, r.date]),
);

/** Lookup rápido: slug → tema/descrição. */
export const LORANNE_RELEASE_THEMES: Record<string, { theme: string; description: string }> = Object.fromEntries(
  LORANNE_RELEASES.map((r) => [r.albumSlug, { theme: r.theme, description: r.description }]),
);

// ─── Compatibilidade retroactiva ──────────────────────────
// Mantém a forma antiga ProductionWeek[] exportada para código existente.
// Agora cada "semana" é um tema; a estrutura seg/qua/sex é só um shim — os
// consumidores devem migrar para LORANNE_RELEASES quando precisarem de datas.

export type ProductionWeek = {
  id: string;
  theme: string;
  description: string;
  albums: {
    segunda: string;
    quarta: string;
    sexta: string;
  };
};

export const PRODUCTION_CALENDAR: ProductionWeek[] = PRODUCTION_THEMES.map((t) => ({
  id: t.id,
  theme: t.theme,
  description: t.description,
  albums: {
    segunda: t.slugs[0] ?? "",
    quarta: t.slugs[1] ?? "",
    sexta: t.slugs[2] ?? "",
  },
}));
