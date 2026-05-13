/**
 * Loranne — Persona vocal e de produção (formato VENNA, afinado)
 *
 * Esta é a "voz de produção" da Loranne, equivalente ao que VENNA tem na sua
 * Persona Seed (Honey Hour). Os blocos abaixo são prepended a cada lyrics
 * dos álbuns prioritários para garantir coerência vocal e travar drift de
 * sotaque ou estilo no Suno.
 *
 * Persona Seed: Goodnight World (mare-varanda-quente / 10) — voz já aprovada
 * Suno Voice ID: a8ad18d5-d23e-4c97-ad68-1006de7ac76d
 * URL: https://suno.com/voice/a8ad18d5-d23e-4c97-ad68-1006de7ac76d
 */

export const LORANNE_VOICE_ID = "a8ad18d5-d23e-4c97-ad68-1006de7ac76d";
export const LORANNE_VOICE_URL = `https://suno.com/voice/${LORANNE_VOICE_ID}`;

export const LORANNE_PERSONA_SEED = {
  albumSlug: "mare-varanda-quente",
  trackNumber: 10,
  trackTitle: "Goodnight World",
} as const;

// Bloco vocal — para letras em PT
export const LORANNE_VOCAL_SIGNATURE_PT = `[Vocal: ONE warm mezzo-contralto female voice, intimate speaking quality, slight breathiness on sustained notes, sings very close to the microphone, layered airy harmonies emerging only on choruses (3 voices max — root, third, fifth), no melisma, no belting, no riffs, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[Persona: Loranne — contemporary organic-electronic, AwakeSoul lineage, contemplative and transformative]`;

// Bloco vocal — para letras em EN
export const LORANNE_VOCAL_SIGNATURE_EN = `[Vocal: ONE warm mezzo-contralto female voice, intimate speaking quality, slight breathiness on sustained notes, sings very close to the microphone, layered airy harmonies emerging only on choruses (3 voices max — root, third, fifth), no melisma, no belting, no riffs, no autotune]
[CRITICAL: subtle international English accent, NOT American, NOT exaggerated British]
[Persona: Loranne — contemporary organic-electronic, AwakeSoul lineage, contemplative and transformative]`;

// Bloco vocal — para faixas em duet (Loranne lead + barítono masculino)
export const LORANNE_VOCAL_SIGNATURE_DUET_PT = `[Vocal: ONE warm mezzo-contralto female voice leading (Loranne) — intimate speaking quality, slight breathiness, close to the microphone. ONE warm baritone male voice (consistent throughout) entering on alternate verses, bridges and low harmonies — slightly husky, poetic, never aggressive, never dominant. Female vocal ALWAYS predominant: opens, closes, owns every chorus. Male vocal adds depth, never competes. No melisma, no belting, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[Persona: Loranne — contemporary organic-electronic, AwakeSoul lineage, contemplative and transformative]`;

export const LORANNE_VOCAL_SIGNATURE_DUET_EN = `[Vocal: ONE warm mezzo-contralto female voice leading (Loranne) — intimate speaking quality, slight breathiness, close to the microphone. ONE warm baritone male voice (consistent throughout) entering on alternate verses, bridges and low harmonies — slightly husky, poetic, never aggressive, never dominant. Female vocal ALWAYS predominant: opens, closes, owns every chorus. Male vocal adds depth, never competes. No melisma, no belting, no autotune]
[CRITICAL: subtle international English accent, NOT American, NOT exaggerated British]
[Persona: Loranne — contemporary organic-electronic, AwakeSoul lineage, contemplative and transformative]`;

export type PersonaLang = "PT" | "EN";
export type PersonaMode = "solo" | "duet";

// ─── Presença — bloco vocal especializado ────────────────────────────────────
// A coleção Presença (meditação cantada Loranne & Ancient Ground) usa sotaque
// **moçambicano de Maputo** (lusofonia africana, consoantes duras), NÃO o
// europeu da Loranne pop. O bloco abaixo segue exactamente o mesmo padrão que
// já cortou BR accent na Loranne ([Vocal:]+[CRITICAL:]+[Persona:]), mas afinado
// para a voz baixa/sussurrada do projecto e o sotaque pretendido.
export const LORANNE_PRESENCA_VOCAL_SIGNATURE = `[Vocal: ONE warm low-register female voice, intimate whisper-to-low-sung quality, very close to the microphone, slight breathiness, no vibrato, no melisma, no belting, no riffs, no autotune, layered female voices ONLY where the lyric explicitly says "layered voices"]
[CRITICAL: Mozambican Portuguese from Maputo only — African Lusophone accent, hard consonants, pronounce 'ti' as 'ti' not 'tchi', pronounce 'di' as 'di' not 'dji', no nasal drag, no open vowels, closed European-style vowels with African rhythm, gritty low register. NOT Brazilian Portuguese, NOT carioca, NOT paulista, NOT Lisbon European]
[Persona: Loranne — contemplative meditation, dhikr-like mantra repetition with development, presence, grounding, no performance]`;

export function presencaPersonaBlock(): string {
  return LORANNE_PRESENCA_VOCAL_SIGNATURE;
}

export function wrapPresencaLyrics(body: string): string {
  return `${LORANNE_PRESENCA_VOCAL_SIGNATURE}

${body.trim()}`;
}

export function lorannePersonaBlock(lang: PersonaLang, mode: PersonaMode = "solo"): string {
  if (mode === "duet") {
    return lang === "PT" ? LORANNE_VOCAL_SIGNATURE_DUET_PT : LORANNE_VOCAL_SIGNATURE_DUET_EN;
  }
  return lang === "PT" ? LORANNE_VOCAL_SIGNATURE_PT : LORANNE_VOCAL_SIGNATURE_EN;
}

// Default exclusion lock — aplicar em quase todas as faixas Loranne
// Travao para o Suno nao cair em afro/tropical por defeito
export const DEFAULT_EXCLUSION_LOCK = [
  "afrobeats",
  "afropop",
  "amapiano",
  "tropical",
];

// Variantes — para faixas que QUEREM afro (marrabenta, gospel-africano)
// pois nesses casos NAO se exclui afro mas exclui-se outras coisas
export const AFRO_FRIENDLY_EXCLUSION_LOCK = [
  "amapiano",
  "tropical reggaeton",
];

// Helper para construir wrapper de lyrics em formato VENNA-compativel
// Usado pelas letras dos albuns prioritarios.
export function wrapLyricsWithPersona(body: string, lang: PersonaLang, mode: PersonaMode = "solo"): string {
  return `${lorannePersonaBlock(lang, mode)}

${body.trim()}`;
}
