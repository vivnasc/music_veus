"use client";

import { useState, useEffect, useCallback, type ChangeEvent } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";
import { pickLorannImages } from "@/lib/loranne-images";

const CALENDAR_STORAGE_KEY = "veus:content-calendar-plan";

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

const DEFAULT_PLAN: DayPlan[] = [
  // ── SEMANA 1: Lançamento "Os Sete Temas do Despertar" ──
  { date: "2026-04-01", actions: [
    { type: "reel", label: "Reel — O Convite", albumSlug: "livro-filosofico", trackNumber: 1, caption: '"Há uma porta que não se vê\nno centro exacto do teu peito"\n\nO Convite — Loranne\nmusic.seteveus.space\n\n#loranne #veus #oconvite #ouve' },
  ]},
  { date: "2026-04-02", actions: [
    { type: "carrossel", label: "Carrossel — Os Sete Temas do Despertar", albumSlug: "livro-filosofico", caption: "os sete temas do despertar.\n9 faixas.\n\n1. o convite\n2. the impermanence of you\n3. a cadeira vazia\n4. the whirlwind\n5. a plenitude que já está\n6. the fertile dark\n7. o horizonte\n8. the reunion\n9. o reflexo final\n\nantes de qualquer álbum houve um livro.\nnão como projecto. como travessia.\n\nos 7 véus não foram escritos.\nforam atravessados.\n\ncada faixa não ensina. expõe.\nnão aponta. desnuda.\nnão constrói nada novo. retira.\n\naté ficar só o que não precisa de ser segurado.\n\nmusic.seteveus.space\n\n#loranne #veus #ouve" },
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
    { type: "post", label: "Post — sobre o álbum", albumSlug: "livro-filosofico", caption: "este álbum não nasceu de inspiração.\nnasceu de ruptura.\n\nruptura com a ideia de permanência.\ncom a necessidade de entender.\ncom a urgência de me resolver.\n\nhá uma cadeira onde fiquei sentada tempo demais\na olhar para o que já tinha passado\ncomo se ainda pudesse mudar.\n\ne houve um momento em que levantei.\n\nnão porque estava pronta.\nmas porque ficar já não era possível.\n\nno fim não há versão melhor.\nnão há resposta final.\n\nhá só isto:\num reflexo que já não distorce.\ne a estranheza de perceber\nque sempre fui eu.\n\n9 faixas. português e inglês.\n\nmusic.seteveus.space\n\n#loranne #veus #ouve" },
  ]},

  // ── SEMANA 2: Lançamento Ilusão + Viagem + Saudade ──
  { date: "2026-04-07", actions: [
    { type: "reel", label: "Reel — Vertigem (Vasto)", albumSlug: "eter-vasto", trackNumber: 1, caption: '"Olhei para cima e o chão fugiu\nO céu não tem fundo e eu também não\nA vertigem de existir\né a mesma de cair — sem chão"\n\nVertigem — Loranne\nVasto\nmusic.seteveus.space\n\n#loranne #veus #vasto #vertigem #céu' },
  ]},
  { date: "2026-04-08", actions: [
    { type: "carrossel", label: "Lançamento — Ilusão (Espelhos)", albumSlug: "espelho-ilusao", caption: "Ilusão.\n10 faixas sobre as máscaras que vestimos.\n\n\"Roda, roda, roda sem parar\nQuem é esta mulher que vive no meu lugar\"\n\nO segundo álbum da Loranne já está em todas as plataformas.\nPõe nos phones e fecha os olhos.\n\nmusic.seteveus.space\n\n#loranne #veus #ilusão #espelhos #novoalbum #ouve" },
    { type: "reel", label: "Reel — A Roda (Ilusão)", albumSlug: "espelho-ilusao", trackNumber: 1, caption: '"Roda, roda, roda sem parar\nQuem é esta mulher que vive no meu lugar\nRoda, roda, roda sem sentir\nHá alguém cá dentro a pedir pra sair"\n\nA Roda — Loranne\nIlusão\nmusic.seteveus.space\n\n#loranne #veus #aroda #automático #ouve' },
  ]},
  { date: "2026-04-09", actions: [
    { type: "reel", label: "Reel — The Impermanence of You", albumSlug: "livro-filosofico", trackNumber: 2, caption: '"Nothing stays — nothing was meant to stay\nThe self you grip is made of rain\nLet the permanence dissolve like morning\nand find what lives beneath the pain"\n\nThe Impermanence of You — Loranne\nmusic.seteveus.space\n\n#loranne #veus #impermanence #letgo' },
    { type: "reel", label: "Reel — O teu lado da cama (Saudade)", albumSlug: "nua-saudade", trackNumber: 1, caption: '"O teu lado da cama está frio\nA marca do teu corpo desapareceu\nMas eu deito-me do meu lado\nComo se o teu ainda existisse"\n\nSaudade — Loranne\nmusic.seteveus.space\n\n#loranne #veus #saudade #falta #amor' },
  ]},
  { date: "2026-04-10", actions: [
    { type: "carrossel", label: "Carrossel — Viagem", albumSlug: "eter-viagem", caption: "viagem.\n10 faixas.\n\nàs vezes é no meio da repetição.\nquando o corpo já não negocia.\noutras é no descanso.\nquando percebo que parar também é força.\n\n\"home is not a place\nhome is a frequency I recognise\nwhen the noise stops\nand the body softens\"\n\neste álbum não foi feito.\nfoi atravessado.\n\nentre o impulso de provar\ne o momento em que já não preciso.\n\nmusic.seteveus.space\n\n#loranne #veus #viagem #ouve" },
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
    { type: "post", label: "Post — sobre Duas Vozes", albumSlug: "nua-duas-vozes", caption: "às vezes é quando recebo algo\ne não tento pagar de volta.\nsó deixo ficar.\n\no amor não está no que digo.\nestá no que faço sem pensar.\n\nno prato que já está quente quando chego.\nno silêncio que não precisa de nada.\nna forma como despes o dia\ne eu não preciso de perguntar como foi.\n\nnão escrevo sobre amor.\nescrevo quando ele aparece.\n\n10 faixas.\n\nmusic.seteveus.space\n\n#loranne #veus #duasvozes #ouve" },
  ]},
  { date: "2026-04-16", actions: [
    { type: "reel", label: "Reel — Sinal", albumSlug: "eter-sinal", trackNumber: 1, caption: '"O arrepio veio do nada\nNinguém tocou, ninguém falou\nEstava na fila do supermercado\nE o corpo inteiro arrepiou"\n\nSinal — Loranne\nmusic.seteveus.space\n\n#loranne #veus #sinal #arrepio #corpo' },
  ]},
  { date: "2026-04-17", actions: [
    { type: "carrossel", label: "Carrossel — Pele", albumSlug: "nua-pele", caption: "pele.\n10 faixas.\n\na música acontece aí.\nnão como ideia.\nmas como consequência.\n\ncomo algo que aparece\nquando eu deixo de interferir.\n\n\"apaixonei-me pelo teu cansaço\npela forma como despes o dia\npelo suspiro entre a porta e o sofá\npela tua falta de energia\"\n\nnão escrevo para resolver.\nnem para melhorar o que sinto.\nescrevo quando já não há nada para fazer\na não ser ficar.\n\nmusic.seteveus.space\n\n#loranne #veus #pele #ouve" },
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
    { type: "post", label: "Post — sobre mães", albumSlug: "no-heranca", caption: "entre o peso que não mente\ne as histórias que eu contava para não sentir.\n\nesta canção nasceu aí.\nno espaço entre o que a minha mãe disse\ne o que ela guardou.\n\nno silêncio depois de dizer algo\nque evitei durante anos.\nno corpo que ainda está quente\nmas já não tem palavras.\n\n\"years I held the rain inside my chest\nI wore the silence like a wedding dress\"\n\nnão é terapia.\nmas muda coisas.\nnão é um método.\nmas transforma na mesma.\n\nmusic.seteveus.space\n\n#loranne #veus #herança #ouve" },
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
    { type: "post", label: "Post — Ilusão 3 semanas depois", albumSlug: "espelho-ilusao", caption: "no intervalo entre dois dias iguais.\nno meio de um set.\nno momento em que já estava a fazer tudo certo.\n\ne de repente\njá não estou a pensar.\nestou só ali.\n\n\"roda, roda, roda sem parar\nquem é esta mulher que vive no meu lugar\"\n\na música não veio como ideia.\nveio como consequência.\n\nalgo que apareceu\nquando eu deixei de interferir.\n\nsem corrigir.\nsem provar.\nsem sair.\n\nsó ali.\n\nmusic.seteveus.space\n\n#loranne #veus #aroda #ouve" },
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
                                        // Step 1: Generate 4 AI images from verse (fal.ai + LoRA)
                                        setGenerating(p => ({ ...p, [key]: "1/4 A gerar 4 imagens IA..." }));
                                        const aiRes = await adminFetch("/api/admin/generate-verse-reel", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ caption: action.caption || track.description, numImages: 4 }),
                                        });
                                        const aiData = await aiRes.json();
                                        if (!aiRes.ok || !aiData.imageUrls?.length) { alert(`fal.ai: ${aiData.erro || JSON.stringify(aiData)}`); return; }

                                        // Step 2: 2 Loranne poses + 4 AI = 6 clips × 5s = 30s
                                        const loranneImgs = pickLorannImages(albumSlug, trackNum, 2);

                                        const loranneBase64List: (string | null)[] = [];
                                        for (const imgPath of loranneImgs) {
                                          try {
                                            const loranneRes = await fetch(imgPath);
                                            if (loranneRes.ok) {
                                              const blob = await loranneRes.blob();
                                              const reader = new FileReader();
                                              const b64 = await new Promise<string>((resolve, reject) => {
                                                reader.onloadend = () => resolve(reader.result as string);
                                                reader.onerror = reject;
                                                reader.readAsDataURL(blob);
                                              });
                                              loranneBase64List.push(b64);
                                            } else {
                                              loranneBase64List.push(null);
                                            }
                                          } catch (e) {
                                            console.warn("Failed to load Loranne image locally:", e);
                                            loranneBase64List.push(null);
                                          }
                                        }

                                        const imageInputs: { imageUrl?: string; imageBase64?: string }[] = [
                                          loranneBase64List[0] ? { imageBase64: loranneBase64List[0] } : { imageUrl: `${window.location.origin}${loranneImgs[0]}` },
                                          { imageUrl: aiData.imageUrls[0] },
                                          { imageUrl: aiData.imageUrls[1] || aiData.imageUrls[0] },
                                          loranneBase64List[1] ? { imageBase64: loranneBase64List[1] } : { imageUrl: `${window.location.origin}${loranneImgs[1] || loranneImgs[0]}` },
                                          { imageUrl: aiData.imageUrls[2] || aiData.imageUrls[0] },
                                          { imageUrl: aiData.imageUrls[3] || aiData.imageUrls[1] || aiData.imageUrls[0] },
                                        ];

                                        setGenerating(p => ({ ...p, [key]: "2/4 A enviar 6 clips para Runway..." }));
                                        const runwayPrompts = [
                                          "Very slow subtle zoom in, portrait photograph, gentle light shift on face, minimal movement, ken burns effect",
                                          "Slow cinematic push-in, gentle atmospheric haze, warm light rays shifting, dreamy and contemplative",
                                          "Gentle camera drift, soft light particles floating, subtle shadows moving, intimate warm atmosphere",
                                          "Very slow pan right, portrait close-up, warm golden light caressing face, ken burns effect",
                                          "Slow dolly out, atmospheric dust particles, volumetric light beams, ethereal and meditative",
                                          "Gentle tilt up, soft bokeh lights emerging, warm ambient glow, peaceful contemplation",
                                        ];

                                        const totalClips = imageInputs.length;
                                        const runwayResults = await Promise.all(imageInputs.map(async (imgInput, idx) => {
                                          const clipTrackNum = trackNum * 100 + idx + 1;
                                          const res = await adminFetch("/api/admin/runway/generate", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                              albumSlug,
                                              trackNumber: clipTrackNum,
                                              ...imgInput,
                                              promptText: runwayPrompts[idx],
                                              duration: 5,
                                              ratio: "720:1280",
                                            }),
                                          });
                                          return { ...(await res.json()), clipTrackNum };
                                        }));

                                        // Step 3: Poll all Runway tasks
                                        setGenerating(p => ({ ...p, [key]: "3/4 Runway a processar 6 clips..." }));
                                        const clipUrls: string[] = [];

                                        for (let idx = 0; idx < runwayResults.length; idx++) {
                                          const rd = runwayResults[idx];
                                          if (rd.status === "exists" && rd.videoUrl) {
                                            clipUrls.push(rd.videoUrl);
                                            continue;
                                          }
                                          if (!rd.taskId) {
                                            console.warn(`Runway clip ${idx + 1}: sem taskId — ${rd.erro || JSON.stringify(rd)}`);
                                            continue;
                                          }

                                          const params = new URLSearchParams({
                                            taskId: rd.taskId,
                                            album: albumSlug,
                                            track: String(rd.clipTrackNum),
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
                                            if (sData.status === "error") {
                                              console.warn(`Runway clip ${idx + 1} falhou: ${sData.error}`);
                                              break;
                                            }
                                            setGenerating(p => ({ ...p, [key]: `3/4 Clip ${idx + 1}/${totalClips}... ${Math.min(Math.round(i * 1.2), 95)}%` }));
                                          }
                                          if (!found) console.warn(`Clip ${idx + 1} não disponível, a continuar com os restantes...`);
                                        }
                                        if (clipUrls.length < 4) { alert(`Apenas ${clipUrls.length} clip(s) disponíveis. Mínimo 4 necessários para 30s.`); return; }

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
