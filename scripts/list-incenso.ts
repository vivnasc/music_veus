import { ALL_ALBUMS } from "../music-app/src/data/albums";

const incenso = ALL_ALBUMS.filter((a) => a.slug.startsWith("incenso-") || a.product === "incenso");
console.log(`${incenso.length} álbuns incenso:`);
for (const a of incenso) {
  console.log(`  ${a.slug.padEnd(28)} (${a.status.padEnd(9)}) — ${a.tracks.length} faixas — ${a.title}`);
}
const total = incenso.reduce((s, a) => s + a.tracks.length, 0);
console.log(`\nTotal faixas: ${total}`);
console.log(`Status: produced=${incenso.filter((a) => a.status === "produced").length}, published=${incenso.filter((a) => a.status === "published").length}, ready=${incenso.filter((a) => a.status === "ready").length}`);
