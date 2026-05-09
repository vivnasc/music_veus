/**
 * Listas Curadas — Sete Veus Music
 *
 * Categorias:
 * - Generos (flavor): Organico, Marrabenta, House, Gospel
 * - Mood (energy): Sussurro, Constante, Pulso, Hino, Cru     (musical energy)
 * - Mood Loranne (espiritual): Elevar, Aterrar, Acordar, Lembrar, Reunir-se, Respirar, Atravessar
 * - Temas: curadas manualmente por tema emocional
 */

import { ALL_ALBUMS, type AlbumTrack } from "./albums";
import { LORANNE_MOODS, MOOD_META, type LoranneMood, type CompactMoodsData } from "./loranne-moods";
import LORANNE_MOODS_DATA from "./loranne-moods-data.json";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type TrackRef = {
  albumSlug: string;
  trackNumber: number;
};

export type CuratedList = {
  slug: string;
  title: string;
  subtitle: string;
  category: "genero" | "mood" | "tema";
  color: string;
  icon: string;
  tracks: TrackRef[];
};

export type ResolvedTrack = AlbumTrack & {
  albumSlug: string;
  albumTitle: string;
  albumColor: string;
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function allTracks(): Array<AlbumTrack & { albumSlug: string }> {
  return ALL_ALBUMS.flatMap(a =>
    a.tracks.map(t => ({ ...t, albumSlug: a.slug }))
  );
}

function byFlavor(flavor: string): TrackRef[] {
  return allTracks()
    .filter(t => t.flavor === flavor)
    .map(t => ({ albumSlug: t.albumSlug, trackNumber: t.number }));
}

function byEnergy(energy: string): TrackRef[] {
  return allTracks()
    .filter(t => t.energy === energy)
    .map(t => ({ albumSlug: t.albumSlug, trackNumber: t.number }));
}

// Filter tracks by Loranne mood (primary or secondary) using auto-tagged data.
// Uses compact format: tracks[key] = [moodsCsv, confidence]
const MOODS_DATA = LORANNE_MOODS_DATA as unknown as CompactMoodsData;
function byLoranneMood(mood: LoranneMood, primaryOnly = false): TrackRef[] {
  const refs: TrackRef[] = [];
  for (const [key, compact] of Object.entries(MOODS_DATA.tracks)) {
    const moods = compact[0].split(",");
    if (primaryOnly ? moods[0] === mood : moods.includes(mood)) {
      const m = key.match(/^(.+)\/(\d+)$/);
      if (m) refs.push({ albumSlug: m[1], trackNumber: parseInt(m[2], 10) });
    }
  }
  return refs;
}

// ─────────────────────────────────────────────
// GENEROS (by flavor)
// ─────────────────────────────────────────────

const GENERO_ORGANICO: CuratedList = {
  slug: "genero-organico",
  title: "Orgânico",
  subtitle: "O som base Loranne. Piano, cordas, pads, intimidade.",
  category: "genero",
  color: "#c9b896",
  icon: "leaf",
  tracks: byFlavor("organic"),
};

const GENERO_HOUSE: CuratedList = {
  slug: "genero-house",
  title: "House",
  subtitle: "Four-on-the-floor. Energia de pista com alma.",
  category: "genero",
  color: "#8aaaca",
  icon: "zap",
  tracks: byFlavor("house"),
};

const GENERO_GOSPEL: CuratedList = {
  slug: "genero-gospel",
  title: "Gospel",
  subtitle: "Coral, palmas, orgão. Hinos de libertação.",
  category: "genero",
  color: "#baaacc",
  icon: "sun",
  tracks: byFlavor("gospel"),
};

// ─────────────────────────────────────────────
// MOOD (by energy)
// ─────────────────────────────────────────────

const MOOD_SUSSURRO: CuratedList = {
  slug: "mood-sussurro",
  title: "Sussurro",
  subtitle: "Íntimo, contemplativo, antes de dormir.",
  category: "mood",
  color: "#666680",
  icon: "moon",
  tracks: byEnergy("whisper"),
};

const MOOD_CONSTANTE: CuratedList = {
  slug: "mood-constante",
  title: "Constante",
  subtitle: "Grounded, ritmo de caminhada, presença.",
  category: "mood",
  color: "#ab9375",
  icon: "footprints",
  tracks: byEnergy("steady"),
};

const MOOD_PULSO: CuratedList = {
  slug: "mood-pulso",
  title: "Pulso",
  subtitle: "Energia, movimento, para correr ou conduzir.",
  category: "mood",
  color: "#c08aaa",
  icon: "heart-pulse",
  tracks: byEnergy("pulse"),
};

const MOOD_HINO: CuratedList = {
  slug: "mood-hino",
  title: "Hino",
  subtitle: "Declarativo, forte, poder no peito.",
  category: "mood",
  color: "#C9A96E",
  icon: "crown",
  tracks: byEnergy("anthem"),
};

const MOOD_CRU: CuratedList = {
  slug: "mood-cru",
  title: "Cru",
  subtitle: "Sem filtro. Voz e verdade.",
  category: "mood",
  color: "#b07a7a",
  icon: "droplet",
  tracks: byEnergy("raw"),
};

// ─────────────────────────────────────────────
// TEMAS (curadas manualmente)
// ─────────────────────────────────────────────

const TEMA_AUTO_AMOR: CuratedList = {
  slug: "tema-auto-amor",
  title: "Auto-Amor",
  subtitle: "Ternura contigo mesma. Mereces sem provar.",
  category: "tema",
  color: "#c08aaa",
  icon: "heart",
  tracks: [
    { albumSlug: "espelho-culpa", trackNumber: 5 },     // Deserve
    { albumSlug: "espelho-culpa", trackNumber: 7 },     // Ternura
    { albumSlug: "espelho-ilusao", trackNumber: 6 },    // Honestidade Quieta
    { albumSlug: "espelho-identidade", trackNumber: 4 }, // Espelho Interior
    { albumSlug: "espelho-identidade", trackNumber: 7 }, // Eu Sem Justificacao
    { albumSlug: "espelho-desejo", trackNumber: 6 },    // Habitar o Desejo
    { albumSlug: "espelho-desejo", trackNumber: 7 },    // Inteira
    { albumSlug: "curso-pele-nua", trackNumber: 3 },    // Habitar
    { albumSlug: "curso-ouro-proprio", trackNumber: 4 }, // Abundance
    { albumSlug: "no-heranca", trackNumber: 5 },        // Desatar
  ],
};

const TEMA_AUTO_PODER: CuratedList = {
  slug: "tema-auto-poder",
  title: "Auto-Poder",
  subtitle: "A força que já tens. Coroa, não armadura.",
  category: "tema",
  color: "#C9A96E",
  icon: "crown",
  tracks: [
    { albumSlug: "espelho-identidade", trackNumber: 7 }, // Eu Sem Justificacao
    { albumSlug: "espelho-medo", trackNumber: 6 },      // Ouco-te Mas Vou
    { albumSlug: "espelho-controlo", trackNumber: 6 },   // Largar
    { albumSlug: "espelho-culpa", trackNumber: 5 },      // Deserve
    { albumSlug: "espelho-ilusao", trackNumber: 7 },     // O Veu Cai
    { albumSlug: "espelho-separacao", trackNumber: 7 },  // Sete Veus
    { albumSlug: "curso-limite-sagrado", trackNumber: 3 }, // Dizer Nao
    { albumSlug: "curso-coroa", trackNumber: 4 },          // Crown
    { albumSlug: "curso-chama", trackNumber: 3 },         // Fogo Controlado
    { albumSlug: "no-silencio", trackNumber: 5 },        // Voice
    { albumSlug: "incenso-maos-juntas", trackNumber: 7 }, // Dádiva
    { albumSlug: "incenso-aleluia", trackNumber: 5 },     // Hallelujah / peak
    { albumSlug: "incenso-coro", trackNumber: 9 },        // Eu Sou Porque Tu És
    { albumSlug: "incenso-de-pe", trackNumber: 1 },       // De Pé
    { albumSlug: "incenso-acende", trackNumber: 5 },      // Voltei
  ],
};

const TEMA_LIMITES: CuratedList = {
  slug: "tema-limites",
  title: "Limites",
  subtitle: "A muralha de luz que protege sem prender.",
  category: "tema",
  color: "#8aaaca",
  icon: "shield",
  tracks: [
    { albumSlug: "curso-limite-sagrado", trackNumber: 1 }, // Sem Muralha
    { albumSlug: "curso-limite-sagrado", trackNumber: 2 }, // A Linha
    { albumSlug: "curso-limite-sagrado", trackNumber: 3 }, // Dizer Nao
    { albumSlug: "curso-limite-sagrado", trackNumber: 4 }, // Com Porta
    { albumSlug: "espelho-controlo", trackNumber: 1 },     // Segurar
    { albumSlug: "espelho-controlo", trackNumber: 5 },     // Trust
    { albumSlug: "espelho-controlo", trackNumber: 6 },     // Largar
    { albumSlug: "espelho-medo", trackNumber: 6 },         // Ouco-te Mas Vou
    { albumSlug: "no-sacrificio", trackNumber: 4 },        // Dois Inteiros
    { albumSlug: "curso-chama", trackNumber: 3 },          // Fogo Controlado
  ],
};

const TEMA_RAIZES: CuratedList = {
  slug: "tema-raizes",
  title: "Raízes",
  subtitle: "O que veio antes de ti. Sangue, herança, pertença.",
  category: "tema",
  color: "#8b5c3e",
  icon: "tree-deciduous",
  tracks: [
    { albumSlug: "curso-sangue-seda", trackNumber: 1 }, // Raizes
    { albumSlug: "curso-sangue-seda", trackNumber: 2 }, // The Inner Mother
    { albumSlug: "curso-sangue-seda", trackNumber: 3 }, // Sangue
    { albumSlug: "curso-sangue-seda", trackNumber: 4 }, // Silk
    { albumSlug: "espelho-culpa", trackNumber: 4 },       // Heranca
    { albumSlug: "espelho-ilusao", trackNumber: 2 },      // The Coat I Never Chose
    { albumSlug: "no-heranca", trackNumber: 1 },          // O Silencio de Helena
    { albumSlug: "no-heranca", trackNumber: 3 },          // Duas Mulheres
    { albumSlug: "curso-ouro-proprio", trackNumber: 3 },  // Heranca Financeira
    { albumSlug: "no-pertenca", trackNumber: 4 },         // Reinventar
  ],
};

const TEMA_O_CORPO: CuratedList = {
  slug: "tema-o-corpo",
  title: "O Corpo",
  subtitle: "Voltar a habitar a pele. O corpo como casa.",
  category: "tema",
  color: "#C4745A",
  icon: "person-standing",
  tracks: [
    { albumSlug: "curso-pele-nua", trackNumber: 1 },     // Mapa do Corpo
    { albumSlug: "curso-pele-nua", trackNumber: 2 },     // Pele
    { albumSlug: "curso-pele-nua", trackNumber: 3 },     // Habitar
    { albumSlug: "curso-pele-nua", trackNumber: 4 },     // Nua
    { albumSlug: "espelho-ilusao", trackNumber: 5 },     // The Body Knows
    { albumSlug: "espelho-medo", trackNumber: 4 },       // O Estomago Sabe
    { albumSlug: "espelho-desejo", trackNumber: 3 },     // O Que o Corpo Pede
    { albumSlug: "espelho-controlo", trackNumber: 7 },   // Respirar
    { albumSlug: "curso-oficio-ser", trackNumber: 2 },    // Pause
    { albumSlug: "curso-fome", trackNumber: 1 },          // Mesa Vazia
    { albumSlug: "fibra-corpo-aberto", trackNumber: 1 },  // Corpo Aberto
    { albumSlug: "fibra-sangue-aceso", trackNumber: 1 },  // Sangue Aceso
    { albumSlug: "fibra-barra-carregada", trackNumber: 1 }, // Barra Carregada
    { albumSlug: "fibra-asfalto-vivo", trackNumber: 1 },  // Asfalto Vivo
    { albumSlug: "fibra-corpo-acorda", trackNumber: 1 },  // Corpo Acorda
  ],
};

const TEMA_RECOMECAR: CuratedList = {
  slug: "tema-recomecar",
  title: "Recomeçar",
  subtitle: "Depois do fogo, nascem flores.",
  category: "tema",
  color: "#6b8e5a",
  icon: "sprout",
  tracks: [
    { albumSlug: "curso-depois-fogo", trackNumber: 1 }, // Cinzas
    { albumSlug: "curso-depois-fogo", trackNumber: 2 }, // Ember
    { albumSlug: "curso-depois-fogo", trackNumber: 3 }, // Broto
    { albumSlug: "curso-depois-fogo", trackNumber: 4 }, // Different
    { albumSlug: "espelho-separacao", trackNumber: 4 },    // Separar
    { albumSlug: "espelho-separacao", trackNumber: 5 },    // Rebuild
    { albumSlug: "espelho-separacao", trackNumber: 6 },    // Raizes no Ar
    { albumSlug: "espelho-separacao", trackNumber: 7 },    // Sete Veus
    { albumSlug: "no-pertenca", trackNumber: 4 },          // Reinventar
    { albumSlug: "curso-relogio", trackNumber: 4 },       // Present
    { albumSlug: "incenso-acende", trackNumber: 1 },      // Pequena Chama
    { albumSlug: "incenso-acende", trackNumber: 2 },      // Coming Back
    { albumSlug: "incenso-acende", trackNumber: 5 },      // Voltei
    { albumSlug: "incenso-acende", trackNumber: 9 },      // Cá Estou
    { albumSlug: "incenso-volta-a-mim", trackNumber: 1 }, // Volta a Mim
    { albumSlug: "grao-primeiro-passo", trackNumber: 1 }, // Primeiro Passo
    { albumSlug: "grao-segunda-vez", trackNumber: 1 },    // Segunda Vez
  ],
};

const TEMA_O_SILENCIO: CuratedList = {
  slug: "tema-o-silencio",
  title: "O Silêncio",
  subtitle: "O que vive no que não se diz.",
  category: "tema",
  color: "#666680",
  icon: "volume-x",
  tracks: [
    { albumSlug: "no-silencio", trackNumber: 1 },         // Dois Corpos Quietos
    { albumSlug: "no-silencio", trackNumber: 2 },         // O Que Cala
    { albumSlug: "no-silencio", trackNumber: 3 },         // Espaco Entre
    { albumSlug: "no-heranca", trackNumber: 1 },           // O Silencio de Helena
    { albumSlug: "no-heranca", trackNumber: 4 },           // O Que Nunca Foi Dito
    { albumSlug: "espelho-medo", trackNumber: 1 },         // Cuidado
    { albumSlug: "espelho-medo", trackNumber: 7 },         // Devagar
    { albumSlug: "curso-voz-dentro", trackNumber: 1 },     // Silêncio
    { albumSlug: "curso-voz-dentro", trackNumber: 2 },     // Echo
    { albumSlug: "curso-silencio-grita", trackNumber: 1 }, // Caverna Muda
  ],
};

const TEMA_ATENCAO: CuratedList = {
  slug: "tema-atencao",
  title: "Atenção",
  subtitle: "Acordar do automatismo. Ver o que estava à frente.",
  category: "tema",
  color: "#7E57C2",
  icon: "eye",
  tracks: [
    { albumSlug: "eter-olhos-arregalados", trackNumber: 1 }, // Olhos Arregalados
    { albumSlug: "incenso-norte-interno", trackNumber: 1 },  // Norte Interno
    { albumSlug: "incenso-raiz-muda", trackNumber: 1 },      // Raiz Muda
    { albumSlug: "incenso-ressonancia", trackNumber: 1 },    // Ressonância
    { albumSlug: "curso-voz-dentro", trackNumber: 1 },       // Silêncio
    { albumSlug: "curso-voz-dentro", trackNumber: 2 },       // Echo
    { albumSlug: "curso-silencio-grita", trackNumber: 1 },   // Caverna Muda
    { albumSlug: "espelho-ilusao", trackNumber: 7 },         // O Veu Cai
    { albumSlug: "incenso-acende", trackNumber: 1 },         // Pequena Chama
    { albumSlug: "grao-primeira-luz", trackNumber: 1 },      // Primeira Luz
  ],
};

const TEMA_CUIDADO: CuratedList = {
  slug: "tema-cuidado",
  title: "Cuidado",
  subtitle: "Os gestos pequenos que te lembram que estás aqui.",
  category: "tema",
  color: "#D4A0B0",
  icon: "hand-heart",
  tracks: [
    { albumSlug: "grao-porcelana", trackNumber: 1 },          // Porcelana
    { albumSlug: "nua-beijo-na-testa", trackNumber: 1 },      // Beijo na Testa
    { albumSlug: "incenso-maos-juntas", trackNumber: 1 },     // Corpo Que Me Leva
    { albumSlug: "incenso-maos-juntas", trackNumber: 4 },     // Enough
    { albumSlug: "espelho-culpa", trackNumber: 7 },           // Ternura
    { albumSlug: "espelho-culpa", trackNumber: 5 },           // Deserve
    { albumSlug: "incenso-maos-abertas", trackNumber: 1 },    // Mãos Abertas
    { albumSlug: "incenso-rescaldo", trackNumber: 1 },        // Rescaldo
    { albumSlug: "grao-pao-sal", trackNumber: 1 },            // O Pão e o Sal
    { albumSlug: "grao-no-de-ouro", trackNumber: 1 },         // Nó de Ouro
  ],
};

const TEMA_A_MAE: CuratedList = {
  slug: "tema-a-mae",
  title: "A Mãe",
  subtitle: "A relação que te fez. A que carregas. A que te falta.",
  category: "tema",
  color: "#B0344A",
  icon: "baby",
  tracks: [
    { albumSlug: "sangue-mae", trackNumber: 1 },              // Mãe
    { albumSlug: "curso-sangue-seda", trackNumber: 2 },       // The Inner Mother
    { albumSlug: "no-heranca", trackNumber: 1 },              // O Silêncio de Helena
    { albumSlug: "no-heranca", trackNumber: 3 },              // Duas Mulheres
    { albumSlug: "espelho-culpa", trackNumber: 4 },           // Herança
    { albumSlug: "sangue-ventre", trackNumber: 1 },           // Ventre
    { albumSlug: "sangue-linhagem", trackNumber: 1 },         // Linhagem
    { albumSlug: "no-heranca", trackNumber: 4 },              // O Que Nunca Foi Dito
    { albumSlug: "espelho-ilusao", trackNumber: 2 },          // The Coat I Never Chose
    { albumSlug: "sangue-o-que-nao-nasceu", trackNumber: 1 }, // O Que Não Nasceu
  ],
};

const TEMA_CASA: CuratedList = {
  slug: "tema-casa",
  title: "Casa",
  subtitle: "O lugar onde se chega. Pertença, mesa, abrigo.",
  category: "tema",
  color: "#C9B896",
  icon: "house",
  tracks: [
    { albumSlug: "grao-pao-sal", trackNumber: 1 },           // O Pão e o Sal
    { albumSlug: "grao-toalha-posta", trackNumber: 1 },      // Toalha Posta
    { albumSlug: "grao-abrigo", trackNumber: 1 },            // Abrigo
    { albumSlug: "grao-porta-aberta", trackNumber: 1 },      // Porta Aberta
    { albumSlug: "grao-terra-molhada", trackNumber: 1 },     // Terra Molhada
    { albumSlug: "no-pertenca", trackNumber: 4 },            // Reinventar
    { albumSlug: "incenso-ancora", trackNumber: 1 },         // Âncora
    { albumSlug: "mare-varanda-quente", trackNumber: 1 },    // Varanda Quente
    { albumSlug: "incenso-coro", trackNumber: 3 },           // A Casa de Outra
    { albumSlug: "incenso-volta-a-mim", trackNumber: 1 },    // Volta a Mim
  ],
};

const TEMA_SAUDADE: CuratedList = {
  slug: "tema-saudade",
  title: "Saudade",
  subtitle: "A falta que ensina o tamanho do amor.",
  category: "tema",
  color: "#7AABBA",
  icon: "cloud-fog",
  tracks: [
    { albumSlug: "nua-longe-e-bem", trackNumber: 1 },        // Longe e Bem
    { albumSlug: "eter-fotografia-velha", trackNumber: 1 },  // Fotografia Velha
    { albumSlug: "eter-amanha-inventado", trackNumber: 1 },  // Amanhã Inventado
    { albumSlug: "nua-traco", trackNumber: 1 },              // Traço
    { albumSlug: "sangue-o-que-nao-nasceu", trackNumber: 1 }, // O Que Não Nasceu
    { albumSlug: "mare-tardes-vazias", trackNumber: 1 },     // Tardes Vazias
    { albumSlug: "incenso-luto", trackNumber: 1 },           // Luto
    { albumSlug: "eter-sala-vazia", trackNumber: 1 },        // Sala Vazia
    { albumSlug: "no-heranca", trackNumber: 4 },             // O Que Nunca Foi Dito
    { albumSlug: "incenso-diluvio-manso", trackNumber: 1 },  // Dilúvio Manso
  ],
};

const TEMA_TEMPO: CuratedList = {
  slug: "tema-tempo",
  title: "Tempo",
  subtitle: "Estações, idade, ciclos. O corpo como calendário.",
  category: "tema",
  color: "#C9A96E",
  icon: "hourglass",
  tracks: [
    { albumSlug: "grao-estacoes", trackNumber: 1 },          // Estações
    { albumSlug: "mare-viva", trackNumber: 1 },              // Maré Viva
    { albumSlug: "nua-tempo-no-corpo", trackNumber: 1 },     // Tempo no Corpo
    { albumSlug: "grao-segunda-vez", trackNumber: 1 },       // Segunda Vez
    { albumSlug: "curso-relogio", trackNumber: 4 },          // Present
    { albumSlug: "mare-penumbra", trackNumber: 1 },          // Penumbra
    { albumSlug: "grao-espelho-agua", trackNumber: 1 },      // Espelho d'Água
    { albumSlug: "grao-sal-na-pele", trackNumber: 1 },       // Sal na Pele
    { albumSlug: "grao-abrigo", trackNumber: 1 },            // Abrigo
    { albumSlug: "grao-insonia", trackNumber: 1 },           // Insónia
  ],
};

const TEMA_SOLIDAO_BOA: CuratedList = {
  slug: "tema-solidao-boa",
  title: "Solidão Boa",
  subtitle: "A companhia de ti mesma. Estar só sem estar perdida.",
  category: "tema",
  color: "#7A7A8B",
  icon: "user",
  tracks: [
    { albumSlug: "mare-companhia-propria", trackNumber: 1 }, // Companhia Própria
    { albumSlug: "nua-so", trackNumber: 1 },                 // Só
    { albumSlug: "eter-sala-vazia", trackNumber: 1 },        // Sala Vazia
    { albumSlug: "grao-insonia", trackNumber: 1 },           // Insónia
    { albumSlug: "grao-ferias", trackNumber: 1 },            // Férias
    { albumSlug: "no-silencio", trackNumber: 1 },            // Dois Corpos Quietos
    { albumSlug: "mare-luz-mansa", trackNumber: 1 },         // Luz Mansa
    { albumSlug: "mare-lua-acordada", trackNumber: 1 },      // Lua Acordada
    { albumSlug: "incenso-silencio-fertil", trackNumber: 1 }, // Silêncio Fértil
    { albumSlug: "mare-tardes-vazias", trackNumber: 1 },     // Tardes Vazias
  ],
};

const TEMA_ROMANCE: CuratedList = {
  slug: "tema-romance",
  title: "Romance",
  subtitle: "Intimidade adulta. O amor que se escolhe e se serve.",
  category: "tema",
  color: "#9B4A5A",
  icon: "flame",
  tracks: [
    { albumSlug: "nua-corpo-a-corpo", trackNumber: 1 },      // Corpo a Corpo
    { albumSlug: "espelho-desejo", trackNumber: 6 },         // Habitar o Desejo
    { albumSlug: "espelho-desejo", trackNumber: 3 },         // O Que o Corpo Pede
    { albumSlug: "espelho-desejo", trackNumber: 7 },         // Inteira
    { albumSlug: "nua-pequeno-demais", trackNumber: 1 },     // Pequeno Demais
    { albumSlug: "nua-nao-era-amor", trackNumber: 1 },       // Não Era Amor
    { albumSlug: "grao-no-de-ouro", trackNumber: 1 },        // Nó de Ouro
    { albumSlug: "incenso-pele-exposta", trackNumber: 1 },   // Pele Exposta
    { albumSlug: "no-sacrificio", trackNumber: 4 },          // Dois Inteiros
    { albumSlug: "grao-combustao", trackNumber: 1 },         // Combustão
    { albumSlug: "fibra-corpo-aberto", trackNumber: 1 },     // Corpo Aberto
  ],
};

// ─────────────────────────────────────────────
// VIBES (energy + flavor combinations)
// ─────────────────────────────────────────────

function byEnergyAndFlavor(energies: string[], flavors: string[]): TrackRef[] {
  return allTracks()
    .filter(t => energies.includes(t.energy || "whisper") && flavors.includes(t.flavor || "organic"))
    .map(t => ({ albumSlug: t.albumSlug, trackNumber: t.number }));
}

function byEnergyAndProduct(energies: string[], products: string[]): TrackRef[] {
  const productSlugs = new Set(
    ALL_ALBUMS.filter(a => products.includes(a.product)).map(a => a.slug)
  );
  return allTracks()
    .filter(t => energies.includes(t.energy || "whisper") && productSlugs.has(t.albumSlug))
    .map(t => ({ albumSlug: t.albumSlug, trackNumber: t.number }));
}

const VIBE_CHILL_SUNSET: CuratedList = {
  slug: "vibe-chill-sunset",
  title: "Chill Sunset",
  subtitle: "Pôr-do-sol, varanda, o dia a abrandar.",
  category: "mood",
  color: "#E8956A",
  icon: "sunset",
  tracks: byEnergyAndFlavor(["whisper", "steady"], ["house", "bossa"]),
};

const VIBE_RUNNING: CuratedList = {
  slug: "vibe-running",
  title: "Running",
  subtitle: "Chill house para correr em modo meditação.",
  category: "mood",
  color: "#E85D3A",
  icon: "flame",
  tracks: byEnergyAndProduct(["whisper", "steady"], ["fibra"]),
};

const VIBE_MORNING: CuratedList = {
  slug: "vibe-morning",
  title: "Chill Morning",
  subtitle: "O corpo acorda antes da mente.",
  category: "mood",
  color: "#5A8FA0",
  icon: "sunrise",
  tracks: [
    ...allTracks()
      .filter(t => {
        const lower = (t.prompt || "").toLowerCase() + " " + (t.description || "").toLowerCase();
        return (lower.includes("dawn") || lower.includes("morning") || lower.includes("sunrise") || lower.includes("amanhecer") || lower.includes("acorda") || lower.includes("manhã") || lower.includes("5:45") || lower.includes("6am"))
          && ["whisper", "steady"].includes(t.energy || "whisper");
      })
      .map(t => ({ albumSlug: t.albumSlug, trackNumber: t.number })),
  ],
};

const VIBE_NIGHT_WALK: CuratedList = {
  slug: "vibe-night-walk",
  title: "Night Walk",
  subtitle: "A noite é de quem não tem pressa.",
  category: "mood",
  color: "#2A2D5E",
  icon: "moon",
  tracks: [
    ...allTracks()
      .filter(t => {
        const lower = (t.prompt || "").toLowerCase() + " " + (t.description || "").toLowerCase();
        return (lower.includes("night") || lower.includes("nocturnal") || lower.includes("noite") || lower.includes("lua") || lower.includes("moon") || lower.includes("midnight") || lower.includes("neon") || lower.includes("3am"))
          && ["whisper", "steady"].includes(t.energy || "whisper");
      })
      .map(t => ({ albumSlug: t.albumSlug, trackNumber: t.number })),
  ],
};

const VIBE_RAINY_DAY: CuratedList = {
  slug: "vibe-rainy-day",
  title: "Rainy Day",
  subtitle: "Chuva na janela, chá frio, sesta.",
  category: "mood",
  color: "#6A9AB0",
  icon: "cloud-rain",
  tracks: [
    ...allTracks()
      .filter(t => {
        const lower = (t.prompt || "").toLowerCase() + " " + (t.description || "").toLowerCase();
        return (lower.includes("rain") || lower.includes("chuva") || lower.includes("storm") || lower.includes("thunder") || lower.includes("trovão") || lower.includes("puddle") || lower.includes("drip") || lower.includes("wet"))
          && ["whisper", "steady"].includes(t.energy || "whisper");
      })
      .map(t => ({ albumSlug: t.albumSlug, trackNumber: t.number })),
  ],
};

const VIBE_BODY_FLOW: CuratedList = {
  slug: "vibe-body-flow",
  title: "Body Flow",
  subtitle: "Yoga, alongamento, o corpo que flui.",
  category: "mood",
  color: "#C4745A",
  icon: "wind",
  tracks: [
    ...allTracks()
      .filter(t => {
        const lower = (t.prompt || "").toLowerCase() + " " + (t.description || "").toLowerCase();
        return (lower.includes("stretch") || lower.includes("breath") || lower.includes("yoga") || lower.includes("flow") || lower.includes("corpo") || lower.includes("respirar") || lower.includes("body") || lower.includes("movement"))
          && ["whisper", "steady", "raw"].includes(t.energy || "whisper");
      })
      .map(t => ({ albumSlug: t.albumSlug, trackNumber: t.number })),
  ],
};

const VIBE_AFRO_GROOVE: CuratedList = {
  slug: "vibe-afro-groove",
  title: "Afro Groove",
  subtitle: "Marrabenta, afrobeat, raízes quentes.",
  category: "genero",
  color: "#D4875A",
  icon: "drum",
  tracks: byEnergyAndFlavor(["whisper", "steady", "pulse"], ["marrabenta", "afrobeat"]),
};

const VIBE_JAZZ_NIGHT: CuratedList = {
  slug: "vibe-jazz-night",
  title: "Jazz Night",
  subtitle: "Rhodes, late-night, smoky.",
  category: "genero",
  color: "#4A5A7A",
  icon: "music",
  tracks: byFlavor("jazz"),
};

const VIBE_BOSSA: CuratedList = {
  slug: "vibe-bossa-nova",
  title: "Bossa Nova",
  subtitle: "Nylon guitar, swaying, velvet.",
  category: "genero",
  color: "#7A9A6A",
  icon: "music-2",
  tracks: byFlavor("bossa"),
};

const VIBE_DANCE: CuratedList = {
  slug: "vibe-dance",
  title: "Dance",
  subtitle: "House, funk, afrobeat — o corpo que não pára.",
  category: "mood",
  color: "#D44A8A",
  icon: "sparkles",
  tracks: byEnergyAndFlavor(["pulse", "anthem", "steady"], ["house", "funk", "afrobeat", "marrabenta"]),
};

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────

export const GENEROS: CuratedList[] = [
  GENERO_ORGANICO,
  GENERO_HOUSE,
  GENERO_GOSPEL,
  VIBE_AFRO_GROOVE,
  VIBE_JAZZ_NIGHT,
  VIBE_BOSSA,
];

export const MOODS: CuratedList[] = [
  MOOD_SUSSURRO,
  MOOD_CONSTANTE,
  MOOD_PULSO,
  MOOD_HINO,
  MOOD_CRU,
];

// ─────────────────────────────────────────────
// MOODS LORANNE (espirituais — auto-tagged)
// elevar · aterrar · acordar · lembrar · reunir-se · respirar · atravessar
// ─────────────────────────────────────────────

const MOOD_ICONS: Record<LoranneMood, string> = {
  "elevar": "sun",
  "aterrar": "mountain",
  "acordar": "eye",
  "lembrar": "tree-pine",
  "reunir-se": "users-round",
  "respirar": "wind",
  "atravessar": "door-open",
};

export const MOODS_LORANNE: CuratedList[] = LORANNE_MOODS.map((mood) => {
  const meta = MOOD_META[mood];
  return {
    slug: `mood-loranne-${meta.slug}`,
    title: meta.label,
    subtitle: meta.paraQuem,
    category: "mood" as const,
    color: meta.color,
    icon: MOOD_ICONS[mood],
    tracks: byLoranneMood(mood),
  };
});

export const VIBES: CuratedList[] = [
  VIBE_CHILL_SUNSET,
  VIBE_RUNNING,
  VIBE_MORNING,
  VIBE_NIGHT_WALK,
  VIBE_RAINY_DAY,
  VIBE_BODY_FLOW,
  VIBE_DANCE,
];

export const TEMAS: CuratedList[] = [
  TEMA_AUTO_AMOR,
  TEMA_AUTO_PODER,
  TEMA_LIMITES,
  TEMA_RAIZES,
  TEMA_O_CORPO,
  TEMA_RECOMECAR,
  TEMA_O_SILENCIO,
  TEMA_ATENCAO,
  TEMA_CUIDADO,
  TEMA_A_MAE,
  TEMA_CASA,
  TEMA_SAUDADE,
  TEMA_TEMPO,
  TEMA_SOLIDAO_BOA,
  TEMA_ROMANCE,
];

export const ALL_LISTS: CuratedList[] = [
  ...VIBES,
  ...GENEROS,
  ...MOODS_LORANNE,  // os 7 moods espirituais aparecem antes da energia
  ...MOODS,
  ...TEMAS,
];

/** Resolve track references to full track objects */
export function resolveList(list: CuratedList): ResolvedTrack[] {
  const albumMap = new Map(ALL_ALBUMS.map(a => [a.slug, a]));
  return list.tracks.flatMap(ref => {
    const album = albumMap.get(ref.albumSlug);
    if (!album) return [];
    const track = album.tracks.find(t => t.number === ref.trackNumber);
    if (!track) return [];
    return [{
      ...track,
      albumSlug: album.slug,
      albumTitle: album.title,
      albumColor: album.color,
    }];
  });
}
