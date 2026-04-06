"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

export default function MigrateSlugsPage() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function run(dryRun: boolean) {
    setLoading(true);
    setLog([dryRun ? "A verificar..." : "A migrar..."]);
    try {
      const res = await adminFetch("/api/admin/migrate-slugs", {
        method: dryRun ? "GET" : "POST",
      });
      const data = await res.json();
      if (data.erro) {
        setLog([`Erro: ${data.erro}`]);
      } else {
        setLog(data.log || [`Migrated: ${data.migrated}, Skipped: ${data.skipped}, Errors: ${data.errors}`]);
        if (!dryRun) setDone(true);
      }
    } catch (e) {
      setLog([`Erro: ${e}`]);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-2">Migrar Slugs do Storage</h1>
      <p className="text-sm text-[#888] mb-6">
        Renomeia as pastas no Supabase Storage dos slugs antigos (vida-, romance-, cosmic-, espiritual-) para os novos (incenso-, eter-, nua-, sangue-, fibra-, grao-, mare-).
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => run(true)}
          disabled={loading}
          className="px-4 py-2 bg-[#222] rounded-lg text-sm hover:bg-[#333] disabled:opacity-50"
        >
          {loading ? "..." : "Preview (dry run)"}
        </button>
        <button
          onClick={() => run(false)}
          disabled={loading || done}
          className="px-4 py-2 bg-[#C9A96E] text-black rounded-lg text-sm font-medium hover:bg-[#d4b87a] disabled:opacity-50"
        >
          {done ? "Feito" : loading ? "A migrar..." : "Executar migração"}
        </button>
      </div>

      {log.length > 0 && (
        <pre className="bg-[#111] rounded-lg p-4 text-xs text-[#aaa] overflow-auto max-h-[60vh] whitespace-pre-wrap">
          {log.join("\n")}
        </pre>
      )}
    </div>
  );
}
