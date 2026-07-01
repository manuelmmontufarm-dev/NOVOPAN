/**
 * ProcessGraph — Línea 1 (modelo m_dot, 2026-06-25)
 *
 * Modelo de tiempos:
 *   - Bins / hoppers (tolva):                        τ = M_holdup / F × 60   [s]
 *   - Encoladores / sprays (tiempo fijo):            τ = constante (s)       [s]
 *   - Bandas acopladas a prensa:                     t = L / v_prensa × 60   [s]
 *   - Bandas inclinadas (velocidad fija HMI):          t = L / v_banda × 60   [s]
 *   - Sprays (caída instantánea):                    t = constante (estimado)
 *   - Cualquier etapa puede sumar buffer manual:     t_total = t_calc + buffer_s
 *
 * Origen de cada número:
 *   - hmi-live   → tag en vivo del HMI Metso/Dieffenbacher (entra cada turno)
 *   - recipe     → setpoint de receta (cambia con el producto)
 *   - mechanical → ficha técnica del equipo (constante para siempre)
 *   - measured   → cronometrado en planta
 *   - derived    → calculado a partir de otra medición
 *   - estimated  → mejor estimación, pendiente de medir
 *   - manual     → buffer añadido por el operador a la etapa
 */

export const PATH_IDS = {
  BOTTOM: 'path-bottom',
  CORE: 'path-core',
  TOP: 'path-top',
};

/**
 * Parámetros globales — entran arriba del panel y aplican a todas las etapas.
 * Cada uno declara su 'kind' (hmi-live | recipe | mechanical).
 */
export const GLOBAL_PARAMS = [
  // ── HMI en vivo ──
  {
    key: '_global:peso_manta',
    label: 'Peso manta (báscula central)',
    unit: 'kg/m²',
    default: 11.5,
    kind: 'hmi-live',
    desc: 'Variable maestra (kg/m²). HMI báscula central · 25-jun: 11,5 kg/m².',
    step: 0.05,
  },
  {
    key: '_global:F_SL',
    label: 'Flujo SL (capa fina total)',
    unit: 'kg/min',
    default: 147.6,
    kind: 'hmi-live',
    desc: 'SL1 (69,5) + SL2 (78,1) kg/min. Flujo dividido HMI 25-jun.',
    step: 0.1,
  },
  {
    key: '_global:F_CL',
    label: 'Flujo CL (core)',
    unit: 'kg/min',
    default: 118,
    kind: 'hmi-live',
    desc: 'Flujo core layer (esparcidor 2). HMI 25-jun: 118 kg/min.',
    step: 0.1,
  },
  // ── Receta ──
  {
    key: '_global:pctSL1',
    label: '% SL1 del fino (BOTTOM)',
    unit: '%',
    default: 47.1,
    kind: 'recipe',
    desc: 'Sub-receta capa fina inferior. 69,5 / 147,6 = 47,1 %.',
    step: 0.1,
  },
  {
    key: '_global:pctSL2',
    label: '% SL2 del fino (TOP)',
    unit: '%',
    default: 52.9,
    kind: 'recipe',
    desc: 'Sub-receta capa fina superior. 78,1 / 147,6 = 52,9 %.',
    step: 1,
  },
];

/** Prefijo compartido fina: dosing → encolador → banda inclinada (sube) → divisor */
export const FINE_PREFIX = [
  {
    id: 'dosing-fine',
    label: 'Dosing bin fina',
    kind: 'retention',
    model: 'bin',
    holdupKg: 20,
    flowSource: 'F_SL',
    layout: 'drop',
    source: {
      kind: 'hmi-live',
      desc: 'τ = M_bin_fina / F_SL × 60',
      detail: 'M = 20 kg (HMI). τ ≈ 8,1 s a F_SL = 147,6 kg/min.',
    },
  },
  {
    id: 'enc-fine',
    label: 'Encolador fina',
    sublabel: 'Resina + parafina + agua',
    kind: 'retention',
    model: 'fixed',
    retentionSec: 30,
    layout: 'process',
    source: {
      kind: 'estimated',
      desc: 'τ = tiempo fijo (s)',
      detail: 'Un solo parámetro en segundos (~30 s acordado en planta). No depende de flujo ni holdup.',
    },
  },
  {
    id: 'incl-fine',
    label: 'Banda inclinada azul (fina)',
    kind: 'transport',
    lengthM: 64.57,
    beltSpeedMperMin: 99.5,
    beltRpm: 123.5,
    beltAreaM2: 600,
    beltColor: 'blue',
    layout: 'incline-up',
    splitsTo: [PATH_IDS.BOTTOM, PATH_IDS.TOP],
    measuredAt: '2026-06-25',
    source: {
      kind: 'measured',
      date: '2026-06-25',
      desc: 't = L / v_banda × 60',
      detail: 'Velocidad FIJA HMI: 99,5 m/min (123,5 rpm). L = 64,57 m → t ≈ 38,9 s. No depende de v_prensa.',
    },
  },
];

export const PATHS = {
  [PATH_IDS.BOTTOM]: {
    id: PATH_IDS.BOTTOM,
    label: 'BOTTOM · Esparcidor 1',
    color: '#1565C0',
    row: 'bottom',
    nodes: [
      {
        id: 'esp1-zone',
        label: 'Esparcidor 1',
        kind: 'retention',
        model: 'hopper',
        holdupKg: 12.5,
        flowSource: 'F_SL1', // = F_SL × pctSL1
        layout: 'spreader',
        measuredAt: '2026-06-25',
        source: {
          kind: 'hmi-live',
          desc: 'τ = M_hopper_esp1 / (F_SL × %SL1) × 60',
          detail: 'M = 12,5 kg (SL1, HMI). τ ≈ 10,8 s a F_SL1 = 69,5 kg/min.',
        },
        equipment: [
          { name: 'Banda interna', atPct: 20 },
          { name: 'Regula volumen', atPct: 45 },
          { name: 'Báscula capa', atPct: 65 },
          { name: 'Rodillos diamante', atPct: 85 },
        ],
      },
    ],
  },
  [PATH_IDS.TOP]: {
    id: PATH_IDS.TOP,
    label: 'TOP · Esparcidor 3',
    color: '#1976D2',
    row: 'top',
    nodes: [
      {
        id: 'esp3-zone',
        label: 'Esparcidor 3',
        kind: 'retention',
        model: 'hopper',
        holdupKg: 15,
        flowSource: 'F_SL2', // = F_SL × pctSL2
        layout: 'spreader',
        measuredAt: '2026-06-25',
        source: {
          kind: 'hmi-live',
          desc: 'τ = M_hopper_esp3 / (F_SL × %SL2) × 60',
          detail: 'M = 15 kg (SL2, HMI). τ ≈ 11,5 s a F_SL2 = 78,1 kg/min.',
        },
        equipment: [
          { name: 'Banda interna', atPct: 20 },
          { name: 'Regula volumen', atPct: 45 },
          { name: 'Báscula capa', atPct: 65 },
          { name: 'Rodillos diamante', atPct: 85 },
        ],
      },
    ],
  },
  [PATH_IDS.CORE]: {
    id: PATH_IDS.CORE,
    label: 'CORE · Esparcidor 2',
    color: '#0A7D5A',
    row: 'core',
    nodes: [
      {
        id: 'dosing-thick',
        label: 'Dosing bin gruesa',
        kind: 'retention',
        model: 'bin',
        holdupKg: 25,
        flowSource: 'F_CL',
        layout: 'drop',
        source: {
          kind: 'hmi-live',
          desc: 'τ = M_bin_thick / F_CL × 60',
          detail: 'M = 25 kg (HMI). τ ≈ 12,7 s a F_CL = 118 kg/min.',
        },
      },
      {
        id: 'sprays-caida',
        label: 'Sprays presión (caída)',
        sublabel: 'Resina + agua + endurecedor',
        kind: 'retention',
        model: 'fixed',
        retentionSec: 5,
        layout: 'drop',
        source: {
          kind: 'estimated',
          desc: 't = 5 s (caída atomizada)',
          detail: 'Spray de inyección en caída libre. Cinética de la mezcla en milisegundos; los 5 s son margen estimado. No depende de receta.',
        },
      },
      {
        id: 'enc-thick',
        label: 'Encolador gruesa',
        sublabel: '+ parafina',
        kind: 'retention',
        model: 'fixed',
        retentionSec: 30,
        layout: 'process',
        source: {
          kind: 'estimated',
          desc: 'τ = tiempo fijo (s)',
          detail: 'Un solo parámetro en segundos (~30 s acordado en planta). No depende de flujo ni holdup.',
        },
      },
      {
        id: 'incl-thick',
        label: 'Banda inclinada azul (gruesa)',
        kind: 'transport',
        lengthM: 68.5,
        beltSpeedMperMin: 96.5,
        beltRpm: 119,
        beltAreaM2: 800,
        beltColor: 'blue',
        layout: 'incline-up',
        measuredAt: '2026-06-25',
        source: {
          kind: 'measured',
          date: '2026-06-25',
          desc: 't = L / v_banda × 60',
          detail: 'Velocidad FIJA HMI: 96,5 m/min (119 rpm). L = 68,5 m → t ≈ 42,6 s. No depende de v_prensa.',
        },
      },
      {
        id: 'esp2-zone',
        label: 'Esparcidor 2',
        kind: 'retention',
        model: 'hopper',
        holdupKg: 40,
        flowSource: 'F_CL',
        layout: 'spreader',
        measuredAt: '2026-06-25',
        source: {
          kind: 'hmi-live',
          desc: 'τ = M_hopper_esp2 / F_CL × 60',
          detail: 'M = 40 kg (CL, HMI). τ ≈ 20,3 s a F_CL = 118 kg/min.',
        },
        equipment: [
          { name: 'Banda interna', atPct: 20 },
          { name: 'Regula volumen', atPct: 45 },
          { name: 'Báscula capa', atPct: 65 },
          { name: 'Rodillos diamante', atPct: 85 },
        ],
      },
    ],
  },
};

/**
 * ── Sub-segmentos medidos en planta (jul-2026) ──
 *
 * Las bandas acopladas a prensa (blanca, roja, prensa metálica) se modelan como
 * una CADENA ordenada de sub-segmentos con longitud medida (flexómetro / campo),
 * en vez de un solo bloque de transporte.
 *
 *   - transport → tramo de banda corriendo (colchón vacío / formándose / manta)
 *   - zone      → tramo con equipo que ocupa longitud (esparcido SL/CL, pre-prensa, vapor)
 *   - waypoint  → punto sin extensión (imán, sprays, detector, cuchillas, marcos)
 *
 * Física: todos usan t = L / v_prensa × 60. La SUMA de longitudes = lengthM del
 * contenedor, así que los tiempos totales no cambian; los sub-segmentos solo
 * añaden granularidad (posición por metro, waypoints, desglose).
 */
export const WHITE_SEGMENTS = [
  { id: 'gap-pre-sl1', type: 'transport', lengthM: 1.42, label: 'Entrada → SL1' },
  { id: 'zone-sl1', type: 'zone', lengthM: 6.94, label: 'Zona SL1 · capa inferior' },
  { id: 'gap-sl1-cl', type: 'transport', lengthM: 3.35, label: 'SL1 → CL' },
  { id: 'zone-cl', type: 'zone', lengthM: 4.38, label: 'Zona CL · core' },
  { id: 'gap-cl-sl2', type: 'transport', lengthM: 1.37, label: 'CL → SL2' },
  { id: 'zone-sl2', type: 'zone', lengthM: 6.39, label: 'Zona SL2 · capa superior' },
  { id: 'gap-sl2-iman', type: 'transport', lengthM: 2.81, label: 'SL2 → imán' },
  { id: 'gap-iman-preprensa', type: 'transport', lengthM: 2.40, label: 'Imán → pre-prensa' },
  { id: 'zone-preprensa', type: 'zone', lengthM: 4.69, label: 'Pre-prensa' },
  { id: 'gap-preprensa-sprays', type: 'transport', lengthM: 2.22, label: 'Pre-prensa → sprays' },
  { id: 'gap-sprays-detector', type: 'transport', lengthM: 1.70, label: 'Sprays → detector' },
  { id: 'gap-detector-cuchillas', type: 'transport', lengthM: 1.86, label: 'Detector → cuchillas' },
  { id: 'gap-post-cuchillas', type: 'transport', lengthM: 5.41, label: 'Cuchillas → nariz #1' },
];
export const WHITE_WAYPOINTS = [
  { id: 'point-iman', atM: 26.68, label: 'Imán' },
  { id: 'point-sprays', atM: 35.99, label: 'Sprays anti-pegado' },
  { id: 'point-detector', atM: 37.69, label: 'Detector metales' },
  { id: 'point-cuchillas', atM: 39.56, label: 'Cuchillas / nariz' },
];

export const RED_SEGMENTS = [
  { id: 'gap-pre-vapor', type: 'transport', lengthM: 1.86, label: 'Entrada → vapor' },
  { id: 'zone-vapor', type: 'zone', lengthM: 2.29, label: 'Zona vapor · Dynasteam' },
  { id: 'gap-post-vapor', type: 'transport', lengthM: 5.88, label: 'Vapor → prensa' },
];
export const RED_WAYPOINTS = [
  { id: 'point-vapor-start', atM: 1.86, label: 'Vapor start' },
  { id: 'point-vapor-end', atM: 4.15, label: 'Vapor end' },
];

/** Prensa metálica: 0.10 + 6×0.75 + 12×0.90 + 1.20 = 16.60 m (19 marcos). */
function buildPressSegments() {
  const segs = [{ id: 'gap-pre-m1', type: 'transport', lengthM: 0.10, label: 'Entrada → marco 1' }];
  for (let i = 1; i <= 18; i++) {
    const L = i <= 6 ? 0.75 : 0.90; // pitch denso marcos 1–7, estándar 7–19
    segs.push({ id: `gap-m${i}-m${i + 1}`, type: 'transport', lengthM: L, label: `Marco ${i} → ${i + 1}` });
  }
  segs.push({ id: 'gap-decompress', type: 'transport', lengthM: 1.20, label: 'Descompresión + salida' });
  return segs;
}
export const PRESS_SEGMENTS = buildPressSegments();
const PRESS_FRAME_M = [0.10, 0.85, 1.60, 2.35, 3.10, 3.85, 4.60, 5.50, 6.40, 7.30,
  8.20, 9.10, 10.00, 10.90, 11.80, 12.70, 13.60, 14.50, 15.40];
export const PRESS_WAYPOINTS = PRESS_FRAME_M
  .map((atM, i) => ({ id: `point:m${i + 1}`, atM, label: `Marco ${i + 1}` }))
  .concat([{ id: 'point:end', atM: 16.60, label: 'Fin zona activa' }]);

const BAND_SEGMENTS = { white: WHITE_SEGMENTS, red: RED_SEGMENTS, press: PRESS_SEGMENTS };
const BAND_WAYPOINTS = { white: WHITE_WAYPOINTS, red: RED_WAYPOINTS, press: PRESS_WAYPOINTS };

/** Sub-segmentos de una banda (o null si no es banda downstream con cadena). */
export function bandSegments(bandId) {
  return BAND_SEGMENTS[bandId] ?? null;
}
export function bandWaypoints(bandId) {
  return BAND_WAYPOINTS[bandId] ?? null;
}
/** Sub-segmentos con startM/endM acumulados. */
export function bandSegmentsWithBounds(bandId) {
  const segs = bandSegments(bandId);
  if (!segs) return null;
  let acc = 0;
  return segs.map((s) => {
    const startM = acc;
    acc += s.lengthM;
    return { ...s, startM: +startM.toFixed(3), endM: +acc.toFixed(3) };
  });
}
/** Longitud total (m) de una banda por su cadena de sub-segmentos. */
export function bandLengthM(bandId) {
  const segs = bandSegments(bandId);
  return segs ? segs.reduce((a, s) => a + s.lengthM, 0) : 0;
}
/** Sub-segmento que contiene la posición posM (m) dentro de la banda. */
export function segmentAtM(bandId, posM) {
  const segs = bandSegmentsWithBounds(bandId);
  if (!segs) return null;
  const clampP = (v, a, b) => Math.max(a, Math.min(b, v));
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (posM < s.endM || i === segs.length - 1) {
      const span = s.endM - s.startM;
      return {
        segmentId: s.id,
        segmentLabel: s.label,
        segmentType: s.type,
        segmentStartM: s.startM,
        segmentEndM: s.endM,
        segmentProgress: span > 0 ? clampP((posM - s.startM) / span, 0, 1) : 1,
      };
    }
  }
  return null;
}

export const DOWNSTREAM = [
  {
    id: 'white',
    label: 'Banda blanca → nariz #1',
    kind: 'transport',
    lengthM: 45,
    beltColor: 'white',
    validated: true,
    measuredAt: '2026-06-30',
    segments: WHITE_SEGMENTS,
    waypoints: WHITE_WAYPOINTS,
    source: {
      kind: 'measured',
      date: '2026-06-30',
      desc: 't = L_white / v_prensa × 60',
      detail: '45 m medidos en planta, en cadena de sub-segmentos (formación SL1/CL/SL2 + imán + pre-prensa + sprays + detector + cuchillas + nariz #1).',
    },
    equipment: [
      { name: 'Zona SL1', atPct: 19 },
      { name: 'Zona CL', atPct: 36 },
      { name: 'Zona SL2', atPct: 53 },
      { name: 'Imán', atPct: 59 },
      { name: 'Pre-prensa', atPct: 75 },
      { name: 'Sprays', atPct: 80 },
      { name: 'Detector', atPct: 84 },
      { name: 'Cuchillas / nariz', atPct: 88 },
    ],
  },
  {
    id: 'red',
    label: 'Banda roja',
    kind: 'transport',
    lengthM: 10,
    beltColor: 'red',
    validated: true,
    segments: RED_SEGMENTS,
    waypoints: RED_WAYPOINTS,
    source: {
      kind: 'measured',
      date: '2026-06-30',
      desc: 't = L_red / v_prensa × 60',
      detail: '10 m medidos en planta, en cadena de sub-segmentos (entrada + Dynasteam vapor + salida a prensa).',
    },
    equipment: [
      { name: 'Vapor start', atPct: 19 },
      { name: 'Vapor end', atPct: 42 },
    ],
  },
  {
    id: 'press',
    label: 'Banda prensa metálica',
    sublabel: '16,6 m activos',
    kind: 'transport',
    lengthM: 16.6,
    beltColor: 'press',
    validated: true,
    segments: PRESS_SEGMENTS,
    waypoints: PRESS_WAYPOINTS,
    source: {
      kind: 'measured',
      date: '2026-07',
      desc: 't = L_press / v_prensa × 60',
      detail: 'Zona activa de prensado: 16,6 m (19 marcos, flexómetro jul-2026). El circuito total ~45 m incluye el retorno de la banda (no modelado).',
    },
    equipment: [
      { name: 'Marco 1', atPct: 1 },
      { name: 'Marco 7', atPct: 28 },
      { name: 'Marco 13', atPct: 60 },
      { name: 'Marco 19', atPct: 93 },
    ],
  },
];

export const INJECTION_OPTIONS = [
  { id: 'enc-all', label: 'Demo pintura · ambos encoladores', group: 'Inicio completo' },
  { id: 'dosing-all', label: 'Inicio · ambos dosing bins', group: 'Inicio completo' },
  { id: 'dosing-fine', label: 'Dosing bin fina', group: 'Ruta fina' },
  { id: 'enc-fine', label: 'Encolador fina', group: 'Ruta fina' },
  { id: 'incl-fine', label: 'Banda inclinada fina', group: 'Ruta fina' },
  { id: 'esp3-zone', label: 'Esparcidor 3 (TOP)', group: 'Ruta fina' },
  { id: 'esp1-zone', label: 'Esparcidor 1 (BOTTOM)', group: 'Ruta fina' },
  { id: 'dosing-thick', label: 'Dosing bin gruesa', group: 'Ruta gruesa (core)' },
  { id: 'sprays-caida', label: 'Sprays caída', group: 'Ruta gruesa (core)' },
  { id: 'enc-thick', label: 'Encolador gruesa', group: 'Ruta gruesa (core)' },
  { id: 'incl-thick', label: 'Banda inclinada gruesa', group: 'Ruta gruesa (core)' },
  { id: 'esp2-zone', label: 'Esparcidor 2 (CORE)', group: 'Ruta gruesa (core)' },
  { id: 'white', label: 'Banda blanca', group: 'Tramo común' },
  { id: 'red', label: 'Banda roja', group: 'Tramo común' },
  { id: 'press', label: 'Banda prensa', group: 'Tramo común' },
];

/** Etapas downstream del merge (t=0 ya en colchón o después). */
export const DOWNSTREAM_STAGE_IDS = ['white', 'red', 'press', 'done'];

/** Rutas que reciben marcador según dónde se inyecta el cambio. */
export function pathsForInjection(injectionId) {
  if (injectionId === 'dosing-all' || injectionId === 'enc-all') {
    return [PATH_IDS.BOTTOM, PATH_IDS.CORE, PATH_IDS.TOP];
  }
  if (injectionId === 'dosing-fine' || injectionId === 'enc-fine' || injectionId === 'incl-fine') {
    return [PATH_IDS.BOTTOM, PATH_IDS.TOP];
  }
  if (injectionId === 'dosing-thick' || injectionId === 'sprays-caida'
    || injectionId === 'enc-thick' || injectionId === 'incl-thick' || injectionId === 'esp2-zone') {
    return [PATH_IDS.CORE];
  }
  if (injectionId === 'esp1-zone') return [PATH_IDS.BOTTOM];
  if (injectionId === 'esp3-zone') return [PATH_IDS.TOP];
  if (DOWNSTREAM_STAGE_IDS.includes(injectionId)) {
    return [PATH_IDS.BOTTOM, PATH_IDS.CORE, PATH_IDS.TOP];
  }
  return [PATH_IDS.BOTTOM, PATH_IDS.CORE, PATH_IDS.TOP];
}

/** Nodo donde arranca t=0 en cada ruta (null = ruta sin cambio). */
export function startNodeForPath(injectionId, pathId) {
  if (DOWNSTREAM_STAGE_IDS.includes(injectionId)) return null;
  if (injectionId === 'dosing-all') {
    return pathId === PATH_IDS.CORE ? 'dosing-thick' : 'dosing-fine';
  }
  if (injectionId === 'enc-all') {
    return pathId === PATH_IDS.CORE ? 'enc-thick' : 'enc-fine';
  }
  const nodes = nodesForPath(pathId);
  if (nodes.some((n) => n.id === injectionId)) return injectionId;
  return null;
}

export const SPEED_PRESETS = [
  { id: 'thick', label: '36 mm → 7 m/min', mPerMin: 7 },
  { id: 'observed-jun24', label: '9 mm medido 24-jun → 14,5 m/min', mPerMin: 14.5 },
  { id: 'observed', label: 'Observado 22-jun → 16,85 m/min', mPerMin: 16.85 },
  { id: 'thin', label: '9 mm ref. → 23 m/min', mPerMin: 23 },
];

/** Nodos ordenados por ruta (fina incluye prefijo compartido). */
export function nodesForPath(pathId) {
  if (pathId === PATH_IDS.BOTTOM || pathId === PATH_IDS.TOP) {
    return [...FINE_PREFIX, ...PATHS[pathId].nodes];
  }
  return PATHS[pathId].nodes;
}

/** Todos los nodos únicos para el diagrama (sin duplicar prefijo fina). */
export function allDiagramNodes() {
  const seen = new Set();
  const list = [];
  const add = (n, pathId, meta = {}) => {
    if (seen.has(n.id)) return;
    seen.add(n.id);
    list.push({ ...n, pathId, ...meta });
  };

  for (const n of FINE_PREFIX) add(n, 'fine-shared');
  for (const pathId of [PATH_IDS.TOP, PATH_IDS.CORE, PATH_IDS.BOTTOM]) {
    for (const n of PATHS[pathId].nodes) add(n, pathId, { spreaderRow: PATHS[pathId].row });
  }
  for (const n of DOWNSTREAM) add(n, 'merged');
  return list;
}

/**
 * Construye lista de parámetros por etapa. Tres tipos:
 *  - 'mass' (kg)      → holdup live (bin/hopper) o mecánico (encolador)
 *  - 'length' (m)     → longitud de banda
 *  - 'factor' (×)     → multiplicador de banda inclinada
 *  - 'retention' (s)  → t fijo (solo sprays)
 *  - 'buffer' (s)     → buffer manual añadido por operador (todas las etapas)
 */
export function getParameterSchema() {
  const params = [];
  const seen = new Set();

  const push = (node, group, meta = {}) => {
    if (node.model === 'fixed' && (node.retentionSec ?? 0) > 0 && !seen.has(`ret:${node.id}`)) {
      seen.add(`ret:${node.id}`);
      params.push({
        key: `ret:${node.id}`,
        nodeId: node.id,
        label: `τ ${node.label}`,
        unit: 's',
        type: 'retention',
        default: node.retentionSec,
        group,
        required: true,
        kindBadge: 'estimated',
      });
    }
    if (node.holdupKg != null && !seen.has(`mass:${node.id}`)) {
      seen.add(`mass:${node.id}`);
      const isMechanical = node.model === 'cstr';
      params.push({
        key: `mass:${node.id}`,
        nodeId: node.id,
        label: `M ${node.label}`,
        unit: 'kg',
        type: 'mass',
        default: node.holdupKg,
        group,
        required: true,
        kindBadge: isMechanical ? 'mechanical' : 'hmi-live',
        flowSource: node.flowSource,
        model: node.model,
      });
    }
    if ((node.lengthM ?? 0) > 0 && !seen.has(`len:${node.id}`)) {
      seen.add(`len:${node.id}`);
      params.push({
        key: `len:${node.id}`,
        nodeId: node.id,
        label: node.label,
        unit: 'm',
        type: 'length',
        default: node.lengthM,
        group,
        required: true,
        kindBadge: 'measured',
      });
    }
    if (node.beltSpeedMperMin != null && !seen.has(`speed:${node.id}`)) {
      seen.add(`speed:${node.id}`);
      params.push({
        key: `speed:${node.id}`,
        nodeId: node.id,
        label: `Velocidad · ${node.label}`,
        unit: 'm/min',
        type: 'speed',
        default: node.beltSpeedMperMin,
        group,
        required: true,
        kindBadge: 'hmi-live',
      });
    } else if (node.speedFactor != null && !seen.has(`factor:${node.id}`)) {
      seen.add(`factor:${node.id}`);
      params.push({
        key: `factor:${node.id}`,
        nodeId: node.id,
        label: `Factor vs prensa · ${node.label}`,
        unit: '×',
        type: 'factor',
        default: node.speedFactor,
        group,
        required: false,
        kindBadge: 'measured',
      });
    }
    // Buffer manual (s) — disponible en TODAS las etapas
    if (!seen.has(`buffer:${node.id}`)) {
      seen.add(`buffer:${node.id}`);
      params.push({
        key: `buffer:${node.id}`,
        nodeId: node.id,
        label: `Buffer manual · ${node.label}`,
        unit: 's',
        type: 'buffer',
        default: 0,
        group,
        required: false,
        kindBadge: 'manual',
      });
    }
  };

  for (const n of FINE_PREFIX) push(n, 'Ruta fina (compartida)');
  for (const path of Object.values(PATHS)) {
    for (const node of path.nodes) push(node, path.label);
  }
  for (const node of DOWNSTREAM) {
    if (!seen.has(`len:${node.id}`)) {
      seen.add(`len:${node.id}`);
      params.push({
        key: `len:${node.id}`,
        nodeId: node.id,
        label: node.label,
        unit: 'm',
        type: 'length',
        default: node.lengthM,
        group: 'Tramo común (blanca → roja → prensa)',
        required: true,
        kindBadge: 'measured',
      });
    }
    if (!seen.has(`buffer:${node.id}`)) {
      seen.add(`buffer:${node.id}`);
      params.push({
        key: `buffer:${node.id}`,
        nodeId: node.id,
        label: `Buffer manual · ${node.label}`,
        unit: 's',
        type: 'buffer',
        default: 0,
        group: 'Tramo común (blanca → roja → prensa)',
        required: false,
        kindBadge: 'manual',
      });
    }
  }
  return params;
}

export function defaultParams() {
  const out = {};
  for (const p of GLOBAL_PARAMS) out[p.key] = p.default;
  for (const p of getParameterSchema()) out[p.key] = p.default;
  return out;
}

export function findNode(nodeId) {
  for (const n of FINE_PREFIX) {
    if (n.id === nodeId) return { ...n, pathId: 'fine-shared' };
  }
  for (const p of Object.values(PATHS)) {
    const n = p.nodes.find((x) => x.id === nodeId);
    if (n) return { ...n, pathId: p.id };
  }
  const d = DOWNSTREAM.find((x) => x.id === nodeId);
  return d ? { ...d, pathId: 'merged' } : null;
}

/** Secuencia para barra de progreso (orden físico izquierda → derecha). */
export const STAGE_SEQUENCE = [
  { id: 'dosing-fine', label: 'Dosing fina', short: 'D.fina' },
  { id: 'enc-fine', label: 'Encolador fina', short: 'Enc.fina' },
  { id: 'dosing-thick', label: 'Dosing gruesa', short: 'D.gruesa' },
  { id: 'sprays-caida', label: 'Sprays caída', short: 'Sprays' },
  { id: 'enc-thick', label: 'Encolador gruesa', short: 'Enc.gruesa' },
  { id: 'incl-fine', label: 'Banda inclinada fina', short: '↗ fina' },
  { id: 'incl-thick', label: 'Banda inclinada gruesa', short: '↗ gruesa' },
  { id: 'esp3-zone', label: 'Esparcidor 3 (TOP)', short: 'Esp.3' },
  { id: 'esp2-zone', label: 'Esparcidor 2 (CORE)', short: 'Esp.2' },
  { id: 'esp1-zone', label: 'Esparcidor 1 (BOTTOM)', short: 'Esp.1' },
  { id: 'white', label: 'Banda blanca', short: 'Blanca' },
  { id: 'red', label: 'Banda roja', short: 'Roja' },
  { id: 'press', label: 'Banda prensa', short: 'Prensa' },
  { id: 'done', label: 'Salida prensa', short: 'Salida' },
];
