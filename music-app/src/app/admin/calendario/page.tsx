"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";

// Loranne images without text, good quality, grouped by mood
const LORANNE_IMAGES: Record<string, string[]> = {
  spiritual: ["/poses/velas-01.png", "/poses/velas-02.png", "/poses/velas-03.png", "/poses/velas-04.png"],
  intimate: ["/poses/loranne8-01.png", "/poses/loranne8-02.png", "/poses/loranne8-03.png", "/poses/loranne8-04.png", "/poses/loranne6-01.png", "/poses/loranne6-02.png", "/poses/loranne6-03.png"],
  movement: ["/poses/loranne3-01.png", "/poses/loranne3-02.png", "/poses/loranne3-03.png", "/poses/loranne3-04.png", "/poses/loranne3-05.png"],
  contemplative: ["/poses/loranne5-01.png", "/poses/loranne5-02.png", "/poses/loranne5-03.png", "/poses/loranne5-04.png", "/poses/loranne5-05.png"],
  vulnerable: ["/poses/loranne6-04.png", "/poses/loranne6-05.png", "/poses/loranne6-06.png", "/poses/loranne6-07.png"],
  iconic: ["/Loranne.png", "/poses/loranne-hero.png"],
};

// Map album collection to image mood
function getImageMood(albumSlug: string): string {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  if (!album) return "iconic";
  const p = album.product;
  if (p === "incenso") return "spiritual";
  if (p === "nua") return "intimate";
  if (p === "fibra") return "movement";
  if (p === "mare" || p === "grao") return "contemplative";
  if (p === "sangue" || p === "no") return "vulnerable";
  if (p === "eter" || p === "espelho") return "contemplative";
  return "iconic";
}

function pickLorannImages(albumSlug: string, trackNumber: number, count: number): string[] {
  const mood = getImageMood(albumSlug);
  const images = LORANNE_IMAGES[mood] || LORANNE_IMAGES.iconic;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(images[(trackNumber - 1 + i) % images.length]);
  }
  return result;
}

type ContentAction = {
  type: "reel" | "carrossel" | "story" | "post" | "partilha";
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
  // Try to find verse between quotes (handles newlines)
  const verseMatch = caption.match(/"([\s\S]+?)"/);
  if (verseMatch) return verseMatch[1].trim();

  // No quotes — use first meaningful lines (skip hashtags, links, short lines)
  const lines = caption.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 10 && !l.startsWith("#") && !l.includes("music.seteveus") && !l.includes("http"));
  return lines.slice(0, 4).join("\n");
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

const PLAN: DayPlan[] = [
  // ── SEMANA 1: Lançamento "Os Sete Temas do Despertar" ──
  { date: "2026-04-01", actions: [
    { type: "reel", label: "Reel — O Convite", albumSlug: "livro-filosofico", trackNumber: 1, caption: '"Há uma porta que não se vê\nno centro exacto do teu peito"\n\nO Convite — Loranne\nmusic.seteveus.space\n\n#loranne #veus #oconvite #ouve' },
  ]},
  { date: "2026-04-02", actions: [
    { type: "carrossel", label: "Carrossel — Os Sete Temas do Despertar", albumSlug: "livro-filosofico", caption: "Os Sete Temas do Despertar.\n9 faixas. O primeiro álbum.\n\n1. O Convite\n2. The Impermanence of You\n3. A Cadeira Vazia\n4. The Whirlwind\n5. A Plenitude que Já Está\n6. The Fertile Dark\n7. O Horizonte\n8. The Reunion\n9. O Reflexo Final\n\nCada faixa é uma camada.\nTira uma e vê o que aparece por baixo.\n\nmusic.seteveus.space\n\n#loranne #veus #despertar #ouve" },
  ]},
  { date: "2026-04-03", actions: [
    { type: "reel", label: "Reel — A Cadeira Vazia", albumSlug: "livro-filosofico", trackNumber: 3, caption: '"A memória é uma sala escura\ncom cadeiras viradas para trás\nSentas-te e olhas o que já foi\ncomo se pudesses mudar o que já não faz"\n\nA Cadeira Vazia — Loranne\nmusic.seteveus.space\n\n#loranne #veus #memória #passado' },
  ]},
  { date: "2026-04-04", actions: [
    { type: "reel", label: "Reel — The Fertile Dark", albumSlug: "livro-filosofico", trackNumber: 6, caption: '"Let the emptiness be full\nof all the things you cannot name\nThe fertile dark will hold your roots\nuntil you bloom without the shame"\n\nThe Fertile Dark — Loranne\nmusic.seteveus.space\n\n#loranne #veus #thefertiledark #bloom' },
  ]},
  { date: "2026-04-05", actions: [
    { type: "reel", label: "Reel — A Plenitude que Já Está", albumSlug: "livro-filosofico", trackNumber: 5, caption: '"Pára — não há nada a conquistar\nA plenitude não é uma meta\nEstá aqui, no exacto lugar\nonde largaste a bicicleta"\n\nA Plenitude que Já Está — Loranne\nmusic.seteveus.space\n\n#loranne #veus #plenitude #parar' },
  ]},
  { date: "2026-04-06", actions: [
    { type: "post", label: "Post — sobre o álbum", albumSlug: "livro-filosofico", caption: "Escrevi estas canções no escuro.\nNão no escuro dramático.\nNo escuro de uma terça-feira às três da manhã, com o chá frio e o corpo a dizer coisas que a boca não sabia dizer.\n\n9 faixas.\nAlgumas em português. Outras em inglês.\nTodas no mesmo sítio — esse lugar entre o peito e a garganta onde as coisas ficam presas.\n\nSe ouvires e sentires um arrepio estranho, não é a música.\nÉs tu a reconheceres-te.\n\nmusic.seteveus.space\n\n#loranne #veus #despertar #sentir" },
  ]},

  // ── SEMANA 2: Viagem + Saudade + Sangue Aceso ──
  { date: "2026-04-07", actions: [
    { type: "reel", label: "Reel — Vertigem (Vasto)", albumSlug: "eter-vasto", trackNumber: 1, caption: '"Olhei para cima e o chão fugiu\nO céu não tem fundo e eu também não\nA vertigem de existir\né a mesma de cair — sem chão"\n\nVertigem — Loranne\nVasto\nmusic.seteveus.space\n\n#loranne #veus #vasto #vertigem #céu' },
  ]},
  { date: "2026-04-08", actions: [
    { type: "reel", label: "Reel — The Impermanence of You", albumSlug: "livro-filosofico", trackNumber: 2, caption: '"Nothing stays — nothing was meant to stay\nThe self you grip is made of rain\nLet the permanence dissolve like morning\nand find what lives beneath the pain"\n\nThe Impermanence of You — Loranne\nmusic.seteveus.space\n\n#loranne #veus #impermanence #letgo' },
  ]},
  { date: "2026-04-09", actions: [
    { type: "reel", label: "Reel — O teu lado da cama (Saudade)", albumSlug: "nua-saudade", trackNumber: 1, caption: '"O teu lado da cama está frio\nA marca do teu corpo desapareceu\nMas eu deito-me do meu lado\nComo se o teu ainda existisse"\n\nSaudade — Loranne\nmusic.seteveus.space\n\n#loranne #veus #saudade #falta #amor' },
  ]},
  { date: "2026-04-10", actions: [
    { type: "carrossel", label: "Carrossel — Viagem", albumSlug: "eter-viagem", caption: "Viagem.\n10 faixas entre o corpo e o cosmos.\n\n\"Home is not a place\nHome is a frequency I recognise\nWhen the noise stops\nAnd the body softens\"\n\nOnde é que acabas tu e começa o universo?\n\nmusic.seteveus.space\n\n#loranne #veus #viagem #cosmic #ouve" },
  ]},
  { date: "2026-04-11", actions: [
    { type: "reel", label: "Reel — Sangue Aceso", albumSlug: "fibra-sangue-aceso", trackNumber: 1, caption: '"O primeiro passo dói\nO segundo já não pára\nO corpo acorda e depois\nJá não precisa de cara"\n\nSangue Aceso — Loranne\nmusic.seteveus.space\n\n#loranne #veus #sangueaceso #corpo #acordar' },
  ]},
  { date: "2026-04-12", actions: [
    { type: "reel", label: "Reel — The Body Keeps the Tale", albumSlug: "espelho-ilusao", trackNumber: 5, caption: '"Oh, the body keeps the tale\nWritten underneath the skin\nEvery scar\'s a letter sent\nFrom the girl I\'ve always been"\n\nThe Body Keeps the Tale — Loranne\nmusic.seteveus.space\n\n#loranne #veus #body #skin #memória' },
  ]},
  { date: "2026-04-13", actions: [
    { type: "reel", label: "Reel — Rendição (domingo)", albumSlug: "mare-rendicao", trackNumber: 5, caption: '"O corpo fica mais pesado\nQue o colchão que o segura\nOs braços são de chumbo dourado\nA gravidade é uma ternura"\n\nRendição — Loranne\nmusic.seteveus.space\n\n#loranne #veus #rendição #descanso #domingo' },
  ]},

  // ── SEMANA 3: Pele + Frequência + Duas Vozes + Estações ──
  { date: "2026-04-14", actions: [
    { type: "reel", label: "Reel — Frequência", albumSlug: "incenso-frequencia", trackNumber: 1, caption: '"São sete da manhã e a cabeça já começou\nAntes do corpo sair da cama\nJá o dia inteiro passou\nDez ideias a falar ao mesmo tempo"\n\nFrequência — Loranne\nmusic.seteveus.space\n\n#loranne #veus #frequência #cabeça #neurodivergente' },
  ]},
  { date: "2026-04-15", actions: [
    { type: "post", label: "Post — sobre Duas Vozes", albumSlug: "nua-duas-vozes", caption: "\"Contas-me o teu dia e eu finjo que ouço\nmas estou a olhar para as tuas mãos\nA forma como seguras o copo\ncomo se o copo fosse uma oração\"\n\nHá canções que só fazem sentido a dois.\nEste álbum é sobre o amor no quotidiano.\nO prato no micro-ondas. A cama desfeita. O silêncio bom.\n\nDuas Vozes. Para ouvir ao lado de alguém.\nOu sozinha a lembrar de alguém.\n\nmusic.seteveus.space\n\n#loranne #veus #duasvozes #amor #quotidiano #ouve" },
  ]},
  { date: "2026-04-16", actions: [
    { type: "reel", label: "Reel — Sinal", albumSlug: "eter-sinal", trackNumber: 1, caption: '"O arrepio veio do nada\nNinguém tocou, ninguém falou\nEstava na fila do supermercado\nE o corpo inteiro arrepiou"\n\nSinal — Loranne\nmusic.seteveus.space\n\n#loranne #veus #sinal #arrepio #corpo' },
  ]},
  { date: "2026-04-17", actions: [
    { type: "carrossel", label: "Carrossel — Pele", albumSlug: "nua-pele", caption: "Pele.\n10 faixas sobre a linguagem mais antiga.\n\n\"Apaixonei-me pelo teu cansaço\nPela forma como despes o dia\nPelo suspiro entre a porta e o sofá\nPela tua falta de energia\"\n\nPara ouvir a dois. Ou sozinha a pensar em alguém.\n\nmusic.seteveus.space\n\n#loranne #veus #pele #amor #ouve" },
  ]},
  { date: "2026-04-18", actions: [
    { type: "reel", label: "Reel — Ressurreição (Estações)", albumSlug: "grao-estacoes", trackNumber: 1, caption: '"Houve um tempo em que fiquei deitada\ndentro de mim mesma, pedra sobre pedra\nO corpo pesado como terra molhada\no peito fechado como quem não medra"\n\nEstações — Loranne\nmusic.seteveus.space\n\n#loranne #veus #estações #renascer #primavera' },
  ]},
  { date: "2026-04-19", actions: [
    { type: "reel", label: "Reel — Máscara (Frequência)", albumSlug: "incenso-frequencia", trackNumber: 3, caption: '"De manhã visto a máscara\nQue sorri na hora certa\nQue fala no tom certo\nQue parece estar desperta\nAntes mesmo de sair\nJá ensaiei quem vou ser"\n\nFrequência — Loranne\nmusic.seteveus.space\n\n#loranne #veus #frequência #máscara #neurodivergente' },
  ]},
  { date: "2026-04-20", actions: [
    { type: "reel", label: "Reel — Honestidade Quieta (domingo)", albumSlug: "espelho-ilusao", trackNumber: 6, caption: '"Não preciso de ser mais\nNão preciso de mudar\nSó preciso deste instante\nQuieto como o fundo do mar"\n\nHonestidade Quieta — Loranne\nmusic.seteveus.space\n\n#loranne #veus #honestidade #calma #domingo' },
  ]},

  // ── SEMANA 4: Herança + Culpa + O Círculo + fecho ──
  { date: "2026-04-21", actions: [
    { type: "reel", label: "Reel — A Mãe Que Viu", albumSlug: "no-heranca", trackNumber: 1, caption: '"A mãe que viu guardou a chuva inteira\nCoseu o céu para não te molhar\nPorque dizer era partir-te em dois pedaços\nE eu preferi calar a te partir ao luar"\n\nA Mãe Que Viu — Loranne\nmusic.seteveus.space\n\n#loranne #veus #mãe #silêncio' },
  ]},
  { date: "2026-04-22", actions: [
    { type: "post", label: "Post — sobre mães", albumSlug: "no-heranca", caption: "\"Years I held the rain inside my chest\nYears I kept the storm from breaking through\nI wore the silence like a wedding dress\nWaiting for the dawn to come from you\"\n\nEsta canção é cantada pela mãe.\n\nA maior parte das pessoas que a ouvem ficam em silêncio durante uns segundos.\nDepois dizem: a minha mãe nunca me disse isto. Mas sei que era isto.\n\nPõe a ouvir e depois liga à tua mãe.\nOu não ligues. Mas ouve.\n\nmusic.seteveus.space\n\n#loranne #veus #mãe #ouve" },
  ]},
  { date: "2026-04-23", actions: [
    { type: "reel", label: "Reel — Permission", albumSlug: "espelho-culpa", trackNumber: 5, caption: '"But the birds don\'t earn the morning\nAnd the river doesn\'t pay for rain\nThe wildflower grows without permission\nAnd still the sun comes back again"\n\nPermission — Loranne\nmusic.seteveus.space\n\n#loranne #veus #permission #liberdade' },
  ]},
  { date: "2026-04-24", actions: [
    { type: "reel", label: "Reel — O Círculo", albumSlug: "incenso-o-circulo", trackNumber: 1, caption: '"Quando acabam as palavras todas\nE o silêncio fica só\nHá qualquer coisa ainda acesa\nQue não sabe dizer adeus"\n\nO Círculo — Loranne\nmusic.seteveus.space\n\n#loranne #veus #ocírculo #silêncio' },
  ]},
  { date: "2026-04-25", actions: [
    { type: "reel", label: "Reel — Herança das avós", albumSlug: "espelho-culpa", trackNumber: 4, caption: '"A minha avó lavava roupa no rio\nCom as mãos rachadas e o ventre cheio\nNunca disse quero, nunca disse eu\nMorreu com os sonhos ainda no seio"\n\nHerança — Loranne\nmusic.seteveus.space\n\n#loranne #veus #herança #avós #mulheres' },
  ]},
  { date: "2026-04-26", actions: [
    { type: "reel", label: "Reel — Desatar", albumSlug: "no-heranca", trackNumber: 5, caption: '"Desatar não é destruir o que era nosso\nDesatar é dar ao fio espaço e ar\nO nó que nos unia era o mesmo nó\nQue nos impedia de nos encontrar"\n\nDesatar — Loranne\nmusic.seteveus.space\n\n#loranne #veus #desatar #liberdade' },
  ]},
  { date: "2026-04-27", actions: [
    { type: "reel", label: "Reel — Luz Crua (domingo manhã)", albumSlug: "grao-luz-crua", trackNumber: 1, caption: '"Antes de abrir os olhos\nO mundo já existe lá fora\nOs pássaros cantam seus orgulhos\nMas eu fico mais uma hora"\n\nLuz Crua — Loranne\nmusic.seteveus.space\n\n#loranne #veus #luzcrua #manhã #domingo' },
  ]},
  { date: "2026-04-28", actions: [
    { type: "reel", label: "Reel — Devagar (Espelho do Medo)", albumSlug: "espelho-medo", trackNumber: 7, caption: '"Devagar como a lua sobe\nDevagar como a maré vem\nDevagar como a ferida fecha\nDevagar como quem quer bem"\n\nDevagar — Loranne\nmusic.seteveus.space\n\n#loranne #veus #devagar #calma' },
  ]},
  { date: "2026-04-29", actions: [
    { type: "post", label: "Post — verso A Roda", albumSlug: "espelho-ilusao", caption: "\"Roda, roda, roda sem parar\nQuem é esta mulher que vive no meu lugar\nRoda, roda, roda sem sentir\nHá alguém cá dentro a pedir pra sair\"\n\nHá uma canção para o momento em que percebes que estás a viver no automático.\nO sorriso certo. A resposta certa. A vida certa.\nTudo certo — menos tu.\n\nA Roda. Põe nos phones.\n\nmusic.seteveus.space\n\n#loranne #veus #aroda #automático #ouve" },
  ]},
  { date: "2026-04-30", actions: [
    { type: "reel", label: "Reel — O Reflexo Final", albumSlug: "livro-filosofico", trackNumber: 9, caption: '"Olha devagar, sem pressa\nO reflexo já não mente\nÉs tu — sempre foste tu\no princípio e o presente"\n\nO Reflexo Final — Loranne\nmusic.seteveus.space\n\n#loranne #veus #reflexo #verdade' },
  ]},
];

const TYPE_COLORS: Record<string, string> = {
  reel: "bg-violet-600/20 text-violet-400 border-violet-500/30",
  carrossel: "bg-pink-600/20 text-pink-400 border-pink-500/30",
  story: "bg-amber-600/20 text-amber-400 border-amber-500/30",
  post: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  partilha: "bg-green-600/20 text-green-400 border-green-500/30",
};

const TYPE_LABELS: Record<string, string> = {
  reel: "Reel",
  carrossel: "Carrossel",
  story: "Story",
  post: "Post",
  partilha: "Partilha",
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

export default function CalendarPage() {
  const [doneState, setDoneState] = useState<Record<string, boolean>>({});
  const [expandedCaption, setExpandedCaption] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState<Record<string, string>>({});

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("veus:content-calendar");
      if (saved) setDoneState(JSON.parse(saved));
    } catch {}
  }, []);

  function toggleDone(key: string) {
    setDoneState(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("veus:content-calendar", JSON.stringify(next));
      return next;
    });
  }

  const totalActions = PLAN.reduce((s, d) => s + d.actions.length, 0);
  const doneCount = Object.values(doneState).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0D0D1A] px-4 sm:px-6 py-10">
      <div className="max-w-screen-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#F5F0E6]">Plano de Conteudo</h1>
            <p className="text-sm text-[#666680] mt-1">Abril 2026 — Instagram + Partilha</p>
          </div>
          <Link href="/admin/producao" className="text-xs text-[#666680] hover:text-[#a0a0b0]">Producao</Link>
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
          {PLAN.map((day) => {
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
                            </div>
                            <p className={`text-sm mt-1 ${done ? "line-through" : "text-[#F5F0E6]"}`}>
                              {action.label}
                            </p>

                            {action.caption && (
                              <button
                                onClick={() => setExpandedCaption(showCaption ? null : key)}
                                className="text-[10px] text-[#C9A96E] mt-1 hover:underline"
                              >
                                {showCaption ? "Esconder legenda" : "Ver legenda"}
                              </button>
                            )}

                            {showCaption && action.caption && (
                              <div className="mt-2 p-3 rounded-lg bg-black/20 border border-white/5 relative">
                                <pre className="text-xs text-[#a0a0b0] whitespace-pre-wrap leading-relaxed">{action.caption}</pre>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(action.caption!);
                                  }}
                                  className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-[#C9A96E]/20 text-[#C9A96E]"
                                >
                                  Copiar
                                </button>
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="mt-2 flex flex-wrap gap-2">
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
                                        // Step 1: Generate 2 AI images from verse (fal.ai)
                                        setGenerating(p => ({ ...p, [key]: "1/4 A gerar 2 imagens IA..." }));
                                        const aiRes = await adminFetch("/api/admin/generate-verse-reel", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ caption: action.caption || track.description, numImages: 2 }),
                                        });
                                        const aiData = await aiRes.json();
                                        if (!aiRes.ok || !aiData.imageUrls?.length) { alert(`fal.ai: ${aiData.erro || JSON.stringify(aiData)}`); return; }

                                        // Step 2: 1 Loranne + 2 AI → send 3 to Runway in parallel
                                        const loranneImgs = pickLorannImages(albumSlug, trackNum, 1);
                                        const prodUrl = "https://music.seteveus.space";
                                        const imageUrls = [
                                          `${prodUrl}${loranneImgs[0]}`,
                                          aiData.imageUrls[0],
                                          aiData.imageUrls[1] || aiData.imageUrls[0],
                                        ];

                                        setGenerating(p => ({ ...p, [key]: "2/4 A enviar 3 clips para Runway..." }));
                                        const runwayPrompts = [
                                          "Slow cinematic movement, gentle fabric flowing, subtle light shift, ethereal atmosphere, the veil moves softly",
                                          "Slow cinematic push-in, gentle atmospheric haze, warm light rays shifting, dreamy and contemplative",
                                          "Gentle camera drift, soft fabric movement, light particles floating, intimate and warm atmosphere",
                                        ];

                                        const runwayResults = await Promise.all(imageUrls.map(async (imgUrl, idx) => {
                                          const res = await adminFetch("/api/admin/runway/generate", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                              albumSlug,
                                              trackNumber: trackNum * 10 + idx, // unique per clip
                                              imageUrl: imgUrl,
                                              promptText: runwayPrompts[idx],
                                              duration: 5,
                                              ratio: "720:1280",
                                            }),
                                          });
                                          return res.json();
                                        }));

                                        // Step 3: Poll all Runway tasks
                                        setGenerating(p => ({ ...p, [key]: "3/4 Runway a processar 3 clips..." }));
                                        const clipUrls: string[] = [];
                                        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";

                                        for (let idx = 0; idx < runwayResults.length; idx++) {
                                          const rd = runwayResults[idx];
                                          if (rd.status === "exists" && rd.videoUrl) {
                                            clipUrls.push(rd.videoUrl);
                                            continue;
                                          }
                                          if (!rd.taskId) { alert(`Runway clip ${idx + 1}: ${rd.erro || JSON.stringify(rd)}`); return; }

                                          const params = new URLSearchParams({
                                            taskId: rd.taskId,
                                            album: albumSlug,
                                            track: String(trackNum * 10 + idx),
                                          });
                                          let found = false;
                                          for (let i = 0; i < 120; i++) {
                                            await new Promise(r => setTimeout(r, 3000));
                                            const sRes = await adminFetch(`/api/admin/runway/status?${params}`);
                                            const sData = await sRes.json();
                                            if (sData.status === "complete" && sData.videoUrl) {
                                              clipUrls.push(sData.videoUrl);
                                              found = true;
                                              break;
                                            }
                                            if (sData.status === "error") { alert(`Runway clip ${idx + 1}: ${sData.error}`); return; }
                                            setGenerating(p => ({ ...p, [key]: `3/4 Clip ${idx + 1}/3... ${Math.min(Math.round(i * 1.2), 95)}%` }));
                                          }
                                          if (!found) { alert(`Timeout no clip ${idx + 1}`); return; }
                                        }

                                        // Step 4: Validate clips + mount with Shotstack
                                        setGenerating(p => ({ ...p, [key]: "4/4 A validar clips..." }));

                                        // Validate all clip URLs are accessible
                                        const clipChecks = await Promise.all(clipUrls.map(url => fetch(url, { method: "HEAD" }).then(r => r.ok).catch(() => false)));
                                        const badClips = clipChecks.filter(ok => !ok).length;
                                        if (badClips > 0) { alert(`${badClips} clip(s) inacessíveis. Os vídeos do Runway podem ter expirado.`); return; }

                                        const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
                                        const audioUrl = `${sbUrl}/storage/v1/object/public/audios/albums/${albumSlug.replace(/[^a-z0-9-]/g, "")}/faixa-${String(trackNum).padStart(2, "0")}.mp3`;

                                        // Validate audio exists
                                        const audioCheck = await fetch(audioUrl, { method: "HEAD" }).then(r => r.ok).catch(() => false);
                                        if (!audioCheck) { alert(`Áudio não encontrado: ${audioUrl}`); return; }

                                        setGenerating(p => ({ ...p, [key]: "4/4 Shotstack a montar..." }));

                                        const verse = (() => {
                                          if (!track.lyrics) return "";
                                          const lines = track.lyrics.split("\n").filter((l: string) => { const t = l.trim(); return t.length > 15 && t.length < 80 && !t.startsWith("["); });
                                          return lines[0]?.trim() || "";
                                        })();

                                        const shotRes = await adminFetch("/api/admin/shotstack/render", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({
                                            clipUrls,
                                            audioUrl,
                                            verse,
                                            trackTitle: track.title,
                                            albumTitle: alb.title,
                                          }),
                                        });
                                        const shotData = await shotRes.json();
                                        if (!shotRes.ok || !shotData.id) { alert(`Shotstack: ${shotData.erro || JSON.stringify(shotData)}`); return; }

                                        // Poll Shotstack
                                        for (let i = 0; i < 120; i++) {
                                          await new Promise(r => setTimeout(r, 3000));
                                          const sRes = await adminFetch(`/api/admin/shotstack/status?id=${shotData.id}`);
                                          const sData = await sRes.json();
                                          if (sData.status === "done" && sData.videoUrl) {
                                            setGeneratedImages(p => ({ ...p, [key]: sData.videoUrl }));
                                            break;
                                          }
                                          if (sData.status === "failed") { alert(`Shotstack falhou: ${sData.error}`); return; }
                                          setGenerating(p => ({ ...p, [key]: `4/4 A renderizar... ${Math.min(Math.round(i * 1.2), 95)}%` }));
                                        }
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
                                      setGenerating(p => ({ ...p, [key]: "A gerar fundo..." }));
                                      try {
                                        // Step 1: Get background image from fal.ai
                                        const res = await adminFetch("/api/admin/generate-post-image", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ caption: action.caption || "", albumTitle: getAlbumTitle(action.albumSlug) }),
                                        });
                                        const data = await res.json();
                                        if (!res.ok || !data.imageUrl) { alert(`Erro: ${data.erro || JSON.stringify(data)}`); return; }

                                        // Step 2: Overlay text on canvas
                                        setGenerating(p => ({ ...p, [key]: "A compor imagem..." }));
                                        const finalUrl = await overlayTextOnImage(data.imageUrl, action.caption || "");
                                        setGeneratedImages(p => ({ ...p, [key]: finalUrl }));
                                      } catch (err) {
                                        alert(`Erro: ${(err as Error).message}`);
                                      } finally {
                                        setGenerating(p => { const n = { ...p }; delete n[key]; return n; });
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-blue-600/30 text-blue-400 text-xs min-h-[44px]"
                                  >
                                    {generating[key] || "Gerar Post IA"}
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
      </div>
    </div>
  );
}
