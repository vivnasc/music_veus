import type { TrackEnergy } from "@/data/albums";

/**
 * Maps version names to energy levels.
 * When uploading a version whose name matches one of these,
 * the energy is auto-detected (admin can still override).
 */
const VERSION_ENERGY_MAP: Record<string, TrackEnergy> = {
  // whisper
  calma: "whisper",
  calm: "whisper",
  whisper: "whisper",
  sussurro: "whisper",
  intimate: "whisper",
  intimo: "whisper",
  soft: "whisper",
  suave: "whisper",
  // steady
  steady: "steady",
  constante: "steady",
  walking: "steady",
  caminhada: "steady",
  groove: "steady",
  // pulse
  pulse: "pulse",
  pulso: "pulse",
  energia: "pulse",
  energy: "pulse",
  drive: "pulse",
  upbeat: "pulse",
  // anthem
  anthem: "anthem",
  hino: "anthem",
  power: "anthem",
  epic: "anthem",
  // raw
  raw: "raw",
  cru: "raw",
  stripped: "raw",
  acoustic: "raw",
  voz: "raw",
};

/**
 * Detect energy from a version name.
 * Returns null if no match (version keeps original track energy).
 */
export function detectEnergyFromVersion(versionName: string): TrackEnergy | null {
  const normalized = versionName.toLowerCase().trim();
  return VERSION_ENERGY_MAP[normalized] || null;
}

export const ENERGY_OPTIONS: { value: TrackEnergy; label: string }[] = [
  { value: "whisper", label: "Sussurro" },
  { value: "steady", label: "Constante" },
  { value: "pulse", label: "Pulso" },
  { value: "anthem", label: "Hino" },
  { value: "raw", label: "Cru" },
];
