#!/usr/bin/env tsx
/**
 * weekly-pack — gera ZIPs Metricool semanais para VENNA + NNOVVA.
 *
 * Lê /social-content/semana-NN/<brand>.yaml + os MP4 dropados em
 * /social-content/semana-NN/<brand>/, faz upload para Supabase Storage
 * (bucket "social"), gera CSVs (Metricool + genérico) e empacota
 * tudo num ZIP por marca em /social-content/output/semana-NN/.
 *
 * Usage:
 *   cd music-app && npm run weekly -- --semana 19
 *   cd music-app && npm run weekly -- --semana 19 --brand venna
 *   cd music-app && npm run weekly -- --semana 19 --skip-upload
 *
 * Env (.env.local ou export):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY     (não use a anon key)
 *
 * Setup uma vez no Supabase:
 *   - cria bucket público chamado "social"
 *   - sem RLS (ou política que permita service role escrever)
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, basename, resolve } from "path";
import yaml from "yaml";
import JSZip from "jszip";
import { createClient } from "@supabase/supabase-js";
import { ALL_ALBUMS } from "../src/data/albums";

const REPO_ROOT = resolve(__dirname, "..", "..");
const SOCIAL_CONTENT = resolve(REPO_ROOT, "social-content");
const OUTPUT_BASE = join(SOCIAL_CONTENT, "output");

// ── Brand config ──────────────────────────────────────────

type Network =
  | "tiktok" | "instagram" | "instagram-reels" | "instagram-story"
  | "youtube" | "youtube-shorts"
  | "facebook" | "twitter" | "linkedin" | "pinterest" | "threads" | "gmb";

type BrandConfig = {
  slug: string;
  name: string;
  /** Hashtags base — vão a todos os posts da marca, juntando com extras do post. */
  hashtags: string[];
  /** Plataformas default se o post YAML não especificar. */
  defaultPlatforms: Network[];
  /** Posts mínimos por semana — abaixo disto, aviso. */
  minWeeklyPosts: number;
};

const BRANDS: Record<string, BrandConfig> = {
  venna: {
    slug: "venna",
    name: "VENNA",
    hashtags: ["venna", "melodichouse", "dancepop", "popmusic", "newmusic", "electronicpop"],
    defaultPlatforms: ["tiktok", "instagram", "youtube"],
    minWeeklyPosts: 7,
  },
  nnovva: {
    slug: "nnovva",
    name: "NNOVVA",
    hashtags: ["nnovva", "conceptpop", "propheticpop", "newmusic", "ethicalpop"],
    defaultPlatforms: ["tiktok", "instagram", "youtube"],
    minWeeklyPosts: 7,
  },
};

// Brand slug → album product slug-prefix (para resolver trackSlug)
const BRAND_ALBUM_PREFIX: Record<string, string> = {
  venna: "venna-",
  nnovva: "nova-",
};

// ── Args ──────────────────────────────────────────────────

function parseArgs(): { semana: number; brand?: string; skipUpload: boolean } {
  const args = process.argv.slice(2);
  let semana: number | undefined;
  let brand: string | undefined;
  let skipUpload = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--semana" && args[i + 1]) { semana = Number(args[++i]); continue; }
    if (args[i] === "--brand" && args[i + 1]) { brand = args[++i].toLowerCase(); continue; }
    if (args[i] === "--skip-upload") { skipUpload = true; continue; }
  }
  if (!semana || isNaN(semana)) {
    console.error("Usage: npm run weekly -- --semana 19 [--brand venna|nnovva] [--skip-upload]");
    process.exit(1);
  }
  return { semana, brand, skipUpload };
}

// ── YAML schema ───────────────────────────────────────────

type Post = {
  date: string;          // YYYY-MM-DD
  time: string;          // HH:MM (24h)
  /** Filename local (no /social-content/semana-NN/<brand>/). Será uploaded. */
  video?: string;
  /** URL pública já-existente (Drive, Dropbox, Supabase, etc). Skipa upload. */
  videoUrl?: string;
  /** ex: "venna-mango-hour-faixa-01" — gera caption automática (verso + título + hashtags). */
  trackSlug?: string;
  /** Override total da caption gerada. */
  caption?: string;
  /** Hashtags extras além das da marca. */
  hashtags?: string[];
  /** Plataformas override (default = brand.defaultPlatforms). */
  platforms?: Network[];
};

type WeekPlan = {
  brand: string;
  posts: Post[];
};

// ── Helpers ───────────────────────────────────────────────

function parseTrackSlug(slug: string): { albumSlug: string; trackNum: number } | null {
  const m = slug.match(/^(.+)-faixa-(\d+)$/);
  if (!m) return null;
  return { albumSlug: m[1], trackNum: Number(m[2]) };
}

function pickFirstVerse(albumSlug: string, trackNum: number): string {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  const track = album?.tracks.find(t => t.number === trackNum);
  if (!track?.lyrics) return "";
  const lines = track.lyrics.split("\n").filter(l => {
    const t = l.trim();
    return t.length > 15 && t.length < 80 && !t.startsWith("[") && !t.startsWith("(");
  });
  return lines[0]?.trim() || "";
}

function getTrackMeta(albumSlug: string, trackNum: number): { trackTitle: string; albumTitle: string } | null {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  const track = album?.tracks.find(t => t.number === trackNum);
  if (!album || !track) return null;
  return { trackTitle: track.title, albumTitle: album.title };
}

function buildCaption(post: Post, brand: BrandConfig): string {
  if (post.caption) {
    // Caption explícita; ainda assim acrescentamos hashtags se não estiverem lá.
    const hasTags = post.caption.includes("#");
    if (hasTags) return post.caption;
    const allTags = [...brand.hashtags, ...(post.hashtags || [])].map(h => "#" + h).join(" ");
    return `${post.caption}\n\n${allTags}`;
  }
  if (post.trackSlug) {
    const parsed = parseTrackSlug(post.trackSlug);
    if (parsed) {
      const meta = getTrackMeta(parsed.albumSlug, parsed.trackNum);
      if (meta) {
        const verse = pickFirstVerse(parsed.albumSlug, parsed.trackNum);
        const allTags = [...brand.hashtags, ...(post.hashtags || [])].map(h => "#" + h).join(" ");
        return [
          verse ? `"${verse}"` : "",
          "",
          `${meta.trackTitle} — out now`,
          "",
          allTags,
        ].filter((_, i, a) => i === 0 || a[i - 1] !== "" || _ !== "").join("\n").trim();
      }
    }
  }
  // Fallback minimal
  const allTags = [...brand.hashtags, ...(post.hashtags || [])].map(h => "#" + h).join(" ");
  return `${brand.name}\n\n${allTags}`;
}

// ── Supabase upload ───────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são precisos no .env. " +
      "Use --skip-upload para gerar só o CSV (sem upload, com paths locais).",
    );
  }
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  return supabaseClient;
}

async function uploadVideo(localPath: string, supabasePath: string): Promise<string> {
  const supabase = getSupabase();
  const file = readFileSync(localPath);
  const { error } = await supabase.storage.from("social").upload(supabasePath, file, {
    contentType: "video/mp4",
    upsert: true,
  });
  if (error) throw new Error(`Upload falhou (${supabasePath}): ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/social/${supabasePath}`;
}

// ── Metricool CSV ─────────────────────────────────────────

/**
 * Cabeçalho EXACTO do template Metricool Premium (descarregado em 2026-05).
 * 93 colunas. A maior parte fica vazia. Só preenchemos o essencial para
 * publicar UM vídeo nas 3 redes (TikTok, Instagram Reel, YouTube Short).
 *
 * Source: template oficial do Metricool (Planner > 3 dots > Import CSV >
 * Download template).
 */
const METRICOOL_HEADERS = [
  "Text", "Date", "Time", "Draft",
  // Networks (TRUE/FALSE)
  "Facebook", "Twitter/X", "LinkedIn", "GBP", "Instagram", "Pinterest", "TikTok", "Youtube", "Threads", "Bluesky",
  // Media
  "Picture Url 1", "Picture Url 2", "Picture Url 3", "Picture Url 4", "Picture Url 5",
  "Picture Url 6", "Picture Url 7", "Picture Url 8", "Picture Url 9", "Picture Url 10",
  "Alt text picture 1", "Alt text picture 2", "Alt text picture 3", "Alt text picture 4", "Alt text picture 5",
  "Alt text picture 6", "Alt text picture 7", "Alt text picture 8", "Alt text picture 9", "Alt text picture 10",
  "Document title", "Shortener", "Video Thumbnail Url", "Video Cover Frame",
  // Twitter/X options
  "Twitter/X Can reply", "Twitter/X Type", "Twitter/X Poll Duration minutes",
  "Twitter/X Poll Option 1", "Twitter/X Poll Option 2", "Twitter/X Poll Option 3", "Twitter/X Poll Option 4",
  // Pinterest
  "Pinterest Board", "Pinterest Pin Title", "Pinterest Pin Link", "Pinterest Pin New Format",
  // Instagram
  "Instagram Post Type", "Instagram Show Reel On Feed",
  // YouTube
  "Youtube Video Title", "Youtube Video Type", "Youtube Video Privacy", "Youtube video for kids",
  "Youtube Video Category", "Youtube Video Tags", "Youtube playlist",
  // GBP / Facebook
  "GBP Post Type", "Facebook Post Type", "Facebook Title",
  // First comment
  "First Comment Text",
  // TikTok
  "TikTok Title", "TikTok disable comments", "TikTok disable duet", "TikTok disable stitch",
  "TikTok Post Privacy", "TikTok Branded Content", "TikTok Your Brand", "TikTok Auto Add Music",
  "TikTok Photo Cover Index",
  "TikTok musicId", "TikTok music title", "TikTok music author", "TikTok music previewUrl",
  "TikTok music thumbnailUrl", "TikTok music soundVolume", "TikTok music originalVolume",
  "TikTok music startMillis", "TikTok music endMillis", "TikTok is AI generated content",
  // LinkedIn
  "LinkedIn Type", "LinkedIn Poll Question",
  "LinkedIn Poll Option 1", "LinkedIn Poll Option 2", "LinkedIn Poll Option 3", "LinkedIn Poll Option 4",
  "LinkedIn Poll Duration", "LinkedIn Show link preview", "LinkedIn Images as Carousel",
  // Threads
  "Threads Reply Control", "Threads Is Spoiler", "Threads Post Type",
] as const;

/**
 * Mapeia plataformas YAML → nome de coluna network do Metricool.
 * Nem tudo bate 1:1; algumas plataformas YAML "instagram-reels" / "youtube-shorts"
 * são mesmo Instagram / Youtube com tipo de post específico.
 */
const NETWORK_MAP: Record<string, "Facebook" | "Twitter/X" | "LinkedIn" | "GBP" | "Instagram" | "Pinterest" | "TikTok" | "Youtube" | "Threads" | "Bluesky"> = {
  facebook: "Facebook",
  twitter: "Twitter/X",
  "twitter/x": "Twitter/X",
  x: "Twitter/X",
  linkedin: "LinkedIn",
  gbp: "GBP",
  gmb: "GBP",
  instagram: "Instagram",
  "instagram-reels": "Instagram",
  "instagram-story": "Instagram",
  pinterest: "Pinterest",
  tiktok: "TikTok",
  youtube: "Youtube",
  "youtube-shorts": "Youtube",
  threads: "Threads",
  bluesky: "Bluesky",
};

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes("\"") || val.includes("\n") || val.includes("\r")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function buildMetricoolCsv(rows: Array<{ post: Post; mediaUrl: string; caption: string; brand: BrandConfig }>): string {
  const lines: string[] = [METRICOOL_HEADERS.map(csvEscape).join(",")];

  for (const { post, mediaUrl, caption, brand } of rows) {
    const platforms = post.platforms ?? brand.defaultPlatforms;
    const activeNetworks = new Set<string>();
    for (const p of platforms) {
      const net = NETWORK_MAP[p.toLowerCase()];
      if (net) activeNetworks.add(net);
    }

    // Auto-detecta tipo de post
    const isReel = platforms.some(p => p === "instagram-reels" || p === "instagram");
    const isStory = platforms.some(p => p === "instagram-story");
    const isShort = platforms.some(p => p === "youtube-shorts" || p === "youtube");
    const ytTitle = post.trackSlug ? trackTitleFromSlug(post.trackSlug, brand.name) : brand.name;
    const ytTags = [...brand.hashtags, ...(post.hashtags || [])].join(",");

    const cell = (header: typeof METRICOOL_HEADERS[number]): string => {
      switch (header) {
        case "Text": return caption;
        case "Date": return post.date;
        case "Time": return post.time;
        case "Draft": return "FALSE";
        case "Facebook": case "Twitter/X": case "LinkedIn": case "GBP":
        case "Instagram": case "Pinterest": case "TikTok": case "Youtube":
        case "Threads": case "Bluesky":
          return activeNetworks.has(header) ? "TRUE" : "FALSE";
        case "Picture Url 1": return mediaUrl;
        // Instagram defaults
        case "Instagram Post Type":
          if (!activeNetworks.has("Instagram")) return "";
          return isStory ? "Story" : "Reel";
        case "Instagram Show Reel On Feed":
          return activeNetworks.has("Instagram") && isReel ? "TRUE" : "";
        // YouTube defaults
        case "Youtube Video Title":
          return activeNetworks.has("Youtube") ? ytTitle : "";
        case "Youtube Video Type":
          return activeNetworks.has("Youtube") ? (isShort ? "Short" : "Video") : "";
        case "Youtube Video Privacy":
          return activeNetworks.has("Youtube") ? "Public" : "";
        case "Youtube video for kids":
          return activeNetworks.has("Youtube") ? "FALSE" : "";
        case "Youtube Video Tags":
          return activeNetworks.has("Youtube") ? ytTags : "";
        // TikTok defaults
        case "TikTok Title":
          return activeNetworks.has("TikTok") ? caption.slice(0, 150) : ""; // TikTok title curto
        case "TikTok Post Privacy":
          return activeNetworks.has("TikTok") ? "PUBLIC_TO_EVERYONE" : "";
        case "TikTok disable comments": case "TikTok disable duet":
        case "TikTok disable stitch": case "TikTok Branded Content":
        case "TikTok Auto Add Music": case "TikTok is AI generated content":
          return activeNetworks.has("TikTok") ? "FALSE" : "";
        // Threads default
        case "Threads Post Type":
          return activeNetworks.has("Threads") ? "Post" : "";
        // Tudo o resto fica vazio
        default:
          return "";
      }
    };

    lines.push(METRICOOL_HEADERS.map(h => csvEscape(cell(h))).join(","));
  }
  return lines.join("\n");
}

function trackTitleFromSlug(trackSlug: string, brandName: string): string {
  const parsed = parseTrackSlug(trackSlug);
  if (!parsed) return brandName;
  const meta = getTrackMeta(parsed.albumSlug, parsed.trackNum);
  return meta ? `${brandName} — ${meta.trackTitle}` : brandName;
}

function buildGenericCsv(rows: Array<{ post: Post; mediaUrl: string; caption: string; brand: BrandConfig }>): string {
  const headers = ["brand", "date", "time", "platform", "caption", "video_url"];
  const lines: string[] = [headers.join(",")];
  for (const { post, mediaUrl, caption, brand } of rows) {
    const platforms = post.platforms ?? brand.defaultPlatforms;
    for (const platform of platforms) {
      lines.push([
        csvEscape(brand.name),
        post.date,
        post.time,
        platform,
        csvEscape(caption),
        csvEscape(mediaUrl),
      ].join(","));
    }
  }
  return lines.join("\n");
}

// ── Validation ────────────────────────────────────────────

function validatePost(post: Post, brand: BrandConfig, idx: number, semanaDir: string): string[] {
  const errors: string[] = [];
  if (!post.date || !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
    errors.push(`post[${idx}]: 'date' tem de ser YYYY-MM-DD (recebido: ${post.date})`);
  }
  if (!post.time || !/^\d{2}:\d{2}$/.test(post.time)) {
    errors.push(`post[${idx}]: 'time' tem de ser HH:MM (recebido: ${post.time})`);
  }
  if (!post.video && !post.videoUrl) {
    errors.push(`post[${idx}]: precisa de 'video' (filename local) ou 'videoUrl' (URL pública)`);
  }
  if (post.video) {
    const localPath = join(semanaDir, brand.slug, post.video);
    if (!existsSync(localPath)) {
      errors.push(`post[${idx}]: vídeo não existe — ${localPath}`);
    }
  }
  if (post.trackSlug) {
    const parsed = parseTrackSlug(post.trackSlug);
    if (!parsed) {
      errors.push(`post[${idx}]: trackSlug '${post.trackSlug}' formato inválido (esperado <album>-faixa-NN)`);
    } else {
      const expectedPrefix = BRAND_ALBUM_PREFIX[brand.slug];
      if (expectedPrefix && !parsed.albumSlug.startsWith(expectedPrefix)) {
        errors.push(`post[${idx}]: trackSlug '${post.trackSlug}' não pertence à marca ${brand.name} (esperava prefix '${expectedPrefix}')`);
      }
    }
  }
  return errors;
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  const { semana, brand: brandFilter, skipUpload } = parseArgs();
  const semanaPad = String(semana).padStart(2, "0");
  const semanaDir = join(SOCIAL_CONTENT, `semana-${semanaPad}`);

  if (!existsSync(semanaDir)) {
    console.error(`✗ Pasta não existe: ${semanaDir}`);
    console.error(`  Cria com: mkdir -p ${semanaDir}/{venna,nnovva}`);
    console.error(`  Depois põe os MP4 nas subpastas e cria <brand>.yaml com o plano.`);
    process.exit(1);
  }

  const yamlFiles = readdirSync(semanaDir).filter(f => f.endsWith(".yaml"));
  if (yamlFiles.length === 0) {
    console.error(`✗ Nenhum *.yaml em ${semanaDir}`);
    console.error(`  Vê /social-content/_examples/ para ficheiro de exemplo.`);
    process.exit(1);
  }

  mkdirSync(join(OUTPUT_BASE, `semana-${semanaPad}`), { recursive: true });

  let totalRows = 0;
  for (const yamlFile of yamlFiles) {
    const brandSlug = basename(yamlFile, ".yaml").toLowerCase();
    if (brandFilter && brandFilter !== brandSlug) continue;
    const brand = BRANDS[brandSlug];
    if (!brand) {
      console.warn(`! Brand desconhecida: ${brandSlug} (esperava: venna, nnovva). Saltando.`);
      continue;
    }

    console.log(`\n— ${brand.name} (semana ${semanaPad}) —`);
    const yamlText = readFileSync(join(semanaDir, yamlFile), "utf-8");
    let plan: WeekPlan;
    try {
      plan = yaml.parse(yamlText) as WeekPlan;
    } catch (e) {
      console.error(`✗ YAML inválido em ${yamlFile}: ${(e as Error).message}`);
      process.exit(1);
    }
    const posts = plan.posts || [];
    console.log(`  ${posts.length} posts no plano`);
    if (posts.length < brand.minWeeklyPosts) {
      console.warn(`  ⚠ cadência baixa (${posts.length} < ${brand.minWeeklyPosts} esperados/semana)`);
    }

    // Validate all posts upfront
    const allErrors: string[] = [];
    posts.forEach((p, i) => {
      const errs = validatePost(p, brand, i, semanaDir);
      allErrors.push(...errs);
    });
    if (allErrors.length > 0) {
      console.error(`✗ Erros de validação em ${brandSlug}.yaml:`);
      for (const e of allErrors) console.error(`    ${e}`);
      process.exit(1);
    }

    const rows: Array<{ post: Post; mediaUrl: string; caption: string; brand: BrandConfig }> = [];

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const tag = `[${String(i + 1).padStart(2, "0")}/${String(posts.length).padStart(2, "0")}]`;
      console.log(`  ${tag} ${post.date} ${post.time}`);

      let mediaUrl: string;
      if (post.videoUrl) {
        mediaUrl = post.videoUrl;
        console.log(`    URL pré-existente`);
      } else if (post.video) {
        const localPath = join(semanaDir, brandSlug, post.video);
        if (skipUpload) {
          mediaUrl = `LOCAL:${localPath}`;
          console.log(`    (--skip-upload — path local)`);
        } else {
          const supaPath = `${brandSlug}/semana-${semanaPad}/${post.video}`;
          process.stdout.write(`    upload → social/${supaPath} ... `);
          mediaUrl = await uploadVideo(localPath, supaPath);
          console.log("✓");
        }
      } else {
        // já validado
        continue;
      }

      const caption = buildCaption(post, brand);
      rows.push({ post, mediaUrl, caption, brand });
    }
    totalRows += rows.length;

    const metricoolCsv = buildMetricoolCsv(rows);
    const genericCsv = buildGenericCsv(rows);

    const zip = new JSZip();
    zip.file("metricool-import.csv", metricoolCsv);
    zip.file("posts.csv", genericCsv);
    zip.file("README.txt",
      `${brand.name} — Semana ${semanaPad}\n\n` +
      `${rows.length} posts.\n\n` +
      `metricool-import.csv: importa no Metricool via Planner > 3 dots > Import CSV.\n` +
      `posts.csv: formato genérico (1 linha por post-por-plataforma) para outras tools.\n\n` +
      `Vídeos${skipUpload ? " (paths locais — não uploaded)" : " uploaded para Supabase Storage bucket 'social'"}.\n`,
    );

    if (skipUpload) {
      // Inclui vídeos no ZIP para upload manual
      for (const { post } of rows) {
        if (post.video) {
          const localPath = join(semanaDir, brandSlug, post.video);
          zip.file(`videos/${post.video}`, readFileSync(localPath));
        }
      }
    }

    const zipBuf = await zip.generateAsync({ type: "nodebuffer" });
    const outZip = join(OUTPUT_BASE, `semana-${semanaPad}`, `${brandSlug}-week-${semanaPad}.zip`);
    writeFileSync(outZip, zipBuf);
    console.log(`  ✓ ${outZip}  (${(zipBuf.length / 1024).toFixed(0)}KB)`);
  }

  console.log(`\nDone. ${totalRows} posts empacotados.`);
}

main().catch(e => {
  console.error("\n✗ Erro:");
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
