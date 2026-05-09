"use client";

import { useEffect, useState } from "react";

export type LangFilter = "all" | "PT" | "EN";

const KEY = "veus:lang-filter";
const EVENT = "veus:lang-filter-change";

export function getLangFilter(): LangFilter {
  if (typeof window === "undefined") return "all";
  const v = localStorage.getItem(KEY);
  if (v === "PT" || v === "EN") return v;
  return "all";
}

export function setLangFilterValue(v: LangFilter): void {
  if (typeof window === "undefined") return;
  if (v === "all") localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, v);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: v }));
}

export function useLangFilter(): [LangFilter, (v: LangFilter) => void] {
  const [v, setV] = useState<LangFilter>("all");
  useEffect(() => {
    setV(getLangFilter());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<LangFilter>).detail;
      if (detail) setV(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setV(getLangFilter());
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return [v, setLangFilterValue];
}

/** Returns true when the track's language matches the active filter (or filter is "all"). */
export function matchesLangFilter(trackLang: string | undefined, filter: LangFilter): boolean {
  if (filter === "all") return true;
  return trackLang === filter;
}
