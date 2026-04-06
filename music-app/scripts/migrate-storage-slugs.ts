/**
 * Migrate Supabase Storage folders from old album slugs to new collection-based slugs.
 *
 * This script:
 * 1. Lists all folders in the "audios" bucket under albums/
 * 2. For each folder matching an old slug, copies all files to the new slug folder
 * 3. Deletes the old files after successful copy
 *
 * Usage:
 *   npx tsx scripts/migrate-storage-slugs.ts [--dry-run]
 *
 * Env vars required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const BUCKET = "audios";
const PREFIX = "albums";

const SLUG_RENAMES: Record<string, string> = {
  // INCENSO
  "corpo-celeste": "incenso-corpo-celeste",
  "correnteza": "incenso-correnteza",
  "demora": "incenso-demora",
  "espiritual-espelho-partido": "incenso-espelho-partido",
  "espiritual-frequencia": "incenso-frequencia",
  "espiritual-furia": "incenso-furia",
  "espiritual-luto": "incenso-luto",
  "espiritual-nevoeiro": "incenso-nevoeiro",
  "folego": "incenso-folego",
  "humus": "incenso-humus",
  "limiar": "incenso-limiar",
  "o-circulo": "incenso-o-circulo",
  "o-gesto": "incenso-o-gesto",
  "o-que-resta": "incenso-o-que-resta",
  "travessia": "incenso-travessia",
  "vida-ancora": "incenso-ancora",
  "vida-diluvio-manso": "incenso-diluvio-manso",
  "vida-lava-quieta": "incenso-lava-quieta",
  "vida-maos-juntas": "incenso-maos-juntas",
  "vida-oferenda": "incenso-oferenda",
  "vida-pes-descalcos": "incenso-pes-descalcos",
  "vida-raiz-muda": "incenso-raiz-muda",
  "vida-rescaldo": "incenso-rescaldo",
  "vida-ressonancia": "incenso-ressonancia",
  "vida-silencio-fertil": "incenso-silencio-fertil",
  // ETER
  "cosmic-eter": "eter",
  "cosmic-oceano": "eter-oceano",
  "cosmic-orbita": "eter-orbita",
  "cosmic-poeira": "eter-poeira",
  "cosmic-porto": "eter-porto",
  "cosmic-raiz-vermelha": "eter-raiz-vermelha",
  "cosmic-sinal": "eter-sinal",
  "cosmic-vasto": "eter-vasto",
  "cosmic-viagem": "eter-viagem",
  "vida-olhos-de-crianca": "eter-olhos-de-crianca",
  "vida-sangue-antigo": "eter-sangue-antigo",
  // NUA
  "cosmic-romance": "nua-pele",
  "romance-carta": "nua-carta",
  "romance-duas-vozes": "nua-duas-vozes",
  "romance-fogo-lento": "nua-fogo-lento",
  "romance-meu": "nua-meu",
  "romance-ninho": "nua-ninho",
  "romance-saudade": "nua-saudade",
  "vida-corpo-a-corpo": "nua-corpo-a-corpo",
  // SANGUE
  "espiritual-ventre": "sangue-ventre",
  "romance-irmas": "sangue-irmas",
  "vida-linhagem": "sangue-linhagem",
  "vida-mae": "sangue-mae",
  "vida-mesmo-sangue": "sangue-mesmo-sangue",
  "vida-raiz": "sangue-raiz",
  "vida-sombra-do-pai": "sangue-sombra-do-pai",
  // FIBRA
  "vida-asfalto-vivo": "fibra-asfalto-vivo",
  "vida-azul-fundo": "fibra-azul-fundo",
  "vida-barra-carregada": "fibra-barra-carregada",
  "vida-corpo-aberto": "fibra-corpo-aberto",
  "vida-sangue-aceso": "fibra-sangue-aceso",
  // GRAO
  "vida-abrigo": "grao-abrigo",
  "vida-boca-aberta": "grao-boca-aberta",
  "vida-deriva": "grao-deriva",
  "vida-descalca": "grao-descalca",
  "vida-ecra": "grao-ecra",
  "vida-espelho-agua": "grao-espelho-agua",
  "vida-estacoes": "grao-estacoes",
  "vida-festa": "grao-festa",
  "vida-insonia": "grao-insonia",
  "vida-luz-crua": "grao-luz-crua",
  "vida-moeda": "grao-moeda",
  "vida-no-de-ouro": "grao-no-de-ouro",
  "vida-o-tear": "grao-o-tear",
  "vida-pao-sal": "grao-pao-sal",
  "vida-porcelana": "grao-porcelana",
  "vida-porta-aberta": "grao-porta-aberta",
  "vida-primeira-luz": "grao-primeira-luz",
  "vida-primeiro-passo": "grao-primeiro-passo",
  "vida-sal-na-pele": "grao-sal-na-pele",
  "vida-toalha-posta": "grao-toalha-posta",
  // MARE
  "vida-brasa-lenta": "mare-brasa-lenta",
  "vida-companhia-propria": "mare-companhia-propria",
  "vida-lua-acordada": "mare-lua-acordada",
  "vida-luz-mansa": "mare-luz-mansa",
  "vida-mare-viva": "mare-viva",
  "vida-penumbra": "mare-penumbra",
  "vida-rendicao": "mare-rendicao",
  "vida-varanda-quente": "mare-varanda-quente",
};

async function migrate() {
  const dryRun = process.argv.includes("--dry-run");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log(dryRun ? "\n=== DRY RUN ===" : "\n=== MIGRATING ===");
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Renames: ${Object.keys(SLUG_RENAMES).length}\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  // Check both albums/ prefix and root level
  for (const prefix of [PREFIX, ""]) {
    const { data: folders } = await supabase.storage
      .from(BUCKET)
      .list(prefix || undefined, { limit: 500 });

    for (const folder of folders || []) {
      const oldSlug = folder.name;
      const newSlug = SLUG_RENAMES[oldSlug];

      if (!newSlug) continue;

      const oldPath = prefix ? `${prefix}/${oldSlug}` : oldSlug;
      const newPath = prefix ? `${prefix}/${newSlug}` : newSlug;

      // List files in old folder
      const { data: files } = await supabase.storage
        .from(BUCKET)
        .list(oldPath, { limit: 100 });

      if (!files || files.length === 0) {
        console.log(`  SKIP (empty): ${oldPath}`);
        skipped++;
        continue;
      }

      console.log(`  ${oldPath}/ → ${newPath}/ (${files.length} files)`);

      if (dryRun) {
        migrated++;
        continue;
      }

      // Copy each file
      let allCopied = true;
      for (const file of files) {
        const src = `${oldPath}/${file.name}`;
        const dst = `${newPath}/${file.name}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .copy(src, dst);

        if (error) {
          console.error(`    ERROR copying ${src} → ${dst}: ${error.message}`);
          allCopied = false;
          errors++;
        }
      }

      // Delete old files only if all copies succeeded
      if (allCopied) {
        const filePaths = files.map((f) => `${oldPath}/${f.name}`);
        const { error } = await supabase.storage
          .from(BUCKET)
          .remove(filePaths);

        if (error) {
          console.error(`    ERROR deleting old files in ${oldPath}: ${error.message}`);
          errors++;
        } else {
          console.log(`    Deleted ${filePaths.length} old files`);
          migrated++;
        }
      }
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Migrated: ${migrated}, Skipped: ${skipped}, Errors: ${errors}`);
  if (dryRun) console.log("(dry run — no changes made)");
}

migrate().catch(console.error);
