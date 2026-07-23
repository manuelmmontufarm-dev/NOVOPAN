/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — MODELO DE RUTA (Silos 5/6 → Sensores 1/2/3)
   ------------------------------------------------------------
   Modelo de ingeniería ÚNICO y confiable para la ruta acotada:

     Silos 5/6 → Dosing → Encoladoras (mixers) → Bandas inclinadas
       → Esparcidoras SL1/CL/SL2 → Registro de capas → Transporte a
       prensa → Sensores de calidad 1/2/3

   Este módulo es AUTOCONTENIDO: define UNA sola tabla de parámetros
   (ROUTE_PARAMS) con toda la metadata de ingeniería y todas las
   ecuaciones con sus conversiones de unidades y guardas. NO refactoriza
   el motor de la Sección 1 (../../trazabilidad/js/core/*), que se deja
   intacto. Se puede importar tanto en el navegador (ES module) como en
   Node (para las pruebas).

   Regla de oro: NUNCA se sustituye en silencio un valor faltante o
   inválido por 0. Cada cantidad devuelve un ESTADO explícito
   (ok · estimado · sin-calibrar · falta-parámetro · inválido ·
   cálculo-no-disponible) para que la UI lo muestre en vez de mentir.
   ============================================================ */

/* ── 1 · Estados de una cantidad ───────────────────────────── */

export const STATUS = {
  OK: 'ok',                       // valor válido, fuente confiable
  ESTIMATED: 'estimated',         // valor calculado sobre una entrada estimada (por validar)
  NOT_CALIBRATED: 'not-calibrated', // valor sobre una posición/entrada aún no medida
  /* El equipo NO se está moviendo: su flujo (o su velocidad) vale exactamente
     0. NO es un error de dato ni un parámetro faltante — es información buena
     sobre la planta, y su τ no es 0 s sino infinito (el material se queda
     dentro). Se separa de INVALID a propósito: "flujo 0" y "flujo corrupto"
     obligan a acciones distintas en planta. */
  STOPPED: 'stopped',
  MISSING: 'missing',             // falta un parámetro requerido (vacío/undefined)
  INVALID: 'invalid',             // entrada presente pero inválida (negativo, NaN, ∞)
  UNAVAILABLE: 'unavailable',     // no se puede calcular porque una dependencia falla
};

/** Etiqueta humana (español) para cada estado — lo que la UI muestra. */
export const STATUS_LABEL = {
  [STATUS.OK]: 'OK',
  [STATUS.ESTIMATED]: 'Valor estimado',
  [STATUS.NOT_CALIBRATED]: 'Sin calibrar',
  [STATUS.STOPPED]: 'Detenido (flujo 0)',
  [STATUS.MISSING]: 'Falta parámetro',
  [STATUS.INVALID]: 'Entrada inválida',
  [STATUS.UNAVAILABLE]: 'Cálculo no disponible',
};

// Severidad: mayor = más grave / manda en el estado combinado.
const SEVERITY = {
  [STATUS.OK]: 0,
  [STATUS.ESTIMATED]: 1,
  [STATUS.NOT_CALIBRATED]: 2,
  [STATUS.STOPPED]: 3,
  [STATUS.MISSING]: 4,
  [STATUS.INVALID]: 5,
  [STATUS.UNAVAILABLE]: 6,
};

/* Estados que impiden que exista un valor numérico (bloquean el cálculo).
   STOPPED entra aquí porque su τ es infinito: no hay número que sumar, y
   cualquier total que lo incluya es también infinito. */
const BLOCKING = new Set([STATUS.STOPPED, STATUS.MISSING, STATUS.INVALID, STATUS.UNAVAILABLE]);

export function isBlocking(status) { return BLOCKING.has(status); }
export function isAvailable(q) { return q != null && q.value != null && !BLOCKING.has(q.status); }

/* ── 2 · Fábrica de cantidades (Quantity) ──────────────────── */
/**
 * Una Quantity representa el resultado de una ecuación o de un parámetro:
 *   { value:number|null, unit, status, flags:Set<string>, reason, source, steps }
 * `flags` acumula matices no bloqueantes (estimated / not-calibrated) que se
 * propagan aguas abajo aunque el valor sí exista.
 */
function makeQ({ value = null, unit = '', status = STATUS.OK, reason = '', source = '', flags = [], steps = null }) {
  const flagSet = new Set(flags);
  if (status === STATUS.ESTIMATED) flagSet.add(STATUS.ESTIMATED);
  if (status === STATUS.NOT_CALIBRATED) flagSet.add(STATUS.NOT_CALIBRATED);
  return { value, unit, status, reason, source, flags: flagSet, steps };
}

function okQ(value, unit, { source = '', flags = [] } = {}) {
  // Guarda central: ningún resultado no finito (overflow → ±Infinity, NaN) puede
  // salir con estado OK. Cierra cualquier fuga aritmética aguas arriba.
  if (!Number.isFinite(value)) {
    return failQ(STATUS.INVALID, unit, `resultado no finito (${value})`, { source });
  }
  // Si trae flags no bloqueantes, el estado headline es el más grave de ellos.
  let status = STATUS.OK;
  for (const f of flags) if (SEVERITY[f] > SEVERITY[status]) status = f;
  return makeQ({ value, unit, status, source, flags });
}

function failQ(status, unit, reason, { source = '' } = {}) {
  return makeQ({ value: null, unit, status, reason, source });
}

/* ── 3 · Conversiones de unidades (con validación) ─────────── */
/* Todas devuelven NaN ante entradas no finitas, para que el llamador
   decida el estado (nunca se convierte NaN en 0). */

export const convert = {
  /** kg/h → kg/min */
  kghToKgmin: (kgh) => (Number.isFinite(kgh) ? kgh / 60 : NaN),
  /** kg/min → kg/h */
  kgminToKgh: (kgmin) => (Number.isFinite(kgmin) ? kgmin * 60 : NaN),
  /** porcentaje [0..100] → fracción [0..1] */
  pctToFraction: (pct) => (Number.isFinite(pct) ? pct / 100 : NaN),
  /** fracción → porcentaje */
  fractionToPct: (fr) => (Number.isFinite(fr) ? fr * 100 : NaN),
  /** minutos → segundos */
  minToSec: (min) => (Number.isFinite(min) ? min * 60 : NaN),
  /** segundos → minutos */
  secToMin: (sec) => (Number.isFinite(sec) ? sec / 60 : NaN),
  /** m/min → m/s */
  mminToMs: (mmin) => (Number.isFinite(mmin) ? mmin / 60 : NaN),
};

/** Normaliza un flujo a kg/min a partir de su unidad declarada. */
export function flowToKgMin(value, unit) {
  if (!Number.isFinite(value)) return NaN;
  if (unit === 'kg/min') return value;
  if (unit === 'kg/h') return convert.kghToKgmin(value);
  return NaN; // unidad de flujo desconocida
}

/* ── 4 · Tabla central de parámetros (ÚNICA fuente de verdad) ─
   Cada parámetro declara:
     key        · identificador estable (namespace por equipo)
     label      · nombre legible
     equipment  · equipo físico
     layer      · capa/ruta a la que pertenece (fina SL / gruesa CL / SL1 / CL / SL2 / común)
     value      · valor por defecto (del HMI CSV — fuente de verdad de trazabilidad-total)
     unit       · unidad física
     source     · origen del número (hmi | measured | recipe | fixed | estimated | not-calibrated)
     min / max  · rango físico conocido (null si no acotado)
     editable   · si el operador puede editarlo en la UI
     description· nota de ingeniería / justificación
   Los valores por defecto reflejan datos/hmi.csv (13-jul-2026).            */

export const LAYER = {
  FINE: 'fina (SL)',
  COARSE: 'gruesa (CL)',
  SL1: 'SL1 · inferior',
  CL: 'CL · core',
  SL2: 'SL2 · superior',
  COMMON: 'común (colchón)',
};

export const ROUTE_PARAMS = [
  /* ── Silo 5 (CL / core) · τ_silo = ρ·V·L / F × 60 ── */
  { key: 'silo5.rho', label: 'Silo 5 · densidad ρ', equipment: 'Silo 5 (CL/core)', layer: LAYER.COARSE, value: 135, unit: 'kg/m³', source: 'hmi', min: 0, max: null, editable: true, description: 'Densidad aparente del material core en Silo 5. HMI CSV SILO5_RHO_KGM3.' },
  { key: 'silo5.capacity', label: 'Silo 5 · capacidad V', equipment: 'Silo 5 (CL/core)', layer: LAYER.COARSE, value: 100, unit: 'm³', source: 'measured', min: 0, max: null, editable: true, description: 'Volumen del silo, CONFIRMADO en planta 21-jul-2026: 100 m³. Antes 120 estimado.' },
  { key: 'silo5.level', label: 'Silo 5 · nivel', equipment: 'Silo 5 (CL/core)', layer: LAYER.COARSE, value: 44, unit: '%', source: 'hmi', min: 0, max: 100, editable: true, description: 'Nivel de llenado. Se convierte a fracción (÷100) antes de usar en τ_silo.' },
  { key: 'silo5.flow', label: 'Silo 5 · flujo de salida F', equipment: 'Silo 5 (CL/core)', layer: LAYER.COARSE, value: 302, unit: 'kg/min', source: 'hmi', min: 0, max: null, editable: true, description: 'Flujo de descarga del silo hacia dosing gruesa. HMI CSV SILO5_FOUT_KGMIN (kg/min, NO kg/h).' },

  /* ── Silo 6 (SL / capas finas) ── */
  { key: 'silo6.rho', label: 'Silo 6 · densidad ρ', equipment: 'Silo 6 (SL/capas)', layer: LAYER.FINE, value: 188, unit: 'kg/m³', source: 'hmi', min: 0, max: null, editable: true, description: 'Densidad aparente del material fino en Silo 6. HMI CSV SILO6_RHO_KGM3.' },
  { key: 'silo6.capacity', label: 'Silo 6 · capacidad V', equipment: 'Silo 6 (SL/capas)', layer: LAYER.FINE, value: 100, unit: 'm³', source: 'measured', min: 0, max: null, editable: true, description: 'Volumen del silo, CONFIRMADO en planta 21-jul-2026: 100 m³. Antes 120 estimado.' },
  { key: 'silo6.level', label: 'Silo 6 · nivel', equipment: 'Silo 6 (SL/capas)', layer: LAYER.FINE, value: 31, unit: '%', source: 'hmi', min: 0, max: 100, editable: true, description: 'Nivel de llenado. Se convierte a fracción antes de usar.' },
  { key: 'silo6.flow', label: 'Silo 6 · flujo de salida F', equipment: 'Silo 6 (SL/capas)', layer: LAYER.FINE, value: 108, unit: 'kg/min', source: 'hmi', min: 0, max: null, editable: true, description: 'Flujo de descarga hacia dosing fina. HMI CSV SILO6_FOUT_KGMIN (kg/min).' },

  /* ── Dosing · τ_dosing = M / F × 60 ── */
  { key: 'dosingCL.mass', label: 'Dosing CL · masa retenida M', equipment: 'Dosing bin gruesa', layer: LAYER.COARSE, value: 25, unit: 'kg', source: 'hmi', min: 0, max: null, editable: true, description: 'Masa de material en el bin dosificador core. HMI CSV DOSING_CL_M_KG.' },
  { key: 'dosingCL.flow', label: 'Dosing CL · flujo F', equipment: 'Dosing bin gruesa', layer: LAYER.COARSE, value: 302, unit: 'kg/min', source: 'hmi', min: 0, max: null, editable: true, description: 'Flujo dosificado (= salida Silo 5 en régimen estable). HMI CSV DOSING_CL_F_KGMIN.' },
  { key: 'dosingSL.mass', label: 'Dosing SL · masa retenida M', equipment: 'Dosing bin fina', layer: LAYER.FINE, value: 20, unit: 'kg', source: 'hmi', min: 0, max: null, editable: true, description: 'Masa de material en el bin dosificador fino. HMI CSV DOSING_SL_M_KG.' },
  { key: 'dosingSL.flow', label: 'Dosing SL · flujo F', equipment: 'Dosing bin fina', layer: LAYER.FINE, value: 108, unit: 'kg/min', source: 'hmi', min: 0, max: null, editable: true, description: 'Flujo dosificado (= salida Silo 6). HMI CSV DOSING_SL_F_KGMIN.' },

  /* ── Encoladoras (mixers) · τ_mixer = 40 s FIJO ── */
  { key: 'mixerCE.tau', label: 'Encoladora externa/fina (CE) · τ', equipment: 'Encolador fina', layer: LAYER.FINE, value: 40, unit: 's', source: 'fixed', min: 40, max: 40, editable: false, description: 'Retención FIJA de la encoladora externa (capa fina). Valor de proceso acordado en planta = 40 s. No depende de flujo ni de masa.' },
  { key: 'mixerCI.tau', label: 'Encoladora interna/gruesa (CI) · τ', equipment: 'Encolador gruesa', layer: LAYER.COARSE, value: 40, unit: 's', source: 'fixed', min: 40, max: 40, editable: false, description: 'Retención FIJA de la encoladora interna (capa gruesa/core) = 40 s. No depende de flujo ni de masa.' },

  /* ── Bandas inclinadas · t = L / v × 60 ── */
  { key: 'inclSL.length', label: 'Banda inclinada fina · L', equipment: 'Banda inclinada fina', layer: LAYER.FINE, value: 64.57, unit: 'm', source: 'measured', min: 0, max: null, editable: true, description: 'Total banda transportadora fina hasta fin del brazo E3 (SL2): inclinada 39.22 + distribución SL2 16.42 + brazo 8.93 = 64.57 m (plano DXF jul-2026, coincide con medición 25-jun). OJO: la rama SL1 NO recorre la distribución: su total es 39.22 + 8.93 = 48.15 m (pendiente de separar en el modelo). HMI CSV INCL_SL_L_M.' },
  { key: 'inclSL.speed', label: 'Banda inclinada fina · v', equipment: 'Banda inclinada fina', layer: LAYER.FINE, value: 99.5, unit: 'm/min', source: 'measured', min: 0, max: null, editable: true, description: 'Velocidad FIJA HMI (no depende de v_prensa). HMI CSV INCL_SL_V_MMIN.' },
  { key: 'inclCL.length', label: 'Banda inclinada gruesa · L', equipment: 'Banda inclinada gruesa', layer: LAYER.COARSE, value: 68.5, unit: 'm', source: 'measured', min: 0, max: null, editable: true, description: 'Total banda transportadora gruesa hasta fin del brazo E2 (CL): inclinada 39.2 + banda flap→esparcidor 17.7 + brazo ≈11.6 = 68.5 m (medición 25-jun; tramos del plano DXF jul-2026). HMI CSV INCL_CL_L_M.' },
  { key: 'inclCL.speed', label: 'Banda inclinada gruesa · v', equipment: 'Banda inclinada gruesa', layer: LAYER.COARSE, value: 96.5, unit: 'm/min', source: 'measured', min: 0, max: null, editable: true, description: 'Velocidad FIJA HMI. HMI CSV INCL_CL_V_MMIN.' },

  /* ── Esparcidores · τ = M_hopper / F_capa × 60 ── */
  /* Masa retenida en la tolva del esparcidor. El HMI NO publica la masa en kg;
     publica el % de llenado de cada tolva (H_SL1/CC/SL2_Filling_PV, ~60 %).
     Convertir % → kg necesita la CAPACIDAD de cada tolva (kg al 100 %), que aún
     no tenemos (preguntar en planta). Hasta entonces se usa un valor de arranque
     EDITABLE; en el panel de parámetros sale marcado «Falta dato», no «HMI»
     (kind `falta` en hmi-csv). Aquí el `source` se deja neutro (no `estimated`
     ni `not-calibrated`) A PROPÓSITO: τ_esparcidor = M/F es corto (~6-20 s de
     ~3300 s) y no debe contaminar el registro —que hereda solo la incertidumbre
     de las DISTANCIAS de sensores— con un «sin calibrar» que taparía lo que sí
     importa. El «falta» vive donde el operador lo edita: el panel. */
  { key: 'spreader1.mass', label: 'Esparcidor 1 (SL1) · masa M', equipment: 'Esparcidor 1', layer: LAYER.SL1, value: 12.5, unit: 'kg', source: 'hmi', min: 0, max: null, editable: true, description: 'FALTA capacidad de tolva SL1 (kg) para convertir H_SL1_Filling_PV (% llenado) a masa. Valor de arranque editable. Preguntar en planta.' },
  { key: 'spreader1.flow', label: 'Esparcidor 1 (SL1) · flujo F', equipment: 'Esparcidor 1', layer: LAYER.SL1, value: 69.76, unit: 'kg/min', source: 'hmi', min: 0, max: null, editable: true, description: 'F_SL × PCT_SL1/100.' },
  { key: 'spreader2.mass', label: 'Esparcidor 2 (CL) · masa M', equipment: 'Esparcidor 2', layer: LAYER.CL, value: 40, unit: 'kg', source: 'hmi', min: 0, max: null, editable: true, description: 'FALTA capacidad de tolva CL (kg) para convertir H_CC_Filling_PV (% llenado) a masa. Valor de arranque editable. Preguntar en planta.' },
  { key: 'spreader2.flow', label: 'Esparcidor 2 (CL) · flujo F', equipment: 'Esparcidor 2', layer: LAYER.CL, value: 118, unit: 'kg/min', source: 'hmi', min: 0, max: null, editable: true, description: 'HMI CSV F_CL_KGMIN.' },
  { key: 'spreader3.mass', label: 'Esparcidor 3 (SL2) · masa M', equipment: 'Esparcidor 3', layer: LAYER.SL2, value: 15, unit: 'kg', source: 'hmi', min: 0, max: null, editable: true, description: 'FALTA capacidad de tolva SL2 (kg) para convertir H_SL2_Filling_PV (% llenado) a masa. Valor de arranque editable. Preguntar en planta.' },
  { key: 'spreader3.flow', label: 'Esparcidor 3 (SL2) · flujo F', equipment: 'Esparcidor 3', layer: LAYER.SL2, value: 77.84, unit: 'kg/min', source: 'hmi', min: 0, max: null, editable: true, description: 'F_SL × PCT_SL2/100.' },

  /* ── Velocidad de línea (máster downstream) ── */
  { key: 'line.speed', label: 'Velocidad de prensa v_prensa', equipment: 'Prensa continua', layer: LAYER.COMMON, value: 14.5, unit: 'm/min', source: 'hmi', min: 0, max: null, editable: true, description: 'Velocidad de la línea después del registro (colchón → sensores). Máster del tramo común. HMI CSV V_PRENSA_M_MIN.' },

  /* ── Sensores de calidad · distancia desde el registro (m=0, arranque banda blanca) ──
     Distancia EFECTIVA derivada de la prueba de papel (cambio CL, 14-jul-2026, v≈15.6):
     el tablero llega al Sensor 1 a ~88.0 m. El flexómetro previo (85.15 m) fue al ojo, y
     el tramo fin-prensa→refila salió ~3.4 m más largo en la prueba → POR CONFIRMAR con flexómetro. */
  { key: 'sensor1.distance', label: 'Sensor 1 · distancia desde registro', equipment: 'Sensores de calidad', layer: LAYER.COMMON, value: 88.0, unit: 'm', source: 'estimated', min: 0, max: null, editable: true, description: 'Distancia efectiva derivada de la prueba de papel (14-jul-2026): el tablero llega al Sensor 1 a ~88.0 m del arranque del colchón. Reemplaza el 85.15 m medido al ojo. POR CONFIRMAR con flexómetro.' },
  { key: 'sensor2.distance', label: 'Sensor 2 · distancia desde registro', equipment: 'Sensores de calidad', layer: LAYER.COMMON, value: 88.2, unit: 'm', source: 'not-calibrated', min: 0, max: null, editable: true, description: 'Sensor 2, ~0.20 m después del Sensor 1 (nominal). Separación sin medir → SIN CALIBRAR.' },
  { key: 'sensor3.distance', label: 'Sensor 3 · distancia desde registro', equipment: 'Sensores de calidad', layer: LAYER.COMMON, value: 88.4, unit: 'm', source: 'not-calibrated', min: 0, max: null, editable: true, description: 'Sensor 3, ~0.40 m después del Sensor 1 (~0.20 m tras el Sensor 2, nominal). SIN CALIBRAR.' },
];

/** Índice key → definición, para lecturas O(1). */
export const PARAM_INDEX = Object.fromEntries(ROUTE_PARAMS.map((p) => [p.key, p]));

/** Constante de proceso: retención fija de las encoladoras (mixers). */
export const MIXER_TAU_SEC = 40;

/** Valores por defecto {key: value} — punto de partida antes de aplicar HMI/overrides. */
export function defaultParamValues() {
  return Object.fromEntries(ROUTE_PARAMS.map((p) => [p.key, p.value]));
}

/* ── 5 · Lectura guardada de un parámetro ──────────────────── */
/**
 * Lee params[key] con TODAS las guardas. Nunca sustituye por 0 en silencio.
 *  - undefined/null/'' (o el sentinel intencional)  → MISSING
 *  - NaN / ±Infinity / no numérico                  → INVALID
 *  - negativo                                        → INVALID
 *  - cero cuando allowZero=false                     → INVALID (p. ej. flujo/velocidad)
 *  - fuera de [min,max] declarados                   → INVALID
 * Si el parámetro es de fuente estimated / not-calibrated, el estado OK se
 * degrada a ese flag (para que se propague aguas abajo).
 */
export function readParam(params, key, { allowZero = true, ceroDetiene = false } = {}) {
  const def = PARAM_INDEX[key];
  const unit = def?.unit ?? '';
  const source = def?.source ?? '';
  let raw = params ? params[key] : undefined;
  if (typeof raw === 'string') raw = raw.trim(); // '  ' no debe colarse como 0

  if (raw === undefined || raw === null || raw === '') {
    return failQ(STATUS.MISSING, unit, `Falta «${def?.label ?? key}»`, { source });
  }
  // Sólo se aceptan number o string numérica. Booleanos/objetos/arrays coercen
  // a 0 con Number() → se rechazan como inválidos (no como 0 silencioso).
  if (typeof raw !== 'number' && typeof raw !== 'string') {
    return failQ(STATUS.INVALID, unit, `«${def?.label ?? key}» tipo inválido (${typeof raw})`, { source });
  }
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) {
    return failQ(STATUS.INVALID, unit, `«${def?.label ?? key}» no es un número finito (${raw})`, { source });
  }
  if (n < 0) {
    return failQ(STATUS.INVALID, unit, `«${def?.label ?? key}» es negativo (${n})`, { source });
  }
  if (!allowZero && n === 0) {
    /* Un flujo o una velocidad en 0 NO es un dato malo: es la máquina parada,
       y el HMI la reporta así todos los días. Un volumen o una retención en 0
       sí es un dato malo. Por eso el llamador declara qué significa el cero. */
    if (ceroDetiene) {
      return failQ(STATUS.STOPPED, unit, `«${def?.label ?? key}» = 0 → equipo detenido, el material no avanza`, { source });
    }
    return failQ(STATUS.INVALID, unit, `«${def?.label ?? key}» no puede ser 0`, { source });
  }
  if (def) {
    if (def.min != null && n < def.min) {
      return failQ(STATUS.INVALID, unit, `«${def.label}» < mínimo ${def.min}`, { source });
    }
    if (def.max != null && n > def.max) {
      return failQ(STATUS.INVALID, unit, `«${def.label}» > máximo ${def.max}`, { source });
    }
  }
  // Válido. Degradar según la fuente del dato.
  const flags = [];
  if (source === 'estimated') flags.push(STATUS.ESTIMATED);
  if (source === 'not-calibrated') flags.push(STATUS.NOT_CALIBRATED);
  return okQ(n, unit, { source, flags });
}

/* ── 6 · Combinadores de cantidades ────────────────────────── */

function worstFlags(quantities) {
  const flags = new Set();
  for (const q of quantities) for (const f of q.flags) flags.add(f);
  return [...flags];
}

/** Suma de cantidades en segundos. Si alguna es bloqueante → UNAVAILABLE. */
function sumSec(label, parts) {
  const blockers = parts.filter((p) => isBlocking(p.q.status) || p.q.value == null);
  if (blockers.length) {
    const reason = `${label}: no disponible por → ` +
      blockers.map((b) => `${b.name} (${STATUS_LABEL[b.q.status]})`).join(', ');
    return makeQ({ value: null, unit: 's', status: STATUS.UNAVAILABLE, reason, steps: parts });
  }
  const value = parts.reduce((a, p) => a + p.q.value, 0);
  return okQ(value, 's', { flags: worstFlags(parts.map((p) => p.q)) });
}

/** Máximo de cantidades en segundos (registro = capa más lenta). */
function maxSec(label, parts) {
  const blockers = parts.filter((p) => isBlocking(p.q.status) || p.q.value == null);
  if (blockers.length) {
    const reason = `${label}: no disponible por → ` +
      blockers.map((b) => `${b.name} (${STATUS_LABEL[b.q.status]})`).join(', ');
    return makeQ({ value: null, unit: 's', status: STATUS.UNAVAILABLE, reason, steps: parts });
  }
  let winner = parts[0];
  for (const p of parts) if (p.q.value > winner.q.value) winner = p;
  const q = okQ(winner.q.value, 's', { flags: worstFlags(parts.map((p) => p.q)) });
  q.reason = `${label} = máx(${parts.map((p) => `${p.name} ${p.q.value.toFixed(1)}s`).join(', ')}) → ${winner.name}`;
  q.winner = winner.name;
  return q;
}

/* ── 7 · Ecuaciones primitivas (cada una devuelve Quantity en s) ── */

/** τ_silo = ρ · V · L(frac) / F(kg/min) × 60  → segundos. */
export function tauSilo(params, prefix) {
  const rho = readParam(params, `${prefix}.rho`);
  const V = readParam(params, `${prefix}.capacity`, { allowZero: false });
  const level = readParam(params, `${prefix}.level`);
  const flow = readParam(params, `${prefix}.flow`, { allowZero: false, ceroDetiene: true });

  const parts = [
    { name: `${prefix}.rho`, q: rho },
    { name: `${prefix}.capacity`, q: V },
    { name: `${prefix}.level`, q: level },
    { name: `${prefix}.flow`, q: flow },
  ];
  const blockers = parts.filter((p) => isBlocking(p.q.status) || p.q.value == null);
  if (blockers.length) {
    return makeQ({
      value: null, unit: 's', status: STATUS.UNAVAILABLE,
      reason: `τ_silo(${prefix}) no disponible por → ` +
        blockers.map((b) => `${b.name} (${STATUS_LABEL[b.q.status]})`).join(', '),
    });
  }
  const levelFrac = convert.pctToFraction(level.value); // % → fracción
  const flowKgMin = flowToKgMin(flow.value, flow.unit);  // kg/(h|min) → kg/min
  if (!Number.isFinite(flowKgMin) || flowKgMin <= 0) {
    return failQ(STATUS.INVALID, 's', `τ_silo(${prefix}): flujo inválido tras conversión`);
  }
  const massKg = rho.value * V.value * levelFrac;         // kg
  const tauSec = (massKg / flowKgMin) * 60;               // min × 60 = s
  return okQ(tauSec, 's', { flags: worstFlags([rho, V, level, flow]) });
}

/** τ_dosing = M / F × 60  → segundos. */
export function tauDosing(params, prefix) {
  const M = readParam(params, `${prefix}.mass`);
  const flow = readParam(params, `${prefix}.flow`, { allowZero: false, ceroDetiene: true });
  const parts = [{ name: `${prefix}.mass`, q: M }, { name: `${prefix}.flow`, q: flow }];
  const blockers = parts.filter((p) => isBlocking(p.q.status) || p.q.value == null);
  if (blockers.length) {
    return makeQ({
      value: null, unit: 's', status: STATUS.UNAVAILABLE,
      reason: `τ_dosing(${prefix}) no disponible por → ` +
        blockers.map((b) => `${b.name} (${STATUS_LABEL[b.q.status]})`).join(', '),
    });
  }
  const flowKgMin = flowToKgMin(flow.value, flow.unit);
  if (!Number.isFinite(flowKgMin) || flowKgMin <= 0) {
    return failQ(STATUS.INVALID, 's', `τ_dosing(${prefix}): flujo inválido`);
  }
  const tauSec = (M.value / flowKgMin) * 60;
  return okQ(tauSec, 's', { flags: worstFlags([M, flow]) });
}

/** τ_mixer = 40 s FIJO. Devuelve el valor del parámetro (que está fijado en 40). */
export function tauMixer(params, prefix) {
  const q = readParam(params, `${prefix}.tau`, { allowZero: false });
  return q; // el rango min=max=40 fuerza que sea exactamente 40 s
}

/** t_incline = L / v × 60  → segundos. */
export function tInclined(params, prefix) {
  const L = readParam(params, `${prefix}.length`);
  const v = readParam(params, `${prefix}.speed`, { allowZero: false, ceroDetiene: true });
  const parts = [{ name: `${prefix}.length`, q: L }, { name: `${prefix}.speed`, q: v }];
  const blockers = parts.filter((p) => isBlocking(p.q.status) || p.q.value == null);
  if (blockers.length) {
    return makeQ({
      value: null, unit: 's', status: STATUS.UNAVAILABLE,
      reason: `t_incline(${prefix}) no disponible por → ` +
        blockers.map((b) => `${b.name} (${STATUS_LABEL[b.q.status]})`).join(', '),
    });
  }
  const tSec = (L.value / v.value) * 60; // (m / (m/min)) × 60 = s
  return okQ(tSec, 's', { flags: worstFlags([L, v]) });
}

/** τ_esparcidor = M_hopper / F_capa × 60. */
export function tauSpreader(params, prefix) {
  const M = readParam(params, `${prefix}.mass`);
  const F = readParam(params, `${prefix}.flow`, { allowZero: false, ceroDetiene: true });
  const blockers = [M, F].filter((q) => isBlocking(q.status) || q.value == null);
  if (blockers.length) return makeQ({ value: null, unit: 's', status: STATUS.UNAVAILABLE, reason: `τ_${prefix} no disponible` });
  return okQ((M.value / F.value) * 60, 's', { flags: worstFlags([M, F]) });
}

/** t_sensor = t_registration + distancia / v_línea × 60. */
export function tSensor(params, sensorKey, tRegistrationQ) {
  const dist = readParam(params, `${sensorKey}.distance`);
  const v = readParam(params, 'line.speed', { allowZero: false, ceroDetiene: true });
  const parts = [
    { name: 't_registro', q: tRegistrationQ },
    { name: `${sensorKey}.distance`, q: dist },
    { name: 'line.speed', q: v },
  ];
  const blockers = parts.filter((p) => isBlocking(p.q.status) || p.q.value == null);
  if (blockers.length) {
    return makeQ({
      value: null, unit: 's', status: STATUS.UNAVAILABLE,
      reason: `t_sensor(${sensorKey}) no disponible por → ` +
        blockers.map((b) => `${b.name} (${STATUS_LABEL[b.q.status]})`).join(', '),
    });
  }
  const transportSec = (dist.value / v.value) * 60; // (m / (m/min)) × 60 = s
  const total = tRegistrationQ.value + transportSec;
  const q = okQ(total, 's', { flags: worstFlags([tRegistrationQ, dist, v]) });
  q.transportSec = transportSec;
  return q;
}

/* ── 8 · Ensamblado de la ruta ─────────────────────────────── */

/** Ruta fina compartida (SL): Silo 6 → Dosing SL → Encoladora CE → Inclinada SL. */
export function fineUpstream(params) {
  const steps = [
    { name: 'τ_silo6', q: tauSilo(params, 'silo6') },
    { name: 'τ_dosingSL', q: tauDosing(params, 'dosingSL') },
    { name: 'τ_mixerCE', q: tauMixer(params, 'mixerCE') },
    { name: 't_inclSL', q: tInclined(params, 'inclSL') },
  ];
  const total = sumSec('Ruta fina (upstream)', steps);
  total.steps = steps;
  return total;
}

/** Ruta gruesa (CL): Silo 5 → Dosing CL → Encoladora CI → Inclinada CL. */
export function coarseUpstream(params) {
  const steps = [
    { name: 'τ_silo5', q: tauSilo(params, 'silo5') },
    { name: 'τ_dosingCL', q: tauDosing(params, 'dosingCL') },
    { name: 'τ_mixerCI', q: tauMixer(params, 'mixerCI') },
    { name: 't_inclCL', q: tInclined(params, 'inclCL') },
  ];
  const total = sumSec('Ruta gruesa (upstream)', steps);
  total.steps = steps;
  return total;
}

/**
 * Llegada de cada capa al colchón:
 *   t_SL1 = ruta fina + esparcidor 1
 *   t_CL  = ruta gruesa + esparcidor 2
 *   t_SL2 = ruta fina + esparcidor 3
 */
export function layerArrivals(params) {
  const fine = fineUpstream(params);
  const coarse = coarseUpstream(params);

  const tSL1 = sumSec('t_SL1', [
    { name: 'ruta_fina', q: fine },
    { name: 'τ_esparcidor1', q: tauSpreader(params, 'spreader1') },
  ]);
  const tCL = sumSec('t_CL', [
    { name: 'ruta_gruesa', q: coarse },
    { name: 'τ_esparcidor2', q: tauSpreader(params, 'spreader2') },
  ]);
  const tSL2 = sumSec('t_SL2', [
    { name: 'ruta_fina', q: fine },
    { name: 'τ_esparcidor3', q: tauSpreader(params, 'spreader3') },
  ]);
  return { fine, coarse, tSL1, tCL, tSL2 };
}

/** t_registration = max(t_SL1, t_CL, t_SL2) — el colchón sólo existe cuando llega la última capa. */
export function registration(params, arrivals = layerArrivals(params)) {
  return maxSec('t_registro', [
    { name: 'SL1', q: arrivals.tSL1 },
    { name: 'CL', q: arrivals.tCL },
    { name: 'SL2', q: arrivals.tSL2 },
  ]);
}

/**
 * Cálculo completo de la ruta. Acepta overrides parciales {key:value}; los
 * faltantes usan defaultParamValues(). `opts.lineSpeed` sobreescribe line.speed.
 */
export function computeRoute(overrides = {}, opts = {}) {
  const params = { ...defaultParamValues(), ...overrides };
  if (opts.lineSpeed != null) params['line.speed'] = opts.lineSpeed;

  const arrivals = layerArrivals(params);
  const tReg = registration(params, arrivals);

  const sensors = {
    sensor1: tSensor(params, 'sensor1', tReg),
    sensor2: tSensor(params, 'sensor2', tReg),
    sensor3: tSensor(params, 'sensor3', tReg),
  };

  return {
    params,
    lineSpeed: params['line.speed'],
    fine: arrivals.fine,
    coarse: arrivals.coarse,
    layers: { tSL1: arrivals.tSL1, tCL: arrivals.tCL, tSL2: arrivals.tSL2 },
    registration: tReg,
    sensors,
  };
}

/* ── 9 · Utilidades de presentación ────────────────────────── */

/** Formatea una Quantity de tiempo para la UI: valor + unidad + estado. */
export function formatSec(q, { decimals = 1 } = {}) {
  if (q == null) return { text: '—', status: STATUS.UNAVAILABLE, label: STATUS_LABEL[STATUS.UNAVAILABLE] };
  if (q.value == null || isBlocking(q.status)) {
    return { text: STATUS_LABEL[q.status] ?? '—', status: q.status, label: STATUS_LABEL[q.status], reason: q.reason };
  }
  const flags = [...q.flags].filter((f) => f !== STATUS.OK);
  const suffix = flags.length ? ` · ${flags.map((f) => STATUS_LABEL[f]).join(' · ')}` : '';
  return {
    text: `${q.value.toFixed(decimals)} s${suffix}`,
    seconds: q.value,
    minutes: q.value / 60,
    status: q.status,
    label: STATUS_LABEL[q.status],
    flags,
  };
}
