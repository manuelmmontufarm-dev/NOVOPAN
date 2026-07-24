#!/usr/bin/env node
/**
 * novopan-bridge — puente CSV local → nube (Vercel Blob).
 *
 * Corre en UNA compu de planta (la que ve el CSV del HMI). Cada pollMs lee el
 * CSV local y, si cambió (o cada KEEPALIVE_MS aunque no cambie), lo sube a
 * Vercel Blob en una ruta pública fija. El simulador lo lee desde esa URL, así
 * se puede ver la Línea 1 · Sección 2 desde cualquier lado.
 *
 * Patrón robado del mesita-bridge: fingerprint para subir solo en cambios,
 * keepalive periódico, y backoff exponencial ante fallos de red — el CSV nunca
 * queda "colgado" y una caída de internet se recupera sola.
 *
 * NO reescribe el CSV local ni toca el HMI: solo LEE y SUBE (read-only).
 *
 * USO:
 *   npm install           (una vez, instala @vercel/blob)
 *   node bridge.mjs       (usa ./bridge.config.json)
 *   DRY_RUN=1 node bridge.mjs   (prueba: lee y detecta cambios sin subir nada)
 *
 * CONFIG (bridge.config.json) — ver bridge.config.example.json:
 *   {
 *     "token": "vercel_blob_rw_...",   // token del Blob store (Vercel > Storage)
 *     "csvPath": "C:\\ruta\\al\\HMI.csv",
 *     "blobPath": "linea1-seccion2/hmi.csv",
 *     "pollMs": 2000
 *   }
 */
import fs from "fs";
import crypto from "crypto";

const CONFIG_PATH = process.env.NOVOPAN_BRIDGE_CONFIG || "./bridge.config.json";
const DRY_RUN = process.env.DRY_RUN === "1";
// Vuelve a subir aunque no cambie, cada tanto, para que la URL nunca "envejezca"
// (y para que el simulador sepa que el puente sigue vivo).
const KEEPALIVE_MS = 30_000;

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadConfig() {
  let raw;
  try {
    raw = fs.readFileSync(CONFIG_PATH, "utf8");
  } catch {
    throw new Error(`No encuentro ${CONFIG_PATH}. Copia bridge.config.example.json a bridge.config.json y llénalo.`);
  }
  const cfg = JSON.parse(raw);
  if (!cfg.csvPath) throw new Error("Falta 'csvPath' (la ruta del CSV del HMI) en el config.");
  if (!DRY_RUN && !cfg.token) throw new Error("Falta 'token' (del Blob store de Vercel) en el config.");
  cfg.pollMs = cfg.pollMs || 2000;
  cfg.blobPath = cfg.blobPath || "linea1-seccion2/hmi.csv";
  return cfg;
}

// Carga perezosa de @vercel/blob: en DRY_RUN ni se necesita instalado.
async function getPut() {
  if (DRY_RUN) return null;
  try {
    const mod = await import("@vercel/blob");
    return mod.put;
  } catch {
    throw new Error("Falta la dependencia @vercel/blob. Corre 'npm install' en esta carpeta.");
  }
}

async function main() {
  const cfg = loadConfig();
  const put = await getPut();
  console.log(`[novopan-bridge] iniciado · CSV=${cfg.csvPath} · cada ${cfg.pollMs}ms${DRY_RUN ? " · DRY_RUN (no sube nada)" : ""}`);

  let lastHash = null;
  let lastPost = 0;
  let backoff = 0;
  let printedUrl = false;

  while (true) {
    try {
      let text;
      try {
        text = fs.readFileSync(cfg.csvPath, "utf8");
      } catch (e) {
        // El HMI puede tener el archivo abierto en exclusiva mientras lo reescribe:
        // no es una desconexión, se reintenta al próximo ciclo.
        console.warn(`[novopan-bridge] no pude leer el CSV (${e.code || e.message}) — reintento`);
        await sleep(cfg.pollMs);
        continue;
      }

      const h = sha(text);
      const keepalive = Date.now() - lastPost >= KEEPALIVE_MS;

      if (text.trim() && (h !== lastHash || keepalive)) {
        if (DRY_RUN) {
          console.log(`[novopan-bridge] (dry-run) subiría ${text.length} bytes${h !== lastHash ? " · CAMBIÓ" : " · keepalive"}`);
        } else {
          const { url } = await put(cfg.blobPath, text, {
            access: "public",
            token: cfg.token,
            contentType: "text/csv; charset=utf-8",
            allowOverwrite: true,
            addRandomSuffix: false,
            cacheControlMaxAge: 0, // el CDN no lo cachea: el simulador siempre ve lo último
          });
          if (!printedUrl) {
            console.log(`\n  ►►► URL PÚBLICA DEL CSV (pásasela a Claude para cablear el simulador):\n  ${url}\n`);
            printedUrl = true;
          }
          console.log(`[novopan-bridge] subido ${text.length} bytes${h !== lastHash ? " · CAMBIÓ" : " · keepalive"}`);
        }
        lastHash = h;
        lastPost = Date.now();
      }
      backoff = 0;
    } catch (e) {
      backoff = Math.min(60_000, backoff ? backoff * 2 : 2_000);
      console.warn(`[novopan-bridge] fallo (${e.message}) — reintento en ${backoff}ms`);
      await sleep(backoff);
    }
    await sleep(cfg.pollMs);
  }
}

main().catch((e) => {
  console.error(`[novopan-bridge] fatal: ${e.message}`);
  process.exit(1);
});
