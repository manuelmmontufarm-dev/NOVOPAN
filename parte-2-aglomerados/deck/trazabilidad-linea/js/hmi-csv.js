/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — datos del HMI vía CSV local
   ------------------------------------------------------------
   El simulador es un sitio estático (sin backend). Los datos del
   HMI llegan como un CSV `tag,valor` que se relee solo:

   · MODO SERVIDOR (principal): el HMI (o un script de planta)
     deja/actualiza `datos/hmi.csv` JUNTO al sitio hosteado; la
     página lo pide con fetch() cada POLL_MS y aplica cambios solo
     si el contenido cambió. Funciona en cualquier navegador e
     intranet HTTP.
   · MODO ARCHIVO (pruebas/fallback): botón para elegir el CSV
     local. En Chrome/Edge (File System Access API) se relee solo
     al cambiar; en otros navegadores es lectura manual.

   Formato: 1 línea por variable, separador `,` o `;`, decimal
   `.` o `,`. Valor vacío = no tocar (conserva TBD). Tags
   desconocidos → warning, no error. Ejemplo: datos/ejemplo-hmi.csv
   ============================================================ */

const POLL_MS = 2000;

/* tag del HMI → clave de parámetro del simulador.
   'v_prensa' es especial: mueve la velocidad de prensa de la barra. */
export const TAG_MAP = {
  V_PRENSA_M_MIN: 'v_prensa',
  PESO_MANTA_KGM2: '_global:peso_manta',
  F_SL_KGMIN: '_global:F_SL',
  F_CL_KGMIN: '_global:F_CL',
  PCT_SL1: '_global:pctSL1',
  PCT_SL2: '_global:pctSL2',
  M_DOSING_FINA_KG: 'mass:dosing-fine',
  M_DOSING_GRUESA_KG: 'mass:dosing-thick',
  M_ESP1_KG: 'mass:esp1-zone',
  M_ESP2_KG: 'mass:esp2-zone',
  M_ESP3_KG: 'mass:esp3-zone',
  F_CE_KGMIN: 'v3:dos-fine:F',
  F_CI_KGMIN: 'v3:dos-thick:F',
  V_INCL_FINA_M_MIN: 'speed:incl-fine',
  V_INCL_GRUESA_M_MIN: 'speed:incl-thick',
  L_INCL_FINA_M: 'len:incl-fine',
  L_INCL_GRUESA_M: 'len:incl-thick',
  SILO6_RHO_KGM3: 'v3:silo-fine:rho',
  SILO6_VCAP_M3: 'v3:silo-fine:Vcap',
  SILO6_LEVEL_PCT: 'v3:silo-fine:Lpct',
  SILO6_FOUT_KGMIN: 'v3:silo-fine:Fout',
  SILO5_RHO_KGM3: 'v3:silo-thick:rho',
  SILO5_VCAP_M3: 'v3:silo-thick:Vcap',
  SILO5_LEVEL_PCT: 'v3:silo-thick:Lpct',
  SILO5_FOUT_KGMIN: 'v3:silo-thick:Fout',
  T_ENC_CE_S: 'v3:enc-fine:tEnc',
  T_ENC_CI_S: 'v3:enc-thick:tEnc',
};

/* Quita comillas envolventes (Excel exporta "valor" con comillas). */
function unquote(s) {
  const t = s.trim();
  return t.length >= 2 && t[0] === '"' && t[t.length - 1] === '"'
    ? t.slice(1, -1).trim()
    : t;
}

/* Normaliza el valor a número. Tolerante con:
   · decimal con coma (`14,5`) SOLO cuando el separador de campos no es coma
   · unidades pegadas (`14.5 m/min`, `47.1%`) — toma el número inicial
   · separador de miles (`1.234,5` o `1,234.5`) */
function toNumber(valRaw, sep) {
  let v = unquote(valRaw);
  if (v === '') return { empty: true };
  if (sep === ';' || sep === '\t') v = v.replace(/\./g, '').replace(',', '.'); // 1.234,5 → 1234.5
  else v = v.replace(/,/g, '');                                                 // 1,234.5 → 1234.5
  const m = v.match(/-?\d+(\.\d+)?/);                          // primer número
  if (!m) return { nan: true };
  return { val: parseFloat(m[0]) };
}

/** Parsea el CSV del HMI. → { updates, vPrensa|null, warnings[], count } */
export function parseHmiCsv(text) {
  const updates = {};
  const warnings = [];
  let vPrensa = null;
  let count = 0;
  const clean = String(text ?? '').replace(/^﻿/, '');     // BOM de Windows
  const lines = clean.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) continue;
    // separador: tab > `;` > coma. Si hay `;`, la coma es decimal (CSV europeo).
    const sep = line.includes('\t') ? '\t' : (line.includes(';') ? ';' : ',');
    const [tagRaw, ...rest] = line.split(sep);
    const tag = unquote(tagRaw ?? '').toUpperCase();
    if (!tag || tag === 'TAG' || tag === 'TAGNAME') continue;  // cabecera
    const key = TAG_MAP[tag];
    if (!key) { warnings.push(`tag desconocido: ${tag}`); continue; }
    const num = toNumber(rest.join(sep), sep);
    if (num.empty) continue;                                   // vacío = no tocar (TBD)
    if (num.nan) { warnings.push(`valor inválido en ${tag}: "${rest.join(sep).trim()}"`); continue; }
    if (num.val < 0) { warnings.push(`valor negativo ignorado en ${tag}: ${num.val}`); continue; }
    if (key === 'v_prensa') vPrensa = num.val;
    else updates[key] = num.val;
    count += 1;
  }
  return { updates, vPrensa, warnings, count };
}

function fmtTime(d) {
  return d.toLocaleTimeString('es-EC', { timeZone: 'America/Guayaquil', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* Conecta la lectura de CSV al simulador.
   applyData({updates, vPrensa}) la provee line-app (aplica y re-renderiza). */
export function initHmiCsv({ applyData, statusEl, connectBtn, fileInput }) {
  let lastText = null;
  let mode = 'off';         // off | server | live-file | manual-file
  let fileHandle = null;
  let lastWarnings = [];
  let lastGood = null;      // Date de la última lectura buena (para "reconectando")
  let failStreak = 0;       // fallos de fetch seguidos (evita parpadeo por un blip)

  function setStatus(cls, msg, title) {
    if (!statusEl) return;
    statusEl.className = `s2-hmi-status is-${cls}`;
    statusEl.textContent = msg;
    statusEl.title = title ?? '';
  }

  function applyText(text, sourceLabel) {
    if (text === lastText) return false;                        // sin cambios
    lastText = text;
    const parsed = parseHmiCsv(text);
    lastWarnings = parsed.warnings;
    if (parsed.count === 0 && parsed.warnings.length > 0) {
      setStatus('error', `● HMI CSV · error de formato`, parsed.warnings.join('\n'));
      return false;
    }
    applyData(parsed);
    lastGood = new Date();
    failStreak = 0;
    const warn = parsed.warnings.length ? ` · ⚠ ${parsed.warnings.length}` : '';
    setStatus(mode === 'manual-file' ? 'manual' : 'live',
      `● HMI ${sourceLabel} · ${fmtTime(lastGood)} · ${parsed.count} tags${warn}`,
      parsed.warnings.join('\n'));
    return true;
  }

  /* Marca desconexión sin perder el último dato bueno; tolera 1 blip. */
  function markServerDown() {
    failStreak += 1;
    if (failStreak < 2) return;                                 // ignora un fallo aislado
    if (lastGood) setStatus('error', `● HMI CSV · reconectando… (último dato ${fmtTime(lastGood)})`,
      'El sitio no encuentra datos/hmi.csv. Se reintenta solo cada 2 s.');
    else setStatus('idle', '● HMI CSV · sin conexión',
      'Coloca datos/hmi.csv junto al sitio o conecta un archivo local.');
  }

  // ── MODO SERVIDOR: fetch de datos/hmi.csv junto al sitio ──
  async function pollServer() {
    try {
      const res = await fetch(`datos/hmi.csv?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) { if (mode === 'server') markServerDown(); return false; }
      const wasDown = failStreak >= 2;
      mode = 'server';
      const changed = applyText(await res.text(), 'CSV (servidor)');
      failStreak = 0;
      // reapareció con contenido idéntico tras una caída → re-afirmar "en vivo"
      if (!changed && wasDown && lastGood) {
        setStatus('live', `● HMI CSV (servidor) · ${fmtTime(lastGood)} · reconectado`, '');
      }
      return true;
    } catch {
      if (mode === 'server') markServerDown();
      return false;
    }
  }

  // ── MODO ARCHIVO: File System Access API (Chrome/Edge) con relectura ──
  let lastModified = 0;
  async function pollFile() {
    if (!fileHandle) return;
    try {
      const file = await fileHandle.getFile();
      if (file.lastModified === lastModified) return;
      lastModified = file.lastModified;
      applyText(await file.text(), 'CSV (archivo)');
    } catch {
      setStatus('error', '● HMI CSV · archivo no accesible', 'Vuelve a conectar el archivo.');
    }
  }

  async function connectFile() {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{ description: 'CSV del HMI', accept: { 'text/csv': ['.csv'], 'text/plain': ['.txt'] } }],
        });
        fileHandle = handle;
        mode = 'live-file';
        lastModified = 0;
        lastText = null;
        await pollFile();
      } catch { /* usuario canceló */ }
    } else if (fileInput) {
      fileInput.click();                                        // fallback <input type=file>
    }
  }

  fileInput?.addEventListener('change', async () => {
    const f = fileInput.files?.[0];
    if (!f) return;
    mode = 'manual-file';
    lastText = null;
    applyText(await f.text(), 'CSV (manual)');
    fileInput.value = '';
  });
  connectBtn?.addEventListener('click', connectFile);

  // Arranque: intenta el modo servidor; si no existe el CSV, queda en espera.
  (async () => {
    const ok = await pollServer();
    if (!ok) setStatus('idle', '● HMI CSV · sin conexión', 'Coloca datos/hmi.csv junto al sitio o conecta un archivo local.');
    setInterval(() => {
      if (mode === 'server' || mode === 'off') pollServer();
      else if (mode === 'live-file') pollFile();
    }, POLL_MS);
  })();

  return { getWarnings: () => lastWarnings };
}
