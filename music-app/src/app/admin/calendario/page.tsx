"use client";

import { useState, useEffect, useCallback, type ChangeEvent } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import { PRODUCTION_CALENDAR } from "@/data/production-calendar";
import { adminFetch } from "@/lib/admin-fetch";
import { pickLorannImages } from "@/lib/loranne-images";

const CALENDAR_STORAGE_KEY = "veus:content-calendar-v3";

type ContentAction = {
  type: "reel" | "carrossel" | "story" | "post" | "partilha" | "capa-animada" | "paisagem" | "reel-capa" | "lora";
  label: string;
  trackNumber?: number;
  albumSlug: string;
  caption?: string;
};

type DayPlan = {
  date: string;
  actions: ContentAction[];
};

function getAlbumTitle(slug: string): string {
  return ALL_ALBUMS.find(a => a.slug === slug)?.title || slug;
}

function getTrackTitle(slug: string, num: number): string {
  const album = ALL_ALBUMS.find(a => a.slug === slug);
  return album?.tracks.find(t => t.number === num)?.title || `Faixa ${num}`;
}

function getAlbumColor(slug: string): string {
  return ALL_ALBUMS.find(a => a.slug === slug)?.color || "#C9A96E";
}

function pickVerse(slug: string, trackNum: number): string {
  const album = ALL_ALBUMS.find(a => a.slug === slug);
  const track = album?.tracks.find(t => t.number === trackNum);
  if (!track?.lyrics) return "";
  const lines = track.lyrics.split("\n").filter(l => {
    const t = l.trim();
    return t.length > 15 && t.length < 80 && !t.startsWith("[");
  });
  return lines[0]?.trim() || "";
}

/**
 * Overlay verse text + branding on a background image using browser canvas.
 * Returns a data URL of the final composite image.
 */
/** Extract the best text to show on the image from a caption */
function extractDisplayText(caption: string): string {
  // Try to find verse between quotes — take only the first 2 lines
  const verseMatch = caption.match(/"([\s\S]+?)"/);
  if (verseMatch) {
    const verseLines = verseMatch[1].trim().split("\n").filter(l => l.trim());
    return verseLines.slice(0, 2).join("\n");
  }

  // No quotes — take just the first impactful sentence
  const lines = caption.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 10 && !l.startsWith("#") && !l.includes("music.seteveus") && !l.includes("http"));
  return lines[0] || "";
}

/** Word-wrap text to fit canvas width */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const result: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) { result.push(""); continue; }
    const words = paragraph.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        result.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) result.push(line);
  }
  return result;
}

async function overlayTextOnImage(bgUrl: string, caption: string): Promise<string> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Load background
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = bgUrl;
  });
  ctx.drawImage(img, 0, 0, W, H);

  // Dark gradient overlay for text readability
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.3)");
  grad.addColorStop(0.4, "rgba(0, 0, 0, 0.5)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0.6)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Extract and render text
  const displayText = extractDisplayText(caption);
  if (displayText) {
    const fontSize = 44;
    ctx.font = `italic ${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 12;

    const maxWidth = W - 160;
    const lines = wrapText(ctx, displayText, maxWidth);
    const lineHeight = fontSize * 1.55;
    const totalHeight = lines.length * lineHeight;
    let y = (H - totalHeight) / 2 + fontSize * 0.5;

    for (const line of lines) {
      if (!line.trim()) { y += lineHeight * 0.5; continue; }
      ctx.fillText(line, W / 2, y);
      y += lineHeight;
    }
  }

  // Branding
  ctx.shadowBlur = 0;
  ctx.font = "bold 22px Georgia, serif";
  ctx.fillStyle = "rgba(201, 169, 110, 0.9)";
  ctx.textAlign = "center";
  ctx.fillText("Loranne", W / 2, H - 55);
  ctx.font = "15px sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillText("music.seteveus.space", W / 2, H - 30);

  return canvas.toDataURL("image/png");
}

// ─── Hashtags por tema (guidelines) ─────────
const THEME_HASHTAGS: Record<string, string> = {
  "Diáspora & Raiz": "#diaspora #africa #mocambique #raiz #identidade",
  "Mulher Inteira": "#mulher #feminino #autocuidado #sermulher",
  "Mulher Inteira II": "#mulher #feminino #autocuidado #sermulher",
  "Amor Que Dói": "#amor #relacoes #emocoes #coracao",
  "Amor Que Dói II": "#amor #relacoes #emocoes #coracao",
  "Maternidade": "#maternidade #mae #familia",
  "Raiva & Sombra": "#emocoes #saudementaln #crescimento",
  "Saudade & Perda": "#amor #saudade #perda #emocoes",
  "Recomeço": "#recomeço #crescimento #forca",
  "Ambição": "#ambicao #mulheres #trabalho #sucesso",
  "Corpo & Tempo": "#corpo #autoamor #envelhecer",
  "Alegria & Leveza": "#alegria #leveza #ferias #sol",
  "Quietude & Maré": "#silencio #paz #mare #natureza",
};

/** Generate social media plan starting from TODAY, using each album's distrokidUploadDate.
 *  Launch date = distrokidUploadDate + 7 days.
 *  Launch days (Seg/Qua/Sex with a launch): 3 posts (capa animada, paisagem, reel)
 *  Non-launch Seg/Qua/Sex + Ter/Qui: 3 posts (paisagem, reel, lora)
 *  Sáb/Dom: 1 post (paisagem)
 */
function generateDefaultPlan(): DayPlan[] {
  // Start today (14 April 2026) — 60 days of content
  const today = new Date(2026, 3, 14);
  const DAYS = 60;

  // Build map: launch date ISO → album slug
  const launchMap: Record<string, string> = {};
  for (const a of ALL_ALBUMS) {
    if (!a.distrokidUploadDate) continue;
    const upload = new Date(a.distrokidUploadDate);
    const launch = new Date(upload);
    launch.setDate(launch.getDate() + 7);
    const iso = launch.toISOString().slice(0, 10);
    launchMap[iso] = a.slug;
  }

  // Most recent launch before/at date — used for non-launch days
  const sortedLaunches = Object.entries(launchMap).sort((a, b) => a[0].localeCompare(b[0]));
  function recentLaunch(iso: string): string | null {
    let last: string | null = null;
    for (const [ld, slug] of sortedLaunches) {
      if (ld <= iso) last = slug;
      else break;
    }
    return last || (ALL_ALBUMS.find((a) => a.status === "published")?.slug ?? null);
  }
  function nextLaunch(iso: string): string | null {
    for (const [ld, slug] of sortedLaunches) if (ld > iso) return slug;
    return null;
  }

  const plan: DayPlan[] = [];

  for (let d = 0; d < DAYS; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const iso = date.toISOString().slice(0, 10);
    const dow = date.getDay(); // 0=dom, 1=seg, 2=ter, 3=qua, 4=qui, 5=sex, 6=sab
    const actions: ContentAction[] = [];

    const launchSlug = launchMap[iso];

    if (launchSlug) {
      // Launch day — 3 posts for this album
      const album = ALL_ALBUMS.find((a) => a.slug === launchSlug);
      const title = getAlbumTitle(launchSlug);
      const verse = pickVerse(launchSlug, 1);
      const theme = PRODUCTION_CALENDAR.find((w) =>
        [w.albums.segunda, w.albums.quarta, w.albums.sexta].includes(launchSlug)
      )?.theme;
      const hashtags = (theme && THEME_HASHTAGS[theme]) || "";
      const caption = `${verse ? `"${verse}"\n\n` : ""}${title} — fora agora.\nmusic.seteveus.space\n\n#loranne #${launchSlug} #musicaportuguesa #veus ${hashtags}`.trim();
      actions.push({ type: "capa-animada", label: `Capa animada — ${title}`, albumSlug: launchSlug, caption });
      actions.push({ type: "paisagem", label: `Paisagem + música — ${title}`, albumSlug: launchSlug, trackNumber: 1, caption });
      actions.push({ type: "reel-capa", label: `Reel de capa — ${title}`, albumSlug: launchSlug, caption });
    } else if (dow === 0 || dow === 6) {
      // Sáb/Dom — presença mínima (1 post)
      const slug = recentLaunch(iso);
      if (slug) {
        actions.push({ type: "paisagem", label: `Paisagem — ${getAlbumTitle(slug)}`, albumSlug: slug, trackNumber: 4 });
      }
    } else {
      // Weekday without launch — 3 posts (paisagem + reel-capa + lora/paisagem)
      const slug = recentLaunch(iso) || nextLaunch(iso);
      if (slug) {
        const title = getAlbumTitle(slug);
        actions.push({ type: "paisagem", label: `Paisagem + música — ${title}`, albumSlug: slug, trackNumber: 2 });
        actions.push({ type: "reel-capa", label: `Reel de capa — ${title}`, albumSlug: slug });
        actions.push({ type: "lora", label: `Lora / Paisagem — ${title}`, albumSlug: slug, trackNumber: 3 });
      }
    }

    plan.push({ date: iso, actions });
  }
  return plan;
}

const DEFAULT_PLAN: DayPlan[] = generateDefaultPlan();

// (plano antigo removido — agora gerado automaticamente a partir do calendário de produção)
// Dados antigos ficam em localStorage "veus:content-calendar-plan" (v1) se o user quiser consultar

const TYPE_COLORS: Record<string, string> = {
  reel: "bg-violet-600/20 text-violet-400 border-violet-500/30",
  carrossel: "bg-pink-600/20 text-pink-400 border-pink-500/30",
  story: "bg-amber-600/20 text-amber-400 border-amber-500/30",
  post: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  partilha: "bg-green-600/20 text-green-400 border-green-500/30",
  "capa-animada": "bg-red-600/20 text-red-400 border-red-500/30",
  paisagem: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",
  "reel-capa": "bg-violet-600/20 text-violet-400 border-violet-500/30",
  lora: "bg-fuchsia-600/20 text-fuchsia-400 border-fuchsia-500/30",
};

const TYPE_LABELS: Record<string, string> = {
  reel: "Reel",
  carrossel: "Carrossel",
  story: "Story",
  post: "Post",
  partilha: "Partilha",
  "capa-animada": "Capa Animada",
  paisagem: "Paisagem",
  "reel-capa": "Reel Capa",
  lora: "Lora",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`;
}

function isToday(iso: string): boolean {
  const d = new Date(iso).toDateString();
  return d === new Date().toDateString();
}

function isPast(iso: string): boolean {
  return new Date(iso) < new Date(new Date().toDateString());
}

type EditTarget = {
  dayIdx: number;
  actionIdx: number | null; // null = new action
  action: ContentAction;
};

export default function CalendarPage() {
  const [plan, setPlan] = useState<DayPlan[]>(DEFAULT_PLAN);
  const [loaded, setLoaded] = useState(false);
  const [doneState, setDoneState] = useState<Record<string, boolean>>({});
  const [expandedCaption, setExpandedCaption] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState<Record<string, string>>({});
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [newDayDate, setNewDayDate] = useState("");

  // Load plan + done state from localStorage
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(CALENDAR_STORAGE_KEY);
      if (savedPlan) {
        const parsed = JSON.parse(savedPlan);
        if (Array.isArray(parsed) && parsed.length > 0) setPlan(parsed);
      }
    } catch {}
    try {
      const saved = localStorage.getItem("veus:content-calendar");
      if (saved) setDoneState(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  const savePlan = useCallback((newPlan: DayPlan[]) => {
    setPlan(newPlan);
    try {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(newPlan));
    } catch {}
  }, []);

  function toggleDone(key: string) {
    setDoneState(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("veus:content-calendar", JSON.stringify(next));
      return next;
    });
  }

  function deleteAction(dayIdx: number, actionIdx: number) {
    const newPlan = plan.map((day: DayPlan, di: number) => {
      if (di !== dayIdx) return day;
      return { ...day, actions: day.actions.filter((_: ContentAction, ai: number) => ai !== actionIdx) };
    }).filter((d: DayPlan) => d.actions.length > 0);
    savePlan(newPlan);
  }

  function saveAction(target: EditTarget) {
    const newPlan = [...plan];
    if (target.actionIdx !== null) {
      newPlan[target.dayIdx] = {
        ...newPlan[target.dayIdx],
        actions: newPlan[target.dayIdx].actions.map((a: ContentAction, i: number) =>
          i === target.actionIdx ? target.action : a
        ),
      };
    } else {
      newPlan[target.dayIdx] = {
        ...newPlan[target.dayIdx],
        actions: [...newPlan[target.dayIdx].actions, target.action],
      };
    }
    savePlan(newPlan);
    setEditTarget(null);
  }

  function addDay(dateStr: string) {
    if (!dateStr) return;
    const newDay: DayPlan = { date: dateStr, actions: [] };
    const newPlan = [...plan, newDay].sort((a: DayPlan, b: DayPlan) => a.date.localeCompare(b.date));
    savePlan(newPlan);
    setNewDayDate("");
    const dayIdx = newPlan.findIndex((d: DayPlan) => d.date === dateStr);
    setEditTarget({
      dayIdx,
      actionIdx: null,
      action: { type: "reel", label: "", albumSlug: ALL_ALBUMS[0]?.slug || "", caption: "" },
    });
  }

  function deleteDay(dayIdx: number) {
    savePlan(plan.filter((_: DayPlan, i: number) => i !== dayIdx));
  }

  function resetPlan() {
    savePlan(DEFAULT_PLAN);
  }

  const totalActions = plan.reduce((s, d) => s + d.actions.length, 0);
  const doneCount = Object.values(doneState).filter(Boolean).length;

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#0D0D1A] px-4 sm:px-6 py-10">
      <div className="max-w-screen-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#F5F0E6]">Plano de Conteudo</h1>
            <p className="text-sm text-[#666680] mt-1">Abril 2026 — Instagram + Partilha</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/fotos" className="text-xs text-[#666680] hover:text-[#c08aaa]">Gerar Fotos</Link>
            <Link href="/admin/producao" className="text-xs text-[#666680] hover:text-[#a0a0b0]">Producao</Link>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#a0a0b0]">{doneCount} / {totalActions} feitos</span>
            <span className="text-sm text-[#C9A96E]">{Math.round((doneCount / totalActions) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div className="h-full rounded-full bg-[#C9A96E] transition-all" style={{ width: `${(doneCount / totalActions) * 100}%` }} />
          </div>
        </div>

        {/* Days */}
        <div className="space-y-4">
          {plan.map((day, dayIdx) => {
            const today = isToday(day.date);
            const past = isPast(day.date);
            const allDone = day.actions.every((_, i) => doneState[`${day.date}-${i}`]);

            return (
              <div
                key={day.date}
                className={`rounded-xl border p-4 transition-colors ${
                  today ? "border-[#C9A96E]/40 bg-[#C9A96E]/5" :
                  past && allDone ? "border-green-900/30 bg-green-950/10 opacity-50" :
                  past ? "border-white/5 bg-white/[0.01] opacity-70" :
                  "border-white/5 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-sm font-semibold ${today ? "text-[#C9A96E]" : "text-[#a0a0b0]"}`}>
                    {formatDate(day.date)}
                  </span>
                  {today && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A96E]/20 text-[#C9A96E]">Hoje</span>}
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => setEditTarget({
                        dayIdx,
                        actionIdx: null,
                        action: { type: "reel", label: "", albumSlug: ALL_ALBUMS[0]?.slug || "", caption: "" },
                      })}
                      className="text-[10px] px-2 py-1 rounded text-[#666680] hover:text-[#C9A96E] transition-colors"
                      title="Adicionar accao"
                    >
                      + Accao
                    </button>
                    {day.actions.length === 0 && (
                      <button
                        onClick={() => deleteDay(dayIdx)}
                        className="text-[10px] px-2 py-1 rounded text-[#666680] hover:text-red-400 transition-colors"
                        title="Remover dia"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {day.actions.map((action, i) => {
                    const key = `${day.date}-${i}`;
                    const done = doneState[key] || false;
                    const showCaption = expandedCaption === key;

                    return (
                      <div key={i} className={`rounded-lg border p-3 ${done ? "opacity-40" : ""} ${TYPE_COLORS[action.type] || "border-white/10"}`}>
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleDone(key)}
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 min-w-[44px] min-h-[44px] ${
                              done ? "border-green-500 bg-green-500" : "border-current/40"
                            }`}
                          >
                            {done && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M20 6L9 17l-5-5" /></svg>}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider">{TYPE_LABELS[action.type]}</span>
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getAlbumColor(action.albumSlug) }} />
                              <span className="text-xs text-[#a0a0b0]">{getAlbumTitle(action.albumSlug)}</span>
                              <button
                                onClick={() => setEditTarget({ dayIdx, actionIdx: i, action: { ...action } })}
                                className="text-[10px] text-[#666680] hover:text-[#C9A96E] transition-colors ml-auto"
                                title="Editar"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => deleteAction(dayIdx, i)}
                                className="text-[10px] text-[#666680] hover:text-red-400 transition-colors"
                                title="Remover"
                              >
                                &times;
                              </button>
                            </div>
                            <input
                              type="text"
                              value={action.label}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const newPlan = [...plan];
                                newPlan[dayIdx] = {
                                  ...newPlan[dayIdx],
                                  actions: newPlan[dayIdx].actions.map((a: ContentAction, ai: number) =>
                                    ai === i ? { ...a, label: e.target.value } : a
                                  ),
                                };
                                savePlan(newPlan);
                              }}
                              className={`text-sm mt-1 w-full bg-transparent border-b border-transparent hover:border-white/10 focus:border-[#C9A96E]/50 focus:outline-none ${done ? "line-through text-[#666680]" : "text-[#F5F0E6]"}`}
                            />

                            {action.caption && (
                              <button
                                onClick={() => setExpandedCaption(showCaption ? null : key)}
                                className="text-[10px] text-[#C9A96E] mt-1 hover:underline"
                              >
                                {showCaption ? "Esconder legenda" : "Ver legenda"}
                              </button>
                            )}

                            {showCaption && action.caption != null && (
                              <div className="mt-2 rounded-lg bg-black/20 border border-white/5 relative">
                                <textarea
                                  value={action.caption}
                                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                    const newPlan = [...plan];
                                    newPlan[dayIdx] = {
                                      ...newPlan[dayIdx],
                                      actions: newPlan[dayIdx].actions.map((a, ai) =>
                                        ai === i ? { ...a, caption: e.target.value } : a
                                      ),
                                    };
                                    savePlan(newPlan);
                                  }}
                                  className="w-full p-3 text-xs text-[#a0a0b0] whitespace-pre-wrap leading-relaxed bg-transparent focus:outline-none focus:text-[#F5F0E6] resize-y min-h-[6rem]"
                                />
                                <button
                                  onClick={() => navigator.clipboard.writeText(action.caption!)}
                                  className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-[#C9A96E]/20 text-[#C9A96E]"
                                >
                                  Copiar
                                </button>
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                              {action.type === "story" && action.trackNumber && (
                                <button
                                  onClick={async () => {
                                    const { generateShareCard, downloadBlob } = await import("@/lib/share-card");
                                    const { getAlbumCover, getTrackCoverUrl } = await import("@/lib/album-covers");
                                    const alb = ALL_ALBUMS.find(a => a.slug === action.albumSlug);
                                    if (!alb) return;
                                    const track = alb.tracks.find(t => t.number === action.trackNumber);
                                    if (!track) return;
                                    let cover = getAlbumCover(alb);
                                    try {
                                      const probe = await fetch(getTrackCoverUrl(alb.slug, track.number), { method: "HEAD" });
                                      if (probe.ok) cover = getTrackCoverUrl(alb.slug, track.number);
                                    } catch {}
                                    const blob = await generateShareCard(track, alb, cover, "story");
                                    downloadBlob(blob, `Story — ${track.title}.png`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-amber-600/30 text-amber-400 text-xs min-h-[44px]"
                                >
                                  Gerar Story
                                </button>
                              )}
                              {action.type === "reel" && action.trackNumber && (
                                <>
                                  <button
                                    disabled={!!generating[key]}
                                    onClick={async () => {
                                      const albumSlug = action.albumSlug;
                                      const trackNum = action.trackNumber!;
                                      const alb = ALL_ALBUMS.find(a => a.slug === albumSlug);
                                      if (!alb) { alert("Álbum não encontrado"); return; }
                                      const track = alb.tracks.find(t => t.number === trackNum);
                                      if (!track) { alert("Faixa não encontrada"); return; }

                                      try {
                                        setGenerating(p => ({ ...p, [key]: "A preparar reel..." }));
                                        const { generateReel } = await import("@/lib/reel-generator");
                                        const { getAlbumCover, getTrackCoverUrl } = await import("@/lib/album-covers");

                                        let coverSrc = getAlbumCover(alb);
                                        try {
                                          const probe = await fetch(getTrackCoverUrl(albumSlug, trackNum), { method: "HEAD" });
                                          if (probe.ok) coverSrc = getTrackCoverUrl(albumSlug, trackNum);
                                        } catch {}

                                        const audioSrc = `/api/music/stream?album=${encodeURIComponent(albumSlug)}&track=${trackNum}`;

                                        setGenerating(p => ({ ...p, [key]: "A gerar reel..." }));
                                        const blob = await generateReel(track, alb, coverSrc, audioSrc, (p) => {
                                          setGenerating(prev => ({ ...prev, [key]: p.message }));
                                        });

                                        const url = URL.createObjectURL(blob);
                                        setGeneratedImages(p => ({ ...p, [key]: url }));

                                        // Also offer download
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `Reel — ${track.title}.mp4`;
                                        a.click();
                                      } catch (err) {
                                        alert(`Erro: ${(err as Error).message}`);
                                      } finally {
                                        setGenerating(p => { const n = { ...p }; delete n[key]; return n; });
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-violet-600/30 text-violet-400 text-xs min-h-[44px]"
                                  >
                                    {generating[key] || "Gerar Reel"}
                                  </button>
                                  <Link
                                    href={`/admin/producao?album=${action.albumSlug}`}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 text-[#666680] text-xs min-h-[44px] flex items-center"
                                  >
                                    Produção
                                  </Link>
                                  {generatedImages[key] && generatedImages[key] !== "done" && (
                                    <a href={generatedImages[key]} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-green-600/30 text-green-400 text-xs min-h-[44px] flex items-center">
                                      Ver reel
                                    </a>
                                  )}
                                </>
                              )}
                              {action.type === "carrossel" && (
                                <button
                                  onClick={async () => {
                                    const { generateCarousel } = await import("@/lib/carousel-generator");
                                    const { getAlbumCover, getTrackCoverUrl } = await import("@/lib/album-covers");
                                    const alb = ALL_ALBUMS.find(a => a.slug === action.albumSlug);
                                    if (!alb) return;
                                    let cover = getAlbumCover(alb);
                                    try {
                                      const probe = await fetch(getTrackCoverUrl(alb.slug, 1), { method: "HEAD" });
                                      if (probe.ok) cover = getTrackCoverUrl(alb.slug, 1);
                                    } catch {}
                                    await generateCarousel(alb, cover);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-pink-600/30 text-pink-400 text-xs min-h-[44px]"
                                >
                                  Gerar Carrossel
                                </button>
                              )}
                              {action.type === "post" && (
                                <>
                                  <button
                                    disabled={!!generating[key]}
                                    onClick={async () => {
                                      setGenerating(p => ({ ...p, [key]: "A compor..." }));
                                      try {
                                        // Use Loranne image as background (no fal.ai)
                                        const lorannImg = pickLorannImages(action.albumSlug, 1, 1)[0];
                                        const finalUrl = await overlayTextOnImage(lorannImg, action.caption || "");
                                        setGeneratedImages(p => ({ ...p, [key]: finalUrl }));
                                      } catch (err) {
                                        alert(`Erro: ${(err as Error).message}`);
                                      } finally {
                                        setGenerating(p => { const n = { ...p }; delete n[key]; return n; });
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-blue-600/30 text-blue-400 text-xs min-h-[44px]"
                                  >
                                    {generating[key] || "Gerar Post"}
                                  </button>
                                  {generatedImages[key] && (
                                    <>
                                      <a href={generatedImages[key]} download={`post-${action.albumSlug}.png`} className="px-3 py-1.5 rounded-lg bg-green-600/30 text-green-400 text-xs min-h-[44px] flex items-center">
                                        Descarregar
                                      </a>
                                      <img src={generatedImages[key]} alt="Preview" className="mt-2 w-full max-w-[300px] rounded-lg" />
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Quick link to production */}
                          {action.trackNumber && (
                            <Link
                              href={`/admin/producao?album=${action.albumSlug}`}
                              className="text-[10px] text-[#666680] hover:text-[#a0a0b0] shrink-0"
                            >
                              Producao
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add day + Reset */}
        <div className="mt-6 flex items-center gap-3">
          <input
            type="date"
            value={newDayDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewDayDate(e.target.value)}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A96E]/50"
          />
          <button
            onClick={() => addDay(newDayDate)}
            disabled={!newDayDate}
            className="text-xs px-3 py-2 rounded-lg bg-[#C9A96E]/20 text-[#C9A96E] hover:bg-[#C9A96E]/30 transition disabled:opacity-30"
          >
            + Novo dia
          </button>
          <button
            onClick={() => {
              if (confirm("Repor calendario original? Perdes todas as alteracoes.")) resetPlan();
            }}
            className="text-xs px-3 py-2 rounded-lg text-[#666680] hover:text-red-400 transition ml-auto"
          >
            Repor original
          </button>
        </div>
      </div>

      {/* Edit modal */}
      {editTarget && (
        <EditActionModal
          target={editTarget}
          onSave={saveAction}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Edit Action Modal
// ─────────────────────────────────────────────

function EditActionModal({
  target,
  onSave,
  onClose,
}: {
  target: EditTarget;
  onSave: (t: EditTarget) => void;
  onClose: () => void;
}) {
  const [action, setAction] = useState<ContentAction>({ ...target.action });
  const isNew = target.actionIdx === null;

  const selectedAlbum = ALL_ALBUMS.find(a => a.slug === action.albumSlug);

  function handleSave() {
    if (!action.label.trim()) {
      // Auto-generate label
      const albumTitle = selectedAlbum?.title || action.albumSlug;
      const trackTitle = action.trackNumber
        ? selectedAlbum?.tracks.find(t => t.number === action.trackNumber)?.title || `Faixa ${action.trackNumber}`
        : "";
      action.label = trackTitle
        ? `${TYPE_LABELS[action.type]} — ${trackTitle} (${albumTitle})`
        : `${TYPE_LABELS[action.type]} — ${albumTitle}`;
    }
    onSave({ ...target, action });
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#0D0D1A] border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-[#F5F0E6]">
            {isNew ? "Nova accao" : "Editar accao"}
          </h3>
          <button onClick={onClose} className="text-[#666680] hover:text-white text-xl">&times;</button>
        </div>

        <div className="space-y-4">
          {/* Type */}
          <div>
            <label className="text-[10px] text-[#666680] uppercase tracking-wider block mb-1">Tipo</label>
            <select
              value={action.type}
              onChange={(e) => setAction({ ...action, type: e.target.value as ContentAction["type"] })}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F5F0E6] focus:outline-none focus:border-[#C9A96E]/50"
            >
              <option value="reel">Reel</option>
              <option value="carrossel">Carrossel</option>
              <option value="post">Post</option>
              <option value="story">Story</option>
              <option value="partilha">Partilha</option>
            </select>
          </div>

          {/* Album */}
          <div>
            <label className="text-[10px] text-[#666680] uppercase tracking-wider block mb-1">Album</label>
            <select
              value={action.albumSlug}
              onChange={(e) => setAction({ ...action, albumSlug: e.target.value, trackNumber: undefined })}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F5F0E6] focus:outline-none focus:border-[#C9A96E]/50"
            >
              {ALL_ALBUMS.map(a => (
                <option key={a.slug} value={a.slug}>{a.title} ({a.product})</option>
              ))}
            </select>
          </div>

          {/* Track */}
          {selectedAlbum && (
            <div>
              <label className="text-[10px] text-[#666680] uppercase tracking-wider block mb-1">Faixa (opcional)</label>
              <select
                value={action.trackNumber || ""}
                onChange={(e) => setAction({ ...action, trackNumber: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F5F0E6] focus:outline-none focus:border-[#C9A96E]/50"
              >
                <option value="">Nenhuma (album inteiro)</option>
                {selectedAlbum.tracks.map(t => (
                  <option key={t.number} value={t.number}>{t.number}. {t.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Label */}
          <div>
            <label className="text-[10px] text-[#666680] uppercase tracking-wider block mb-1">Label (vazio = auto)</label>
            <input
              type="text"
              value={action.label}
              onChange={(e) => setAction({ ...action, label: e.target.value })}
              placeholder="Ex: Reel — A Roda (Ilusão)"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="text-[10px] text-[#666680] uppercase tracking-wider block mb-1">Legenda / Caption</label>
            <textarea
              value={action.caption || ""}
              onChange={(e) => setAction({ ...action, caption: e.target.value })}
              placeholder="Texto para Instagram..."
              rows={6}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50 resize-y"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="text-xs px-4 py-2 rounded-lg text-[#666680] hover:text-[#a0a0b0] transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="text-xs px-5 py-2 rounded-lg bg-[#C9A96E] text-[#0D0D1A] font-semibold hover:bg-[#d4b06a] transition"
          >
            {isNew ? "Adicionar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
