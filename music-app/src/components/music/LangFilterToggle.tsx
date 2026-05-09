"use client";

import { useLangFilter, type LangFilter } from "@/lib/lang-filter";

const OPTIONS: { value: LangFilter; label: string; sub: string }[] = [
  { value: "PT", label: "PT", sub: "Português" },
  { value: "EN", label: "EN", sub: "English" },
  { value: "all", label: "Mix", sub: "PT + EN" },
];

export function LangFilterToggle({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useLangFilter();

  return (
    <div
      role="radiogroup"
      aria-label="Filtro de língua"
      className={`inline-flex rounded-full bg-white/5 border border-white/10 p-1 ${compact ? "text-[11px]" : "text-xs"}`}
    >
      {OPTIONS.map((o) => {
        const active = filter === o.value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => setFilter(o.value)}
            title={o.sub}
            className={`px-3 py-1.5 rounded-full transition ${
              active
                ? "bg-mundo-creme text-mundo-noite font-semibold"
                : "text-mundo-muted hover:text-mundo-creme"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function LangFilterChip() {
  const [filter] = useLangFilter();
  if (filter === "all") return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-mundo-creme/15 text-mundo-creme border border-mundo-creme/30">
      <span className="font-semibold">{filter}</span>
      <span className="text-mundo-muted">só</span>
    </span>
  );
}
