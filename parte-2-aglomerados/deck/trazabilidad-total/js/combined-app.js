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
import { initParams, loadParams, loadPart1Params } from './combined-params.js';
import { initHmiCsv } from './hmi-csv.js';
import { computeRoute, formatSec, STATUS_LABEL, PARAM_INDEX, MIXER_TAU_SEC } from './route-model.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const QUITO_TZ = 'America/Guayaquil';

// ── Configuración de la vista horizontal (Parte 2 · HMI en vivo) ──
const DEFAULT_SPEED = SPEED_PRESETS.find((p) => p.id === 'observed-jun24')?.mPerMin ?? 14.5;
const SPEED_MIN = 8;
const SPEED_MAX = 22;

// Sensores de calidad 1/2/3: distancia desde el registro (m=0, arranque del
// colchón). Se leen del route-model (única fuente de verdad) para que la
// simulación visual y las ecuaciones usen exactamente los mismos metros.
const SENSOR_DEFS = [
  { key: 'sensor1', m: PARAM_INDEX['sensor1.distance'].value, label: `Sensor de calidad 1 (${PARAM_INDEX['sensor1.distance'].value} m)` },
  { key: 'sensor2', m: PARAM_INDEX['sensor2.distance'].value, label: `Sensor de calidad 2 (${PARAM_INDEX['sensor2.distance'].value} m)` },
  { key: 'sensor3', m: PARAM_INDEX['sensor3.distance'].value, label: `Sensor de calidad 3 (${PARAM_INDEX['sensor3.distance'].value} m) · fin de proceso` },
];
// Fin del recorrido simulado: el ÚLTIMO sensor (85.55 m), no el primero —
// así ningún cambio "desaparece" antes de cruzar los sensores 2 y 3.
const PROCESS_END_M = Math.max(PROCESS_TOTAL_M, ...SENSOR_DEFS.map((s) => s.m));

// Waypoints con nombre (m absolutos) para registrar en qué equipo y a qué hora
// real pasó cada cambio. Los equipos "esparcidores" con material que cae (SL1/
// CL/SL2) inyectan a los 3/4 de su zona (el material no cae al inicio del
// cabezal sino más hacia el final de su recorrido). Pre-prensa/Vapor usan el
// INICIO real de su zona. El resto son eventos puntuales (ya son su "inicio").
// Posiciones post-prensa y pre-prensa CORREGIDAS con la prueba de papel
// (cambio CL, 14-jul-2026, v≈15.6 m/min). Ancladas al tramo de prensa (55→71.6 m,
// que salió exacto: 16.6 m ↔ 63 s). Marcadas como derivadas · POR CONFIRMAR con
// flexómetro. La pre-prensa se movió a su lugar físico (después del cortador de
// filos, justo antes de la prensa), no a 29 m como estaba.
const NAMED_WAYPOINTS = [
  { m: 0.7, label: 'Desmoldante #1' },
  { m: 6.63, label: 'SL1 · capa inferior' },
  { m: 15.0, label: 'CL · core' },
  { m: 22.25, label: 'SL2 · capa superior' },
  { m: 26.68, label: 'Imán / tambor azul' },
  { m: 35.99, label: 'Desmoldante #2' },
  { m: 37.69, label: 'Detector de metales' },
  { m: 39.56, label: 'Cortadores de filo' },
  { m: 44.9, label: 'Nariz · rechazo' },
  { m: 46.86, label: 'Vapor EVOsteam' },
  { m: 47.0, label: 'Pre-prensa' },              // corregido: va antes de la prensa (prueba papel)
  { m: 55.0, label: 'Prensa continua' },
  { m: 71.6, label: 'Fin prensa' },
  { m: 81.7, label: 'Cuchillos de refila · inicio' },   // 78.3 → 81.7 (prueba papel, por confirmar)
  { m: 83.0, label: 'Cuchillos de refila · fin' },       // 79.65 → 83.0
  { m: 84.1, label: 'Sierra transversal · inicio' },     // 80.35 → 84.1
  { m: 86.4, label: 'Sierra transversal · fin' },        // 82.65 → 86.4
  ...SENSOR_DEFS.map((s) => ({ m: s.m, label: s.label })),
].sort((a, b) => a.m - b.m);

const FINISH_LABEL = SENSOR_DEFS[SENSOR_DEFS.length - 1].label;

function nextWaypoint(posM) {
  return NAMED_WAYPOINTS.find((wp) => wp.m > posM + 1e-6) ?? null;
}

// Paleta de colores para cambios simultáneos (se cicla si hay más de 8 activos).
const CHANGE_COLORS = ['#FFDE00', '#FF7A33', '#29B6F6', '#AB47BC', '#EC407A', '#26A69A', '#8BC34A', '#EF5350'];

/* ── Grafo del proceso Parte 1 (coordenadas GLOBALES del SVG = wireframe local
   + translate(-2160,18)). Cada nodo clicable inyecta un cambio que NACE en su
   posición y avanza siguiendo los sucesores hasta la entrada a la Sección 2.
   Así, hacer clic en Silo 2B, Zaranda 3 o cualquier equipo pone el cambio AHÍ
   (no en un punto compartido). ── */
const NODE_POS = {
  patios: [-2068, 328],
  // vía aserrín
  pm1: [-1860, 138], ds: [-1690, 138], silo1: [-1460, 138],
  // vía chip
  ch: [-1898, 328], pm2: [-1752, 328], flex: [-1608, 328], silo2a: [-1488, 283], silo2b: [-1424, 358],
  // vía hombak
  hb: [-1760, 538], silo3: [-1460, 538],
  // tronco mezcla/secado/clasificación
  bunker: [-1305, 338], secadero1: [-1200, 248], secadero2: [-1200, 428],
  cribaF: [-1112, 248], cribaG: [-1112, 428],
  zaranda1: [-1020, 213], zaranda2: [-1020, 338], zaranda3: [-1020, 463],
  colectCL: [-900, 213], colectSL: [-900, 338], colectPG: [-900, 498], colectPolvo: [-900, 618],
  ws1: [-760, 338], ws2: [-620, 338],
  // lazo oversize / refino
  partG: [-760, 498], w3: [-640, 498], r1: [-520, 458], r2: [-520, 538], cy: [-400, 498], clasSL: [-280, 498],
  // silos finales (wireframe)
  silo5: [-440, 212], silo6: [-440, 338],
  // polvo → biomasa
  silo4: [-760, 618], silo8: [-620, 618], quemador: [-340, 618],
  // zona animada (intake)
  activeSilo5: [860, 155], activeDosingCL: [860, 305], activeEncCI: [860, 460],
  activeSilo6: [330, 185], activeDosingSL: [330, 330], activeEncCE: [330, 500],
  // entradas a la Sección 2
  clGate: [2970, 248], sl1Gate: [2444, 360], sl2Gate: [3538, 360],
};
const NODE_LABEL = {
  patios: 'Patios · rumas', pm1: 'Piso móvil 1', ds: 'Clasificador', silo1: 'Silo 1 · Aserrín',
  ch: 'Molino Chips', pm2: 'Piso Móvil 2', flex: 'Molinos Flakes 1·2', silo2a: 'Silo 2A · Flakes 1', silo2b: 'Silo 2B · Flakes 2',
  hb: 'Hombak', silo3: 'Silo 3 · Hombak',
  bunker: 'Dosing Bunker IMAL', secadero1: 'Secadero 1', secadero2: 'Secadero 2',
  cribaF: 'Tamiz F', cribaG: 'Tamiz G', zaranda1: 'Zaranda 1', zaranda2: 'Zaranda 2', zaranda3: 'Zaranda 3',
  colectCL: 'Colector CL', colectSL: 'Colector SL', colectPG: 'Colector de Partículas Grandes', colectPolvo: 'Colector de Polvo',
  ws1: 'Windsifter 1', ws2: 'Windsifter 2', partG: 'Part. Grandes', w3: 'Windsifter 3',
  r1: 'Refinador 1', r2: 'Refinador 2', cy: 'Ciclones', clasSL: 'Clasificadores',
  silo5: 'Silo 5 · CL/core', silo6: 'Silo 6 · SL/capas', silo4: 'Silo 4 · Polvo', silo8: 'Silo 8 · TVM', quemador: 'Quemador · biomasa',
  activeSilo5: 'Silo 5 · gruesa animado', activeDosingCL: 'Dosing gruesa', activeEncCI: 'Encoladora CI',
  activeSilo6: 'Silo 6 · fina animado', activeDosingSL: 'Dosing fina', activeEncCE: 'Encoladora CE',
  clGate: 'Entrada CL a Esparcidor 2', sl1Gate: 'Entrada SL a Esparcidor 1', sl2Gate: 'Entrada SL a Esparcidor 3',
};
// Sucesor por defecto de cada nodo (la bifurcación CL/SL se resuelve en succ()).
const LINEAR_NEXT = {
  patios: 'bunker',   // cambio de receta: recorre la reducción hasta el bunker
  pm1: 'ds', ds: 'silo1', silo1: 'bunker',
  ch: 'pm2', pm2: 'flex', flex: 'silo2a', silo2a: 'bunker', silo2b: 'bunker',
  hb: 'silo3', silo3: 'bunker',
  bunker: 'secadero1', secadero1: 'cribaF', cribaF: 'zaranda2',
  secadero2: 'cribaG', cribaG: 'zaranda2', zaranda1: 'zaranda2', zaranda3: 'zaranda2',
  colectCL: 'silo5', colectSL: 'ws1', colectPG: 'partG', colectPolvo: 'silo4',
  ws1: 'ws2', ws2: 'silo6', silo6: 'activeSilo6', activeSilo6: 'activeDosingSL', activeDosingSL: 'activeEncCE',
  silo5: 'activeSilo5', activeSilo5: 'activeDosingCL', activeDosingCL: 'activeEncCI', activeEncCI: 'clGate',
  partG: 'w3', w3: 'r1', r1: 'cy', r2: 'cy', cy: 'clasSL', clasSL: 'ws1',
  silo4: 'silo8', silo8: 'quemador', quemador: null,
  clGate: null, sl1Gate: null, sl2Gate: null,
};
function succ(key, branch) {
  if (key === 'zaranda2') return branch === 'cl' ? 'colectCL' : 'colectSL'; // bifurca mediante colectores
  if (key === 'activeEncCE') return 'sl1Gate';   // ruta fina → formación (se divide en SL1+SL2 al llegar)
  return LINEAR_NEXT[key] ?? null;
}
// `via` (polilínea que sigue la tubería dibujada) para las aristas donde una
// recta se vería mal (codos, transportadores aéreos, bandas inclinadas).
const EDGE_VIA = {
  'patios>bunker': [[-1608, 328], [-1370, 338]],
  'silo1>bunker': [[-1370, 138], [-1370, 338]],
  'silo2a>bunker': [[-1370, 283], [-1370, 338]],
  'silo2b>bunker': [[-1370, 358], [-1370, 338]],
  'silo3>bunker': [[-1370, 538], [-1370, 338]],
  'bunker>secadero1': [[-1248, 338], [-1248, 248]],
  'cribaF>zaranda2': [[-1060, 248], [-1060, 338]],
  'cribaG>zaranda2': [[-1060, 428], [-1060, 338]],
  'zaranda2>silo5': [[-950, 338], [-950, 212]],
  'clasSL>ws1': [[-612, 338]],
  'silo5>activeSilo5': [[-582, 212], [-582, 14], [860, 14]],
  'silo6>activeSilo6': [[-618, 408], [-618, 30], [330, 30]],
  'activeEncCI>clGate': [[928, 494], [2750, 494]],
  'activeEncCE>sl1Gate': [[398, 534], [2100, 534]],
  'activeEncCE>sl2Gate': [[398, 534], [2100, 534]],
};
// launchM/label al entrar a la Sección 2 animada.
const GATE_LAUNCH = {
  clGate: { launchM: 15.0, launchLabel: 'CL/core entra a Esparcidor 2' },
  sl1Gate: { launchM: 6.63, launchLabel: 'SL entra a Esparcidor 1' },
  sl2Gate: { launchM: 22.25, launchLabel: 'SL entra a Esparcidor 3' },
};

/* Configuración por punto de inyección (data-pre-stage) → ramas + nodo de arranque.
   b3 = las 3 capas (antes de la bifurcación); bsl = ruta SL; bcl = ruta CL. */
// Una sola ruta fina 'sl' (se divide en SL1+SL2 al llegar a la formación) + ruta gruesa 'cl'.
const B3 = ['cl', 'sl'], BSL = ['sl'], BCL = ['cl'], BIO = ['bio'];
const STAGE_CONFIG = {
  patios: { branches: B3, startAt: 'patios' },
  'wf-pm1': { branches: B3, startAt: 'pm1' }, 'wf-ds': { branches: B3, startAt: 'ds' }, silo1: { branches: B3, startAt: 'silo1' },
  'wf-ch': { branches: B3, startAt: 'ch' }, 'wf-pm2': { branches: B3, startAt: 'pm2' }, 'wf-flex': { branches: B3, startAt: 'flex' },
  silo2a: { branches: B3, startAt: 'silo2a' }, silo2b: { branches: B3, startAt: 'silo2b' },
  'wf-hb': { branches: B3, startAt: 'hb' }, silo3: { branches: B3, startAt: 'silo3' },
  bunker: { branches: B3, startAt: 'bunker' }, secadero1: { branches: B3, startAt: 'secadero1' }, secadero2: { branches: B3, startAt: 'secadero2' },
  cribaF: { branches: B3, startAt: 'cribaF' }, cribaG: { branches: B3, startAt: 'cribaG' },
  zaranda1: { branches: B3, startAt: 'zaranda1' }, zaranda2: { branches: B3, startAt: 'zaranda2' }, zaranda3: { branches: B3, startAt: 'zaranda3' },
  'colector-cl': { branches: BCL, startAt: 'colectCL' }, 'colector-sl': { branches: BSL, startAt: 'colectSL' },
  'colector-pg': { branches: BSL, startAt: 'colectPG' }, 'colector-polvo': { branches: BIO, startAt: 'colectPolvo' },
  ws1: { branches: BSL, startAt: 'ws1' }, ws2: { branches: BSL, startAt: 'ws2' }, silo6: { branches: BSL, startAt: 'silo6' },
  partG: { branches: BSL, startAt: 'partG' }, w3: { branches: BSL, startAt: 'w3' }, r1: { branches: BSL, startAt: 'r1' }, r2: { branches: BSL, startAt: 'r2' }, cy: { branches: BSL, startAt: 'cy' }, clasSL: { branches: BSL, startAt: 'clasSL' },
  silo5: { branches: BCL, startAt: 'silo5' },
  'active-silo5': { branches: BCL, startAt: 'activeSilo5' }, 'active-dosCL': { branches: BCL, startAt: 'activeDosingCL' }, 'active-encCI': { branches: BCL, startAt: 'activeEncCI' },
  'active-silo6': { branches: BSL, startAt: 'activeSilo6' }, 'active-dosSL': { branches: BSL, startAt: 'activeDosingSL' }, 'active-encCE': { branches: BSL, startAt: 'activeEncCE' },
  silo4: { branches: BIO, startAt: 'silo4' }, silo8: { branches: BIO, startAt: 'silo8' }, quemador: { branches: BIO, startAt: 'quemador' },
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
  const aserrinPila = tauPila(params, 'p1:pila1_M', 'p1:pila1_F');
  const aserrinTransfer = fixed(params, 'p1:tDS') + fixed(params, 'p1:tr1');
  const chipsPila = tauPila(params, 'p1:pila2_M', 'p1:pila2_F');
  const flakesTransfer = fixed(params, 'p1:esperaDesv') + fixed(params, 'p1:tr2');
  const hombakTransfer = fixed(params, 'p1:tr3');
  const silo1 = tauSiloH(params, 's1');
  const silo2a = tauSiloH(params, 's2');
  const silo2b = tauSiloH(params, 's2b');
  const silo3 = tauSiloH(params, 's3');
  const reduction = Math.max(
    aserrinPila + aserrinTransfer + silo1,
    chipsPila + flakesTransfer + Math.max(silo2a, silo2b),
    hombakTransfer + silo3,
  );
  const bunker = tauSiloH(params, 'bk') + fixed(params, 'p1:trSec');
  const secado = fixed(params, 'p1:tauTambor');
  return {
    reduction, aserrinPila, aserrinTransfer, chipsPila, flakesTransfer, hombakTransfer,
    silo1, silo2a, silo2b, silo3,
    bunker,
    secado,
    tamices: fixed(params, 'p1:tCriba'), zarandas: fixed(params, 'p1:tZar'),
    collectCL: fixed(params, 'p1:tColectCL'), collectSL: fixed(params, 'p1:tColectSL'),
    collectPG: fixed(params, 'p1:tColectOver'), collectPolvo: fixed(params, 'p1:tPolvo'),
    ws1: fixed(params, 'p1:tWS1'), ws2: fixed(params, 'p1:tWS2'), ws3: fixed(params, 'p1:tWS3'),
    imanFe: fixed(params, 'p1:tFe'), neumaticoSL: fixed(params, 'p1:tNeum'),
    ref1: fixed(params, 'p1:tRef1'), ref2: fixed(params, 'p1:tRef2'), ciclon: fixed(params, 'p1:tCiclon'),
    clasReingreso: fixed(params, 'p1:tClasSL') + fixed(params, 'p1:tReingresoSL'),
    clSilo: tauSiloM(params, 's5'),
    clDosing: tauMF(params, 'p1:dosG_M', 'p1:dosG_F'),
    clEnc: fixed(params, 'p1:tEncCI'),
    clIncl: tBelt(params, 'p1:inclG_L', 'p1:inclG_v'),
    slSilo: tauSiloM(params, 's6'),
    slDosing: tauMF(params, 'p1:dosF_M', 'p1:dosF_F'),
    slEnc: fixed(params, 'p1:tEncCE'),
    slIncl: tBelt(params, 'p1:inclF_L', 'p1:inclF_v'),
    polvoSilo4: tauSiloM(params, 's4'), polvoSilo8: tauSiloM(params, 's8'),
  };
}

/* Duración de la arista from→to (s), tomada del modelo (τ=M/F, ρ·V·L%/F, L/v).
   Las residencias grandes viven en el nodo silo; los saltos visuales son ~1-2 s. */
function edgeDt(from, to, d) {
  const T = {
    'patios>bunker': d.reduction,
    'pm1>ds': d.aserrinPila, 'ds>silo1': d.aserrinTransfer, 'silo1>bunker': d.silo1,
    'pm2>flex': d.chipsPila, 'flex>silo2a': d.flakesTransfer,
    'silo2a>bunker': d.silo2a, 'silo2b>bunker': d.silo2b,
    'hb>silo3': d.hombakTransfer, 'silo3>bunker': d.silo3,
    'bunker>secadero1': d.bunker, 'secadero1>cribaF': d.secado, 'secadero2>cribaG': d.secado,
    'cribaF>zaranda2': d.tamices, 'cribaG>zaranda2': d.tamices,
    // La retención de la encoladora (τ=40 s) vive en la arista de SALIDA del
    // nodo encolador: así un cambio inyectado EN la encoladora también cumple
    // sus 40 s dentro de la máquina (el total silo→gate no cambia).
    'zaranda1>zaranda2': d.zarandas, 'zaranda3>zaranda2': d.zarandas,
    'zaranda2>colectCL': d.zarandas, 'colectCL>silo5': d.collectCL,
    'silo5>activeSilo5': 1, 'activeSilo5>activeDosingCL': d.clSilo,
    'activeDosingCL>activeEncCI': d.clDosing, 'activeEncCI>clGate': d.clEnc + d.clIncl,
    'zaranda2>colectSL': d.zarandas, 'colectSL>ws1': d.collectSL, 'ws1>ws2': d.ws1, 'ws2>silo6': d.ws2 + d.neumaticoSL,
    'colectPG>partG': d.collectPG, 'partG>w3': d.imanFe, 'colectPolvo>silo4': d.collectPolvo,
    'silo6>activeSilo6': 1, 'activeSilo6>activeDosingSL': d.slSilo,
    'activeDosingSL>activeEncCE': d.slDosing, 'activeEncCE>sl1Gate': d.slEnc + d.slIncl, 'activeEncCE>sl2Gate': d.slEnc + d.slIncl,
    'w3>r1': d.ws3, 'w3>r2': d.ws3, 'r1>cy': d.ref1, 'r2>cy': d.ref2,
    'cy>clasSL': d.ciclon, 'clasSL>ws1': d.clasReingreso,
    'silo4>silo8': d.polvoSilo4, 'silo8>quemador': d.polvoSilo8,
  };
  return Math.max(1, T[`${from}>${to}`] ?? 2);
}

/* Recorre el grafo desde `startAt` siguiendo succ() hasta la entrada a la
   Sección 2 (o el quemador, para la ruta de polvo). Cada hito lleva key/label/
   posición/via/t acumulado, y el último la marca launchM para nacer en P2. */
function preMilestonesFor(startAt, branch, params) {
  const d = buildPreDurations(params);
  const at = (key, extra) => ({ key, label: NODE_LABEL[key] ?? key, x: NODE_POS[key][0], y: NODE_POS[key][1], ...extra });
  const miles = [at(startAt, { t: 0 })];
  let cur = startAt;
  let t = 0;
  for (let guard = 0; guard < 40; guard++) {
    const nxt = succ(cur, branch);
    if (!nxt || !NODE_POS[nxt]) break;
    t += edgeDt(cur, nxt, d);
    const via = EDGE_VIA[`${cur}>${nxt}`];
    miles.push(at(nxt, { t, ...(via ? { via } : {}), ...(GATE_LAUNCH[nxt] ?? {}) }));
    cur = nxt;
  }
  return miles;
}

/* El tramo a→b puede llevar `via` (polilínea que sigue la tubería dibujada):
   el tiempo del tramo se reparte proporcional a la LONGITUD de cada segmento. */
function posOnPreRoute(miles, elapsed) {
  if (elapsed <= 0) return miles[0];
  const last = miles[miles.length - 1];
  if (elapsed >= last.t) return last;
  for (let i = 1; i < miles.length; i++) {
    const a = miles[i - 1];
    const b = miles[i];
    if (elapsed <= b.t) {
      const f = (elapsed - a.t) / Math.max(1, b.t - a.t);
      const pts = [[a.x, a.y], ...(b.via ?? []), [b.x, b.y]];
      const lens = [];
      let L = 0;
      for (let j = 1; j < pts.length; j++) {
        const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
        lens.push(d);
        L += d;
      }
      if (L <= 0) return { x: b.x, y: b.y };
      let target = f * L;
      for (let j = 1; j < pts.length; j++) {
        if (target <= lens[j - 1]) {
          const g = lens[j - 1] > 0 ? target / lens[j - 1] : 0;
          return {
            x: pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * g,
            y: pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * g,
          };
        }
        target -= lens[j - 1];
      }
      return { x: b.x, y: b.y };
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

// Descenso del cambio POR DENTRO del esparcidor: entra por el tope del cabezal
// (donde lo entrega la banda inclinada), baja por la tolva → cuerpo → rodillos →
// boca hasta caer al colchón. El punto de inyección de cada esparcidor (xm de
// 6.63 · 15.0 · 22.25) coincide con su rodillo central y su boca de salida, así
// que el descenso vertical traza una recta limpia por el centro de la máquina.
const SPREADER_HEAD_TOP_Y = 110;   // y del tope del cabezal (entrada desde la inclinada)
const SPREADER_FALLBACK_TAU = 0;   // sin plug fijo: el CSV debe aportar M y F

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
  // Arranca a tiempo real para que el cambio se vea nacer en el equipo pulsado.
  // El operador puede acelerar la demostración manualmente cuando lo necesite.
  let timeScale = clamp(Number(document.getElementById('timeScaleInput')?.value) || 1, 1, 100000);
  let modelParams = loadPart1Params();
  let hmiCsvApi = null;
  let scrubbing = false;
  let paused = false;      // pausa/reanuda la simulación (no borra nada; el reloj real sigue)
  let changeSeq = 0;
  let selectedId = null;   // cambio que controla el movedor manual (el último inyectado)
  const changes = [];      // cambios activos: { id, seq, color, posM, el, arrivals[], passed:Set }
  const preChanges = [];    // cambios upstream Parte 1: se convierten a cambios downstream al llegar a P2
  const reports = [];      // cambios completados (más reciente primero), máx. 8
  // Grupo por cambio (seq): capas esperadas, caídas observadas, registro y
  // PREDICCIONES congeladas al inyectar (registro + sensores 1/2/3).
  const groups = new Map(); // seq → { seq, origin, wallStart, expected:Set, landed:Map, registeredAt, predictions, tracersLeft }

  const speedRange = document.getElementById('speedRange');
  const speedInput = document.getElementById('speedInput');
  const timeScaleInput = document.getElementById('timeScaleInput');
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

  // Si el metro `m` es el punto de inyección de un esparcidor (SL1 6.63 · CL 15 ·
  // SL2 22.25), devuelve su τ de residencia (s) leído de los params del modelo
  // (editable en panel / CSV). Con esto el cambio BAJA por dentro del esparcidor
  // durante ese tiempo antes de caer al colchón. Fuera de un esparcidor → dropM null.
  const SPREADER_CONFIG = {
    '6.63': { massKey: 'mass:esp1-zone', flow: (p) => num(p, '_global:F_SL') * num(p, '_global:pctSL1') / 100 },
    '15': { massKey: 'mass:esp2-zone', flow: (p) => num(p, '_global:F_CL') },
    '22.25': { massKey: 'mass:esp3-zone', flow: (p) => num(p, '_global:F_SL') * num(p, '_global:pctSL2') / 100 },
  };
  const SPREADER_LAYER = { '6.63': 'SL1', '15': 'CL', '22.25': 'SL2' };
  function spreaderDropFor(m) {
    const s = [6.63, 15.0, 22.25].find((v) => Math.abs(v - m) < 0.15);
    if (s == null) return { dropM: null, dropDur: 0, layerName: null };
    const cfg = SPREADER_CONFIG[String(s)];
    const mass = Math.max(0, num(modelParams, cfg.massKey));
    const flow = Math.max(0, cfg.flow(modelParams));
    const tau = mass > 0 && flow > 0 ? mass / flow * 60 : SPREADER_FALLBACK_TAU;
    return { dropM: s, dropDur: tau, layerName: SPREADER_LAYER[String(s)] };
  }

  /* ── Predicciones por cambio (congeladas al inyectar) ──────────────
     Usa la MISMA línea de tiempo que la simulación (edgeDt/miles + τ de
     esparcidora + transporte a v_prensa), en SEGUNDOS DE PROCESO desde la
     inyección, para que lo predicho sea comparable con lo observado.
     La calidad de los parámetros (estimado / sin calibrar) se toma del
     route-model, que es quien conoce la fuente de cada dato. */
  const LAYER_DEPOSIT_M = { SL1: 6.63, CL: 15.0, SL2: 22.25 };
  function tauEsp(layer) {
    const key = Object.entries(SPREADER_CONFIG).find(([, cfg]) => cfg.massKey === `mass:${layer === 'SL1' ? 'esp1' : layer === 'CL' ? 'esp2' : 'esp3'}-zone`)?.[0];
    const cfg = key ? SPREADER_CONFIG[key] : null;
    if (!cfg) return SPREADER_FALLBACK_TAU;
    const mass = Math.max(0, num(modelParams, cfg.massKey));
    const flow = Math.max(0, cfg.flow(modelParams));
    return mass > 0 && flow > 0 ? mass / flow * 60 : SPREADER_FALLBACK_TAU;
  }

  /* Calidad de parámetros según el route-model (fuente + flags). */
  function modelQuality() {
    try {
      const r = computeRoute(bridgeP1ToModel(modelParams), { lineSpeed: vPrensa });
      const tag = (q) => {
        const f = formatSec(q);
        return f.flags?.length ? f.flags.map((x) => STATUS_LABEL[x]).join(' · ') : 'OK';
      };
      return {
        registro: tag(r.registration),
        sensor1: tag(r.sensors.sensor1),
        sensor2: tag(r.sensors.sensor2),
        sensor3: tag(r.sensors.sensor3),
        source: 'HMI CSV + mediciones jul-2026 (route-model)',
      };
    } catch {
      return { registro: '—', sensor1: '—', sensor2: '—', sensor3: '—', source: 'modelo no disponible' };
    }
  }

  /**
   * layersIn: [{ layer:'SL1'|'CL'|'SL2', tGate:segundos hasta entrar a su
   * esparcidora }]. Devuelve llegadas por capa, registro (máx) y sensores.
   * Para inyecciones aguas abajo del registro (sin capas), sólo sensores.
   */
  function buildPrediction(layersIn, directM = null) {
    const v = vPrensa; // m/min al momento de inyectar (congelada en la predicción)
    const layers = {};
    let tReg = null;
    for (const L of layersIn) {
      const landing = L.tGate + tauEsp(L.layer);
      layers[L.layer] = landing;
      if (tReg == null || landing > tReg) tReg = landing;
    }
    const sensors = {};
    for (const s of SENSOR_DEFS) {
      let worst = null;
      if (layersIn.length) {
        for (const L of layersIn) {
          const t = layers[L.layer] + ((s.m - LAYER_DEPOSIT_M[L.layer]) / v) * 60;
          if (worst == null || t > worst) worst = t;
        }
      } else if (directM != null && directM <= s.m + 1e-6) {
        worst = ((s.m - directM) / v) * 60;
      }
      sensors[s.key] = worst; // null → el cambio nació después de este sensor
    }
    return {
      layers, tReg, sensors,
      completeBoard: layersIn.length >= 3,
      vAtInjection: v,
      quality: modelQuality(),
    };
  }

  function createGroup(seq, origin, expectedLayers, predictions) {
    const g = {
      seq, origin, wallStart: new Date(),
      expected: new Set(expectedLayers),
      landed: new Map(),          // layer → Date de caída al colchón (observado)
      registeredAt: null,         // Date · max(SL1, CL, SL2) observado
      predictions,
      tracersLeft: 0,             // trazadores vivos (pre + downstream) del seq
      state: 'EN CURSO',
    };
    groups.set(seq, g);
    return g;
  }

  /* Caída observada de una capa al colchón. El registro del colchón COMPLETO
     sólo se marca cuando cae la ÚLTIMA capa esperada = max(SL1, CL, SL2). */
  function recordLanding(ch) {
    if (ch.landed || !ch.layerName) return false;
    ch.landed = true;
    const now = new Date();
    ch.arrivals.push({ label: `${ch.layerName} · caída al colchón (fin τ esparcidora)`, m: ch.dropM, wallTime: now });
    const g = groups.get(ch.seq);
    if (!g) return true;
    if (!g.landed.has(ch.layerName)) g.landed.set(ch.layerName, now);
    if (!g.registeredAt && g.expected.size > 0 && [...g.expected].every((L) => g.landed.has(L))) {
      g.registeredAt = now;
      const which = [...g.expected].join(' + ');
      const label = g.expected.size >= 3
        ? `Registro de colchón COMPLETO (${which}) · máx capas`
        : `Registro parcial (${which})`;
      ch.arrivals.push({ label, m: ch.dropM, wallTime: now });
    }
    return true;
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
    let my = topTop(mx) - 6;
    // Si el cambio nació en un esparcidor, BAJA por dentro del cabezal: entra por
    // el tope (donde lo entrega la banda inclinada) y desciende hasta el colchón
    // en su τ de residencia. Recién al terminar empieza a avanzar por la banda.
    if (ch.dropM != null && ch.dropDur > 0 && ch.dropAge < ch.dropDur) {
      const f = clamp(ch.dropAge / ch.dropDur, 0, 1);   // 0 en el tope → 1 ya sobre el colchón
      my = SPREADER_HEAD_TOP_Y + (my - SPREADER_HEAD_TOP_Y) * f;
    }
    ch.el?.setAttribute('transform', `translate(${mx.toFixed(1)} ${my.toFixed(1)})`);
  }

  function updatePreTracerEl(ch) {
    const p = posOnPreRoute(ch.miles, ch.elapsed);
    ch.el?.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  }

  // El reporte de cada cambio existe desde que NACE (se ve "en curso" con solo
  // su primera fila) y se va llenando en vivo con cada equipo que va cruzando;
  // al completarse pasa a "completado" y queda fijo en la lista.
  const fmtT = (s) => (s == null || !Number.isFinite(s) ? '—' : `T+${fmtCountdown(s)}`);

  /* Fila predicha: valor T+ (segundos de proceso desde la inyección) + etiqueta
     de calidad del parámetro según el route-model (OK · estimado · sin calibrar). */
  function predRow(label, seconds, quality) {
    const q = quality && quality !== 'OK' ? ` <em class="report-card__q">${quality}</em>` : '';
    return `<li class="report-card__pred"><span>${label}${q}</span><strong>${fmtT(seconds)}</strong></li>`;
  }

  function renderCard(item, isActive) {
    const g = item.group ?? groups.get(item.seq) ?? null;
    const card = document.createElement('div');
    card.className = isActive ? 'report-card report-card--active' : 'report-card';
    card.style.borderLeftColor = item.color;
    const nextWp = isActive ? nextWaypoint(item.posM) : null;
    const countdownRow = isActive ? `
        <li class="report-card__countdown">
          <span data-countdown-label-for="${item.id}">Próximo: ${nextWp?.label ?? '—'}</span>
          <strong data-countdown-for="${item.id}">--:--</strong>
        </li>` : '';
    const state = isActive ? (paused ? 'EN PAUSA' : 'EN CURSO') : 'COMPLETADO';
    const layerBadge = item.layerName ? `<span class="report-card__layer">${item.layerName}</span>`
      : (item.branchLabel ? `<span class="report-card__layer">${item.branchLabel}</span>` : '');
    const p = g?.predictions;
    const predBlock = p ? `
        <li class="report-card__sub">Predicho · modelo (${p.vAtInjection} m/min · ${p.quality.source})</li>
        ${p.layers.SL1 != null ? predRow('SL1 · llegada al colchón', p.layers.SL1, p.quality.registro) : ''}
        ${p.layers.CL != null ? predRow('CL · llegada al colchón', p.layers.CL, p.quality.registro) : ''}
        ${p.layers.SL2 != null ? predRow('SL2 · llegada al colchón', p.layers.SL2, p.quality.registro) : ''}
        ${p.tReg != null ? predRow(`Registro ${p.completeBoard ? 'COMPLETO (máx SL1·CL·SL2)' : 'parcial'}`, p.tReg, p.quality.registro) : ''}
        ${predRow('Sensor 1', p.sensors.sensor1, p.quality.sensor1)}
        ${predRow('Sensor 2', p.sensors.sensor2, p.quality.sensor2)}
        ${predRow('Sensor 3', p.sensors.sensor3, p.quality.sensor3)}` : '';
    card.innerHTML = `
      <div class="report-card__hd">
        <i style="background:${item.color}"></i>
        <strong>Cambio ${item.seq}</strong>
        ${layerBadge}
        <span class="report-card__status">${state}</span>
      </div>
      <div class="report-card__meta">
        <span>${item.id}</span>
        <span>Origen: ${g?.origin ?? item.arrivals[0]?.label ?? '—'}</span>
        <span>Inicio: ${g ? fmtWallTime(g.wallStart) : (item.arrivals[0] ? fmtWallTime(item.arrivals[0].wallTime) : '—')}</span>
        ${g?.registeredAt ? `<span>Registro observado: ${fmtWallTime(g.registeredAt)}</span>` : ''}
      </div>
      <ul class="report-card__list">
        ${countdownRow}
        ${predBlock}
        <li class="report-card__sub">Observado · simulación (hora Quito)</li>
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
      const inDrop = ch.dropM != null && ch.dropDur > 0 && ch.dropAge < ch.dropDur;
      const here = inDrop
        ? `Esparcidor ${ch.layerName ?? ''} (descenso τ)`
        : ([...NAMED_WAYPOINTS].reverse().find((wp) => wp.m <= ch.posM + 1e-6)?.label ?? 'Inicio del colchón');
      const wp = nextWaypoint(ch.posM);
      if (!wp && !inDrop) {
        if (labelEl) labelEl.textContent = `En: ${here}`;
        strong.textContent = '—';
        continue;
      }
      if (labelEl) labelEl.textContent = `En: ${here} · Próximo: ${inDrop ? 'caída al colchón' : wp.label}`;
      if (paused) { strong.textContent = 'PAUSA'; continue; }
      const remaining = inDrop
        ? (ch.dropDur - ch.dropAge)
        : ((Math.max(0, wp.m - ch.posM) / vPrensa) * 60);
      strong.textContent = fmtCountdown(remaining / Math.min(timeScale, 300));
    }
    for (const ch of preChanges) {
      const strong = reportsList.querySelector(`[data-countdown-for="${ch.id}"]`);
      const labelEl = reportsList.querySelector(`[data-countdown-label-for="${ch.id}"]`);
      if (!strong) continue;
      const here = [...ch.miles].reverse().find((m) => m.t <= ch.elapsed + 1e-6)?.label ?? ch.miles[0]?.label ?? '—';
      const next = ch.miles.find((m) => m.t > ch.elapsed + 1e-6);
      if (labelEl) labelEl.textContent = `En: ${here} · Próximo: ${next?.label ?? 'entrada a Parte 2'}`;
      strong.textContent = paused ? 'PAUSA' : fmtCountdown(Math.max(0, (next?.t ?? ch.total) - ch.elapsed) / timeScale);
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
    if (!ch.passed.has(FINISH_LABEL)) {
      ch.arrivals.push({ label: FINISH_LABEL, m: PROCESS_END_M, wallTime: new Date() });
    }
    ch.el?.remove();
    const idx = changes.indexOf(ch);
    if (idx >= 0) changes.splice(idx, 1);
    const g = groups.get(ch.seq);
    if (g) {
      g.tracersLeft = Math.max(0, g.tracersLeft - 1);
      if (g.tracersLeft === 0) g.state = 'COMPLETADO';
    }
    reports.unshift({ id: ch.id, seq: ch.seq, color: ch.color, layerName: ch.layerName, arrivals: ch.arrivals, group: g ?? null });
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
      ...spreaderDropFor(startM),   // si nace en un esparcidor: baja por dentro (τ) antes de avanzar
      dropAge: 0,
      arrivals: [{ label: startLabel, m: startM, wallTime: new Date() }],
      passed: new Set([startLabel]),
    };
    // Grupo + predicciones: si nace en una esparcidora es un cambio de ESA capa
    // (tGate = 0, ya está entrando); si nace más abajo, sólo aplica transporte.
    const layersIn = ch.layerName ? [{ layer: ch.layerName, tGate: 0 }] : [];
    const g = createGroup(ch.seq, startLabel, layersIn.map((L) => L.layer), buildPrediction(layersIn, ch.layerName ? null : startM));
    g.tracersLeft = 1;
    ch.el = createTracerEl(ch);
    updateTracerEl(ch);
    changes.push(ch);
    selectedId = ch.id;
    syncMoverEnabled();
    renderReportsList(); // el reporte nace con el cambio, no solo al completarse
    ensureRunning();
  }

  function injectDownstreamFromPre(parent, m, label) {
    const inherited = parent.arrivals.map((a) => ({
      ...a,
      m: typeof a.m === 'number' ? a.m : 0,
      wallTime: a.wallTime instanceof Date ? a.wallTime : new Date(a.wallTime || Date.now()),
    }));
    const alreadyHasLaunch = inherited.some((a) => a.label === label);
    // Al terminar la banda inclinada el cambio ENTRA por el tope del esparcidor y
    // baja por dentro durante su τ de residencia (SL1 6.63 · CL 15 · SL2 22.25).
    const { dropM, dropDur, layerName } = spreaderDropFor(m);
    const g = groups.get(parent.seq);
    if (g) g.tracersLeft += 1;
    const ch = {
      id: `${parent.id}-p2-${Math.round(m * 100)}`,
      seq: parent.seq,
      color: parent.color,
      posM: clamp(m, 0, PROCESS_END_M),
      dropM,
      dropDur,
      layerName,
      dropAge: 0,
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

  const BRANCH_LABEL = { cl: 'Ruta gruesa · CL/core', sl: 'Ruta fina · SL1 + SL2', bio: 'Polvo → biomasa (no entra a P2)' };

  function injectPre(stage, label) {
    const cfg = STAGE_CONFIG[stage] ?? STAGE_CONFIG.patios;
    label = label || NODE_LABEL[cfg.startAt] || stage;
    changeSeq += 1;
    const seq = changeSeq;
    const color = CHANGE_COLORS[(seq - 1) % CHANGE_COLORS.length];

    // Predicciones del grupo: tiempo upstream por rama (misma línea de tiempo
    // que la simulación) + τ esparcidora + transporte a v_prensa.
    const layersIn = [];
    for (const branch of cfg.branches) {
      const total = preMilestonesFor(cfg.startAt, branch, modelParams).slice(-1)[0].t;
      if (branch === 'cl') layersIn.push({ layer: 'CL', tGate: total });
      if (branch === 'sl') layersIn.push({ layer: 'SL1', tGate: total }, { layer: 'SL2', tGate: total });
    }
    const g = createGroup(seq, label, layersIn.map((L) => L.layer), buildPrediction(layersIn));

    for (const branch of cfg.branches) {
      const branchLabel = BRANCH_LABEL[branch];
      const miles = preMilestonesFor(cfg.startAt, branch, modelParams);
      const ch = {
        id: `pre-${seq}-${branch}`,
        seq,
        color,
        branch,
        startAt: cfg.startAt,   // para recalcular la línea de tiempo si cambian los params/CSV
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
      g.tracersLeft += 1;
    }
    selectedId = null;
    syncMoverEnabled();
    renderReportsList();
    ensureRunning();
  }

  // Bucle auto-suspendible: solo corre cuando hay cambios activos (idle = 0 CPU).
  let last = performance.now();
  let running = false;
  let rafId = 0;
  let cdAccum = 0;   // acumulador para throttlear los countdowns a ~3 Hz
  function ensureRunning() {
    if (running || paused) return;
    running = true;
    last = performance.now();
    cdAccum = 999;
    rafId = requestAnimationFrame(frame);
  }
  function frame(now) {
    // Tiempo REAL transcurrido (sin recorte): si el navegador retrasa un frame
    // (pestaña oculta, GC, etc.) la simulación avanza lo que de verdad pasó —
    // no deriva por intervalos de JavaScript demorados.
    const dt = Math.max(0, (now - last) / 1000);
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
        const grp = groups.get(ch.seq);
        if (grp) grp.tracersLeft = Math.max(0, grp.tracersLeft - 1);
        if (lastM.launchM != null) {
          if (ch.branch === 'sl') {
            // La ruta fina se SEPARA en la formación: capa inferior (SL1) y superior (SL2)
            injectDownstreamFromPre(ch, 6.63, 'SL1 · capa inferior (esparcidor 1)');
            injectDownstreamFromPre(ch, 22.25, 'SL2 · capa superior (esparcidor 3)');
          } else {
            injectDownstreamFromPre(ch, lastM.launchM, lastM.launchLabel);   // gruesa (CL) → esparcidor 2
          }
        } else {
          // ruta de polvo/biomasa: no entra a P2, se registra como completada en el quemador
          if (grp && grp.tracersLeft === 0) grp.state = 'COMPLETADO';
          reports.unshift({ id: ch.id, seq: ch.seq, color: ch.color, arrivals: ch.arrivals, group: grp ?? null });
          if (reports.length > 8) reports.length = 8;
        }
        crossed = true;
      }
    }
    for (const ch of changes.slice()) {
      // Fase 1 — descenso por dentro del esparcidor: consume su τ de residencia con
      // el reloj de la Sección 2 (min(timeScale,300), igual que la banda) y todavía
      // NO avanza. Se ve bajar de arriba a abajo antes de caer al colchón.
      if (ch.dropM != null && ch.dropDur > 0 && ch.dropAge < ch.dropDur) {
        ch.dropAge += dt * Math.min(timeScale, 300);
        updateTracerEl(ch);
        // Fin del descenso = la capa CAE al colchón (llegada observada). El
        // registro completo se marca cuando cae la ÚLTIMA capa del grupo.
        if (ch.dropAge >= ch.dropDur && recordLanding(ch)) crossed = true;
        continue;
      }
      if (!ch.landed && ch.layerName && recordLanding(ch)) crossed = true; // τ=0 o aterrizado por mover manual
      if (scrubbing && ch.id === selectedId) continue; // el movedor controla este directamente
      const prevM = ch.posM;
      ch.posM = Math.min(ch.posM + advanceM, PROCESS_END_M);
      if (recordCrossings(ch, prevM)) crossed = true;
      if (ch.posM >= PROCESS_END_M) finishChange(ch); // ya re-renderiza el panel
      else updateTracerEl(ch);
    }
    if (crossed) renderReportsList(); // llena en vivo el reporte de cada cambio activo
    // Countdowns solo ~3 veces/s (no 60 fps): recorta el churn de querySelector/Intl.
    cdAccum += dt;
    if ((changes.length || preChanges.length) && cdAccum >= 0.33) {
      cdAccum = 0;
      updateReportCountdowns();
    }
    if (selectedId && moverRange && document.activeElement !== moverRange) {
      const sel = changes.find((c) => c.id === selectedId);
      if (sel) moverRange.value = sel.posM.toFixed(1);
    }
    // Suspende el bucle cuando no queda nada activo (idle = 0 CPU).
    if (changes.length || preChanges.length) {
      rafId = requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  // Velocidad de prensa (único parámetro operador visible en la barra).
  const requestSpeedChange = (value) => {
    const normalized = clamp(parseFloat(value) || DEFAULT_SPEED, SPEED_MIN, SPEED_MAX);
    if (!hmiCsvApi?.updateKey('v_prensa', normalized)) syncSpeedUI();
  };
  speedRange?.addEventListener('input', () => requestSpeedChange(speedRange.value));
  speedInput?.addEventListener('change', () => requestSpeedChange(speedInput.value));
  // Multiplicador de tiempo escribible: se aplica en vivo mientras se escribe
  // (clamp interno sin pisar lo tecleado) y se normaliza el valor al salir del campo.
  const applyTimeScale = () => {
    timeScale = clamp(Number(timeScaleInput.value) || 1, 1, 100000);
    updateReportCountdowns();
  };
  timeScaleInput?.addEventListener('input', applyTimeScale);
  timeScaleInput?.addEventListener('change', () => {
    applyTimeScale();
    timeScaleInput.value = timeScale;
  });
  syncSpeedUI();

  // Pausa/Reanudar: congela el avance de TODOS los cambios (pre y downstream)
  // sin perder nada; al reanudar el reloj parte de "ahora" (no hay salto).
  const pauseBtn = document.getElementById('pauseBtn');
  function setPaused(p) {
    paused = p;
    if (pauseBtn) {
      pauseBtn.classList.toggle('is-paused', paused);
      pauseBtn.innerHTML = paused
        ? '<span class="ms">play_arrow</span> Reanudar'
        : '<span class="ms">pause</span> Pausa';
      pauseBtn.title = paused ? 'Reanudar la simulación' : 'Pausar la simulación (los cambios se congelan)';
    }
    if (paused) {
      if (rafId) cancelAnimationFrame(rafId);
      running = false;
    } else {
      ensureRunning();
    }
    renderReportsList();       // refresca los chips EN CURSO ↔ EN PAUSA
    updateReportCountdowns();
  }
  pauseBtn?.addEventListener('click', () => setPaused(!paused));

  // Movedor manual: adelanta/retrocede el cambio SELECCIONADO (el último inyectado).
  const endScrub = () => { scrubbing = false; last = performance.now(); };
  moverRange?.addEventListener('pointerdown', () => { scrubbing = true; });
  moverRange?.addEventListener('input', () => {
    scrubbing = true;
    const sel = changes.find((c) => c.id === selectedId);
    if (!sel) return;
    if (sel.dropM != null && sel.dropAge < sel.dropDur) {
      sel.dropAge = sel.dropDur;   // mover manual → aterriza el descenso
      recordLanding(sel);          // la caída observada queda registrada igual
    }
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

  // Todo equipo de P1/P2 tiene una zona de toque ampliada. El SVG solo recibe
  // clics sobre píxeles pintados por defecto; el hitbox transparente evita que
  // etiquetas, huecos o pantallas táctiles dejen nodos aparentemente inactivos.
  const prepareNodeHitbox = (node) => {
    if (node.querySelector(':scope > .s2-node-hitbox')) return;
    try {
      const box = node.getBBox();
      if (!Number.isFinite(box.width) || !Number.isFinite(box.height)) return;
      const pad = 14;
      const hitbox = document.createElementNS(SVG_NS, 'rect');
      hitbox.classList.add('s2-node-hitbox');
      hitbox.setAttribute('x', String(box.x - pad));
      hitbox.setAttribute('y', String(box.y - pad));
      hitbox.setAttribute('width', String(box.width + pad * 2));
      hitbox.setAttribute('height', String(box.height + pad * 2));
      hitbox.setAttribute('rx', '8');
      node.insertBefore(hitbox, node.firstChild);
    } catch { /* el SVG puede no estar visible durante un cambio de vista */ }
  };

  // Clic o teclado en un equipo → crea un cambio NUEVO desde ese proceso.
  document.querySelectorAll('[data-pre-stage]').forEach((node) => {
    prepareNodeHitbox(node);
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-label', node.dataset.label || node.textContent.trim());
    const trigger = (e) => {
      e.stopPropagation();
      node.classList.remove('is-injected');
      void node.getBoundingClientRect();
      node.classList.add('is-injected');
      injectPre(node.dataset.preStage, node.dataset.label);
    };
    node.addEventListener('click', trigger);
    node.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      trigger(e);
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
    groups.clear();
    changeSeq = 0;
    selectedId = null;
    if (paused) setPaused(false);
    if (rafId) cancelAnimationFrame(rafId);
    running = false;   // el bucle se reanuda solo al inyectar el próximo cambio
    syncMoverEnabled();
    renderReportsList();
  }
  resetChangesBtn?.addEventListener('click', resetAll);

  syncMoverEnabled();
  renderReportsList();
  // El bucle arranca solo cuando hay un cambio (ensureRunning en inject/injectPre).

  // Pestaña Parámetros: ahora LEE del CSV del HMI (fuente de verdad).
  const paramsApi = initParams({
    speedGetter: () => vPrensa,
    onChange: (params) => { modelParams = params; recomputeActivePre(); renderIntakeTaus(); window.__NOVOPAN_ROUTE_MODEL__?.recompute?.(); },
    onCsvEdit: (key, value) => hmiCsvApi?.updateKey(key, value) ?? false,
    onCsvReset: () => hmiCsvApi?.reloadServer(),
    onCsvDownload: () => hmiCsvApi?.downloadCsv() ?? false,
  });

  /* Recalcula la línea de tiempo de los cambios upstream ACTIVOS cuando cambian
     los parámetros (CSV o edición): conserva el tiempo transcurrido y re-mapea
     los hitos con las nuevas duraciones. */
  function recomputeActivePre() {
    for (const ch of preChanges) {
      const fresh = preMilestonesFor(ch.startAt, ch.branch, modelParams);
      ch.miles = fresh;
      ch.total = fresh[fresh.length - 1].t;
    }
  }

  /* Muestra el τ de residencia REAL de cada encolador (tEncCE fina · tEncCI core)
     en los chips de la zona de entrada, sincronizado con el modelo/CSV del HMI. */
  function renderIntakeTaus() {
    const set = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.textContent = `${Math.round(Number(modelParams?.[key]) || 0)} s`;
    };
    set('intakeTauEncCE', 'p1:tEncCE');
    set('intakeTauEncCI', 'p1:tEncCI');
  }

  // ── HMI en vivo vía CSV local (releído cada 2 s; estático ahora, listo para el servidor) ──
  const hmiStatusEl = document.getElementById('hmiStatus');
  const hmiStatus2 = document.getElementById('hmiStatus2');
  hmiCsvApi = initHmiCsv({
    statusEl: hmiStatusEl,
    connectBtn: document.getElementById('hmiConnectBtn'),
    fileInput: document.getElementById('hmiFileInput'),
    applyData: (data) => {
      paramsApi.applyExternal(data);            // pisa los params del modelo con el CSV
      modelParams = paramsApi.getParams();
      recomputeActivePre();
      renderIntakeTaus();
      if (data.vPrensa != null) setSpeed(data.vPrensa);
      window.__NOVOPAN_ROUTE_MODEL__?.recompute?.();
    },
  });
  // Espeja el pill de estado de la barra en el banner del panel de parámetros.
  if (hmiStatusEl && hmiStatus2) {
    const mirror = () => { hmiStatus2.textContent = hmiStatusEl.textContent; hmiStatus2.className = hmiStatusEl.className; };
    mirror();
    setInterval(mirror, 1000);
  }
  // Botón "Conectar CSV local" del panel de parámetros → mismo picker que el de la barra
  document.getElementById('hmiConnectBtn2')?.addEventListener('click', () => document.getElementById('hmiConnectBtn')?.click());

  renderIntakeTaus();   // pinta el τ real de las encoladoras en los chips de entrada
  selfTest();

  // Modelo de ruta acotado (read-only): expone y registra las predicciones a
  // sensores con las ecuaciones documentadas. No interfiere con la simulación.
  const recomputeRouteModel = () => routeModelDiagnostic(paramsApi.getParams(), vPrensa);
  window.__NOVOPAN_ROUTE_MODEL__ = { recompute: recomputeRouteModel, computeRoute, formatSec, STATUS_LABEL, last: null };
  recomputeRouteModel();
}

/* Diagnóstico en consola: valida que las ecuaciones y los puntos de inyección
   son coherentes (se ve en la consola del navegador, como el selfTest del deck
   de línea). No afecta la UI. */
function selfTest() {
  try {
    // Merge de ambos sets: las masas/flujos de esparcidoras (mass:esp*-zone,
    // _global:F_SL/F_CL) viven en loadParams(); los buffers P1 en loadPart1Params().
    const p = { ...loadParams(), ...loadPart1Params() };
    const d = buildPreDurations(p);
    const finite = Object.values(d).every((v) => Number.isFinite(v) && v >= 0);
    const clOk = STAGE_CONFIG['active-encCI'].startAt === 'activeEncCI';
    const slOk = STAGE_CONFIG['active-encCE'].startAt === 'activeEncCE';
    const espTau = {
      esp1: num(p, 'mass:esp1-zone') / Math.max(.001, num(p, '_global:F_SL') * num(p, '_global:pctSL1') / 100) * 60,
      esp2: num(p, 'mass:esp2-zone') / Math.max(.001, num(p, '_global:F_CL')) * 60,
      esp3: num(p, 'mass:esp3-zone') / Math.max(.001, num(p, '_global:F_SL') * num(p, '_global:pctSL2') / 100) * 60,
    };
    const espOk = Object.values(espTau).every((v) => Number.isFinite(v) && v > 0 && v < 300);
    const mixOk = MIXER_TAU_SEC === 40 && Number(p['p1:tEncCE']) === 40 && Number(p['p1:tEncCI']) === 40;
    const sensorWps = NAMED_WAYPOINTS.filter((w) => w.label.startsWith('Sensor de calidad'));
    const senOk = sensorWps.length === 3 && sensorWps.every((w, i, a) => i === 0 || w.m > a[i - 1].m);
    const ok = finite && clOk && slOk && espOk && mixOk && senOk;
    const msg = `[combined] selfTest: duraciones ${finite ? 'OK' : 'FALLO'} · inyección encolador ${clOk && slOk ? 'OK (nace en la máquina)' : 'FALLO'} · τ esparcidoras ${espOk ? 'OK' : 'FALLO'} · encoladoras 40 s ${mixOk ? 'OK' : 'FALLO'} · sensores 1/2/3 ${senOk ? 'OK' : 'FALLO'}`;
    (ok ? console.info : console.error)(msg, { ...d, ...espTau, sensores: sensorWps.map((w) => w.m) });
  } catch (e) { console.error('[combined] selfTest error', e); }
}

/* ── Modelo de ruta acotado (Silos 5/6 → Sensores 1/2/3) ──────────────
   Puente read-only entre los parámetros HMI en vivo (claves P1) y el
   módulo route-model.js, que implementa las ecuaciones documentadas con
   guardas y estados explícitos. NO altera la simulación visual: sólo
   calcula, expone en window.__NOVOPAN_ROUTE_MODEL__ y registra en consola
   las predicciones de registro y de cada sensor. Así la app "usa" las
   mismas ecuaciones que las pruebas y la documentación. */
const P1_TO_MODEL = {
  'p1:s5_rho': 'silo5.rho', 'p1:s5_V': 'silo5.capacity', 'p1:s5_L': 'silo5.level', 'p1:s5_Fmin': 'silo5.flow',
  'p1:s6_rho': 'silo6.rho', 'p1:s6_V': 'silo6.capacity', 'p1:s6_L': 'silo6.level', 'p1:s6_Fmin': 'silo6.flow',
  'p1:dosG_M': 'dosingCL.mass', 'p1:dosG_F': 'dosingCL.flow',
  'p1:dosF_M': 'dosingSL.mass', 'p1:dosF_F': 'dosingSL.flow',
  'p1:tEncCE': 'mixerCE.tau', 'p1:tEncCI': 'mixerCI.tau',
  'p1:inclF_L': 'inclSL.length', 'p1:inclF_v': 'inclSL.speed',
  'p1:inclG_L': 'inclCL.length', 'p1:inclG_v': 'inclCL.speed',
};

/** Traduce los params P1 en vivo a overrides del route-model. */
function bridgeP1ToModel(p1) {
  const overrides = {};
  if (p1) for (const [src, dst] of Object.entries(P1_TO_MODEL)) {
    if (p1[src] !== undefined && p1[src] !== null && p1[src] !== '') overrides[dst] = p1[src];
  }
  if (p1) {
    overrides['spreader1.mass'] = p1['mass:esp1-zone'];
    overrides['spreader1.flow'] = num(p1, '_global:F_SL') * num(p1, '_global:pctSL1') / 100;
    overrides['spreader2.mass'] = p1['mass:esp2-zone'];
    overrides['spreader2.flow'] = p1['_global:F_CL'];
    overrides['spreader3.mass'] = p1['mass:esp3-zone'];
    overrides['spreader3.flow'] = num(p1, '_global:F_SL') * num(p1, '_global:pctSL2') / 100;
  }
  return overrides;
}

function routeModelDiagnostic(p1params, vPrensa) {
  try {
    const r = computeRoute(bridgeP1ToModel(p1params), { lineSpeed: vPrensa });
    const fmt = (q) => formatSec(q).text;
    console.info(
      `[route-model] v=${vPrensa} m/min · registro ${fmt(r.registration)} · ` +
      `S1 ${fmt(r.sensors.sensor1)} · S2 ${fmt(r.sensors.sensor2)} · S3 ${fmt(r.sensors.sensor3)}`,
      { registro: r.registration, sensores: r.sensors },
    );
    if (window.__NOVOPAN_ROUTE_MODEL__) window.__NOVOPAN_ROUTE_MODEL__.last = r;
    return r;
  } catch (e) { console.error('[route-model] error', e); return null; }
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
