/* ============================================================
   NOVOPAN · Trazabilidad total · documento CSV del modelo
   ------------------------------------------------------------
   El CSV es la única autoridad editable de parámetros. La UI nunca
   modifica el modelo directamente: edita una fila del CSV, vuelve a
   parsear el documento completo y recién entonces actualiza el motor.

   En producción, WinCC/SQL sigue siendo dueño de datos/hmi.csv. Un
   navegador estático no puede sobrescribir ese archivo del servidor;
   por eso las ediciones se mantienen en el documento CSV activo, se
   pueden descargar y, si el usuario conectó un archivo local mediante
   File System Access, se escriben de forma debounced a ese archivo.
   ============================================================ */

/* Intervalo de relectura del CSV. Default 2000 ms (el HMI de planta escribe
   cada ~2 s); se puede ajustar sin tocar código con ?poll=1000 en la URL
   (mínimo 250 ms para no saturar el servidor). */
const POLL_MS = (() => {
  try {
    const p = Number(new URLSearchParams(window.location.search).get('poll'));
    if (Number.isFinite(p) && p >= 250) return p;
  } catch { /* sin window.location (entorno de pruebas) */ }
  return 2000;
})();
const WRITE_DEBOUNCE_MS = 420;

const entry = (keys, kind, unit) => ({ keys: Array.isArray(keys) ? keys : [keys], kind, unit });

/* Tag CSV → claves del modelo. Algunos tags alimentan tanto el modelo
   combinado P1 como el motor detallado de Sección 2; una sola edición
   del CSV mantiene ambos alias sincronizados. */
export const TAG_MAP = {
  V_PRENSA_M_MIN:      entry('v_prensa', 'hmi', 'm/min'),
  PESO_MANTA_KGM2:     entry('_global:peso_manta', 'hmi', 'kg/m²'),
  F_SL_KGMIN:          entry('_global:F_SL', 'hmi', 'kg/min'),
  F_CL_KGMIN:          entry('_global:F_CL', 'hmi', 'kg/min'),
  PCT_SL1:             entry('_global:pctSL1', 'hmi', '%'),
  PCT_SL2:             entry('_global:pctSL2', 'hmi', '%'),

  PILA1_ASERRIN_M_KG:  entry('p1:pila1_M', 'hmi', 'kg'),
  PILA1_ASERRIN_F_KGH: entry('p1:pila1_F', 'hmi', 'kg/h'),
  T_DYNESCREEN_S:      entry('p1:tDS', 'est', 's'),
  T_TRANSP_ASERRIN_S:  entry('p1:tr1', 'est', 's'),
  PILA2_CHIP_M_KG:     entry('p1:pila2_M', 'hmi', 'kg'),
  PILA2_CHIP_F_KGH:    entry('p1:pila2_F', 'hmi', 'kg/h'),
  T_ESPERA_DESVIADOR_S: entry('p1:esperaDesv', 'est', 's'),
  T_TRANSP_FLAKES_S:   entry('p1:tr2', 'est', 's'),
  T_HOMBAK_S3_S:       entry('p1:tr3', 'est', 's'),

  SILO1_RHO_KGM3:      entry('p1:s1_rho', 'hmi', 'kg/m³'),
  SILO1_V_M3:          entry('p1:s1_V', 'est', 'm³'),
  SILO1_L_PCT:         entry('p1:s1_L', 'hmi', '%'),
  SILO1_FOUT_KGH:      entry('p1:s1_F', 'hmi', 'kg/h'),
  SILO2A_RHO_KGM3:     entry('p1:s2_rho', 'hmi', 'kg/m³'),
  SILO2A_V_M3:         entry('p1:s2_V', 'est', 'm³'),
  SILO2A_L_PCT:        entry('p1:s2_L', 'hmi', '%'),
  SILO2A_FOUT_KGH:     entry('p1:s2_F', 'hmi', 'kg/h'),
  SILO2B_RHO_KGM3:     entry('p1:s2b_rho', 'hmi', 'kg/m³'),
  SILO2B_V_M3:         entry('p1:s2b_V', 'est', 'm³'),
  SILO2B_L_PCT:        entry('p1:s2b_L', 'hmi', '%'),
  SILO2B_FOUT_KGH:     entry('p1:s2b_F', 'hmi', 'kg/h'),
  SILO3_RHO_KGM3:      entry('p1:s3_rho', 'hmi', 'kg/m³'),
  SILO3_V_M3:          entry('p1:s3_V', 'est', 'm³'),
  SILO3_L_PCT:         entry('p1:s3_L', 'hmi', '%'),
  SILO3_FOUT_KGH:      entry('p1:s3_F', 'hmi', 'kg/h'),

  BUNKER_RHO_KGM3:     entry('p1:bk_rho', 'hmi', 'kg/m³'),
  BUNKER_V_M3:         entry('p1:bk_V', 'est', 'm³'),
  BUNKER_L_PCT:        entry('p1:bk_L', 'hmi', '%'),
  BUNKER_FHUM_KGH:     entry('p1:bk_F', 'hmi', 'kg/h'),
  T_TRANSP_SECADERO_S: entry('p1:trSec', 'est', 's'),
  TAU_TAMBOR_S:        entry('p1:tauTambor', 'est', 's'),

  T_TAMICES_FG_S:      entry('p1:tCriba', 'est', 's'),
  T_ZARANDAS_S:        entry('p1:tZar', 'est', 's'),
  T_COLECT_CL_S:       entry('p1:tColectCL', 'est', 's'),
  T_COLECT_SL_S:       entry('p1:tColectSL', 'est', 's'),
  T_COLECT_PG_S:       entry('p1:tColectOver', 'est', 's'),
  T_COLECT_POLVO_S:    entry('p1:tPolvo', 'est', 's'),
  T_WS1_S:             entry('p1:tWS1', 'est', 's'),
  T_WS2_S:             entry('p1:tWS2', 'est', 's'),
  T_WS3_S:             entry('p1:tWS3', 'est', 's'),
  T_IMAN_FE_S:         entry('p1:tFe', 'est', 's'),
  T_NEUMATICO_SL_S:    entry('p1:tNeum', 'est', 's'),
  T_REF1_S:            entry('p1:tRef1', 'est', 's'),
  T_REF2_S:            entry('p1:tRef2', 'est', 's'),
  T_CICLON_S:          entry('p1:tCiclon', 'est', 's'),
  T_CLAS_SL_S:         entry('p1:tClasSL', 'est', 's'),
  T_REINGRESO_SL_S:    entry('p1:tReingresoSL', 'est', 's'),

  SILO5_RHO_KGM3:      entry('p1:s5_rho', 'hmi', 'kg/m³'),
  SILO5_V_M3:          entry('p1:s5_V', 'est', 'm³'),
  SILO5_L_PCT:         entry('p1:s5_L', 'hmi', '%'),
  SILO5_FOUT_KGMIN:    entry('p1:s5_Fmin', 'hmi', 'kg/min'),
  SILO6_RHO_KGM3:      entry('p1:s6_rho', 'hmi', 'kg/m³'),
  SILO6_V_M3:          entry('p1:s6_V', 'est', 'm³'),
  SILO6_L_PCT:         entry('p1:s6_L', 'hmi', '%'),
  SILO6_FOUT_KGMIN:    entry('p1:s6_Fmin', 'hmi', 'kg/min'),
  SILO4_RHO_KGM3:      entry('p1:s4_rho', 'hmi', 'kg/m³'),
  SILO4_V_M3:          entry('p1:s4_V', 'est', 'm³'),
  SILO4_L_PCT:         entry('p1:s4_L', 'hmi', '%'),
  SILO4_FOUT_KGMIN:    entry('p1:s4_Fmin', 'hmi', 'kg/min'),
  SILO8_RHO_KGM3:      entry('p1:s8_rho', 'hmi', 'kg/m³'),
  SILO8_V_M3:          entry('p1:s8_V', 'est', 'm³'),
  SILO8_L_PCT:         entry('p1:s8_L', 'hmi', '%'),
  SILO8_FOUT_KGMIN:    entry('p1:s8_Fmin', 'hmi', 'kg/min'),

  DOSING_CL_M_KG:      entry(['p1:dosG_M', 'mass:dosing-thick'], 'hmi', 'kg'),
  DOSING_CL_F_KGMIN:   entry(['p1:dosG_F', 'flow:dosing-thick'], 'hmi', 'kg/min'),
  DOSING_SL_M_KG:      entry(['p1:dosF_M', 'mass:dosing-fine'], 'hmi', 'kg'),
  DOSING_SL_F_KGMIN:   entry(['p1:dosF_F', 'flow:dosing-fine'], 'hmi', 'kg/min'),
  T_ENC_CI_S:          entry(['p1:tEncCI', 'ret:enc-thick'], 'est', 's'),
  T_ENC_CE_S:          entry(['p1:tEncCE', 'ret:enc-fine'], 'est', 's'),
  T_SPRAYS_CAIDA_S:    entry('ret:sprays-caida', 'est', 's'),
  INCL_CL_L_M:         entry(['p1:inclG_L', 'len:incl-thick'], 'measured', 'm'),
  INCL_CL_V_MMIN:      entry(['p1:inclG_v', 'speed:incl-thick'], 'hmi', 'm/min'),
  INCL_SL_L_M:         entry(['p1:inclF_L', 'len:incl-fine'], 'measured', 'm'),
  INCL_SL_V_MMIN:      entry(['p1:inclF_v', 'speed:incl-fine'], 'hmi', 'm/min'),

  M_ESP1_KG:           entry('mass:esp1-zone', 'hmi', 'kg'),
  M_ESP2_KG:           entry('mass:esp2-zone', 'hmi', 'kg'),
  M_ESP3_KG:           entry('mass:esp3-zone', 'hmi', 'kg'),
  L_BANDA_BLANCA_M:    entry('len:white', 'measured', 'm'),
  L_BANDA_ROJA_M:      entry('len:red', 'measured', 'm'),
  L_PRENSA_M:          entry('len:press', 'measured', 'm'),
  L_POSTPRENSA_M:      entry('p1:postPress_L', 'measured', 'm'),
  OFFSET_SENSOR2_M:    entry('geom:sensor2Offset', 'measured', 'm'),
  OFFSET_SENSOR3_M:    entry('geom:sensor3Offset', 'measured', 'm'),
  M_ESP1_CAIDA_M:      entry('geom:esp1', 'measured', 'm'),
  M_ESP2_CAIDA_M:      entry('geom:esp2', 'measured', 'm'),
  M_ESP3_CAIDA_M:      entry('geom:esp3', 'measured', 'm'),
  M_IMAN_M:            entry('geom:magnet', 'measured', 'm'),
  M_SPRAYS2_M:         entry('geom:sprays2', 'measured', 'm'),
  M_DETECTOR_M:        entry('geom:detector', 'measured', 'm'),
  M_CORTADORES_M:      entry('geom:cutters', 'measured', 'm'),
  M_NARIZ_M:           entry('geom:nose', 'measured', 'm'),
  M_VAPOR_M:           entry('geom:vapor', 'measured', 'm'),
  M_PREPRENSA_M:       entry('geom:prepress', 'measured', 'm'),
  M_PREPRENSA_LEN_M:   entry('geom:prepressLen', 'measured', 'm'),
  M_REFILA_INICIO_M:   entry('geom:refilaStart', 'measured', 'm'),
  M_REFILA_FIN_M:      entry('geom:refilaEnd', 'measured', 'm'),
  M_SIERRA_INICIO_M:   entry('geom:sawStart', 'measured', 'm'),
  M_SIERRA_FIN_M:      entry('geom:sawEnd', 'measured', 'm'),
};

/* Tags reales del HMI Metso (pantalla "Select Tag", 700 items, foto 21-jul-2026).
   Alias de SOLO LECTURA: el CSV que escribe IT puede usar el nombre real de
   WinCC y el simulador lo entiende sin que nadie renombre nada. El nombre
   canónico de la izquierda en TAG_MAP se sigue usando para escribir/editar.

   ⚠️ Los nombres de WinCC son sensibles a mayúsculas en pantalla pero el
   simulador los compara sin distinguir mayúsculas — se conservan aquí tal
   como aparecen en el HMI (incluidos sus errores de tipeo de fábrica).

   Cada alias está confirmado por la columna `Comment` del propio HMI (fotos de
   descripciones, 21-jul-2026) — no por parecido de nombre. La unidad citada es
   la que declara ese comentario. */
export const WINCC_ALIAS = {
  // "Press speed (m/min)" · Access Name: Forming
  'H_PressSpeed_PV':      'V_PRENSA_M_MIN',
  // "Mat weight after forming (kg/m2)" · OJO: `H_Act_MatWeight_Real` NO sirve
  // aquí — su comentario es "Mat weight from Scale (kg)", son kilos, no kg/m².
  'H_Act_MatWeight_SP':   'PESO_MANTA_KGM2',
  // "CL total flakes kg/min" · Access Name: Forming
  'H_CL_Total_Flakes':    'F_CL_KGMIN',
  // "SL1 % Set value (%)" · Access Name: Forming
  'H_Act_SL1_SP':         'PCT_SL1',

  /* HMI de encolado / cocina de cola (420 items, servidor `HMI`, 21-jul-2026).
     Es un servidor DISTINTO al de formación: si IT junta ambos en un solo CSV,
     revisar colisiones — `H_PressSpeed_PV` y `H_SL_FlakeDens_SP` existen en los
     dos con Access Name distinto (`Forming` vs `Form`). */
  // "CL dosing bin weight" · Access Name: Gluing · grupo CL_DosBin
  'F_CL_DosBin_Weight':   'DOSING_CL_M_KG',
  // "SL dosing bin weight" · Access Name: Gluing · grupo SL_DosBin
  'F_SL_DosBin_Weight':   'DOSING_SL_M_KG',
  // "SL flake flow" · unidad no declarada en el comentario; se asume kg/min por
  // simetría con `H_CL_Total_Flakes` ("CL total flakes kg/min"). CONFIRMAR.
  'F_SL_FlakeFlow_PV':    'F_SL_KGMIN',
};

/* Índice de búsqueda: NOMBRE_NORMALIZADO → metadatos. Cubre los nombres
   canónicos y los alias de WinCC en una sola tabla. */
const LOOKUP = (() => {
  const out = new Map();
  for (const [tag, meta] of Object.entries(TAG_MAP)) out.set(tag.toUpperCase(), meta);
  for (const [wincc, canon] of Object.entries(WINCC_ALIAS)) {
    const meta = TAG_MAP[canon];
    if (meta) out.set(wincc.toUpperCase(), meta);
  }
  return out;
})();

export const KIND_BY_KEY = (() => {
  const out = {};
  for (const meta of Object.values(TAG_MAP)) {
    for (const key of meta.keys) out[key] = meta.kind;
  }
  return out;
})();

export const UNIT_BY_KEY = (() => {
  const out = {};
  for (const meta of Object.values(TAG_MAP)) {
    for (const key of meta.keys) out[key] = meta.unit;
  }
  return out;
})();

export const TAG_BY_KEY = (() => {
  const out = {};
  for (const [tag, meta] of Object.entries(TAG_MAP)) {
    for (const key of meta.keys) out[key] = tag;
  }
  return out;
})();

function unquote(s) {
  const t = String(s ?? '').trim();
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

/** Parsea el CSV completo. Todos los alias reciben el mismo valor. */
export function parseHmiCsv(text) {
  const updates = {};
  const warnings = [];
  let vPrensa = null;
  let count = 0;
  const clean = String(text ?? '').replace(/^﻿/, '');
  for (const rawLine of clean.split(/\r?\n/)) {
    let line = rawLine;
    const h = line.indexOf('#'); if (h !== -1) line = line.slice(0, h);
    const c = line.indexOf('//'); if (c !== -1) line = line.slice(0, c);
    line = line.trim();
    if (!line) continue;
    const records = line.includes(':') ? line.split(';') : [line];
    for (const recRaw of records) {
      const rec = recRaw.trim();
      if (!rec) continue;
      let sep;
      let sepIdx = rec.indexOf(':');
      if (sepIdx !== -1) sep = ':';
      else if ((sepIdx = rec.indexOf('\t')) !== -1) sep = '\t';
      else if ((sepIdx = rec.indexOf(';')) !== -1) sep = ';';
      else if ((sepIdx = rec.indexOf(',')) !== -1) sep = ',';
      else { warnings.push(`registro sin separador: "${rec}"`); continue; }
      /* El nombre se conserva tal cual viene (WinCC distingue mayúsculas y
         usa guiones: `L18CL5-IN-PB-le-F_act`); la comparación es
         insensible a mayúsculas para tolerar exports en otro formato. */
      const tag = unquote(rec.slice(0, sepIdx));
      const norm = tag.toUpperCase();
      if (!tag || norm === 'TAG' || norm === 'TAGNAME' || norm === 'VARIABLE') continue;
      const meta = LOOKUP.get(norm);
      if (!meta) { warnings.push(`tag desconocido: ${tag}`); continue; }
      const num = toNumber(rec.slice(sepIdx + 1), sep);
      if (num.empty) continue;
      if (num.nan) { warnings.push(`valor inválido en ${tag}`); continue; }
      if (num.val < 0) { warnings.push(`valor negativo ignorado en ${tag}`); continue; }
      for (const key of meta.keys) updates[key] = num.val;
      if (meta.keys.includes('v_prensa')) vPrensa = num.val;
      count += 1;
    }
  }
  return { updates, vPrensa, warnings, count };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Cambia exactamente un tag y conserva comentarios/orden del documento. */
export function updateCsvTag(text, tag, value) {
  const formatted = Number(value).toString();
  const re = new RegExp(`(^|[;\\n\\r])([ \\t]*${escapeRegExp(tag)}[ \\t]*:[ \\t]*)([^;\\r\\n]*)(;)`, 'im');
  if (re.test(text)) return text.replace(re, (_, lead, prefix, _old, semi) => `${lead}${prefix}${formatted}${semi}`);
  return `${String(text ?? '').replace(/\s*$/, '')}\n${tag}: ${formatted};\n`;
}

function fmtTime(d) {
  return d.toLocaleTimeString('es-EC', { timeZone: 'America/Guayaquil', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function initHmiCsv({ applyData, statusEl, connectBtn, fileInput }) {
  let lastText = null;
  let currentText = '';
  let mode = 'off'; // off | server | live-file | manual-file | edited
  let fileHandle = null;
  let lastGood = null;
  let failStreak = 0;
  let lastCount = 0;
  let writeTimer = 0;

  function setStatus(cls, msg, title) {
    if (!statusEl) return;
    statusEl.className = `s2-hmi-status is-${cls}`;
    statusEl.textContent = msg;
    statusEl.title = title ?? '';
  }

  /* Devuelve true = aplicado · false = sin cambios · 'error' = formato
     inválido (se conserva el último CSV bueno y el estado muestra el error;
     pollServer NO debe pisar ese estado con el pill "en vivo"). */
  function applyText(text, sourceLabel, force = false) {
    if (!force && text === lastText) return false;
    const parsed = parseHmiCsv(text);
    if (parsed.count === 0 && parsed.warnings.length > 0) {
      const when = lastGood ? ` · último válido ${fmtTime(lastGood)}` : '';
      setStatus('error', `● CSV · error de formato${when}`, parsed.warnings.join('\n'));
      return 'error';
    }
    lastText = text;
    currentText = text;
    lastGood = new Date();
    failStreak = 0;
    lastCount = parsed.count;
    const warn = parsed.warnings.length ? ` · ⚠ ${parsed.warnings.length}` : '';
    const edited = mode === 'edited';
    setStatus(edited || mode === 'manual-file' ? 'manual' : 'live',
      `● ${sourceLabel} · ${fmtTime(lastGood)} · ${parsed.count} tags${warn}`,
      parsed.warnings.join('\n'));
    applyData({ ...parsed, rawText: text, sourceLabel, edited });
    return true;
  }

  function markServerDown() {
    failStreak += 1;
    if (failStreak < 2) return;
    if (lastGood) setStatus('error', `● CSV · reconectando… (último ${fmtTime(lastGood)})`, 'No se encuentra datos/hmi.csv.');
    else setStatus('idle', '● CSV · sin conexión', 'Conecta un archivo CSV o verifica datos/hmi.csv.');
  }

  async function pollServer() {
    try {
      const res = await fetch(`datos/hmi.csv?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) { if (mode === 'server') markServerDown(); return false; }
      mode = 'server';
      const text = await res.text();
      const changed = applyText(text, 'HMI CSV');
      // Solo el caso "sin cambios" refresca el pill en vivo; un 'error' de
      // formato debe quedar visible hasta que llegue un CSV válido.
      if (changed === false && lastGood) setStatus('live', `● HMI CSV · ${fmtTime(lastGood)} · ${lastCount} tags`, 'Contenido sin cambios; última lectura válida.');
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
      applyText(await file.text(), 'CSV local', true);
    } catch {
      setStatus('error', '● CSV local · no accesible', 'Vuelve a conectar el archivo.');
    }
  }

  async function connectFile() {
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{ description: 'CSV del modelo NOVOPAN', accept: { 'text/csv': ['.csv'], 'text/plain': ['.txt'] } }],
        });
        fileHandle = handle;
        mode = 'live-file';
        lastModified = 0;
        lastText = null;
        await pollFile();
      } catch { /* cancelado por el usuario */ }
    } else if (fileInput) {
      fileInput.click();
    }
  }

  async function persistConnectedFile() {
    if (!fileHandle?.createWritable || !currentText) return;
    try {
      const writable = await fileHandle.createWritable();
      await writable.write(currentText);
      await writable.close();
      const file = await fileHandle.getFile();
      lastModified = file.lastModified;
      setStatus('manual', `● CSV local guardado · ${fmtTime(new Date())} · ${lastCount} tags`, 'El modelo fue actualizado únicamente a través del CSV conectado.');
    } catch {
      setStatus('manual', '● CSV editado en memoria · descarga para guardar', 'El navegador no obtuvo permiso para sobrescribir el archivo local.');
    }
  }

  function scheduleFileWrite() {
    clearTimeout(writeTimer);
    if (!fileHandle) return;
    writeTimer = setTimeout(persistConnectedFile, WRITE_DEBOUNCE_MS);
  }

  /* Si el CSV vino de IT con nombres de WinCC, la edición debe reescribir
     ESA fila — no agregar una segunda con nuestro nombre canónico. */
  function tagPresentIn(text, key) {
    const canon = TAG_BY_KEY[key];
    if (!canon) return null;
    const has = (name) => new RegExp(`(^|[;\\n\\r])[ \\t]*${escapeRegExp(name)}[ \\t]*:`, 'im').test(text);
    if (has(canon)) return canon;
    for (const [wincc, target] of Object.entries(WINCC_ALIAS)) {
      if (target === canon && has(wincc)) return wincc;
    }
    return canon;
  }

  function updateKey(key, value) {
    const tag = tagPresentIn(currentText, key);
    const numeric = Number(value);
    if (!tag || !Number.isFinite(numeric) || numeric < 0 || !currentText) return false;
    mode = 'edited';
    const next = updateCsvTag(currentText, tag, numeric);
    applyText(next, fileHandle ? 'CSV local editado' : 'CSV editado en memoria', true);
    scheduleFileWrite();
    return true;
  }

  function downloadCsv() {
    if (!currentText) return false;
    const blob = new Blob([currentText], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hmi-editado.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return true;
  }

  async function reloadServer() {
    mode = 'off';
    fileHandle = null;
    lastText = null;
    currentText = '';
    await pollServer();
  }

  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    mode = 'manual-file';
    fileHandle = null;
    lastText = null;
    applyText(await file.text(), 'CSV manual', true);
    fileInput.value = '';
  });
  connectBtn?.addEventListener('click', connectFile);

  (async () => {
    const ok = await pollServer();
    if (!ok) setStatus('idle', '● CSV · sin conexión', 'Conecta un archivo CSV o verifica datos/hmi.csv.');
    setInterval(() => {
      if (mode === 'server' || mode === 'off') pollServer();
      else if (mode === 'live-file') pollFile();
    }, POLL_MS);
  })();

  return { updateKey, downloadCsv, reloadServer, getText: () => currentText, getTagForKey: (key) => TAG_BY_KEY[key] ?? null };
}
