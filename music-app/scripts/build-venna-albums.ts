/**
 * build-venna-albums
 *
 * Lê /VENNA/PARTE-{1..4}.md e gera src/data/venna-albums.ts.
 * VENNA tem 10 álbuns × 7 faixas (algumas reutilizam faixas do Álbum 1
 * "Mango Hour" como abertura — markdown marca-as com "(do Álbum 1)").
 *
 * Formato do .md:
 *   # ÁLBUM N — TITLE
 *   *subtítulo italic*
 *
 *   ## N.M — TRACK_TITLE [✅ APPROVED] [🔞]
 *   **BPM:** 118 · **Signature:** ... · **Mood:** ...
 *
 *   **STYLE:**
 *   ```
 *   ...
 *   ```
 *
 *   **LYRICS:**
 *   ```
 *   ...
 *   ```
 *
 * Faixas marcadas "(do Álbum 1)" não trazem STYLE/LYRICS — copiam-se da
 * faixa canónica do Álbum 1 (lookup por título normalizado).
 *
 * Usage:
 *   cd music-app && npx tsx scripts/build-venna-albums.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const REPO_ROOT = resolve(__dirname, "..", "..");
const PARTS = [1, 2, 3, 4].map((i) => resolve(REPO_ROOT, "VENNA", `PARTE-${i}.md`));
const OUTPUT = resolve(__dirname, "..", "src", "data", "venna-albums.ts");

// Slug + cor + subtitle por nº de álbum (paleta VENNA — mango, honey,
// terracotta, wine, sunset). Subtitles curtos em PT, sem travessão.
const ALBUM_META: Record<number, { slug: string; title: string; color: string; subtitle: string }> = {
  1:  { slug: "venna-mango-hour",       title: "Mango Hour",          color: "#F5803E", subtitle: "Romance que dança, desejo que sorri" },
  2:  { slug: "venna-honey-cities",     title: "Honey Cities",        color: "#E8B14A", subtitle: "Cidades sem nome, cada faixa um lugar à hora certa" },
  3:  { slug: "venna-slow-down",        title: "Slow Down",           color: "#A14E2C", subtitle: "Flerte, atrevimento, mulher no controlo" },
  4:  { slug: "venna-wine-velvet",      title: "Wine & Velvet",       color: "#3D1B2C", subtitle: "Noites longas, jantares, sensualidade adulta" },
  5:  { slug: "venna-saturday-forever", title: "Saturday Forever",    color: "#E89B8C", subtitle: "Fim de semana, dança, euforia leve" },
  6:  { slug: "venna-closer",           title: "Closer",              color: "#D4A574", subtitle: "Intimidade do amor estabelecido" },
  7:  { slug: "venna-skin-memory",      title: "Skin Memory",         color: "#5C2538", subtitle: "Desejo, memória corporal, atrevimento maduro" },
  8:  { slug: "venna-sunset-club",      title: "Sunset Club",         color: "#C9A24E", subtitle: "Chill house, after-hours, lounge dançável" },
  9:  { slug: "venna-heart-bassline",   title: "Heart Like A Bassline", color: "#E76C7E", subtitle: "Pop dance brilhante, refrões grandes" },
  10: { slug: "venna-tonight",          title: "VENNA Tonight",       color: "#E89A4E", subtitle: "Manifesto, álbum de assinatura" },
};

// Descrições editoriais curtas em PT (estilo Loranne, sem travessão).
// Apenas para tracks NOVAS (originais). As reusadas herdam a descrição da
// faixa canónica. Para faixas sem entrada aqui, usamos o "Mood:" do .md
// como fallback.
const TRACK_DESCRIPTIONS: Record<string, string> = {
  // Album 1 — Mango Hour
  "venna-mango-hour/1": "A hora doce em que ninguém quer ir embora",
  "venna-mango-hour/2": "Uma terça à noite, vinho no copo, o céu em fogo",
  "venna-mango-hour/3": "Calma, tens a noite toda",
  "venna-mango-hour/4": "Pele de sábado, corpo na noite até o sol nascer",
  "venna-mango-hour/5": "Vim para dançar, vim para ficar",
  "venna-mango-hour/6": "Lua de manga sobre a cozinha, meia-noite morna",
  "venna-mango-hour/7": "Não vás já, só mais uma música",

  // Album 2 — Honey Cities
  "venna-honey-cities/1": "Primeira chuva da noite, vista do telhado",
  "venna-honey-cities/2": "A cidade a passar pela janela do táxi",
  "venna-honey-cities/3": "Calor à varanda, dois corpos sem pressa",
  "venna-honey-cities/4": "Luz da cozinha, conversa que não acaba",
  "venna-honey-cities/5": "Nascer do sol no terraço, ainda a dançar",
  "venna-honey-cities/6": "Metro às onze da noite, regresso devagar",
  "venna-honey-cities/7": "Beijo debaixo do candeeiro da rua",

  // Album 3 — Slow Down (renumerado: 3.1 era reuse, agora começa em 1)
  "venna-slow-down/1": "Tens tempo, eu também tenho",
  "venna-slow-down/2": "Boa ideia, péssima ideia, mesma ideia",
  "venna-slow-down/3": "Boa tentativa, mas a noite é minha",
  "venna-slow-down/4": "Se é a sério, prova-me",
  "venna-slow-down/5": "Hoje não, e está bem assim",
  "venna-slow-down/6": "Sair dali com o passo certo",

  // Album 4 — Wine & Velvet
  "venna-wine-velvet/1": "Vinho e veludo, mesa para dois",
  "venna-wine-velvet/2": "Fica, em francês intacto",
  "venna-wine-velvet/3": "Baton vermelho, conversa baixinha",
  "venna-wine-velvet/4": "Duas da manhã, ainda à mesa",
  "venna-wine-velvet/5": "Pele em veludo, gesto suave",
  "venna-wine-velvet/6": "Mesa de meia-noite, tudo combinado",
  "venna-wine-velvet/7": "O último gole antes de fechar a porta",

  // Album 5 — Saturday Forever (renumerado: 5.1 era reuse)
  "venna-saturday-forever/1": "Olhar de sexta, promessa para o resto",
  "venna-saturday-forever/2": "Dança comigo, baila comigo",
  "venna-saturday-forever/3": "Festa à beira da piscina, sol a pino",
  "venna-saturday-forever/4": "Domingo às quatro, ainda a tocar",
  "venna-saturday-forever/5": "Não pares o fim de semana",
  "venna-saturday-forever/6": "Vamos, agora, sem perguntar",

  // Album 6 — Closer
  "venna-closer/1": "Mais perto, mesmo amor",
  "venna-closer/2": "O teu lado da cama, o meu lado também",
  "venna-closer/3": "Ao fundo do corredor, sem palavras",
  "venna-closer/4": "Chaves no balcão, casa nossa",
  "venna-closer/5": "Continuo aqui, ainda contigo",
  "venna-closer/6": "A nossa canção, escrita sem aviso",
  "venna-closer/7": "Canção de manhã, café e luz",

  // Album 7 — Skin Memory
  "venna-skin-memory/1": "A pele lembra o que a memória esqueceu",
  "venna-skin-memory/2": "Ensina-me devagar, sem pressa",
  "venna-skin-memory/3": "Combustão lenta, calor que não apaga",
  "venna-skin-memory/4": "Encore, mais uma vez",
  "venna-skin-memory/5": "Não senti falta, e ainda assim chegaste",
  "venna-skin-memory/6": "O beijo no colarinho que ficou marcado",
  "venna-skin-memory/7": "Lembra-te de mim, mesmo no escuro",

  // Album 8 — Sunset Club
  "venna-sunset-club/1": "Sunset club, o céu como cocktail",
  "venna-sunset-club/2": "Alma de ilha sem nome, só ritmo",
  "venna-sunset-club/3": "Espreguiçadeira, tempo a derreter",
  "venna-sunset-club/4": "Terraço à meia-noite, pés descalços",
  "venna-sunset-club/5": "Beira da piscina, francês pelo meio",
  "venna-sunset-club/6": "Depois das horas, antes do regresso",
  "venna-sunset-club/7": "Conduz devagar, casa fica sempre lá",

  // Album 9 — Heart Like A Bassline
  "venna-heart-bassline/1": "Coração com batida de baixo",
  "venna-heart-bassline/2": "Passar o sinal vermelho de propósito",
  "venna-heart-bassline/3": "Dois pêssegos, uma manhã, sem aviso",
  "venna-heart-bassline/4": "Mais brilhante hoje do que ontem",
  "venna-heart-bassline/5": "Domingo latino, tarde longa",
  "venna-heart-bassline/6": "Ela é tudo, em embalagem inteira",
  "venna-heart-bassline/7": "Coração de estádio, batida grande",

  // Album 10 — VENNA Tonight (renumerado: 10.1 era reuse)
  "venna-tonight/1": "Esta noite é minha, sem partilhar",
  "venna-tonight/2": "Quatro línguas, um só recado",
  "venna-tonight/3": "Mulher à noite, sem pedir desculpa",
  "venna-tonight/4": "Convite aberto, resposta livre",
  "venna-tonight/5": "Ma vie, mi vida, minha vida",
  "venna-tonight/6": "VENNA tonight, fecho do círculo",
};

// ── Tipos ─────────────────────────────────────────────────

type ParsedTrack = {
  number: number;        // posição no álbum (1-7)
  title: string;
  bpm: number | null;
  mood: string;          // linha "Mood:" do .md (fallback de descrição)
  explicit: boolean;
  reuseFromAlbum: number | null; // se "(do Álbum N)", senão null
  prompt: string;
  lyrics: string;
};

type ParsedAlbum = {
  index: number;
  tracks: ParsedTrack[];
};

// ── Parser ────────────────────────────────────────────────

function escapeTpl(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function mapEnergy(bpm: number | null, mood: string): "anthem" | "pulse" | "steady" | "whisper" {
  const m = mood.toLowerCase();
  if (m.includes("anthemic") || m.includes("manifesto") || m.includes("epic") || m.includes("euforia")) return "anthem";
  if ((bpm ?? 110) >= 116) return "pulse";
  if ((bpm ?? 110) >= 108) return "steady";
  return "whisper";
}

function parsePart(filePath: string): ParsedAlbum[] {
  const raw = readFileSync(filePath, "utf-8");

  // Encontrar todos os álbuns: # ÁLBUM N — TITLE
  const albumRegex = /^#\s+ÁLBUM\s+(\d+)\s*[—-]\s*(.+)$/gm;
  const albumStarts: { num: number; title: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = albumRegex.exec(raw)) !== null) {
    albumStarts.push({ num: Number(m[1]), title: m[2].trim(), index: m.index });
  }

  const albums: ParsedAlbum[] = [];
  for (let i = 0; i < albumStarts.length; i++) {
    const start = albumStarts[i].index;
    const end = i + 1 < albumStarts.length ? albumStarts[i + 1].index : raw.length;
    const albumSection = raw.slice(start, end);
    const albumNum = albumStarts[i].num;

    // Encontrar todas as faixas: ## N.M — TITLE [✅ ...] [🔞]
    const trackRegex = /^##\s+(\d+)\.(\d+)\s*[—-]\s*(.+)$/gm;
    const trackStarts: { num: number; titleRaw: string; index: number }[] = [];
    let tm: RegExpExecArray | null;
    while ((tm = trackRegex.exec(albumSection)) !== null) {
      const num = Number(tm[2]);
      trackStarts.push({ num, titleRaw: tm[3].trim(), index: tm.index });
    }

    const tracks: ParsedTrack[] = [];
    for (let j = 0; j < trackStarts.length; j++) {
      const ts = trackStarts[j];
      const tStart = ts.index;
      const tEnd = j + 1 < trackStarts.length ? trackStarts[j + 1].index : albumSection.length;
      const trackSection = albumSection.slice(tStart, tEnd);

      // Limpar título de markers (✅ APPROVED, ✅ (do Álbum X), 🔞)
      const titleRaw = ts.titleRaw;
      const explicit = titleRaw.includes("🔞");
      const reuseMatch = titleRaw.match(/\(do\s+Álbum\s+(\d+)\)/i);
      const reuseFromAlbum = reuseMatch ? Number(reuseMatch[1]) : null;
      // Remove markers do título
      let title = titleRaw
        .replace(/✅\s*\(?do\s+Álbum\s+\d+\)?/gi, "")
        .replace(/✅\s*APPROVED/gi, "")
        .replace(/✅/g, "")
        .replace(/🔞/g, "")
        .replace(/\(.*?\)/g, "") // tira parênteses (ex: "(Theme)", "(BAILA)") só se vier depois do dash
        .trim();
      // Se "(...)" original era importante (ex: "DANCE WITH ME (BAILA)"), preserva
      if (titleRaw.match(/\([A-Z\s]+\)/) && !reuseMatch) {
        // Restaurar o parêntese visível (espanhol/inglês)
        const parenMatch = titleRaw.match(/\(([^)]+)\)/);
        if (parenMatch && !parenMatch[0].toLowerCase().includes("do álbum") && !parenMatch[0].toLowerCase().includes("theme")) {
          title = `${title} (${parenMatch[1]})`;
        }
      }

      // Extract BPM e Mood da linha "**BPM:** N · **Signature:** ... · **Mood:** ..."
      const metaMatch = trackSection.match(/\*\*BPM:\*\*\s*(\d+).*?\*\*Mood:\*\*\s*([^\n]+)/);
      const bpm = metaMatch ? Number(metaMatch[1]) : null;
      const mood = metaMatch ? metaMatch[2].trim() : "";

      // STYLE block
      const styleMatch = trackSection.match(/\*\*STYLE:\*\*\s*\n+```\s*\n([\s\S]*?)\n```/);
      const prompt = styleMatch ? styleMatch[1] : "";

      // LYRICS block
      const lyricsMatch = trackSection.match(/\*\*LYRICS:\*\*\s*\n+```\s*\n([\s\S]*?)\n```/);
      const lyrics = lyricsMatch ? lyricsMatch[1] : "";

      tracks.push({
        number: ts.num,
        title,
        bpm,
        mood,
        explicit,
        reuseFromAlbum,
        prompt,
        lyrics,
      });
    }

    albums.push({ index: albumNum, tracks });
  }

  return albums;
}

// ── Main ──────────────────────────────────────────────────

function main() {
  // Parse all 4 parts
  const allAlbums: ParsedAlbum[] = [];
  for (const p of PARTS) allAlbums.push(...parsePart(p));
  allAlbums.sort((a, b) => a.index - b.index);

  // Build lookup of canonical Album 1 tracks by normalized title
  const album1 = allAlbums.find((a) => a.index === 1);
  if (!album1) throw new Error("Álbum 1 (Mango Hour) não encontrado em PARTE-1.md");
  const norm = (s: string) => s.toUpperCase().replace(/\s+/g, " ").replace(/[^A-Z0-9 ]/g, "").trim();
  const album1ByTitle = new Map<string, ParsedTrack>();
  for (const t of album1.tracks) album1ByTitle.set(norm(t.title), t);

  // Resolve reuses — se a faixa é reuse, copiar prompt+lyrics do canónico
  const albumBlocks: string[] = [];
  for (const a of allAlbums) {
    const meta = ALBUM_META[a.index];
    if (!meta) {
      console.warn(`Sem metadata para álbum ${a.index} — saltando`);
      continue;
    }

    // Saltar faixas marcadas como reuse "(do Álbum N)" — não duplicar
    // canções entre álbuns. Renumerar as restantes para 1..N consecutivos.
    const trackBlocks: string[] = [];
    let trackPos = 0;
    let skippedReuses = 0;
    for (const t of a.tracks) {
      if (t.reuseFromAlbum !== null) {
        skippedReuses++;
        continue;
      }
      trackPos++;
      const prompt = t.prompt;
      const lyrics = t.lyrics;
      const mood = t.mood;
      if (!prompt || !lyrics) {
        console.warn(`[${meta.slug}/${trackPos}] "${t.title}" sem STYLE ou LYRICS`);
      }

      const overrideKey = `${meta.slug}/${trackPos}`;
      const description = TRACK_DESCRIPTIONS[overrideKey] ?? mood ?? "";
      const energy = mapEnergy(t.bpm, mood);
      const lang = "EN" as const;

      trackBlocks.push(`    {
      number: ${trackPos},
      title: ${JSON.stringify(t.title)},
      description: ${JSON.stringify(description)},
      lang: ${JSON.stringify(lang)} as const,
      energy: ${JSON.stringify(energy)} as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: \`${escapeTpl(prompt)}\`,
      lyrics: \`${escapeTpl(lyrics)}\`,
      durationSeconds: 240,
      audioUrl: null,
    },`);
    }
    if (skippedReuses > 0) {
      console.log(`  ${meta.slug}: ${skippedReuses} faixa(s) reutilizada(s) saltada(s), restam ${trackPos}`);
    }

    albumBlocks.push(`  {
    slug: ${JSON.stringify(meta.slug)},
    title: ${JSON.stringify(meta.title)},
    subtitle: ${JSON.stringify(meta.subtitle)},
    artist: "VENNA",
    product: "venna" as const,
    color: ${JSON.stringify(meta.color)},
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
${trackBlocks.join("\n")}
    ],
  },`);
  }

  const out = `/**
 * VENNA — discografia completa (10 álbuns × 7 faixas, 70 entradas)
 *
 * Artista: VENNA
 * Tagline: Romance que dança, desejo que sorri.
 *
 * Pop dançável: melodic house, dance pop, R&B contemporâneo. PT/EN com
 * sotaque europeu (Lisboa). Algumas faixas reutilizam canções do Álbum 1
 * "Mango Hour" como abertura de outros álbuns conceptuais — (3.1 = Slow
 * Down, 5.1 = Saturday Skin, 10.1 = VENNA). Honey Hour é a Persona Seed
 * Track aprovada.
 *
 * Gerado por scripts/build-venna-albums.ts a partir de
 * /VENNA/PARTE-{1..4}.md. NÃO EDITAR À MÃO — alterar o .md fonte e
 * correr o script.
 */

import type { Album, TrackEnergy, VocalMode } from "./albums";

export const VENNA_ALBUMS: Album[] = [
${albumBlocks.join("\n")}
];
`;

  writeFileSync(OUTPUT, out, "utf-8");

  let total = 0;
  console.log(`\n✓ Gerado ${OUTPUT}`);
  for (const a of allAlbums) {
    const meta = ALBUM_META[a.index];
    if (!meta) continue;
    const kept = a.tracks.filter((t) => t.reuseFromAlbum === null).length;
    total += kept;
    console.log(`  · ${String(a.index).padStart(2, "0")} ${meta.title} (${kept} faixas, slug: ${meta.slug})`);
  }
  console.log(`  Total: ${total} faixas únicas em ${allAlbums.length} álbuns (sem duplicações)`);
}

main();
