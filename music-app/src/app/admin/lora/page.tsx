"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

const STORAGE_KEY = "veus:lora-training";

const TRAINING_SCENES = [
  // From behind (8)
  "woman seen from behind in a dark room, back to camera, warm amber backlight, golden fabric flowing",
  "woman from behind at the ocean, golden silhouette against sunset light",
  "woman from behind seated at a piano, golden fabric on shoulders, candlelight",
  "woman walking away through morning fog, golden fabric trailing behind her",
  "woman from behind on a rooftop at dusk, looking at city lights, golden fabric in wind",
  "woman walking away through rain, golden fabric flowing, wet cobblestones, street lamps",
  "woman from behind in a doorway, extreme golden backlight, pure silhouette",
  "woman from behind dancing, golden fabric spinning around her body",
  // Pure silhouette against light (6)
  "pure black silhouette of a woman against bright golden window light, no details visible, only outline and flowing fabric",
  "silhouette of woman standing in a doorway, blown-out golden backlight, entire figure is dark shadow",
  "woman as a pure dark silhouette against golden sunset sky, fabric outline flowing in wind",
  "silhouette of woman with fabric, backlit by a single golden light source, completely dark figure against bright background",
  "silhouette of woman at a window, golden morning light behind her, no features visible, just dark shape and flowing fabric",
  "silhouette of woman with arms extended, golden fabric as dark flowing shapes against bright amber background",
  // Hands and body only (4)
  "close-up of woman's hands holding a cup, golden fabric sleeves, warm candlelight, no face in frame",
  "close-up of woman's hands on piano keys, golden fabric sleeves, warm light, cropped below neck",
  "close-up of woman's hands holding golden fabric, warm amber light, artistic crop no face",
  "woman's body from neck down, golden fabric draped, sitting in warm light, artistic composition no face",
  // Far away / wide shot (3)
  "extreme wide shot of tiny woman silhouette standing alone in golden field, figure very small in landscape",
  "woman seen from very far away walking on empty beach at golden hour, tiny figure against vast ocean",
  "aerial view from above of woman lying in golden fabric on dark floor, seen from directly overhead",
  // Profile in deep shadow (3)
  "woman in profile but face entirely lost in deep black shadow, only the golden lit side of body and fabric visible",
  "woman's profile but face is in complete darkness, golden backlight rim on hair and fabric edge only",
  "woman turned to the side, face area completely dark shadowed, only golden fabric on body catches light",
];

type TrainingImage = {
  url: string;
  scene: string;
  selected: boolean;
  rejected: boolean;
};

type SavedState = {
  images: TrainingImage[];
  triggerWord: string;
  steps: number;
};

export default function LoraPage() {
  const [images, setImages] = useState<TrainingImage[]>([]);
  const [triggerWord, setTriggerWord] = useState("loranne_artist");
  const [steps, setSteps] = useState(1200);
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState("");
  const [trainingStatus, setTrainingStatus] = useState<string | null>(null);
  const [activeLoraUrl, setActiveLoraUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data: SavedState = JSON.parse(saved);
        if (data.images?.length) setImages(data.images);
        if (data.triggerWord) setTriggerWord(data.triggerWord);
        if (data.steps) setSteps(data.steps);
      }
    } catch {}
    // Load active LoRA
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
    fetch(`${sbUrl}/storage/v1/object/public/audios/lora/active-lora.json`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.loraUrl) setActiveLoraUrl(d.loraUrl); })
      .catch(() => {});
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ images, triggerWord, steps }));
    } catch {}
  }, [images, triggerWord, steps]);

  const selectedImages = images.filter(i => i.selected && !i.rejected);
  const rejectedCount = images.filter(i => i.rejected).length;

  // ─── Generate 24 training images ───

  async function generateAll() {
    setGenerating(true);
    setError(null);
    setImages([]);
    const allImages: TrainingImage[] = [];

    // Generate in batches of 4 (fal.ai max per request), 6 batches = 24
    const scenes = [...TRAINING_SCENES].sort(() => Math.random() - 0.5).slice(0, 24);
    const batches: string[][] = [];
    for (let i = 0; i < scenes.length; i += 4) {
      batches.push(scenes.slice(i, i + 4));
    }

    for (let b = 0; b < batches.length; b++) {
      setGenProgress(`Batch ${b + 1}/${batches.length} (${allImages.length}/${scenes.length} geradas)...`);

      // Generate each scene individually (1 image per scene for variety)
      const batchPromises = batches[b].map(async (scene) => {
        try {
          const res = await adminFetch("/api/admin/generate-loranne", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: scene, numImages: 1, useLoRA: false }),
          });
          const data = await res.json();
          if (res.ok && data.imageUrls?.length) {
            return { url: data.imageUrls[0], scene, selected: true, rejected: false };
          }
          return null;
        } catch { return null; }
      });

      const results = await Promise.all(batchPromises);
      for (const r of results) {
        if (r) {
          allImages.push(r);
          setImages([...allImages]);
        }
      }
    }

    setGenProgress("");
    setGenerating(false);
    if (allImages.length === 0) setError("Nenhuma imagem gerada. Verifica a FAL_KEY.");
  }

  function toggleImage(idx: number) {
    setImages(prev => prev.map((img, i) => {
      if (i !== idx) return img;
      if (img.rejected) return { ...img, rejected: false, selected: true };
      if (img.selected) return { ...img, selected: false, rejected: true };
      return { ...img, selected: true, rejected: false };
    }));
  }

  async function regenerateOne(idx: number) {
    const scene = images[idx]?.scene || TRAINING_SCENES[idx % TRAINING_SCENES.length];
    setImages(prev => prev.map((img, i) => i === idx ? { ...img, url: "", selected: true, rejected: false } : img));
    try {
      const res = await adminFetch("/api/admin/generate-loranne", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: scene, numImages: 1, useLoRA: false }),
      });
      const data = await res.json();
      if (res.ok && data.imageUrls?.[0]) {
        setImages(prev => prev.map((img, i) => i === idx ? { ...img, url: data.imageUrls[0] } : img));
      }
    } catch {}
  }

  // ─── Train LoRA ───

  async function startTraining() {
    if (selectedImages.length < 10) {
      alert(`Precisa de pelo menos 10 imagens. Tens ${selectedImages.length} seleccionadas.`);
      return;
    }
    setError(null);

    try {
      setTrainingStatus("1/3 A criar ZIP...");
      const imageUrls = selectedImages.map(i => i.url);
      const zipRes = await adminFetch("/api/admin/lora/create-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls }),
      });
      const zipData = await zipRes.json();
      if (!zipRes.ok || !zipData.zipUrl) throw new Error(zipData.erro || "ZIP falhou");

      setTrainingStatus("2/3 A enviar para treino...");
      const trainRes = await adminFetch("/api/admin/lora/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipUrl: zipData.zipUrl, triggerWord, steps }),
      });
      const trainData = await trainRes.json();
      if (!trainRes.ok || !trainData.requestId) throw new Error(trainData.erro || "Treino falhou");

      setTrainingStatus("3/3 A treinar... 0%");
      for (let i = 0; i < 360; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const sRes = await adminFetch(`/api/admin/lora/status?requestId=${trainData.requestId}&triggerWord=${encodeURIComponent(triggerWord)}`);
        const sData = await sRes.json();
        if (sData.status === "complete" && sData.loraUrl) {
          setActiveLoraUrl(sData.loraUrl);
          setTrainingStatus(null);
          alert(`LoRA treinado!\nTrigger: ${triggerWord}\n${selectedImages.length} imagens`);
          return;
        }
        if (sData.status === "error") throw new Error(sData.error || "Treino falhou");
        const pct = sData.progress ? `${Math.round(sData.progress * 100)}%` : `${Math.min(Math.round(i * 0.4), 95)}%`;
        setTrainingStatus(`3/3 A treinar... ${pct}`);
      }
      throw new Error("Timeout — treino demorou mais de 30 minutos");
    } catch (err) {
      setError((err as Error).message);
      setTrainingStatus(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <div className="flex items-center gap-4 text-xs text-[#666680] mb-5">
          <Link href="/admin/producao" className="hover:text-[#a0a0b0]">← Producao</Link>
          <Link href="/admin/shorts" className="hover:text-[#a0a0b0]">Shorts</Link>
          <Link href="/admin/fotos" className="hover:text-[#a0a0b0]">Fotos</Link>
        </div>

        <h1 className="font-display text-2xl text-[#F5F0E6] mb-1">Treinar LoRA — Loranne</h1>
        <p className="text-sm text-[#a0a0b0] mb-6">Gera imagens limpas (sem rosto, sem nudez) e treina uma LoRA de conceito visual.</p>

        {activeLoraUrl && (
          <div className="mb-6 rounded-xl bg-fuchsia-900/10 border border-fuchsia-500/20 px-4 py-3">
            <p className="text-sm text-fuchsia-400">LoRA activo — trigger: <strong>{triggerWord}</strong></p>
          </div>
        )}

        {error && <div className="mb-4 rounded-xl bg-red-900/20 border border-red-500/20 px-4 py-3 text-xs text-red-400">{error}</div>}

        {/* ═══ Step 1: Generate ═══ */}
        <div className="rounded-xl bg-[#1A1A2E]/60 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider">1. Gerar imagens de treino</h2>
            <span className="text-[11px] text-[#666680]">Flux Pro (sem LoRA) — {TRAINING_SCENES.length} cenas variadas</span>
          </div>

          {images.length === 0 && !generating && (
            <button onClick={generateAll} className="rounded-xl px-6 py-3 text-sm font-medium bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition">
              Gerar 24 imagens
            </button>
          )}

          {generating && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-fuchsia-400">{genProgress}</p>
            </div>
          )}
        </div>

        {/* ═══ Step 2: Review ═══ */}
        {images.length > 0 && (
          <div className="rounded-xl bg-[#1A1A2E]/60 p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider">2. Rever e curar</h2>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-green-400">{selectedImages.length} aceites</span>
                <span className="text-red-400">{rejectedCount} rejeitadas</span>
                <span className="text-[#666680]">{images.length} total</span>
              </div>
            </div>
            <p className="text-[11px] text-[#666680] mb-3">
              Clica: <span className="text-green-400">verde</span> = aceite, <span className="text-red-400">vermelho</span> = rejeitada, clica de novo = alterna. Duplo-clique = regenerar.
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={img.scene}
                      onClick={() => toggleImage(idx)}
                      onDoubleClick={() => regenerateOne(idx)}
                      className={`w-full aspect-square object-cover rounded-lg cursor-pointer transition ring-2 ${
                        img.rejected ? "ring-red-500 opacity-30 grayscale" :
                        img.selected ? "ring-green-500" :
                        "ring-transparent opacity-50"
                      }`}
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <div className={`absolute top-1 left-1 text-[8px] px-1 py-0.5 rounded font-bold ${
                    img.rejected ? "bg-red-500/80 text-white" :
                    img.selected ? "bg-green-500/80 text-white" :
                    "bg-black/60 text-white/60"
                  }`}>
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setImages(prev => prev.map(i => ({ ...i, selected: true, rejected: false })))} className="text-[11px] text-green-400 hover:text-green-300">Aceitar todas</button>
              <button onClick={() => setImages(prev => prev.map(i => ({ ...i, selected: false, rejected: true })))} className="text-[11px] text-red-400 hover:text-red-300">Rejeitar todas</button>
              <button onClick={generateAll} className="text-[11px] text-fuchsia-400 hover:text-fuchsia-300">Gerar 24 novas</button>
              <button onClick={() => { setImages([]); }} className="text-[11px] text-[#666680] hover:text-[#a0a0b0] ml-auto">Limpar tudo</button>

              {/* Upload custom */}
              <button onClick={() => fileRef.current?.click()} className="text-[11px] text-blue-400 hover:text-blue-300">+ Carregar imagem</button>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={async (e) => {
                if (!e.target.files) return;
                for (const file of Array.from(e.target.files)) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImages(prev => [...prev, { url: reader.result as string, scene: file.name, selected: true, rejected: false }]);
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </div>
          </div>
        )}

        {/* ═══ Step 3: Train ═══ */}
        {selectedImages.length >= 10 && (
          <div className="rounded-xl bg-[#1A1A2E]/60 p-5">
            <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">3. Treinar LoRA</h2>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div>
                <label className="block text-[10px] text-[#666680] uppercase tracking-wider mb-1">Trigger</label>
                <input type="text" value={triggerWord} onChange={e => setTriggerWord(e.target.value)} className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-[#F5F0E6] w-44 focus:border-fuchsia-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-[#666680] uppercase tracking-wider mb-1">Steps</label>
                <input type="number" value={steps} onChange={e => setSteps(parseInt(e.target.value) || 1200)} className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-[#F5F0E6] w-24 focus:border-fuchsia-500/50 focus:outline-none" />
              </div>
              <div className="self-end text-[11px] text-[#666680]">{selectedImages.length} imagens — ~${(steps * 0.0024).toFixed(2)}</div>
            </div>

            <button
              onClick={startTraining}
              disabled={!!trainingStatus}
              className={`rounded-xl px-8 py-3 text-sm font-medium transition ${trainingStatus ? "bg-fuchsia-900/30 text-fuchsia-400 animate-pulse" : "bg-fuchsia-600 text-white hover:bg-fuchsia-500"}`}
            >
              {trainingStatus || `Treinar LoRA (${selectedImages.length} imagens)`}
            </button>
          </div>
        )}

        {selectedImages.length > 0 && selectedImages.length < 10 && (
          <div className="rounded-xl bg-[#1A1A2E]/60 p-5">
            <p className="text-sm text-[#666680]">Selecciona pelo menos 10 imagens para treinar. Tens {selectedImages.length}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
