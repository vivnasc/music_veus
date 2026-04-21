"use client";

import { useState } from "react";
import {
  getEffectiveAncientGroundReleases,
  updateAncientGroundOverride,
  clearAncientGroundOverride,
  loadOverrides,
} from "@/lib/calendar-overrides";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DOW = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function fmt(iso: string): string {
  const d = new Date(iso);
  return `${DOW[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function isPast(iso: string): boolean {
  return new Date(iso) < new Date(new Date().toDateString());
}

export default function AncientGroundCalendar() {
  const [tick, setTick] = useState(0);
  const [editingNum, setEditingNum] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const ov = loadOverrides();
  void tick;
  const effective = getEffectiveAncientGroundReleases(ov);
  const skipped = Object.entries(ov.ancientGround).filter(([, v]) => v?.skip);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = effective.filter((r) => r.date >= today);
  const recent = effective.filter((r) => r.date < today).slice(-2);
  const visible = showAll ? effective : [...recent, ...upcoming.slice(0, 12)];

  function changeDate(num: number, iso: string) {
    updateAncientGroundOverride(num, { date: iso, skip: false });
    setTick((t) => t + 1);
    setEditingNum(null);
  }

  function toggleSkip(num: number, currentlySkipped: boolean) {
    updateAncientGroundOverride(num, { skip: !currentlySkipped });
    setTick((t) => t + 1);
  }

  function resetOverride(num: number) {
    clearAncientGroundOverride(num);
    setTick((t) => t + 1);
  }

  return (
    <div className="rounded-xl border border-amber-900/30 bg-amber-950/10 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-amber-400">Calendário Ancient Ground</h2>
          <p className="text-[10px] text-mundo-muted">
            1 single por sexta. Clica numa data para alterar, ou &times; para saltar.
          </p>
        </div>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-[10px] text-amber-500 hover:text-amber-400"
        >
          {showAll ? "Mostrar menos" : `Mostrar todos (${effective.length})`}
        </button>
      </div>

      <div className="divide-y divide-amber-900/20">
        {visible.map((r) => {
          const past = isPast(r.date);
          const override = ov.ancientGround[String(r.singleNumber)];
          const hasDateOverride = !!override?.date;
          const editing = editingNum === r.singleNumber;

          return (
            <div
              key={r.singleNumber}
              className={`flex items-center gap-2 py-2 ${past ? "opacity-50" : ""}`}
            >
              <span className="w-8 text-right text-[10px] font-mono text-amber-600">
                #{r.singleNumber}
              </span>

              <div className="w-32 flex-shrink-0">
                {editing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="date"
                      defaultValue={r.date}
                      autoFocus
                      onChange={(e) => {
                        if (e.target.value) changeDate(r.singleNumber, e.target.value);
                      }}
                      className="rounded bg-white/10 border border-amber-500/40 px-1 py-0.5 text-[10px] text-[#F5F0E6]"
                    />
                    {hasDateOverride && (
                      <button
                        onClick={() => resetOverride(r.singleNumber)}
                        className="text-[9px] text-amber-500 hover:text-amber-300"
                        title="Repor data original"
                      >
                        Repor
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingNum(r.singleNumber)}
                    className={`text-[11px] hover:text-amber-300 text-left ${
                      hasDateOverride ? "text-amber-400 font-medium" : "text-mundo-muted"
                    }`}
                    title="Alterar data"
                  >
                    {fmt(r.date)}
                    {hasDateOverride && " •"}
                  </button>
                )}
              </div>

              <span className="flex-1 text-xs text-mundo-creme truncate">{r.title}</span>

              <button
                onClick={() => toggleSkip(r.singleNumber, false)}
                className="text-[10px] text-mundo-muted-dark hover:text-red-400 px-2 py-1"
                title="Saltar este single"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {/* Saltados */}
      {skipped.length > 0 && (
        <div className="mt-4 pt-3 border-t border-amber-900/20">
          <p className="text-[10px] text-mundo-muted mb-2">
            {skipped.length} saltado{skipped.length > 1 ? "s" : ""}:
          </p>
          <div className="flex flex-wrap gap-1">
            {skipped.map(([num]) => (
              <button
                key={num}
                onClick={() => toggleSkip(Number(num), true)}
                className="text-[10px] px-2 py-1 rounded-full border border-amber-700/30 bg-amber-900/20 text-amber-400 hover:bg-amber-900/40 transition"
                title="Restaurar"
              >
                #{num} ↺
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
