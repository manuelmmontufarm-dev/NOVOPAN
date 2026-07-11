/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — orquestación
   ------------------------------------------------------------
   Parte 1: geometría a escala real (colchón, rodillos, marcos,
   regla métrica y franja de distancias medidas).
   Parte 2: HMI en vivo — la línea NUNCA se detiene. Cada clic en
   un equipo inyecta un cambio NUEVO (color distinto) desde el
   INICIO de ese proceso (no desde su cabezal/centro visual), y
   pueden coexistir varios cambios simultáneos. Sin botón de play.
   El operador controla velocidad de prensa y un movedor manual
   (sobre el cambio seleccionado = el último inyectado). Un único
   reloj real (hora de Quito, Ecuador) sirve de referencia; al
   completarse cada cambio se genera un reporte con la hora real
   en que pasó por cada equipo, visible en el panel "Reportes".
   ============================================================ */

import { SPEED_PRESETS } from '../../trazabilidad/js/core/process-graph.js';
import { buildAnnotations, PROCESS_TOTAL_M } from './line-bridge.js';
import { initParams, loadPart1Params } from './combined-params.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const QUITO_TZ = 'America/Guayaquil';

// ── Configuración de la vista horizontal (Parte 2 · HMI en vivo) ──
const DEFAULT_SPEED = SPEED_PRESETS.find((p) => p.id === 'observed-jun24')?.mPerMin ?? 14.5;
const SPEED_MIN = 8;
const SPEED_MAX = 22;

// Fin real medido: 71.6 m hasta fin de prensa + 13.55 m post-prensa.
const PROCESS_END_M = PROCESS_TOTAL_M;

// Waypoints con nombre (m absolutos) para registrar en qué equipo y a qué hora
// real pasó cada cambio. Los equipos "esparcidores" con material que cae (SL1/
// CL/SL2) inyectan a los 3/4 de su zona (el material no cae al inicio del
// cabezal sino más hacia el final de su recorrido). Pre-prensa/Vapor usan el
// INICIO real de su zona. El resto son eventos puntuales (ya son su "inicio").
const NAMED_WAYPOINTS = [
  { m: 0.7, label: 'Desmoldante #1' },
  { m: 6.63, label: 'SL1 · capa inferior' },
  { m: 15.0, label: 'CL · core' },
  { m: 22.25, label: 'SL2 · capa superior' },
  { m: 26.68, label: 'Imán / tambor azul' },
  { m: 29.06, label: 'Pre-prensa' },
  { m: 35.99, label: 'Desmoldante #2' },
  { m: 37.69, label: 'Detector de metales' },
  { m: 39.56, label: 'Cortadores de filo' },
  { m: 44.9, label: 'Nariz · rechazo' },
  { m: 46.86, label: 'Vapor EVOsteam' },
  { m: 55.0, label: 'Prensa continua' },
  { m: 71.6, label: 'Fin prensa' },
  { m: 78.3, label: 'Cuchillos de refila · inicio' },
  { m: 79.65, label: 'Cuchillos de refila · fin' },
  { m: 80.35, label: 'Sierra transversal · inicio' },
  { m: 82.65, label: 'Sierra transversal · fin' },
  { m: PROCESS_END_M, label: 'Sensores de calidad · fin de proceso' },
].sort((a, b) => a.m - b.m);

function nextWaypoint(posM) {
  return NAMED_WAYPOINTS.find((wp) => wp.m > posM + 1e-6) ?? null;
}

// Paleta de colores para cambios simultáneos (se cicla si hay más de 8 activos).
const CHANGE_COLORS = ['#FFDE00', '#FF7A33', '#29B6F6', '#AB47BC', '#EC407A', '#26A69A', '#8BC34A', '#EF5350'];

const PRE_WAYPOINTS = {
  patios: { x: -2068, y: 328, label: 'Patios · rumas' },
  silosVerdes: { x: -1460, y: 300, label: 'Silos verdes 1/2/3' },
  bunker: { x: -1305, y: 338, label: 'Dosing Bunker IMAL' },
  secadero: { x: -1200, y: 320, label: 'Secaderos 1/2' },
  clasificacion: { x: -1020, y: 338, label: 'Cribas F/G + 3 zarandas' },
  silo5: { x: -665, y: 212, label: 'Silo 5 · CL/core' },
  silo6: { x: -705, y: 408, label: 'Silo 6 · SL/capas' },
  activeSilo5: { x: 860, y: 155, label: 'Silo 5 · gruesa animado' },
  activeDosingCL: { x: 860, y: 305, label: 'Dosing gruesa' },
  activeEncCI: { x: 860, y: 460, label: 'Encolador CI' },
  activeSilo6: { x: 330, y: 185, label: 'Silo 6 · fina animado' },
  activeDosingSL: { x: 330, y: 330, label: 'Dosing fina' },
  activeEncCE: { x: 330, y: 500, label: 'Encolador CE' },
  polvo: { x: -910, y: 578, label: 'Polvo → Silo 4/8 · quemador' },
  clGate: { x: 2970, y: 248, label: 'Entrada CL a Esparcidor 2' },
  sl1Gate: { x: 2444, y: 360, label: 'Entrada SL a Esparcidor 1' },
  sl2Gate: { x: 3538, y: 360, label: 'Entrada SL a Esparcidor 3' },
};

const PRE_STAGE_INDEX = {
  patios: 0,
  'silos-verdes': 1,
  bunker: 2,
  secadero: 3,
  clasificacion: 4,
  silo5: 5,
  silo6: 5,
};

const num = (params, key, fallback = 0) => Number(params?.[key] ?? fallback) || 0;
const fixed = (params, key) => Math.max(0, num(params, key));
const tauPila = (params, mKey, fKey) => {
  const M = num(params, mKey);
  const Fh = num(params, fKey);
  return M > 0 && Fh > 0 ? M / (Fh / 3600) : 0;
};
const tauSiloH = (params, prefix) => {
  const rho = num(params, `p1:${prefix}_rho`);
  const V = num(params, `p1:${prefix}_V`);
  const L = num(params, `p1:${prefix}_L`);
  const F = num(params, `p1:${prefix}_F`);
  return rho > 0 && V > 0 && L > 0 && F > 0 ? (rho * V * L / 100) / (F / 3600) : 0;
};
const tauSiloM = (params, prefix) => {
  const rho = num(params, `p1:${prefix}_rho`);
  const V = num(params, `p1:${prefix}_V`);
  const L = num(params, `p1:${prefix}_L`);
  const F = num(params, `p1:${prefix}_Fmin`);
  return rho > 0 && V > 0 && L > 0 && F > 0 ? (rho * V * L / 100) / F * 60 : 0;
};
const tauMF = (params, mKey, fKey) => {
  const M = num(params, mKey);
  const F = num(params, fKey);
  return M > 0 && F > 0 ? M / F * 60 : 0;
};
const tBelt = (params, lKey, vKey) => {
  const L = num(params, lKey);
  const v = num(params, vKey);
  return L > 0 && v > 0 ? L / v * 60 : 0;
};

function buildPreDurations(params) {
  const reduction = Math.max(
    tauPila(params, 'p1:pila1_M', 'p1:pila1_F') + tauSiloH(params, 's1'),
    tauPila(params, 'p1:pila2_M', 'p1:pila2_F') + tauSiloH(params, 's2'),
    fixed(params, 'p1:tr3') + tauSiloH(params, 's3'),
  );
  const bunker = tauSiloH(params, 'bk') + fixed(params, 'p1:trSec');
  const secado = fixed(params, 'p1:tauTambor');
  const clasifBase = fixed(params, 'p1:tCriba') + fixed(params, 'p1:tZar');
  return {
    reduction,
    bunker,
    secado,
    clasifBase,
    toS5: fixed(params, 'p1:tColectCL'),
    toS6: fixed(params, 'p1:tColectSL') + fixed(params, 'p1:tWS1') + fixed(params, 'p1:tWS2'),
    overToSL: fixed(params, 'p1:tWS3') + Math.max(fixed(params, 'p1:tRef1'), fixed(params, 'p1:tRef2')) + fixed(params, 'p1:tCiclon') + fixed(params, 'p1:tClasSL') + fixed(params, 'p1:tReingresoSL'),
    clSilo: tauSiloM(params, 's5'),
    clDosing: tauMF(params, 'p1:dosG_M', 'p1:dosG_F'),
    clEnc: fixed(params, 'p1:tEncCI'),
    clIncl: tBelt(params, 'p1:inclG_L', 'p1:inclG_v'),
    slSilo: tauSiloM(params, 's6'),
    slDosing: tauMF(params, 'p1:dosF_M', 'p1:dosF_F'),
    slEnc: fixed(params, 'p1:tEncCE'),
    slIncl: tBelt(params, 'p1:inclF_L', 'p1:inclF_v'),
  };
}

function preMilestonesFor(stage, branch, params) {
  const d = buildPreDurations(params);
  const common = [
    { ...PRE_WAYPOINTS.patios, dt: 0 },
    { ...PRE_WAYPOINTS.silosVerdes, dt: d.reduction },
    { ...PRE_WAYPOINTS.bunker, dt: d.bunker },
    { ...PRE_WAYPOINTS.secadero, dt: d.secado },
    { ...PRE_WAYPOINTS.clasificacion, dt: d.clasifBase },
  ];
  const tail = branch === 'cl'
    ? [
      { ...PRE_WAYPOINTS.silo5, dt: d.toS5 },
      { ...PRE_WAYPOINTS.activeSilo5, dt: 1 },
      { ...PRE_WAYPOINTS.activeDosingCL, dt: d.clSilo },
      { ...PRE_WAYPOINTS.activeEncCI, dt: d.clDosing + d.clEnc },
      { ...PRE_WAYPOINTS.clGate, dt: d.clIncl, launchM: 15.0, launchLabel: 'CL/core entra a Esparcidor 2' },
    ]
    : [
      { ...PRE_WAYPOINTS.silo6, dt: d.toS6 + d.overToSL },
      { ...PRE_WAYPOINTS.activeSilo6, dt: 1 },
      { ...PRE_WAYPOINTS.activeDosingSL, dt: d.slSilo },
      { ...PRE_WAYPOINTS.activeEncCE, dt: d.slDosing + d.slEnc },
      { ...(branch === 'sl2' ? PRE_WAYPOINTS.sl2Gate : PRE_WAYPOINTS.sl1Gate), dt: d.slIncl, launchM: branch === 'sl2' ? 22.25 : 6.63, launchLabel: branch === 'sl2' ? 'SL entra a Esparcidor 3' : 'SL entra a Esparcidor 1' },
    ];
  const all = [...common, ...tail];
  const startIdx = Math.min(PRE_STAGE_INDEX[stage] ?? 0, all.length - 2);
  let t = 0;
  return all.slice(startIdx).map((m, i) => {
    t += i === 0 ? 0 : Math.max(1, m.dt);
    return { ...m, t };
  });
}

function posOnPreRoute(miles, elapsed) {
  if (elapsed <= 0) return miles[0];
  const last = miles[miles.length - 1];
  if (elapsed >= last.t) return last;
  for (let i = 1; i < miles.length; i++) {
    const a = miles[i - 1];
    const b = miles[i];
    if (elapsed <= b.t) {
      const f = (elapsed - a.t) / Math.max(1, b.t - a.t);
      return {
        x: a.x + (b.x - a.x) * f,
        y: a.y + (b.y - a.y) * f,
      };
    }
  }
  return last;
}

// ── Constantes de geometría (escala lineal real · Parte 1) ──
// x = X0 + PX_PER_M × metros. Waypoints clave (px):
//   0 m → 80 · 45 m → 3230 · 55 m → 3930 · 71.6 m → 5092 · 85.15 m → 6040.5.
const BELT_Y = 400;
const X0 = 80;            // metro 0
const PX_PER_M = 70;      // px por metro
const xm = (m) => X0 + PX_PER_M * m;
const PRESS_START_X = xm(55);   // 3930
const PRESS_END_X = xm(71.6);   // 5092
const END = xm(91);             // 6450 · margen visual después de sensores

// Punto donde cada capa "aparece" y sube en el colchón: el mismo punto real
// donde cae el material (3/4 de la zona del esparcidor) — no el cabezal
// dibujado — para que la subida del relieve coincida con el punto de inyección
// del cambio (NAMED_WAYPOINTS / data-inject-m de SL1 · CL · SL2).
const SL1_X = xm(6.63);   // 544
const CL_X = xm(15.0);    // 1130
const SL2_X = xm(22.25);  // 1638

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);

// multiplicador de compresión global a lo largo de x (anclado a metros)
function comp(x) {
  const preIn = xm(31.4);        // 2278 · entra pre-prensa
  const preOut = xm(33.86);      // 2450 · sale pre-prensa comprimido
  if (x < preIn) return 1;
  if (x < preOut) return lerp(1, 0.62, (x - preIn) / (preOut - preIn));
  if (x < PRESS_START_X) return 0.62;
  if (x < PRESS_END_X) return lerp(0.62, 0.38, (x - PRESS_START_X) / (PRESS_END_X - PRESS_START_X));
  return 0.38;
}

// alturas base por capa (con rampas de entrada en cada cabezal), luego comprimidas
const bh = (x) => (x < SL1_X ? 0 : x < SL1_X + 40 ? ((x - SL1_X) / 40) * 9 : 9) * comp(x);
const ch = (x) => (x < CL_X ? 0 : x < CL_X + 40 ? ((x - CL_X) / 40) * 15 : 15) * comp(x);
const th = (x) => (x < SL2_X ? 0 : x < SL2_X + 40 ? ((x - SL2_X) / 40) * 9 : 9) * comp(x);

const bottomTop = (x) => BELT_Y - bh(x);
const coreTop = (x) => BELT_Y - bh(x) - ch(x);
const topTop = (x) => BELT_Y - bh(x) - ch(x) - th(x);

function genLayer(appearX, bottomFn, topFn) {
  const top = [];
  const bot = [];
  for (let x = appearX; x <= END; x += 6) {
    top.push(`${x.toFixed(1)},${topFn(x).toFixed(1)}`);
    bot.push(`${x.toFixed(1)},${bottomFn(x).toFixed(1)}`);
  }
  top.push(`${END},${topFn(END).toFixed(1)}`);
  bot.push(`${END},${bottomFn(END).toFixed(1)}`);
  return 'M ' + top.join(' L ') + ' L ' + bot.reverse().join(' L ') + ' Z';
}

function el(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
}

function renderColchon() {
  document.getElementById('layerBottom').setAttribute('d', genLayer(SL1_X, () => BELT_Y, bottomTop));
  document.getElementById('layerCore').setAttribute('d', genLayer(CL_X, bottomTop, coreTop));
  document.getElementById('layerTop').setAttribute('d', genLayer(SL2_X, coreTop, topTop));
}

function renderRollers() {
  const g = document.getElementById('rollers');
  for (let x = xm(0.15); x <= END; x += PX_PER_M) {
    g.appendChild(el('ellipse', { cx: +x.toFixed(1), cy: 430, rx: 9, ry: 7 }));
  }
}

// Posiciones reales de los 19 marcos (m desde inicio de prensa · MEDICIONES.md).
const FRAME_POS_M = [
  0.10, 0.85, 1.60, 2.35, 3.10, 3.85, 4.60,   // pitch 0.75 (marcos 1–7)
  5.50, 6.40, 7.30, 8.20, 9.10, 10.00, 10.90, // pitch 0.90 (marcos 7–19)
  11.80, 12.70, 13.60, 14.50, 15.40,
];

function renderFrames() {
  const g = document.getElementById('pressFrames');
  for (const pos of FRAME_POS_M) {
    const x = +xm(55 + pos).toFixed(1);
    g.appendChild(el('line', { x1: x, y1: 188, x2: x, y2: 416 }));
  }
}

function renderRuler() {
  const gTicks = document.getElementById('rulerTicks');
  const gLabels = document.getElementById('rulerLabels');
  const addTick = (m, major, label) => {
    const x = +xm(m).toFixed(1);
    gTicks.appendChild(el('line', { x1: x, y1: 470, x2: x, y2: major ? 458 : 464 }));
    if (label != null) {
      const t = el('text', { x, y: 490 });
      t.textContent = label;
      gLabels.appendChild(t);
    }
  };
  for (let m = 0; m <= 84; m++) addTick(m, m % 5 === 0, m % 5 === 0 ? String(m) : null);
  addTick(71.6, true, '71.6');   // fin prensa
  addTick(85.15, true, '85.15'); // sensores / fin de proceso
}

// anotaciones discretas de distancias medidas (una sola vez)
function renderAnnotations() {
  const { segments, waypoints } = buildAnnotations();
  const gSeg = document.getElementById('distSegments');
  const gWp = document.getElementById('distWaypoints');

  for (const s of segments) {
    const t = el('text', {
      x: s.x.toFixed(1), y: 527, 'text-anchor': 'middle',
      'font-family': "'Barlow',sans-serif", 'font-size': 8.5,
      'font-weight': s.type === 'zone' ? 700 : 600,
      fill: s.type === 'zone' ? '#0A7D5A' : (s.type === 'pitch' ? '#2A2A2A' : '#9AA39E'),
    });
    t.textContent = s.type === 'pitch' ? s.label : `${s.len.toFixed(2)} m`;
    gSeg.appendChild(t);
  }

  for (const w of waypoints) {
    const tick = el('line', {
      x1: w.x.toFixed(1), y1: 470, x2: w.x.toFixed(1), y2: 540,
      stroke: '#C7CCC7', 'stroke-width': 1, 'stroke-dasharray': '2 3',
    });
    gWp.appendChild(tick);
    const name = el('text', {
      x: w.x.toFixed(1), y: 549, 'text-anchor': 'middle',
      'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800,
      'font-size': 9, fill: '#1A1D1B',
    });
    name.textContent = w.label;
    gWp.appendChild(name);
    const pos = el('text', {
      x: w.x.toFixed(1), y: 558, 'text-anchor': 'middle',
      'font-family': "'Barlow',sans-serif", 'font-size': 8, fill: '#676E69',
    });
    pos.textContent = w.pct == null ? `${w.atM.toFixed(2)} m` : `${w.atM.toFixed(1)} m · ${w.pct}%`;
    gWp.appendChild(pos);
  }
}

// hora real de Quito (Ecuador, UTC-5 todo el año) para reportes y reloj de header.
function fmtWallTime(date) {
  return date.toLocaleTimeString('es-EC', {
    timeZone: QUITO_TZ, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function fmtCountdown(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '—';
  if (sec < 1) return '< 1 s';
  const s = Math.ceil(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function initLiveClock() {
  const el2 = document.getElementById('liveClock');
  if (!el2) return;
  const tick = () => { el2.textContent = fmtWallTime(new Date()); };
  tick();
  setInterval(tick, 500);
}

// ── HMI en vivo: motor multi-cambio (varios trazadores de colores a la vez) ──
function initSimulation() {
  let vPrensa = clamp(DEFAULT_SPEED, SPEED_MIN, SPEED_MAX); // m/min, compartida por todos los cambios
  let timeScale = Number(document.getElementById('timeScaleSelect')?.value ?? 36000) || 1;
  let modelParams = loadPart1Params();
  let scrubbing = false;
  let changeSeq = 0;
  let selectedId = null;   // cambio que controla el movedor manual (el último inyectado)
  const changes = [];      // cambios activos: { id, seq, color, posM, el, arrivals[], passed:Set }
  const preChanges = [];    // cambios upstream Parte 1: se convierten a cambios downstream al llegar a P2
  const reports = [];      // cambios completados (más reciente primero), máx. 8

  const speedRange = document.getElementById('speedRange');
  const speedInput = document.getElementById('speedInput');
  const timeScaleSelect = document.getElementById('timeScaleSelect');
  const moverRange = document.getElementById('moverRange');
  const canvas = document.getElementById('canvasScroll');
  const tracersLayer = document.getElementById('tracers');
  const preTracersLayer = document.getElementById('preTracers');
  const reportsToggle = document.getElementById('reportsToggle');
  const reportsPanel = document.getElementById('reportsPanel');
  const reportsClose = document.getElementById('reportsClose');
  const reportsList = document.getElementById('reportsList');
  const reportsCount = document.getElementById('reportsCount');
  const resetChangesBtn = document.getElementById('resetChangesBtn');

  function syncSpeedUI() {
    if (speedRange && document.activeElement !== speedRange) speedRange.value = vPrensa;
    if (speedInput && document.activeElement !== speedInput) speedInput.value = vPrensa;
  }
  function setSpeed(v) {
    const nv = parseFloat(v);
    vPrensa = clamp(Number.isNaN(nv) ? DEFAULT_SPEED : nv, SPEED_MIN, SPEED_MAX);
    syncSpeedUI();
  }

  function labelForM(m) {
    const hit = NAMED_WAYPOINTS.find((wp) => Math.abs(wp.m - m) < 0.05);
    return hit ? hit.label : `Inyectado @ ${m.toFixed(1)} m`;
  }

  // Trazador SVG propio por cambio, coloreado, con su número de secuencia.
  function createTracerEl(ch) {
    const g = el('g', { class: 's2-tracer', 'data-change-id': ch.id });
    g.innerHTML = `
      <line x1="0" y1="-12" x2="0" y2="-34" stroke="${ch.color}" stroke-width="2"></line>
      <rect x="-15" y="-52" width="30" height="18" rx="4" fill="${ch.color}" stroke="#1A1D1B" stroke-width="1"></rect>
      <text x="0" y="-39" text-anchor="middle" font-family="'Barlow Semi Condensed',sans-serif" font-weight="800" font-size="10" fill="#1A1D1B">${ch.seq}</text>
      <circle cx="0" cy="-6" r="12" fill="none" stroke="${ch.color}" stroke-width="3" style="animation:mpulse 1.4s ease infinite"></circle>
      <circle cx="0" cy="-6" r="5" fill="${ch.color}"></circle>
    `;
    tracersLayer?.appendChild(g);
    return g;
  }

  function createPreTracerEl(ch) {
    const g = el('g', { class: 'p1-tracer', 'data-pre-change-id': ch.id });
    g.innerHTML = `
      <line x1="0" y1="-12" x2="0" y2="-32" stroke="${ch.color}" stroke-width="2"></line>
      <rect x="-17" y="-50" width="34" height="18" rx="4" fill="${ch.color}" stroke="#1A1D1B" stroke-width="1"></rect>
      <text x="0" y="-37" text-anchor="middle" font-family="'Barlow Semi Condensed',sans-serif" font-weight="800" font-size="10" fill="#1A1D1B">${ch.seq}</text>
      <circle cx="0" cy="-4" r="11" fill="none" stroke="${ch.color}" stroke-width="3" style="animation:mpulse 1.4s ease infinite"></circle>
      <circle cx="0" cy="-4" r="5" fill="${ch.color}"></circle>
    `;
    preTracersLayer?.appendChild(g);
    return g;
  }

  function updateTracerEl(ch) {
    const mx = xm(ch.posM);
    const my = topTop(mx) - 6;
    ch.el?.setAttribute('transform', `translate(${mx.toFixed(1)} ${my.toFixed(1)})`);
  }

  function updatePreTracerEl(ch) {
    const p = posOnPreRoute(ch.miles, ch.elapsed);
    ch.el?.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  }

  // El reporte de cada cambio existe desde que NACE (se ve "en curso" con solo
  // su primera fila) y se va llenando en vivo con cada equipo que va cruzando;
  // al completarse pasa a "completado" y queda fijo en la lista.
  function renderCard(item, isActive) {
    const card = document.createElement('div');
    card.className = isActive ? 'report-card report-card--active' : 'report-card';
    card.style.borderLeftColor = item.color;
    const nextWp = isActive ? nextWaypoint(item.posM) : null;
    const countdownRow = isActive ? `
        <li class="report-card__countdown">
          <span data-countdown-label-for="${item.id}">Próximo: ${nextWp?.label ?? '—'}</span>
          <strong data-countdown-for="${item.id}">--:--</strong>
        </li>` : '';
    card.innerHTML = `
      <div class="report-card__hd">
        <i style="background:${item.color}"></i>
        <strong>Cambio ${item.seq}</strong>
        <span class="report-card__status">${isActive ? 'EN CURSO' : 'COMPLETADO'}</span>
      </div>
      <ul class="report-card__list">
        ${countdownRow}
        ${item.arrivals.map((a) => `<li><span>${a.label}</span><strong>${fmtWallTime(a.wallTime)}</strong></li>`).join('')}
      </ul>
    `;
    return card;
  }

  function updateReportCountdowns() {
    if (!reportsList) return;
    for (const ch of changes) {
      const strong = reportsList.querySelector(`[data-countdown-for="${ch.id}"]`);
      const labelEl = reportsList.querySelector(`[data-countdown-label-for="${ch.id}"]`);
      if (!strong) continue;
      const wp = nextWaypoint(ch.posM);
      if (!wp) {
        if (labelEl) labelEl.textContent = 'Próximo';
        strong.textContent = '—';
        continue;
      }
      if (labelEl) labelEl.textContent = `Próximo: ${wp.label}`;
      const distM = Math.max(0, wp.m - ch.posM);
      strong.textContent = fmtCountdown((distM / vPrensa) * 60 / Math.min(timeScale, 300));
    }
    for (const ch of preChanges) {
      const strong = reportsList.querySelector(`[data-countdown-for="${ch.id}"]`);
      const labelEl = reportsList.querySelector(`[data-countdown-label-for="${ch.id}"]`);
      if (!strong) continue;
      const next = ch.miles.find((m) => m.t > ch.elapsed + 1e-6);
      if (labelEl) labelEl.textContent = `Próximo: ${next?.label ?? 'entrada a Parte 2'}`;
      strong.textContent = fmtCountdown(Math.max(0, (next?.t ?? ch.total) - ch.elapsed) / timeScale);
    }
  }

  function renderReportsList() {
    if (!reportsList) return;
    reportsList.innerHTML = '';
    const upstreamList = preChanges.slice().reverse();
    const activeList = changes.slice().reverse(); // más reciente primero
    if (upstreamList.length === 0 && activeList.length === 0 && reports.length === 0) {
      const p = document.createElement('p');
      p.className = 'report-empty';
      p.textContent = 'Aún no hay cambios. Haz clic en un equipo para inyectar uno.';
      reportsList.appendChild(p);
    } else {
      for (const ch of upstreamList) reportsList.appendChild(renderCard(ch, true));
      for (const ch of activeList) reportsList.appendChild(renderCard(ch, true));
      for (const rep of reports) reportsList.appendChild(renderCard(rep, false));
    }
    if (reportsCount) reportsCount.textContent = String(upstreamList.length + activeList.length + reports.length);
  }

  function syncMoverEnabled() {
    if (!moverRange) return;
    const sel = changes.find((c) => c.id === selectedId);
    moverRange.disabled = !sel;
    if (sel && document.activeElement !== moverRange) moverRange.value = sel.posM.toFixed(1);
  }

  function recordCrossings(ch, prevM) {
    let added = false;
    for (const wp of NAMED_WAYPOINTS) {
      if (wp.m > prevM + 1e-6 && wp.m <= ch.posM + 1e-6 && !ch.passed.has(wp.label)) {
        ch.passed.add(wp.label);
        ch.arrivals.push({ label: wp.label, m: wp.m, wallTime: new Date() });
        added = true;
      }
    }
    return added;
  }

  function finishChange(ch) {
    if (!ch.passed.has('Sensores de calidad · fin de proceso')) {
      ch.arrivals.push({ label: 'Sensores de calidad · fin de proceso', m: PROCESS_END_M, wallTime: new Date() });
    }
    ch.el?.remove();
    const idx = changes.indexOf(ch);
    if (idx >= 0) changes.splice(idx, 1);
    reports.unshift({ id: ch.id, seq: ch.seq, color: ch.color, arrivals: ch.arrivals });
    if (reports.length > 8) reports.length = 8;
    if (selectedId === ch.id) selectedId = changes.length ? changes[changes.length - 1].id : null;
    renderReportsList();
    syncMoverEnabled();
  }

  // El cambio se inyecta en el equipo donde se hace clic, al INICIO real de ese
  // proceso — no en su cabezal/centro visual — y arranca un trazador nuevo.
  function inject(m, label) {
    const startM = clamp(m, 0, PROCESS_END_M);
    const startLabel = label ?? labelForM(startM);
    changeSeq += 1;
    const ch = {
      id: `chg-${changeSeq}`,
      seq: changeSeq,
      color: CHANGE_COLORS[(changeSeq - 1) % CHANGE_COLORS.length],
      posM: startM,
      arrivals: [{ label: startLabel, m: startM, wallTime: new Date() }],
      passed: new Set([startLabel]),
    };
    ch.el = createTracerEl(ch);
    updateTracerEl(ch);
    changes.push(ch);
    selectedId = ch.id;
    syncMoverEnabled();
    renderReportsList(); // el reporte nace con el cambio, no solo al completarse
  }

  function injectDownstreamFromPre(parent, m, label) {
    const inherited = parent.arrivals.map((a) => ({
      ...a,
      m: typeof a.m === 'number' ? a.m : 0,
      wallTime: a.wallTime instanceof Date ? a.wallTime : new Date(a.wallTime || Date.now()),
    }));
    const alreadyHasLaunch = inherited.some((a) => a.label === label);
    const ch = {
      id: `${parent.id}-p2-${Math.round(m * 100)}`,
      seq: parent.seq,
      color: parent.color,
      posM: clamp(m, 0, PROCESS_END_M),
      arrivals: alreadyHasLaunch ? inherited : [...inherited, { label, m, wallTime: new Date() }],
      passed: new Set([label, ...inherited.map((a) => a.label)]),
    };
    ch.el = createTracerEl(ch);
    updateTracerEl(ch);
    changes.push(ch);
    selectedId = ch.id;
    syncMoverEnabled();
    renderReportsList();
  }

  function injectPre(stage, label) {
    changeSeq += 1;
    const seq = changeSeq;
    const color = CHANGE_COLORS[(seq - 1) % CHANGE_COLORS.length];
    const branchSpecs = stage === 'silo5'
      ? [['cl', 'CL/core → Sección 2']]
      : stage === 'silo6'
        ? [['sl1', 'SL → Esparcidor 1'], ['sl2', 'SL → Esparcidor 3']]
        : [['cl', 'CL/core → Sección 2'], ['sl1', 'SL → Esparcidor 1'], ['sl2', 'SL → Esparcidor 3']];

    for (const [branch, branchLabel] of branchSpecs) {
      const miles = preMilestonesFor(stage, branch, modelParams);
      const ch = {
        id: `pre-${seq}-${branch}`,
        seq,
        color,
        branch,
        branchLabel,
        elapsed: 0,
        total: miles[miles.length - 1].t,
        miles,
        launched: false,
        arrivals: [{ label: `${label} · ${branchLabel}`, m: 0, wallTime: new Date() }],
        passed: new Set([miles[0]?.label]),
      };
      ch.el = createPreTracerEl(ch);
      updatePreTracerEl(ch);
      preChanges.push(ch);
    }
    selectedId = null;
    syncMoverEnabled();
    renderReportsList();
  }

  // Bucle continuo — la línea nunca deja de moverse; cada cambio activo avanza a v_prensa.
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    const advanceM = (vPrensa / 60) * dt * Math.min(timeScale, 300);
    let crossed = false;
    for (const ch of preChanges.slice()) {
      const prevElapsed = ch.elapsed;
      ch.elapsed = Math.min(ch.total, ch.elapsed + dt * timeScale);
      for (const m of ch.miles) {
        if (m.t > prevElapsed + 1e-6 && m.t <= ch.elapsed + 1e-6 && !ch.passed.has(m.label)) {
          ch.passed.add(m.label);
          ch.arrivals.push({ label: m.label, m: m.t, wallTime: new Date() });
          crossed = true;
        }
      }
      updatePreTracerEl(ch);
      const lastM = ch.miles[ch.miles.length - 1];
      if (!ch.launched && ch.elapsed >= ch.total) {
        ch.launched = true;
        ch.el?.remove();
        const idx = preChanges.indexOf(ch);
        if (idx >= 0) preChanges.splice(idx, 1);
        injectDownstreamFromPre(ch, lastM.launchM ?? 0, lastM.launchLabel ?? 'Entrada a Parte 2');
        crossed = true;
      }
    }
    for (const ch of changes.slice()) {
      if (scrubbing && ch.id === selectedId) continue; // el movedor controla este directamente
      const prevM = ch.posM;
      ch.posM = Math.min(ch.posM + advanceM, PROCESS_END_M);
      if (recordCrossings(ch, prevM)) crossed = true;
      if (ch.posM >= PROCESS_END_M) finishChange(ch); // ya re-renderiza el panel
      else updateTracerEl(ch);
    }
    if (crossed) renderReportsList(); // llena en vivo el reporte de cada cambio activo
    if (changes.length || preChanges.length) updateReportCountdowns();
    if (selectedId && moverRange && document.activeElement !== moverRange) {
      const sel = changes.find((c) => c.id === selectedId);
      if (sel) moverRange.value = sel.posM.toFixed(1);
    }
    requestAnimationFrame(frame);
  }

  // Velocidad de prensa (único parámetro operador visible en la barra).
  speedRange?.addEventListener('input', () => setSpeed(speedRange.value));
  speedInput?.addEventListener('input', () => setSpeed(speedInput.value));
  speedInput?.addEventListener('change', syncSpeedUI);
  timeScaleSelect?.addEventListener('change', () => {
    timeScale = Math.max(1, Number(timeScaleSelect.value) || 1);
    updateReportCountdowns();
  });
  syncSpeedUI();

  // Movedor manual: adelanta/retrocede el cambio SELECCIONADO (el último inyectado).
  const endScrub = () => { scrubbing = false; last = performance.now(); };
  moverRange?.addEventListener('pointerdown', () => { scrubbing = true; });
  moverRange?.addEventListener('input', () => {
    scrubbing = true;
    const sel = changes.find((c) => c.id === selectedId);
    if (!sel) return;
    const prevM = sel.posM;
    sel.posM = clamp(parseFloat(moverRange.value) || 0, 0, PROCESS_END_M);
    const crossed = recordCrossings(sel, prevM);
    if (sel.posM >= PROCESS_END_M) finishChange(sel);
    else {
      updateTracerEl(sel);
      if (crossed) renderReportsList();
      else updateReportCountdowns();
    }
  });
  moverRange?.addEventListener('pointerup', endScrub);
  moverRange?.addEventListener('pointercancel', endScrub);
  moverRange?.addEventListener('change', endScrub);

  // Clic en un equipo → crea un cambio NUEVO (color propio) desde el inicio de ese proceso.
  document.querySelectorAll('[data-pre-stage]').forEach((node) => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      node.classList.remove('is-injected');
      void node.getBoundingClientRect();
      node.classList.add('is-injected');
      injectPre(node.dataset.preStage, node.dataset.label);
    });
  });
  document.querySelectorAll('[data-pre-trigger]').forEach((button) => {
    button.addEventListener('click', () => {
      const stage = button.dataset.preTrigger;
      if (!stage) return;
      button.classList.remove('is-fired');
      void button.getBoundingClientRect();
      button.classList.add('is-fired');
      injectPre(stage, button.dataset.label || button.textContent.trim());
    });
  });
  canvas?.addEventListener('click', (e) => {
    const p1 = e.target.closest('[data-pre-stage]');
    if (p1) {
      p1.classList.remove('is-injected');
      void p1.getBoundingClientRect();
      p1.classList.add('is-injected');
      injectPre(p1.dataset.preStage, p1.dataset.label);
      return;
    }
    const g = e.target.closest('[data-inject-m]');
    if (!g) return;
    g.classList.remove('is-injected');
    void g.getBoundingClientRect(); // fuerza reflow para reiniciar la animación del flash
    g.classList.add('is-injected');
    inject(parseFloat(g.dataset.injectM), g.dataset.label);
  });

  // Panel de reportes: hora real de Quito por cada equipo y cada cambio completado.
  reportsToggle?.addEventListener('click', () => reportsPanel?.classList.toggle('is-hidden'));
  reportsClose?.addEventListener('click', () => reportsPanel?.classList.add('is-hidden'));

  // Reiniciar demo: borra todos los cambios activos y los reportes acumulados.
  function resetAll() {
    for (const ch of changes.slice()) ch.el?.remove();
    for (const ch of preChanges.slice()) ch.el?.remove();
    changes.length = 0;
    preChanges.length = 0;
    reports.length = 0;
    changeSeq = 0;
    selectedId = null;
    syncMoverEnabled();
    renderReportsList();
  }
  resetChangesBtn?.addEventListener('click', resetAll);

  syncMoverEnabled();
  renderReportsList();
  updateReportCountdowns();
  requestAnimationFrame(frame);

  // Pestaña Parámetros: comparte localStorage con el clásico y refleja v_prensa.
  initParams({
    speedGetter: () => vPrensa,
    onChange: (params) => { modelParams = params; },
  });
}

// scroll suave a una zona (chips 2A–2E), portado del handoff
function scrollCanvasTo(x) {
  const el = document.getElementById('canvasScroll');
  if (!el) return;
  const start = el.scrollLeft;
  const target = Math.max(0, Math.min(x, el.scrollWidth - el.clientWidth));
  const d = target - start;
  const t0 = performance.now();
  const dur = 450;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.scrollLeft = start + d * (1 - Math.pow(1 - p, 3));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function wireZoneChips() {
  document.querySelectorAll('.s2-zone-btn[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => scrollCanvasTo(parseFloat(btn.dataset.scroll)));
  });
}

function init() {
  renderColchon();
  renderRollers();
  renderFrames();
  renderRuler();
  renderAnnotations();
  wireZoneChips();
  initLiveClock();
  initSimulation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { topTop };
