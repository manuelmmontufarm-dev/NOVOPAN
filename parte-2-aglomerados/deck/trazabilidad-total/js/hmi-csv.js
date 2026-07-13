/* ============================================================
   NOVOPAN · Línea 1 · Trazabilidad total — datos del HMI vía CSV
   ------------------------------------------------------------
   El sitio es estático (sin backend). Los datos del HMI llegan como
   un archivo `datos/hmi.csv` en formato `VARIABLE:VALOR;` que se
   relee SOLO cada POLL_MS (2 s) con fetch no-cache. En planta, un
   job de SQL Server / WinCC / script sobrescribe ese archivo; aquí
   es estático pero la tubería HMI→simulador queda 100% probada y
   lista para el servidor. Fallback: elegir un CSV local (botón).

   El parser es tolerante (BOM, CRLF, comillas de Excel, comentarios
   ///#, decimal '.' o ',', separador de miles, unidades pegadas).
   Reusa la semántica del reader ya probado de trazabilidad-linea.
   ============================================================ */

const POLL_MS = 2000;

/* tag del HMI → clave de parámetro del modelo (p1:*) o 'v_prensa'.
   KIND marca el origen para el badge del panel: 'hmi' = medido en vivo,
   'est' = plug estimado (pendiente de instrumentar). */
export const TAG_MAP = {
  V_PRENSA_M_MIN:      { key: 'v_prensa',      kind: 'hmi' },
  PILA1_ASERRIN_M_KG:  { key: 'p1:pila1_M',    kind: 'hmi' },
  PILA1_ASERRIN_F_KGH: { key: 'p1:pila1_F',    kind: 'hmi' },
  PILA2_CHIP_M_KG:     { key: 'p1:pila2_M',    kind: 'hmi' },
  PILA2_CHIP_F_KGH:    { key: 'p1:pila2_F',    kind: 'hmi' },
  T_HOMBAK_S3_S:       { key: 'p1:tr3',        kind: 'est' },
  SILO1_RHO_KGM3:      { key: 'p1:s1_rho',     kind: 'hmi' },
  SILO1_V_M3:          { key: 'p1:s1_V',       kind: 'est' },
  SILO1_L_PCT:         { key: 'p1:s1_L',       kind: 'hmi' },
  SILO1_FOUT_KGH:      { key: 'p1:s1_F',       kind: 'hmi' },
  SILO2A_RHO_KGM3:     { key: 'p1:s2_rho',     kind: 'hmi' },
  SILO2A_V_M3:         { key: 'p1:s2_V',       kind: 'est' },
  SILO2A_L_PCT:        { key: 'p1:s2_L',       kind: 'hmi' },
  SILO2A_FOUT_KGH:     { key: 'p1:s2_F',       kind: 'hmi' },
  SILO3_RHO_KGM3:      { key: 'p1:s3_rho',     kind: 'hmi' },
  SILO3_V_M3:          { key: 'p1:s3_V',       kind: 'est' },
  SILO3_L_PCT:         { key: 'p1:s3_L',       kind: 'hmi' },
  SILO3_FOUT_KGH:      { key: 'p1:s3_F',       kind: 'hmi' },
  BUNKER_RHO_KGM3:     { key: 'p1:bk_rho',     kind: 'hmi' },
  BUNKER_V_M3:         { key: 'p1:bk_V',       kind: 'est' },
  BUNKER_L_PCT:        { key: 'p1:bk_L',       kind: 'hmi' },
  BUNKER_FHUM_KGH:     { key: 'p1:bk_F',       kind: 'hmi' },
  T_TRANSP_SECADERO_S: { key: 'p1:trSec',      kind: 'est' },
  TAU_TAMBOR_S:        { key: 'p1:tauTambor',  kind: 'est' },
  T_TAMICES_FG_S:      { key: 'p1:tCriba',     kind: 'est' },
  T_ZARANDAS_S:        { key: 'p1:tZar',       kind: 'est' },
  T_COLECT_CL_S:       { key: 'p1:tColectCL',  kind: 'est' },
  T_COLECT_SL_S:       { key: 'p1:tColectSL',  kind: 'est' },
  T_WS1_S:             { key: 'p1:tWS1',       kind: 'est' },
  T_WS2_S:             { key: 'p1:tWS2',       kind: 'est' },
  T_WS3_S:             { key: 'p1:tWS3',       kind: 'est' },
  T_REF1_S:            { key: 'p1:tRef1',      kind: 'est' },
  T_REF2_S:            { key: 'p1:tRef2',      kind: 'est' },
  T_CICLON_S:          { key: 'p1:tCiclon',    kind: 'est' },
  T_CLAS_SL_S:         { key: 'p1:tClasSL',    kind: 'est' },
  T_REINGRESO_SL_S:    { key: 'p1:tReingresoSL', kind: 'est' },
  SILO5_RHO_KGM3:      { key: 'p1:s5_rho',     kind: 'hmi' },
  SILO5_V_M3:          { key: 'p1:s5_V',       kind: 'est' },
  SILO5_L_PCT:         { key: 'p1:s5_L',       kind: 'hmi' },
  SILO5_FOUT_KGMIN:    { key: 'p1:s5_Fmin',    kind: 'hmi' },
  SILO6_RHO_KGM3:      { key: 'p1:s6_rho',     kind: 'hmi' },
  SILO6_V_M3:          { key: 'p1:s6_V',       kind: 'est' },
  SILO6_L_PCT:         { key: 'p1:s6_L',       kind: 'hmi' },
  SILO6_FOUT_KGMIN:    { key: 'p1:s6_Fmin',    kind: 'hmi' },
  DOSING_CL_M_KG:      { key: 'p1:dosG_M',     kind: 'hmi' },
  DOSING_CL_F_KGMIN:   { key: 'p1:dosG_F',     kind: 'hmi' },
  DOSING_SL_M_KG:      { key: 'p1:dosF_M',     kind: 'hmi' },
  DOSING_SL_F_KGMIN:   { key: 'p1:dosF_F',     kind: 'hmi' },
  T_ENC_CI_S:          { key: 'p1:tEncCI',     kind: 'est' },
  T_ENC_CE_S:          { key: 'p1:tEncCE',     kind: 'est' },
  INCL_CL_L_M:         { key: 'p1:inclG_L',    kind: 'hmi' },
  INCL_CL_V_MMIN:      { key: 'p1:inclG_v',    kind: 'hmi' },
  INCL_SL_L_M:         { key: 'p1:inclF_L',    kind: 'hmi' },
  INCL_SL_V_MMIN:      { key: 'p1:inclF_v',    kind: 'hmi' },
  T_ESP1_S:            { key: 'p1:tEsp1',      kind: 'est' },
  T_ESP2_S:            { key: 'p1:tEsp2',      kind: 'est' },
  T_ESP3_S:            { key: 'p1:tEsp3',      kind: 'est' },
};

/* key de parámetro → kind (para el badge del panel). */
export const KIND_BY_KEY = (() => {
  const out = {};
  for (const tag in TAG_MAP) out[TAG_MAP[tag].key] = TAG_MAP[tag].kind;
  return out;
})();

function unquote(s) {
  const t = s.trim();
  return t.length >= 2 && t[0] === '"' && t[t.length - 1] === '"' ? t.slice(1, -1).trim() : t;
}

function toNumber(valRaw, sep) {
  let v = unquote(valRaw);
  if (v === '') return { empty: true };
  if (sep === ':') {
    const dec = Math.max(v.lastIndexOf(','), v.lastIndexOf('.'));
    if (dec !== -1) v = v.slice(0, dec).replace(/[.,]/g, '') + '.' + v.slice(dec + 1);
  } else if (sep === ';' || sep === '\t') {
    v = v.replace(/\./g, '').replace(',', '.');
  } else {
    v = v.replace(/,/g, '');
  }
  const m = v.match(/-?\d+(\.\d+)?/);
  if (!m) return { nan: true };
  return { val: parseFloat(m[0]) };
}

/** Parsea el CSV del HMI. → { updates, vPrensa|null, warnings[], count } */
export function parseHmiCsv(text) {
  const updates = {};
  const warnings = [];
  let vPrensa = null;
  let count = 0;
  const clean = String(text ?? '').replace(/^﻿/, '');
  for (const rawLine of clean.split(/\r?\n/)) {
    let line = rawLine;
    const h = line.indexOf('#');  if (h !== -1) line = line.slice(0, h);
    const c = line.indexOf('//'); if (c !== -1) line = line.slice(0, c);
    line = line.trim();
    if (!line) continue;
    const records = line.includes(':') ? line.split(';') : [line];
    for (const recRaw of records) {
      const rec = recRaw.trim();
      if (!rec) continue;
      let sep, sepIdx = rec.indexOf(':');
      if (sepIdx !== -1) sep = ':';
      else if ((sepIdx = rec.indexOf('\t')) !== -1) sep = '\t';
      else if ((sepIdx = rec.indexOf(';')) !== -1) sep = ';';
      else if ((sepIdx = rec.indexOf(',')) !== -1) sep = ',';
      else { warnings.push(`registro sin separador: "${rec}"`); continue; }
      const tag = unquote(rec.slice(0, sepIdx)).toUpperCase();
      if (!tag || tag === 'TAG' || tag === 'TAGNAME' || tag === 'VARIABLE') continue;
      const entry = TAG_MAP[tag];
      if (!entry) { warnings.push(`tag desconocido: ${tag}`); continue; }
      const num = toNumber(rec.slice(sepIdx + 1), sep);
      if (num.empty) continue;
      if (num.nan) { warnings.push(`valor inválido en ${tag}`); continue; }
      if (num.val < 0) { warnings.push(`valor negativo ignorado en ${tag}`); continue; }
      if (entry.key === 'v_prensa') vPrensa = num.val;
      else updates[entry.key] = num.val;
      count += 1;
    }
  }
  return { updates, vPrensa, warnings, count };
}

function fmtTime(d) {
  return d.toLocaleTimeString('es-EC', { timeZone: 'America/Guayaquil', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* Conecta la lectura del CSV al simulador.
   applyData({updates, vPrensa, rawText}) la provee combined-app. */
export function initHmiCsv({ applyData, statusEl, connectBtn, fileInput }) {
  let lastText = null;
  let mode = 'off';         // off | server | live-file | manual-file
  let fileHandle = null;
  let lastGood = null;
  let failStreak = 0;

  function setStatus(cls, msg, title) {
    if (!statusEl) return;
    statusEl.className = `s2-hmi-status is-${cls}`;
    statusEl.textContent = msg;
    statusEl.title = title ?? '';
  }

  let lastCount = 0;
  let lastSource = 'CSV';
  function applyText(text, sourceLabel) {
    if (text === lastText) return false;
    lastText = text;
    const parsed = parseHmiCsv(text);
    if (parsed.count === 0 && parsed.warnings.length > 0) {
      setStatus('error', '● HMI CSV · error de formato', parsed.warnings.join('\n'));
      return false;
    }
    lastGood = new Date();
    failStreak = 0;
    lastCount = parsed.count;
    lastSource = sourceLabel;
    // Estado ANTES de aplicar, para que el espejo del panel lea el texto fresco.
    const warn = parsed.warnings.length ? ` · ⚠ ${parsed.warnings.length}` : '';
    setStatus(mode === 'manual-file' ? 'manual' : 'live',
      `● HMI ${sourceLabel} · ${fmtTime(lastGood)} · ${parsed.count} tags${warn}`,
      parsed.warnings.join('\n'));
    applyData({ ...parsed, rawText: text });
    return true;
  }

  /* Latido: aunque el CSV no cambie, refresca el sello de tiempo cada poll para
     que se VEA que se está releyendo cada 2 s (el archivo estático no cambia). */
  function heartbeat() {
    if (mode !== 'server' || !lastGood) return;
    setStatus('live', `● HMI ${lastSource} · ${fmtTime(new Date())} · ${lastCount} tags · en vivo`, '');
  }

  function markServerDown() {
    failStreak += 1;
    if (failStreak < 2) return;
    if (lastGood) setStatus('error', `● HMI CSV · reconectando… (último ${fmtTime(lastGood)})`, 'No se encuentra datos/hmi.csv. Reintento cada 2 s.');
    else setStatus('idle', '● HMI CSV · sin conexión', 'Coloca datos/hmi.csv junto al sitio o conecta un archivo local.');
  }

  async function pollServer() {
    try {
      const res = await fetch(`datos/hmi.csv?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) { if (mode === 'server') markServerDown(); return false; }
      mode = 'server';
      const changed = applyText(await res.text(), 'CSV (servidor)');
      failStreak = 0;
      if (!changed) heartbeat();   // mismo contenido → refresca sello para mostrar liveness
      return true;
    } catch {
      if (mode === 'server') markServerDown();
      return false;
    }
  }

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
      fileInput.click();
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

  (async () => {
    const ok = await pollServer();
    if (!ok) setStatus('idle', '● HMI CSV · sin conexión', 'Coloca datos/hmi.csv junto al sitio o conecta un archivo local.');
    setInterval(() => {
      if (mode === 'server' || mode === 'off') pollServer();
      else if (mode === 'live-file') pollFile();
    }, POLL_MS);
  })();
}
