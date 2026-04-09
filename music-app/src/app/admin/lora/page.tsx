"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

// All available Loranne poses
const EXISTING_POSES = [
  "/poses/loranne-hero.png",
  "/Loranne.png",
  ...Array.from({ length: 9 }, (_, i) => i + 1).filter(i => i !== 8).map(i => `/poses/loranne2-${String(i).padStart(2, "0")}.png`),
  ...Array.from({ length: 9 }, (_, i) => i + 1).filter(i => i !== 8).map(i => `/poses/loranne3-${String(i).padStart(2, "0")}.png`),
  ...Array.from({ length: 9 }, (_, i) => i + 1).map(i => `/poses/loranne4-${String(i).padStart(2, "0")}.png`),
  ...Array.from({ length: 8 }, (_, i) => i + 1).map(i => `/poses/loranne5-${String(i).padStart(2, "0")}.png`),
  ...Array.from({ length: 9 }, (_, i) => i + 1).filter(i => i !== 8).map(i => `/poses/loranne6-${String(i).padStart(2, "0")}.png`),
  ...Array.from({ length: 4 }, (_, i) => i + 1).map(i => `/poses/loranne7-${String(i).padStart(2, "0")}.png`),
  ...Array.from({ length: 4 }, (_, i) => i + 1).map(i => `/poses/loranne8-${String(i).padStart(2, "0")}.png`),
  ...Array.from({ length: 4 }, (_, i) => i + 1).map(i => `/poses/velas-${String(i).padStart(2, "0")}.png`),
];

// Best images pre-selected for LoRA training:
// - Clear/consistent facial features visible (even through veil)
// - Good lighting and quality
// - Variety of angles, poses, and compositions
// - Excludes: velas (no face), loranne5 (too dark/face hidden), redundant poses
const BEST_FOR_TRAINING: Set<string> = new Set([
  "/poses/loranne-hero.png",
  "/Loranne.png",
  // loranne2: classic warm series, good variety
  "/poses/loranne2-01.png",
  "/poses/loranne2-02.png",
  "/poses/loranne2-03.png",
  "/poses/loranne2-04.png",
  "/poses/loranne2-05.png",
  "/poses/loranne2-06.png",
  "/poses/loranne2-07.png",
  // loranne3: dynamic movement, full body
  "/poses/loranne3-01.png",
  "/poses/loranne3-03.png",
  "/poses/loranne3-05.png",
  "/poses/loranne3-07.png",
  // loranne4: warm tones, varied angles
  "/poses/loranne4-02.png",
  "/poses/loranne4-03.png",
  "/poses/loranne4-06.png",
  "/poses/loranne4-07.png",
  "/poses/loranne4-09.png",
  // loranne6: intimate close-ups, best face visibility
  "/poses/loranne6-01.png",
  "/poses/loranne6-02.png",
  "/poses/loranne6-03.png",
  "/poses/loranne6-05.png",
  "/poses/loranne6-07.png",
  // loranne7: strong portraits, closest face views
  "/poses/loranne7-01.png",
  "/poses/loranne7-02.png",
  "/poses/loranne7-03.png",
  // loranne8: close-up detail
  "/poses/loranne8-02.png",
  "/poses/loranne8-04.png",
]);

export default function LoraPage() {
  const [selectedPoses, setSelectedPoses] = useState<Set<string>>(new Set(BEST_FOR_TRAINING));
  const [uploadedImages, setUploadedImages] = useState<{ url: string; name: string }[]>([]);
  const [triggerWord, setTriggerWord] = useState("loranne_artist");
  const [steps, setSteps] = useState(1000);
  const [status, setStatus] = useState<string | null>(null);
  const [activeLoraUrl, setActiveLoraUrl] = useState<string | null>(null);
  const [activeTrigger, setActiveTrigger] = useState<string>("loranne_artist");
  const [genPrompt, setGenPrompt] = useState("");
  const [genCount, setGenCount] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load active LoRA from Supabase on mount
  useEffect(() => {
    fetch("/api/published-tracks") // just to warm up, the real check:
      .catch(() => {});
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
    fetch(`${supabaseUrl}/storage/v1/object/public/audios/lora/active-lora.json`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.loraUrl) {
          setActiveLoraUrl(data.loraUrl);
          setActiveTrigger(data.triggerWord || "loranne_artist");
        }
      })
      .catch(() => {});
  }, []);

  const togglePose = (url: string) => {
    setSelectedPoses(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const removeUploaded = (idx: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, { url: reader.result as string, name: file.name }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalImages = selectedPoses.size + uploadedImages.length;

  const startTraining = async () => {
    if (totalImages < 10) {
      alert("Precisa de pelo menos 10 imagens para treinar o LoRA.");
      return;
    }

    try {
      // Step 1: Collect all image URLs
      setStatus("1/3 A preparar dataset...");

      // Convert poses to full URLs and uploaded images to data URLs
      const allImageUrls: string[] = [];

      // Existing poses — use origin URL
      for (const pose of selectedPoses) {
        allImageUrls.push(`${window.location.origin}${pose}`);
      }

      // Uploaded images — need to upload to Supabase first
      if (uploadedImages.length > 0) {
        for (const img of uploadedImages) {
          // Upload via a simple form to get a public URL
          const blob = await fetch(img.url).then(r => r.blob());
          const form = new FormData();
          form.append("albumSlug", "loranne");
          form.append("trackNumber", String(Date.now() % 10000));
          form.append("image", blob, img.name);
          const uploadRes = await adminFetch("/api/admin/upload-cover", { method: "POST", body: form });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.url) allImageUrls.push(uploadData.url);
          }
        }
      }

      // Step 2: Create ZIP via server
      setStatus(`2/3 A criar ZIP com ${allImageUrls.length} imagens...`);
      const zipRes = await adminFetch("/api/admin/lora/create-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls: allImageUrls }),
      });
      const zipData = await zipRes.json();
      if (!zipRes.ok || !zipData.zipUrl) {
        alert(`Erro ZIP: ${zipData.erro || JSON.stringify(zipData)}`);
        setStatus(null);
        return;
      }

      // Step 3: Train
      setStatus("3/3 A enviar para treino...");
      const trainRes = await adminFetch("/api/admin/lora/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipUrl: zipData.zipUrl, triggerWord, steps }),
      });
      const trainData = await trainRes.json();
      if (!trainRes.ok || !trainData.requestId) {
        alert(`Erro treino: ${trainData.erro || JSON.stringify(trainData)}`);
        setStatus(null);
        return;
      }

      // Step 4: Poll
      setStatus("A treinar... 0%");
      for (let i = 0; i < 360; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const sRes = await adminFetch(
          `/api/admin/lora/status?requestId=${trainData.requestId}&triggerWord=${encodeURIComponent(triggerWord)}`
        );
        const sData = await sRes.json();

        if (sData.status === "complete" && sData.loraUrl) {
          setActiveLoraUrl(sData.loraUrl);
          setStatus("LoRA treinado!");
          alert(
            `LoRA treinado com sucesso!\n\nTrigger: ${triggerWord}\nURL: ${sData.loraUrl}\n\nGuardado no Supabase — será usado automaticamente para gerar imagens.`
          );
          return;
        }
        if (sData.status === "error") {
          alert(`Treino falhou: ${sData.error}`);
          setStatus(null);
          return;
        }
        const pct = sData.progress
          ? `${Math.round(sData.progress * 100)}%`
          : `${Math.min(Math.round(i * 0.4), 95)}%`;
        setStatus(`A treinar... ${pct}`);
      }

      alert("Timeout — treino demorou mais de 30 minutos.");
      setStatus(null);
    } catch (err) {
      alert(`Erro: ${err}`);
      setStatus(null);
    }
  };

  return (
    <div className="min-h-screen bg-mundo-bg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <Link
          href="/admin/producao"
          className="mb-4 inline-block text-sm text-mundo-muted hover:text-mundo-creme"
        >
          ← Produção
        </Link>

        <h1 className="font-display text-3xl text-mundo-creme mb-2">
          LoRA — Loranne
        </h1>
        <p className="text-mundo-muted text-sm mb-6">
          Treina um modelo LoRA para gerar novas fotos da Loranne em qualquer cenário.
          Selecciona as poses existentes + carrega fotos de novos ambientes.
        </p>

        {/* Active LoRA status */}
        {activeLoraUrl && (
          <div className="mb-6 rounded-xl border border-fuchsia-500/30 bg-fuchsia-900/10 p-4">
            <p className="text-sm text-fuchsia-400">
              LoRA activo — trigger: <strong>{triggerWord}</strong>
            </p>
            <p className="text-xs text-mundo-muted mt-1 break-all">{activeLoraUrl}</p>
          </div>
        )}

        {/* Config */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-mundo-muted mb-1">Trigger word</label>
            <input
              type="text"
              value={triggerWord}
              onChange={(e) => setTriggerWord(e.target.value)}
              className="rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg-light px-3 py-2 text-sm text-mundo-creme w-48"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-mundo-muted mb-1">Steps</label>
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 1000)}
              className="rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg-light px-3 py-2 text-sm text-mundo-creme w-24"
            />
          </div>
          <div className="self-end">
            <span className="rounded-full bg-mundo-muted-dark/10 px-3 py-1.5 text-xs text-mundo-muted">
              {totalImages} imagens seleccionadas
            </span>
          </div>
          <div className="self-end">
            <span className="rounded-full bg-amber-900/30 px-3 py-1.5 text-xs text-amber-400">
              ~${((steps * 0.0024).toFixed(2))} estimado
            </span>
          </div>
        </div>

        {/* Upload new images */}
        <div className="mb-6">
          <h2 className="text-lg text-mundo-creme mb-3">Carregar fotos novas</h2>
          <div className="flex flex-wrap gap-3 items-start">
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border-2 border-dashed border-mundo-muted-dark/30 w-24 h-24 flex items-center justify-center text-mundo-muted hover:border-fuchsia-500/50 hover:text-fuchsia-400 transition"
            >
              <span className="text-2xl">+</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
            {uploadedImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-24 h-24 object-cover rounded-xl border border-fuchsia-500/30"
                />
                <button
                  onClick={() => removeUploaded(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  x
                </button>
                <p className="text-[9px] text-mundo-muted truncate w-24 mt-1">{img.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Existing poses grid */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-lg text-mundo-creme">Poses existentes ({selectedPoses.size}/{EXISTING_POSES.length})</h2>
            <button
              onClick={() => setSelectedPoses(new Set(BEST_FOR_TRAINING))}
              className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-medium"
            >
              Recomendadas (27)
            </button>
            <button
              onClick={() => setSelectedPoses(new Set(EXISTING_POSES))}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedPoses(new Set())}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Limpar
            </button>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {EXISTING_POSES.map((pose) => (
              <button
                key={pose}
                onClick={() => togglePose(pose)}
                className={`relative rounded-lg overflow-hidden border-2 transition ${
                  selectedPoses.has(pose)
                    ? "border-fuchsia-500 opacity-100"
                    : "border-transparent opacity-40 hover:opacity-70"
                }`}
              >
                <img
                  src={pose}
                  alt={pose.split("/").pop()}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                {selectedPoses.has(pose) && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-fuchsia-500 flex items-center justify-center">
                    <span className="text-[10px] text-white">v</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Train button */}
        <div className="mb-8 py-4 border-t border-b border-mundo-muted-dark/30">
          <div className="flex items-center gap-4">
            <button
              onClick={startTraining}
              disabled={!!status || totalImages < 10}
              className={`rounded-xl px-8 py-3 text-sm font-medium transition ${
                status
                  ? "bg-fuchsia-900/30 text-fuchsia-400 animate-pulse cursor-wait"
                  : totalImages < 10
                  ? "bg-mundo-muted-dark/20 text-mundo-muted cursor-not-allowed"
                  : "bg-fuchsia-600 text-white hover:bg-fuchsia-500"
              }`}
            >
              {status || `Treinar LoRA (${totalImages} imagens)`}
            </button>
            {totalImages < 10 && (
              <span className="text-xs text-red-400">Mínimo 10 imagens</span>
            )}
          </div>
        </div>

        {/* ── GENERATE NEW IMAGES ── */}
        <div className="mb-8">
          <h2 className="font-display text-2xl text-mundo-creme mb-2">Gerar Novas Fotos</h2>
          {!activeLoraUrl ? (
            <p className="text-sm text-mundo-muted">
              Treina o LoRA primeiro para gerar novas fotos da Loranne.
            </p>
          ) : (
            <>
              <p className="text-sm text-mundo-muted mb-4">
                LoRA activo — trigger: <strong className="text-fuchsia-400">{activeTrigger}</strong>.
                Descreve o cenário e gera fotos novas da Loranne.
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                <textarea
                  value={genPrompt}
                  onChange={(e) => setGenPrompt(e.target.value)}
                  placeholder="Ex: sentada num café em Lisboa, luz da tarde pela janela, ar contemplativo"
                  rows={2}
                  className="flex-1 min-w-[300px] rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg-light px-3 py-2 text-sm text-mundo-creme placeholder:text-mundo-muted/50"
                />
                <div className="flex flex-col gap-2">
                  <select
                    value={genCount}
                    onChange={(e) => setGenCount(parseInt(e.target.value))}
                    className="rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg-light px-3 py-2 text-sm text-mundo-creme"
                  >
                    <option value={1}>1 imagem</option>
                    <option value={2}>2 imagens</option>
                    <option value={4}>4 imagens</option>
                  </select>
                  <button
                    onClick={async () => {
                      if (!genPrompt.trim()) { alert("Escreve uma descrição do cenário."); return; }
                      setGenerating(true);
                      try {
                        const fullPrompt = `${activeTrigger}, ${genPrompt.trim()}. Cinematic portrait, warm natural light, high quality photography. No text, no watermarks. Warm golden tones, intimate atmosphere. 9:16 vertical, shallow depth of field.`;
                        const res = await adminFetch("/api/admin/generate-verse-reel", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            caption: `"${genPrompt.trim()}"`,
                            numImages: genCount,
                            loraUrl: activeLoraUrl,
                            triggerWord: activeTrigger,
                          }),
                        });
                        const data = await res.json();
                        if (!res.ok || !data.imageUrls?.length) {
                          alert(`Erro: ${data.erro || "Sem imagens"}`);
                        } else {
                          setGeneratedImages(prev => [...data.imageUrls, ...prev]);
                        }
                      } catch (err) {
                        alert(`Erro: ${err}`);
                      } finally {
                        setGenerating(false);
                      }
                    }}
                    disabled={generating || !genPrompt.trim()}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      generating
                        ? "bg-fuchsia-900/30 text-fuchsia-400 animate-pulse"
                        : "bg-fuchsia-600 text-white hover:bg-fuchsia-500"
                    }`}
                  >
                    {generating ? "A gerar..." : "Gerar"}
                  </button>
                </div>
              </div>

              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "silhueta envolta em véu dourado, rosto oculto, luz lateral quente, fundo escuro",
                  "figura feminina coberta por tecido translúcido, sem rosto visível, ao pôr do sol na praia",
                  "silhueta com véu a flutuar ao vento, contraluz dourado, atmosfera etérea",
                  "figura envolta em tecido, sentada junto a janela antiga, rosto escondido, luz da tarde",
                  "silhueta feminina entre velas acesas, véu translúcido, rosto invisível, atmosfera sagrada",
                  "figura coberta por véu ao piano, luz de velas, momento íntimo, sem feições visíveis",
                  "silhueta na chuva, véu molhado, rua de paralelepípedos, contraluz dourado",
                  "figura com véu deitada num sofá, rosto oculto pelo tecido, luz suave difusa",
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => setGenPrompt(p)}
                    className="rounded-full bg-mundo-muted-dark/10 px-3 py-1 text-[11px] text-mundo-muted hover:text-mundo-creme hover:bg-mundo-muted-dark/20 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Generated results */}
              {generatedImages.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm text-mundo-creme">Geradas ({generatedImages.length})</h3>
                    <button
                      onClick={() => setGeneratedImages([])}
                      className="text-[10px] text-red-400 hover:text-red-300"
                    >
                      Limpar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {generatedImages.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Generated ${idx + 1}`}
                          className="w-full aspect-[9/16] object-cover rounded-xl border border-mundo-muted-dark/30"
                        />
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(url);
                                const blob = await res.blob();
                                const a = document.createElement("a");
                                a.href = URL.createObjectURL(blob);
                                a.download = `loranne-gerada-${Date.now()}-${idx + 1}.png`;
                                a.click();
                                URL.revokeObjectURL(a.href);
                              } catch { alert("Erro ao descarregar"); }
                            }}
                            className="rounded-lg bg-green-600/80 px-2 py-1 text-[10px] text-white hover:bg-green-500"
                          >
                            PC
                          </button>
                          <button
                            onClick={async (e) => {
                              const btn = e.currentTarget;
                              btn.textContent = "...";
                              try {
                                const imgRes = await fetch(url);
                                const blob = await imgRes.blob();
                                const filename = `lora/geradas/loranne-${Date.now()}-${idx + 1}.png`;
                                const signRes = await adminFetch("/api/admin/signed-upload-url", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ filename }),
                                });
                                const signData = await signRes.json();
                                if (!signRes.ok || !signData.signedUrl) throw new Error("Signed URL falhou");
                                const upRes = await fetch(signData.signedUrl, {
                                  method: "PUT",
                                  headers: { "Content-Type": "image/png" },
                                  body: blob,
                                });
                                btn.textContent = upRes.ok ? "OK!" : "Erro";
                              } catch { btn.textContent = "Erro"; }
                              setTimeout(() => { btn.textContent = "Supabase"; }, 2000);
                            }}
                            className="rounded-lg bg-blue-600/80 px-2 py-1 text-[10px] text-white hover:bg-blue-500"
                          >
                            Supabase
                          </button>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-black/60 px-2 py-1 text-[10px] text-white hover:bg-black/80"
                          >
                            Abrir
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
