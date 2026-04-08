"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

// Existing Loranne poses (clean, no text)
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

export default function LoraPage() {
  const [selectedPoses, setSelectedPoses] = useState<Set<string>>(new Set(EXISTING_POSES));
  const [uploadedImages, setUploadedImages] = useState<{ url: string; name: string }[]>([]);
  const [triggerWord, setTriggerWord] = useState("loranne_artist");
  const [steps, setSteps] = useState(1000);
  const [status, setStatus] = useState<string | null>(null);
  const [activeLoraUrl, setActiveLoraUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
              onClick={() => setSelectedPoses(new Set(EXISTING_POSES))}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Seleccionar todas
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
        <div className="sticky bottom-0 bg-mundo-bg/90 backdrop-blur py-4 border-t border-mundo-muted-dark/30 -mx-4 px-4 sm:-mx-6 sm:px-6">
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
      </div>
    </div>
  );
}
