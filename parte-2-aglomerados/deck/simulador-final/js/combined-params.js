/* ============================================================
   NOVOPAN · Parámetros y ecuaciones · Patios → Sensores
   ------------------------------------------------------------
   Cada tarjeta presenta:
     1. ecuación simbólica con unidades,
     2. la misma ecuación con valores del CSV,
     3. resultado final en segundos.

   Los inputs NO escriben al modelo. Solicitan una edición del CSV;
   el parser vuelve a leer el documento y solo entonces actualiza UI
   y simulador. Así existe una sola fuente editable de verdad.
   ============================================================ */

import {
  GLOBAL_PARAMS, getParameterSchema, defaultParams, findNode, STAGE_SEQUENCE,
} from '../../trazabilidad/js/core/process-graph.js';
import {
  tauForNode, transportForNode, flowFor,
} from '../../trazabilidad/js/core/trace-engine.js';
import {
  KIND_BY_KEY, TAG_BY_KEY, TAG_MAP, UNIT_BY_KEY, esSupuesto, registrarOrigenes,
} from './hmi-csv.js';
import { lockParameters, requestParametersAccess } from './params-auth.js';
import { geometryFromParams, validateGeometry } from './line-bridge.js';

export const P1_PARAMS = [
  { key: 'p1:pila1_M', label: 'Masa · pila de aserrín', unit: 'kg', default: 5000 },
  { key: 'p1:pila1_F', label: 'Flujo · pila de aserrín', unit: 'kg/h', default: 7000 },
  { key: 'p1:tDS', label: 'Retención · Clasificador Dynescreen', unit: 's', default: 20 },
  { key: 'p1:tr1', label: 'Transporte · aserrín a Silo 1', unit: 's', default: 40 },
  { key: 'p1:pila2_M', label: 'Masa · pila de chips', unit: 'kg', default: 10000 },
  { key: 'p1:pila2_F', label: 'Flujo · pila de chips', unit: 'kg/h', default: 20000 },
  { key: 'p1:esperaDesv', label: 'Espera · desviador de Flakes', unit: 's', default: 90 },
  { key: 'p1:tr2', label: 'Transporte · Flakes a Silos 2A/2B', unit: 's', default: 45 },
  { key: 'p1:tr3', label: 'Transporte Hombak → Silo 3', unit: 's', default: 60 },

  { key: 'p1:s1_rho', label: 'Densidad · Silo 1', unit: 'kg/m³', default: 271 },
  { key: 'p1:s1_V', label: 'Volumen · Silo 1', unit: 'm³', default: 150, unknown: true },
  { key: 'p1:s1_L', label: 'Nivel · Silo 1', unit: '%', default: 50 },
  { key: 'p1:s1_F', label: 'Flujo de salida · Silo 1', unit: 'kg/h', default: 7000 },
  { key: 'p1:s2_rho', label: 'Densidad · Silo 2A', unit: 'kg/m³', default: 230 },
  { key: 'p1:s2_V', label: 'Volumen · Silo 2A', unit: 'm³', default: 200, unknown: true },
  { key: 'p1:s2_L', label: 'Nivel · Silo 2A', unit: '%', default: 25.4 },
  { key: 'p1:s2_F', label: 'Flujo de salida · Silo 2A', unit: 'kg/h', default: 13990 },
  { key: 'p1:s2b_rho', label: 'Densidad · Silo 2B', unit: 'kg/m³', default: 232 },
  { key: 'p1:s2b_V', label: 'Volumen · Silo 2B', unit: 'm³', default: 200, unknown: true },
  { key: 'p1:s2b_L', label: 'Nivel · Silo 2B', unit: '%', default: 41.5 },
  { key: 'p1:s2b_F', label: 'Flujo de salida · Silo 2B', unit: 'kg/h', default: 13990 },
  { key: 'p1:s3_rho', label: 'Densidad · Silo 3', unit: 'kg/m³', default: 211 },
  { key: 'p1:s3_V', label: 'Volumen · Silo 3', unit: 'm³', default: 250, unknown: true },
  { key: 'p1:s3_L', label: 'Nivel · Silo 3', unit: '%', default: 30 },
  { key: 'p1:s3_F', label: 'Flujo de salida · Silo 3', unit: 'kg/h', default: 8700 },

  { key: 'p1:bk_rho', label: 'Densidad · Dosing Bunker', unit: 'kg/m³', default: 290 },
  { key: 'p1:bk_V', label: 'Volumen · Dosing Bunker', unit: 'm³', default: 40 },
  { key: 'p1:bk_L', label: 'Nivel · Dosing Bunker', unit: '%', default: 55 },
  { key: 'p1:bk_F', label: 'Flujo húmedo · Dosing Bunker', unit: 'kg/h', default: 27005 },
  { key: 'p1:trSec', label: 'Transporte hacia secadero', unit: 's', default: 30 },
  { key: 'p1:tauTambor', label: 'Retención · tambor secadero', unit: 's', default: 900 },

  { key: 'p1:tCriba', label: 'Retención · tamices F/G', unit: 's', default: 8 },
  { key: 'p1:tZar', label: 'Retención · tres zarandas', unit: 's', default: 15 },
  { key: 'p1:tColectCL', label: 'Retención · Colector CL', unit: 's', default: 12 },
  { key: 'p1:tColectSL', label: 'Retención · Colector SL', unit: 's', default: 12 },
  { key: 'p1:tColectOver', label: 'Retención · Colector Partículas Grandes', unit: 's', default: 10 },
  { key: 'p1:tPolvo', label: 'Retención · Colector de Polvo', unit: 's', default: 8 },
  { key: 'p1:tWS1', label: 'Retención · Windsifter 1', unit: 's', default: 10 },
  { key: 'p1:tWS2', label: 'Retención · Windsifter 2', unit: 's', default: 10 },
  { key: 'p1:tWS3', label: 'Retención · Windsifter 3', unit: 's', default: 10 },
  { key: 'p1:tFe', label: 'Retención · imán Fe', unit: 's', default: 4 },
  { key: 'p1:tNeum', label: 'Transporte neumático · línea SL', unit: 's', default: 8 },
  { key: 'p1:tRef1', label: 'Retención · Refinador 1', unit: 's', default: 25 },
  { key: 'p1:tRef2', label: 'Retención · Refinador 2', unit: 's', default: 25 },
  { key: 'p1:tCiclon', label: 'Retención · ciclones', unit: 's', default: 8 },
  { key: 'p1:tClasSL', label: 'Retención · clasificadores', unit: 's', default: 12 },
  { key: 'p1:tReingresoSL', label: 'Transporte · reingreso SL', unit: 's', default: 10 },

  { key: 'p1:s5_rho', label: 'Densidad · Silo 5', unit: 'kg/m³', default: 135 },
  { key: 'p1:s5_V', label: 'Volumen · Silo 5', unit: 'm³', default: 100 },
  { key: 'p1:s5_L', label: 'Nivel · Silo 5', unit: '%', default: 44 },
  { key: 'p1:s5_Fmin', label: 'Flujo de salida · Silo 5', unit: 'kg/min', default: 302 },
  { key: 'p1:s6_rho', label: 'Densidad · Silo 6', unit: 'kg/m³', default: 188 },
  { key: 'p1:s6_V', label: 'Volumen · Silo 6', unit: 'm³', default: 100 },
  { key: 'p1:s6_L', label: 'Nivel · Silo 6', unit: '%', default: 31 },
  { key: 'p1:s6_Fmin', label: 'Flujo de salida · Silo 6', unit: 'kg/min', default: 108 },
  { key: 'p1:s4_rho', label: 'Densidad · Silo 4', unit: 'kg/m³', default: 238 },
  { key: 'p1:s4_V', label: 'Volumen · Silo 4', unit: 'm³', default: 60, unknown: true },
  { key: 'p1:s4_L', label: 'Nivel · Silo 4', unit: '%', default: 30 },
  { key: 'p1:s4_Fmin', label: 'Flujo de salida · Silo 4', unit: 'kg/min', default: 60.2 },
  { key: 'p1:s8_rho', label: 'Densidad · Silo 8', unit: 'kg/m³', default: 238 },
  { key: 'p1:s8_V', label: 'Volumen · Silo 8', unit: 'm³', default: 40, unknown: true },
  { key: 'p1:s8_L', label: 'Nivel · Silo 8', unit: '%', default: 30 },
  { key: 'p1:s8_Fmin', label: 'Flujo de salida · Silo 8', unit: 'kg/min', default: 60.2 },

  // Alias usados por el motor upstream. El CSV sincroniza estos valores con
  // el modelo detallado de Sección 2; no se renderizan como tarjetas duplicadas.
  { key: 'p1:dosG_M', label: 'Masa · dosificación CL', unit: 'kg', default: 25, hidden: true },
  { key: 'p1:dosG_F', label: 'Flujo · dosificación CL', unit: 'kg/min', default: 302, hidden: true },
  { key: 'p1:dosF_M', label: 'Masa · dosificación SL', unit: 'kg', default: 20, hidden: true },
  { key: 'p1:dosF_F', label: 'Flujo · dosificación SL', unit: 'kg/min', default: 108, hidden: true },
  { key: 'p1:tEncCI', label: 'Retención · Encoladora CI', unit: 's', default: 40, hidden: true },
  { key: 'p1:tEncCE', label: 'Retención · Encoladora CE', unit: 's', default: 40, hidden: true },
  { key: 'p1:inclG_L', label: 'Longitud · banda inclinada CL', unit: 'm', default: 68.5, hidden: true },
  { key: 'p1:inclG_v', label: 'Velocidad · banda inclinada CL', unit: 'm/min', default: 96.5, hidden: true },
  { key: 'p1:inclF_L', label: 'Longitud · banda inclinada SL', unit: 'm', default: 64.57, hidden: true },
  { key: 'p1:inclF_v', label: 'Velocidad · banda inclinada SL', unit: 'm/min', default: 99.5, hidden: true },
  { key: 'p1:postPress_L', label: 'Longitud · fin prensa → Sensor 1', unit: 'm', default: 16.4 },
  { key: 'geom:sensor2Offset', label: 'Offset · Sensor 1 → Sensor 2', unit: 'm', default: 0.2 },
  { key: 'geom:sensor3Offset', label: 'Offset · Sensor 1 → Sensor 3', unit: 'm', default: 0.4 },
  { key: 'geom:esp1', label: 'Posición · Esparcidor 1', unit: 'm', default: 6.63 },
  { key: 'geom:esp2', label: 'Posición · Esparcidor 2', unit: 'm', default: 15 },
  { key: 'geom:esp3', label: 'Posición · Esparcidor 3', unit: 'm', default: 22.25 },
  { key: 'geom:magnet', label: 'Posición · Imán', unit: 'm', default: 26.68 },
  { key: 'geom:sprays2', label: 'Posición · Desmoldante #2', unit: 'm', default: 35.99 },
  { key: 'geom:detector', label: 'Posición · Detector metales', unit: 'm', default: 37.69 },
  { key: 'geom:cutters', label: 'Posición · Cortadores de filo', unit: 'm', default: 39.56 },
  { key: 'geom:nose', label: 'Posición · Nariz/rechazo', unit: 'm', default: 44.9 },
  { key: 'geom:vapor', label: 'Posición · Vapor', unit: 'm', default: 46.86 },
  { key: 'geom:prepress', label: 'Posición · Pre-prensa (entrada)', unit: 'm', default: 29.06 },
  { key: 'geom:prepressLen', label: 'Largo · Pre-prensa', unit: 'm', default: 4.69 },
  { key: 'geom:refilaStart', label: 'Inicio · Cuchillos de refila', unit: 'm', default: 78.3 },
  { key: 'geom:refilaEnd', label: 'Fin · Cuchillos de refila', unit: 'm', default: 79.65 },
  { key: 'geom:sawStart', label: 'Inicio · Sierra transversal (carro)', unit: 'm', default: 79.95 },
  { key: 'geom:sawEnd', label: 'Fin · Sierra transversal (salida)', unit: 'm', default: 86.72 },
];

const PARAM_BY_KEY = Object.fromEntries(P1_PARAMS.map((p) => [p.key, p]));

export function defaultPart1Params() {
  return Object.fromEntries(P1_PARAMS.map((p) => [p.key, p.default]));
}

export function loadPart1Params() {
  return defaultPart1Params();
}

export function loadParams() {
  return defaultParams();
}

const P1_STEPS = [
  { id: 'pila-aserrin', group: '01 · Patios y reducción', label: 'Pila de aserrín', type: 'ratio-hour', keys: ['p1:pila1_M', 'p1:pila1_F'] },
  { id: 'molino-chips', group: '01 · Patios y reducción', label: 'Molino Chips', type: 'instant', note: 'Transformación; sin acumulación modelada.' },
  { id: 'dynescreen', group: '01 · Patios y reducción', label: 'Clasificador Dynescreen', type: 'fixed', keys: ['p1:tDS'] },
  { id: 'transp-aserrin', group: '01 · Patios y reducción', label: 'Transporte de aserrín → Silo 1', type: 'fixed', keys: ['p1:tr1'] },
  { id: 'pila-chips', group: '01 · Patios y reducción', label: 'Pila de chips · Piso Móvil 2', type: 'ratio-hour', keys: ['p1:pila2_M', 'p1:pila2_F'] },
  { id: 'molinos-flakes', group: '01 · Patios y reducción', label: 'Molinos Flakes 1 y 2', type: 'instant', note: 'Transformación; espera del desviador y transporte se modelan por separado.' },
  { id: 'desviador-flakes', group: '01 · Patios y reducción', label: 'Espera del desviador Flakes 1/2', type: 'fixed', keys: ['p1:esperaDesv'] },
  { id: 'transp-flakes', group: '01 · Patios y reducción', label: 'Transporte de Flakes → Silos 2A/2B', type: 'fixed', keys: ['p1:tr2'] },
  { id: 'hombak', group: '01 · Patios y reducción', label: 'Hombak U100 + U112', type: 'instant', note: 'Transformación; el transporte a Silo 3 se modela aparte.' },
  { id: 'hombak-s3', group: '01 · Patios y reducción', label: 'Transporte Hombak → Silo 3', type: 'fixed', keys: ['p1:tr3'] },

  { id: 'silo1', group: '02 · Silos verdes', label: 'Silo 1 · Aserrín', type: 'silo-hour', keys: ['p1:s1_rho', 'p1:s1_V', 'p1:s1_L', 'p1:s1_F'] },
  { id: 'silo2a', group: '02 · Silos verdes', label: 'Silo 2A · Flakes', type: 'silo-hour', keys: ['p1:s2_rho', 'p1:s2_V', 'p1:s2_L', 'p1:s2_F'] },
  { id: 'silo2b', group: '02 · Silos verdes', label: 'Silo 2B · Flakes', type: 'silo-hour', keys: ['p1:s2b_rho', 'p1:s2b_V', 'p1:s2b_L', 'p1:s2b_F'] },
  { id: 'silo3', group: '02 · Silos verdes', label: 'Silo 3 · Hombak', type: 'silo-hour', keys: ['p1:s3_rho', 'p1:s3_V', 'p1:s3_L', 'p1:s3_F'] },

  { id: 'bunker', group: '03 · Dosificación y secado', label: 'Dosing Bunker · IMAL', type: 'silo-hour', keys: ['p1:bk_rho', 'p1:bk_V', 'p1:bk_L', 'p1:bk_F'] },
  { id: 'transp-secadero', group: '03 · Dosificación y secado', label: 'Transporte hacia secadero', type: 'fixed', keys: ['p1:trSec'] },
  { id: 'tambor-secadero', group: '03 · Dosificación y secado', label: 'Tambor secadero 1/2', type: 'fixed', keys: ['p1:tauTambor'] },

  { id: 'tamices', group: '04 · Clasificación', label: 'Tamices F/G', type: 'fixed', keys: ['p1:tCriba'] },
  { id: 'zarandas', group: '04 · Clasificación', label: 'Zarandas 1/2/3', type: 'fixed', keys: ['p1:tZar'] },
  { id: 'colector-cl', group: '04 · Clasificación', label: 'Colector CL', type: 'fixed', keys: ['p1:tColectCL'] },
  { id: 'colector-sl', group: '04 · Clasificación', label: 'Colector SL', type: 'fixed', keys: ['p1:tColectSL'] },
  { id: 'colector-pg', group: '04 · Clasificación', label: 'Colector de Partículas Grandes', type: 'fixed', keys: ['p1:tColectOver'] },
  { id: 'colector-polvo', group: '04 · Clasificación', label: 'Colector de Polvo', type: 'fixed', keys: ['p1:tPolvo'] },
  { id: 'windsifter1', group: '04 · Clasificación', label: 'Windsifter 1', type: 'fixed', keys: ['p1:tWS1'] },
  { id: 'windsifter2', group: '04 · Clasificación', label: 'Windsifter 2', type: 'fixed', keys: ['p1:tWS2'] },

  { id: 'windsifter3', group: '05 · Reproceso de partículas grandes', label: 'Windsifter 3', type: 'fixed', keys: ['p1:tWS3'] },
  { id: 'iman-fe', group: '05 · Reproceso de partículas grandes', label: 'Imán Fe', type: 'fixed', keys: ['p1:tFe'] },
  { id: 'transporte-neumatico', group: '05 · Reproceso de partículas grandes', label: 'Transporte neumático · línea SL', type: 'fixed', keys: ['p1:tNeum'] },
  { id: 'refinador1', group: '05 · Reproceso de partículas grandes', label: 'Refinador 1', type: 'fixed', keys: ['p1:tRef1'] },
  { id: 'refinador2', group: '05 · Reproceso de partículas grandes', label: 'Refinador 2', type: 'fixed', keys: ['p1:tRef2'] },
  { id: 'ciclones', group: '05 · Reproceso de partículas grandes', label: 'Ciclones', type: 'fixed', keys: ['p1:tCiclon'] },
  { id: 'clasificadores', group: '05 · Reproceso de partículas grandes', label: 'Clasificadores', type: 'fixed', keys: ['p1:tClasSL'] },
  { id: 'reingreso-sl', group: '05 · Reproceso de partículas grandes', label: 'Reingreso a línea SL', type: 'fixed', keys: ['p1:tReingresoSL'] },

  { id: 'silo5', group: '06 · Silos finales', label: 'Silo 5 · CL/core', type: 'silo-minute', keys: ['p1:s5_rho', 'p1:s5_V', 'p1:s5_L', 'p1:s5_Fmin'] },
  { id: 'silo6', group: '06 · Silos finales', label: 'Silo 6 · SL/capas', type: 'silo-minute', keys: ['p1:s6_rho', 'p1:s6_V', 'p1:s6_L', 'p1:s6_Fmin'] },
  { id: 'silo4', group: '06 · Silos finales', label: 'Silo 4 · Polvo', type: 'silo-minute', keys: ['p1:s4_rho', 'p1:s4_V', 'p1:s4_L', 'p1:s4_Fmin'] },
  { id: 'silo8', group: '06 · Silos finales', label: 'Silo 8 · TVM', type: 'silo-minute', keys: ['p1:s8_rho', 'p1:s8_V', 'p1:s8_L', 'p1:s8_Fmin'] },
  { id: 'quemador', group: '06 · Silos finales', label: 'Quemador · salida de biomasa', type: 'instant', note: 'Salida lateral; no continúa hacia los sensores de calidad.' },
];

const BADGE = {
  'hmi-live': { cls: 'hmi', short: 'HMI' }, hmi: { cls: 'hmi', short: 'HMI' },
  recipe: { cls: 'recipe', short: 'Receta' }, mechanical: { cls: 'mech', short: 'Mecánico' },
  manual: { cls: 'manual', short: 'Manual' }, measured: { cls: 'ok', short: 'Medido' },
  derived: { cls: 'derived', short: 'Calculado' }, estimated: { cls: 'est', short: 'Estimado' },
  est: { cls: 'est', short: 'Estimado' },
  // Se esperaba del HMI, pero ningún tag de WinCC lo publica todavía.
  assumed: { cls: 'assumed', short: 'Supuesto' },
  // Dato de planta que FALTA (el HMI no lo publica en forma usable) → editable
  // a mano hasta conseguirlo. P.ej. masa de tolva del esparcidor: el HMI da el
  // % de llenado, no los kg, y falta la capacidad de la tolva para convertir.
  falta: { cls: 'assumed', short: 'Falta dato' },
};

/* ══ Quién decide si un campo es "HMI": KIND_BY_KEY, nunca la tarjeta ══════
   `process-graph.js` reparte `kindBadge: 'hmi-live'` a TODO speed:/mass: por
   defecto — es el esquema genérico del grafo, no sabe qué publica el HMI. Así
   salían con sello HMI campos que el HMI no tiene: «Velocidad · Banda
   inclinada fina» (en TAG_MAP es `measured`; se barrieron los 3 servidores
   WinCC el 21-jul-2026 y NO existe tag de velocidad de banda inclinada).

   Un sello HMI falso es peor que no poner sello: dice "esto viene de planta"
   sobre un número que escribimos nosotros. La autoridad es la misma que la del
   candado — KIND_BY_KEY — y la etiqueta de la tarjeta solo se usa cuando la
   clave no está en el mapa de tags (campos derivados, sin tag propio). */
function kindReal(key, fallback) {
  /* Declarado HMI pero hoy nadie de planta lo escribe: sale de nuestro
     archivo de defaults. Se muestra como supuesto, no como dato de planta. */
  if (key && esSupuesto(key)) return 'assumed';
  return (key && KIND_BY_KEY[key]) ?? fallback;
}

function badgeHtml(kind) {
  const badge = BADGE[kind] ?? BADGE.estimated;
  return `<span class="badge badge--${badge.cls}">${badge.short}</span>`;
}

const n = (params, key, fallback = 0) => {
  const value = Number(params?.[key] ?? fallback);
  return Number.isFinite(value) ? value : 0;
};
const f = (value, digits = 2) => Number(value).toLocaleString('es-EC', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
const texN = (value, digits = 2) => f(value, digits).replace(',', '{,}');

function p1StepEquation(step, params) {
  const values = step.keys?.map((key) => n(params, key, PARAM_BY_KEY[key]?.default)) ?? [];
  if (step.type === 'ratio-hour') {
    const [mass, flow] = values;
    const seconds = mass > 0 && flow > 0 ? (mass / flow) * 3600 : 0;
    return {
      symbolic: String.raw`\tau=\frac{M\,[\mathrm{kg}]}{F\,[\mathrm{kg\,h^{-1}}]}\cdot 3600\,\mathrm{s\,h^{-1}}`,
      substituted: String.raw`\tau=\frac{${texN(mass)}\,\mathrm{kg}}{${texN(flow)}\,\mathrm{kg\,h^{-1}}}\cdot 3600\,\mathrm{s\,h^{-1}}`,
      seconds,
    };
  }
  if (step.type === 'silo-hour' || step.type === 'silo-minute') {
    const [rho, volume, level, flow] = values;
    const factor = step.type === 'silo-hour' ? 3600 : 60;
    const flowUnit = step.type === 'silo-hour' ? 'kg\\,h^{-1}' : 'kg\\,min^{-1}';
    const timeUnit = step.type === 'silo-hour' ? 's\\,h^{-1}' : 's\\,min^{-1}';
    const seconds = rho > 0 && volume > 0 && level > 0 && flow > 0 ? ((rho * volume * level / 100) / flow) * factor : 0;
    return {
      symbolic: String.raw`\tau=\frac{\rho\,[\mathrm{kg\,m^{-3}}]\;V\,[\mathrm{m^3}]\;\left(L\,[\%]/100\right)}{F\,[\mathrm{${flowUnit}}]}\cdot ${factor}\,\mathrm{${timeUnit}}`,
      substituted: String.raw`\tau=\frac{${texN(rho)}\,\mathrm{kg\,m^{-3}}\cdot ${texN(volume)}\,\mathrm{m^3}\cdot(${texN(level)}\,\%/100)}{${texN(flow)}\,\mathrm{${flowUnit}}}\cdot ${factor}\,\mathrm{${timeUnit}}`,
      seconds,
    };
  }
  if (step.type === 'fixed') {
    const seconds = Math.max(0, values[0] ?? 0);
    return {
      symbolic: String.raw`\tau=t\,[\mathrm{s}]`,
      substituted: String.raw`\tau=${texN(seconds)}\,\mathrm{s}`,
      seconds,
    };
  }
  return {
    symbolic: String.raw`t_{\mathrm{transformacion}}\approx 0\,\mathrm{s}`,
    substituted: String.raw`t_{\mathrm{modelado}}=0\,\mathrm{s}`,
    seconds: 0,
  };
}

function graphNodeEquation(node, speed, params) {
  const tau = tauForNode(node, params);
  const transport = transportForNode(node, speed, params);
  const seconds = tau + transport;
  if (node.model === 'bin' || node.model === 'hopper' || node.model === 'cstr') {
    const mass = n(params, `mass:${node.id}`, node.holdupKg);
    const flow = flowFor(node, params);
    const hasNodeFlow = n(params, `flow:${node.id}`) > 0;
    const flowName = hasNodeFlow
      ? 'F_{descarga}'
      : (({ F_SL: 'F_{SL}', F_CL: 'F_{CL}', F_SL1: 'F_{SL}\,p_{SL1}/100', F_SL2: 'F_{SL}\,p_{SL2}/100' })[node.flowSource] ?? 'F');
    return {
      symbolic: String.raw`\tau=\frac{M\,[\mathrm{kg}]}{(${flowName})\,[\mathrm{kg\,min^{-1}}]}\cdot60\,\mathrm{s\,min^{-1}}`,
      substituted: String.raw`\tau=\frac{${texN(mass)}\,\mathrm{kg}}{${texN(flow)}\,\mathrm{kg\,min^{-1}}}\cdot60\,\mathrm{s\,min^{-1}}`,
      seconds,
    };
  }
  if (node.model === 'fixed') {
    const fixed = n(params, `ret:${node.id}`, node.retentionSec);
    return {
      symbolic: String.raw`\tau=t\,[\mathrm{s}]`,
      substituted: String.raw`\tau=${texN(fixed)}\,\mathrm{s}`,
      seconds,
    };
  }
  const length = n(params, `len:${node.id}`, node.lengthM);
  const beltSpeed = n(params, `speed:${node.id}`, node.beltSpeedMperMin) || speed;
  const speedSymbol = node.beltSpeedMperMin ? 'v_{banda}' : 'v_{prensa}';
  return {
    symbolic: String.raw`t=\frac{L\,[\mathrm{m}]}{${speedSymbol}\,[\mathrm{m\,min^{-1}}]}\cdot60\,\mathrm{s\,min^{-1}}`,
    substituted: String.raw`t=\frac{${texN(length)}\,\mathrm{m}}{${texN(beltSpeed)}\,\mathrm{m\,min^{-1}}}\cdot60\,\mathrm{s\,min^{-1}}`,
    seconds,
  };
}

function renderMath(element, tex, displayMode = true) {
  if (!element) return;
  if (window.katex?.render) {
    window.katex.render(tex, element, { displayMode, throwOnError: false, strict: 'ignore', trust: false, output: 'htmlAndMathml' });
  } else {
    element.textContent = tex;
  }
}

function renderEquation(card, equation) {
  renderMath(card.querySelector('[data-equation-symbolic]'), equation.symbolic);
  renderMath(card.querySelector('[data-equation-substituted]'), equation.substituted);
  renderMath(card.querySelector('[data-equation-result]'), String.raw`=\ ${texN(equation.seconds, 1)}\ \mathrm{s}`);
}

function fieldHtml({ key, label, unit, unknown = false, kind }) {
  const tag = TAG_BY_KEY[key];
  /* PRODUCCIÓN: lo que viene VIVO del HMI no se edita desde el panel — se
     muestra tal cual llega del CSV de Sistemas. Editable queda solo lo local
     (constantes 'est'/'measured', que no tocan el CSV). OJO: el candado se
     decide por KIND_BY_KEY (la autoridad), NO por el `kind` recibido, que en
     las tarjetas de Sección 2 es solo la etiqueta visual ('hmi-live'…). */
  const hmiLock = KIND_BY_KEY[key] === 'hmi';
  const disabled = !tag || hmiLock;
  return `
    <label class="equation-field${hmiLock ? ' equation-field--hmi-lock' : ''}"${hmiLock ? ' title="Dato vivo del HMI · solo lectura"' : ''}>
      <span class="equation-field__label">${label} ${badgeHtml(kindReal(key, kind))}</span>
      <span class="equation-field__control">
        <input type="number" step="any" min="0" data-key="${key}" data-csv-tag="${tag ?? ''}"
          data-label="${String(label).replace(/"/g, '&quot;')}" data-unit="${unit ?? ''}"
          ${unknown ? 'data-unknown="1"' : ''} ${disabled ? 'disabled' : ''}>
        <span>${unit}</span>
      </span>
      ${hmiLock ? `<code>${tag ?? ''}</code><small class="equation-field__lock"><span class="ms">lock</span> dato vivo del HMI · solo lectura</small>`
    : (tag ? `<code>${tag}</code>` : '<small>Valor derivado</small>')}
    </label>`;
}

function cardShell({ label, subtitle, kind, stepId, nodeId, fields = [], note = '' }) {
  const card = document.createElement('article');
  card.className = 'equation-card';
  if (stepId) card.dataset.stepId = stepId;
  if (nodeId) card.dataset.nodeId = nodeId;
  card.innerHTML = `
    <header class="equation-card__header">
      <div><span class="equation-card__eyebrow">${subtitle}</span><h4>${label}</h4></div>
      ${badgeHtml(kind)}
    </header>
    <div class="equation-card__math">
      <div class="equation-card__row equation-card__row--symbolic" data-equation-symbolic></div>
      <div class="equation-card__arrow" aria-hidden="true">↓</div>
      <div class="equation-card__row equation-card__row--substituted" data-equation-substituted></div>
      <div class="equation-card__result" data-equation-result></div>
    </div>
    ${note ? `<p class="equation-card__note">${note}</p>` : ''}
    <div class="equation-card__fields">${fields.join('')}</div>`;
  return card;
}

function kindForKeys(keys) {
  const kinds = (keys ?? []).map((key) => KIND_BY_KEY[key]);
  if (kinds.includes('est')) return 'estimated';
  if (kinds.includes('measured')) return 'measured';
  return kinds.length ? 'hmi-live' : 'derived';
}

function renderP1Step(step, params) {
  const fields = (step.keys ?? []).map((key) => {
    const p = PARAM_BY_KEY[key];
    return fieldHtml({ ...p, key, kind: KIND_BY_KEY[key] });
  });
  const card = cardShell({
    label: step.label,
    subtitle: step.group,
    kind: kindForKeys(step.keys),
    stepId: step.id,
    fields,
    note: step.note,
  });
  renderEquation(card, p1StepEquation(step, params));
  return card;
}

function nodeFieldDefs(node, stageParams) {
  const defs = stageParams.filter((p) => p.type !== 'buffer').map((p) => ({ key: p.key, label: p.label, unit: p.unit, kind: p.kindBadge }));
  const add = (key, label, unit, kind = 'hmi-live') => {
    if (!defs.some((p) => p.key === key)) defs.push({ key, label, unit, kind });
  };
  const nodeFlowKey = `flow:${node.id}`;
  if (TAG_BY_KEY[nodeFlowKey]) add(nodeFlowKey, 'Flujo de descarga', 'kg/min');
  else if (node.flowSource === 'F_SL') add('_global:F_SL', 'Flujo total SL', 'kg/min');
  else if (node.flowSource === 'F_CL') add('_global:F_CL', 'Flujo CL', 'kg/min');
  else if (node.flowSource === 'F_SL1') {
    add('_global:F_SL', 'Flujo total SL', 'kg/min');
    add('_global:pctSL1', 'Proporción SL1', '%', 'recipe');
  }
  else if (node.flowSource === 'F_SL2') {
    add('_global:F_SL', 'Flujo total SL', 'kg/min');
    add('_global:pctSL2', 'Proporción SL2', '%', 'recipe');
  }
  if ((node.lengthM ?? 0) > 0 && !node.beltSpeedMperMin) add('v_prensa', 'Velocidad de prensa', 'm/min');
  return defs;
}

function renderGraphStage(stage, speed, params) {
  const node = findNode(stage.nodeId);
  if (!node) return null;
  const label = STAGE_SEQUENCE.find((s) => s.id === stage.nodeId)?.label ?? node.label;
  const fields = nodeFieldDefs(node, stage.params).map((p) => fieldHtml(p));
  const sourceKind = node.source?.kind ?? 'estimated';
  const sourceNote = ['estimated', 'manual'].includes(sourceKind)
    ? 'Tiempo estimado pendiente de validar en planta.'
    : 'Valores actuales leídos del CSV activo; las unidades y el resultado se recalculan automáticamente.';
  const card = cardShell({
    label,
    subtitle: stage.group,
    kind: sourceKind,
    nodeId: node.id,
    fields,
    note: sourceNote,
  });
  renderEquation(card, graphNodeEquation(node, speed, params));
  return card;
}

function renderOverview(params, speed) {
  const card = document.createElement('section');
  card.className = 'equation-overview';
  card.innerHTML = `
    <div>
      <span class="equation-overview__eyebrow">MODELO DE TIEMPO · PATIOS → SENSORES</span>
      <h4>Una ecuación verificable para cada etapa</h4>
      <p>Cada valor visible proviene del CSV activo. Las ecuaciones usan <strong>×3600</strong> para kg/h y <strong>×60</strong> para kg/min o m/min.</p>
    </div>
    <div class="equation-overview__math" data-equation-total></div>`;
  renderMath(card.querySelector('[data-equation-total]'), String.raw`t_{total}=\sum\tau_{almacenamiento}+\sum t_{proceso}+\max(t_{SL1},t_{CL},t_{SL2})+\sum\frac{L_i}{v_{prensa}}\,60`);
  return card;
}

/* ── Ecuación de cierre ─────────────────────────────────────
   Esta es la ruta física completa y simultánea desde Silos 5/6 hasta
   el Sensor 3. Las tres capas viajan en paralelo: el registro sólo puede
   empezar cuando llega la última. Por eso el núcleo de la ecuación es max().
   No se suman las tres capas entre sí (sería doble conteo).
   Cada símbolo se resuelve desde el mismo objeto params que llega del CSV. */
function finalRouteEquation(params, speed) {
  const rho5 = n(params, 'p1:s5_rho', 135);
  const v5 = n(params, 'p1:s5_V', 100);
  const l5 = n(params, 'p1:s5_L', 44);
  const f5 = n(params, 'p1:s5_Fmin', 302);
  const rho6 = n(params, 'p1:s6_rho', 188);
  const v6 = n(params, 'p1:s6_V', 100);
  const l6 = n(params, 'p1:s6_L', 31);
  const f6 = n(params, 'p1:s6_Fmin', 108);
  const mDosCL = n(params, 'p1:dosG_M', 25);
  const fDosCL = n(params, 'p1:dosG_F', f5);
  const mDosSL = n(params, 'p1:dosF_M', 20);
  const fDosSL = n(params, 'p1:dosF_F', f6);
  const tCI = n(params, 'p1:tEncCI', 40);
  const tCE = n(params, 'p1:tEncCE', 40);
  const lInclCL = n(params, 'p1:inclG_L', 68.5);
  const vInclCL = n(params, 'p1:inclG_v', 96.5);
  const lInclSL = n(params, 'p1:inclF_L', 64.57);
  const vInclSL = n(params, 'p1:inclF_v', 99.5);
  const mEsp1 = n(params, 'mass:esp1-zone', 12.5);
  const mEsp2 = n(params, 'mass:esp2-zone', 40);
  const mEsp3 = n(params, 'mass:esp3-zone', 15);
  const fSL = n(params, '_global:F_SL', 147.6);
  const fCL = n(params, '_global:F_CL', 118);
  const pSL1 = n(params, '_global:pctSL1', 47.1);
  const pSL2 = n(params, '_global:pctSL2', 52.9);
  const lSensor3 = geometryFromParams(params).sensor3M;
  const vPrensa = n(params, 'v_prensa', speed);

  const silo = (rho, volume, level, flow) => flow > 0 ? rho * volume * level / 100 / flow * 60 : 0;
  const dosing = (mass, flow) => flow > 0 ? mass / flow * 60 : 0;
  const incline = (length, beltSpeed) => beltSpeed > 0 ? length / beltSpeed * 60 : 0;
  const spreader = (mass, flow) => flow > 0 ? mass / flow * 60 : 0;
  const fine = silo(rho6, v6, l6, f6) + dosing(mDosSL, fDosSL) + tCE + incline(lInclSL, vInclSL);
  const coarse = silo(rho5, v5, l5, f5) + dosing(mDosCL, fDosCL) + tCI + incline(lInclCL, vInclCL);
  const sl1 = fine + spreader(mEsp1, fSL * pSL1 / 100);
  const cl = coarse + spreader(mEsp2, fCL);
  const sl2 = fine + spreader(mEsp3, fSL * pSL2 / 100);
  const registration = Math.max(sl1, cl, sl2);
  const sensorTravel = vPrensa > 0 ? lSensor3 / vPrensa * 60 : 0;

  const rawFine = String.raw`\frac{\rho_6V_6(L_6/100)}{F_6}\,60+\frac{M_{dos,SL}}{F_{dos,SL}}\,60+t_{CE}+\frac{L_{inc,SL}}{v_{inc,SL}}\,60`;
  const rawCoarse = String.raw`\frac{\rho_5V_5(L_5/100)}{F_5}\,60+\frac{M_{dos,CL}}{F_{dos,CL}}\,60+t_{CI}+\frac{L_{inc,CL}}{v_{inc,CL}}\,60`;
  return {
    symbolic: String.raw`\displaystyle t_{tot}^{\mathrm{S5/S6\rightarrow S3}}=\max\!\left(\underbrace{${rawFine}+\frac{M_{ESP1}}{F_{SL}(p_{SL1}/100)}\,60}_{t_{SL1}},\;\underbrace{${rawCoarse}+\frac{M_{ESP2}}{F_{CL}}\,60}_{t_{CL}},\;\underbrace{${rawFine}+\frac{M_{ESP3}}{F_{SL}(p_{SL2}/100)}\,60}_{t_{SL2}}\right)+\frac{L_{S3}}{v_{prensa}}\,60`,
    substituted: String.raw`\displaystyle t_{tot}=\max\!\left(\begin{aligned}&\frac{${texN(rho6)}\,\mathrm{kg\,m^{-3}}\cdot${texN(v6)}\,\mathrm{m^3}\cdot(${texN(l6)}\,\%/100)}{${texN(f6)}\,\mathrm{kg\,min^{-1}}}\,60+\frac{${texN(mDosSL)}\,\mathrm{kg}}{${texN(fDosSL)}\,\mathrm{kg\,min^{-1}}}\,60+${texN(tCE)}\,\mathrm{s}+\frac{${texN(lInclSL)}\,\mathrm{m}}{${texN(vInclSL)}\,\mathrm{m\,min^{-1}}}\,60+\frac{${texN(mEsp1)}\,\mathrm{kg}}{${texN(fSL)}\,\mathrm{kg\,min^{-1}}\cdot(${texN(pSL1)}\,\%/100)}\,60,\\&\frac{${texN(rho5)}\,\mathrm{kg\,m^{-3}}\cdot${texN(v5)}\,\mathrm{m^3}\cdot(${texN(l5)}\,\%/100)}{${texN(f5)}\,\mathrm{kg\,min^{-1}}}\,60+\frac{${texN(mDosCL)}\,\mathrm{kg}}{${texN(fDosCL)}\,\mathrm{kg\,min^{-1}}}\,60+${texN(tCI)}\,\mathrm{s}+\frac{${texN(lInclCL)}\,\mathrm{m}}{${texN(vInclCL)}\,\mathrm{m\,min^{-1}}}\,60+\frac{${texN(mEsp2)}\,\mathrm{kg}}{${texN(fCL)}\,\mathrm{kg\,min^{-1}}}\,60,\\&\frac{${texN(rho6)}\,\mathrm{kg\,m^{-3}}\cdot${texN(v6)}\,\mathrm{m^3}\cdot(${texN(l6)}\,\%/100)}{${texN(f6)}\,\mathrm{kg\,min^{-1}}}\,60+\frac{${texN(mDosSL)}\,\mathrm{kg}}{${texN(fDosSL)}\,\mathrm{kg\,min^{-1}}}\,60+${texN(tCE)}\,\mathrm{s}+\frac{${texN(lInclSL)}\,\mathrm{m}}{${texN(vInclSL)}\,\mathrm{m\,min^{-1}}}\,60+\frac{${texN(mEsp3)}\,\mathrm{kg}}{${texN(fSL)}\,\mathrm{kg\,min^{-1}}\cdot(${texN(pSL2)}\,\%/100)}\,60\end{aligned}\right)+\frac{${texN(lSensor3)}\,\mathrm{m}}{${texN(vPrensa)}\,\mathrm{m\,min^{-1}}}\,60`,
    seconds: registration + sensorTravel,
    winner: cl >= sl1 && cl >= sl2 ? 'CL · core' : (sl1 >= sl2 ? 'SL1 · inferior' : 'SL2 · superior'),
  };
}

function renderFinalRouteTotal(params, speed) {
  const equation = finalRouteEquation(params, speed);
  const card = document.createElement('section');
  card.className = 'equation-total';
  card.dataset.totalEquation = 'route-sensor3';
  card.innerHTML = `
    <header class="equation-total__header">
      <div><span>ECUACIÓN DE CIERRE · RUTA EN PARALELO</span><h3>Tiempo total · Silos 5/6 → Sensor de calidad 3</h3></div>
      <div class="equation-total__badge">RUTA CRÍTICA <strong data-total-winner></strong></div>
    </header>
    <div class="equation-total__body">
      <div class="equation-total__label">Modelo con variables físicas</div>
      <div class="equation-total__math equation-total__math--symbolic" data-total-symbolic></div>
      <div class="equation-total__divider"><span>VALORES ACTUALES DEL CSV</span></div>
      <div class="equation-total__math equation-total__math--substituted" data-total-substituted></div>
    </div>
    <footer class="equation-total__result"><span>t<sub>tot</sub> = registro de la última capa + recorrido hasta Sensor 3</span><strong data-total-result></strong></footer>`;
  renderFinalRouteTotalValues(card, equation);
  return card;
}

function renderFinalRouteTotalValues(card, equation) {
  renderMath(card.querySelector('[data-total-symbolic]'), equation.symbolic);
  renderMath(card.querySelector('[data-total-substituted]'), equation.substituted);
  renderMath(card.querySelector('[data-total-result]'), String.raw`=\ ${texN(equation.seconds, 1)}\ \mathrm{s}`);
  const winner = card.querySelector('[data-total-winner]');
  if (winner) winner.textContent = equation.winner;
}

function renderGlobals(params, speed) {
  const card = document.createElement('section');
  card.className = 'globals-card globals-card--csv';
  const defs = [
    { key: 'v_prensa', label: 'Velocidad de prensa', unit: 'm/min', kind: 'hmi-live' },
    ...GLOBAL_PARAMS.map((p) => ({ key: p.key, label: p.label, unit: p.unit, kind: p.kind })),
  ];
  card.innerHTML = `
    <header class="globals-card__hd"><h4>Variables maestras del CSV</h4>
      <p class="globals-card__sub">Al editar un campo se modifica el documento CSV activo y el simulador lo vuelve a leer.</p></header>
    <div class="equation-card__fields">${defs.map((p) => fieldHtml(p)).join('')}</div>`;
  return card;
}

const GEOMETRY_KEYS = [
  'p1:postPress_L', 'geom:sensor2Offset', 'geom:sensor3Offset',
  'geom:esp1', 'geom:esp2', 'geom:esp3', 'geom:magnet', 'geom:sprays2',
  'geom:detector', 'geom:cutters', 'geom:nose', 'geom:vapor', 'geom:prepress', 'geom:prepressLen',
  'geom:refilaStart', 'geom:refilaEnd', 'geom:sawStart', 'geom:sawEnd',
];

/* ── Mediciones del plano (Dieffenbacher) · fuente de verdad ──
   Valores extraídos del PlanoGeneral2022.dwg (bloque 000-Refernce-Point,
   residual < 1 mm) + mediciones de campo validadas con la prueba de papel
   del 21-jul-2026 (residuales ≤ ±3 s). Editar cualquiera de estas claves
   pide confirmación explícita. Detalle: deck/_mediciones-plano/. */
const PLANO_PROTECTED = new Set([
  ...GEOMETRY_KEYS,
  'len:white', 'len:red', 'len:press',
  'p1:inclF_L', 'p1:inclG_L', 'p1:inclF_v', 'p1:inclG_v',
]);
const PLANO_ALERT = '⚠️ MEDICIÓN DE LOS PLANOS\n\nEste valor proviene de los planos Dieffenbacher o de mediciones validadas en campo (prueba de papel 21-jul-2026).\n\n¿Seguro que quieres cambiarlo?';

/* ── Confirmación de CUALQUIER cambio de variable ───────────────────────
   Esta pantalla vive en planta y las constantes que se editan aquí mueven
   los tiempos de todo el modelo: un número cambiado por accidente (o por un
   dedo apoyado en el teclado) desplaza las horas de todos los reportes y
   nadie se entera hasta que no cuadran. Por eso TODA edición pide
   confirmación nombrando el parámetro, su valor anterior, el nuevo y qué
   pasa si se acepta — no solo las claves del plano, que era el único caso
   protegido antes.

   Se confirma al SALIR del campo (evento `change`), nunca por tecla: un
   diálogo por pulsación sería inusable. */
function textoConfirmacion(key, label, unit, prev, value) {
  const enc = `${label}${unit ? ` (${unit})` : ''}`;
  const antes = Number.isFinite(prev) ? `${prev}` : '—';
  if (PLANO_PROTECTED.has(key)) {
    return `${PLANO_ALERT}\n\n${enc}\n${antes} → ${value}`;
  }
  return '⚠️ VAS A CAMBIAR UNA VARIABLE DEL MODELO\n\n'
    + `${enc}\n${antes} → ${value}\n\n`
    + 'Esto recalcula los tiempos de recorrido y las horas previstas de TODOS los cambios en curso, '
    + 'y queda guardado en esta computadora hasta que se restablezcan las constantes.\n\n'
    + '¿Confirmas el cambio?';
}
const PLANO_MEDS = [
  ['Eje · báscula de manta (matscale)', '26.20 m', 'plano'],
  ['Eje · salida pre-prensa (CL Pre-Press)', '33.81 m', 'plano (modelo: 33.75)'],
  ['Eje · tolva de rechazo / nariz', '44.64 m', 'plano (modelo: 44.90)'],
  ['Tambor de ENTRADA de prensa', '52.67 m', 'plano'],
  ['Banda roja (nariz → tambor)', '7.67 m', 'plano (antes 10 m)'],
  ['Prensa tambor a tambor', '18.93 m', 'plano'],
  ['Marco 1 (2.43 m tras el tambor)', '55.10 m abs', 'plano + flexómetro'],
  ['Fin de prensa (tambor salida) · ANCLA', '71.60 m', 'plano = campo'],
  ['Grupo de sierras (cuerpo)', '78.3 – 85.6 m', 'plano = campo jul'],
  ['Sierra transversal · carro (30 cm tras refila)', '79.95 – 86.72 m', 'campo 21-jul'],
  ['Sierra transversal · eje de la cuchilla', '85.57 m', 'plano + operador (32 m)'],
  ['Sensor 1 de calidad', '≈ 88.00 m', 'calibración campo · validado 21-jul'],
  ['Inclinada fina 31.170 (proy. horizontal)', '38.35 m', 'plano'],
  ['Banda distribución SL2 (poleas 30hp)', '16.42 m', 'plano'],
  ['Brazo oscilatorio (E1 = E2 = E3)', '6.0 m', 'campo 21-jul'],
  ['Ruta fina total hasta brazo E3 (SL2)', '64.57 m', 'campo = suma plano'],
  ['Ruta fina hasta brazo E1 (SL1, sin distribución)', '48.15 m', 'derivada — pendiente en modelo'],
  ['Inclinada gruesa 31.270 (proy. horizontal)', '38.35 m', 'plano'],
  ['Ruta gruesa total hasta brazo E2 (CL)', '68.5 m', 'campo'],
];

function renderPlanoMeds() {
  const wrap = document.createElement('details');
  wrap.className = 's2-p1-params plano-meds';
  wrap.innerHTML = `
    <summary><span class="ms">architecture</span> Mediciones del plano (Dieffenbacher) — fuente de verdad</summary>
    <section class="globals-card globals-card--csv">
      <header class="globals-card__hd"><h4>Valores extraídos del PlanoGeneral2022.dwg + campo validado</h4>
        <p class="globals-card__sub">Sistema de estaciones del fabricante (residual &lt; 1 mm) anclado en fin de prensa = 71.60 m.
        Validado con la prueba de papel del 21-jul-2026 (residuales ≤ ±3 s en 63 m).
        Estos valores alimentan la calibración física; cambiarlos pide confirmación.</p></header>
      <table class="plano-meds__table" style="width:100%;border-collapse:collapse;font-size:.86rem">
        ${PLANO_MEDS.map(([l, v, f]) => `<tr style="border-bottom:1px solid rgba(128,128,128,.25)">
          <td style="padding:.28rem .4rem">${l}</td>
          <td style="padding:.28rem .4rem;text-align:right;font-weight:700;white-space:nowrap">${v}</td>
          <td style="padding:.28rem .4rem;opacity:.75;white-space:nowrap">${f}</td></tr>`).join('')}
      </table>
    </section>`;
  return wrap;
}

function renderGeometryCalibration(params) {
  const geometry = geometryFromParams(params);
  const errors = validateGeometry(geometry);
  const card = document.createElement('section');
  card.className = 'globals-card globals-card--csv geometry-card';
  card.innerHTML = `
    <header class="globals-card__hd"><h4>Calibración física de la línea</h4>
      <p class="globals-card__sub">Todos los valores están medidos desde el inicio de formación. Los cambios actualizan regla, equipos, tiempos y sensores.</p></header>
    <div class="equation-card__fields">${GEOMETRY_KEYS.map((key) => fieldHtml(PARAM_BY_KEY[key])).join('')}</div>
    <div class="geometry-validation ${errors.length ? 'is-error' : 'is-ok'}" id="geometryValidation">
      ${errors.length ? errors.join(' · ') : `Coherente · fin prensa ${geometry.pressEndM.toFixed(2)} m · S1 ${geometry.sensor1M.toFixed(2)} m · S2 ${geometry.sensor2M.toFixed(2)} m · S3 ${geometry.sensor3M.toFixed(2)} m`}
    </div>`;
  return card;
}

/* ── Constantes del modelo: almacén LOCAL, no CSV ───────────────────────
   Todo lo que NO se lee del HMI (kind 'est' o 'measured': longitudes de
   bandas, volúmenes de silos, posiciones/geometría, tiempos estimados de la
   Sección 1) se guarda en localStorage y se aplica ENCIMA del CSV: editarlo
   no toca el documento CSV, no detiene el polling en vivo y PERSISTE para
   siempre en este equipo. Un tag con alias (p.ej. INCL_CL_L_M ↔ p1:inclG_L
   y len:incl-thick) se guarda con TODOS sus alias para que ninguna vía lo
   pise. */
const P1_LOCAL_KEY = 'novopan.p1Overrides';
const isLocalConstant = (key) => {
  const kind = KIND_BY_KEY[key];
  return kind === 'est' || kind === 'measured';
};
const aliasesOf = (key) => TAG_MAP[TAG_BY_KEY[key]]?.keys ?? [key];

function loadP1Overrides() {
  try { return JSON.parse(localStorage.getItem(P1_LOCAL_KEY) || '{}') || {}; }
  catch { return {}; }
}

export function initParams({ speedGetter, onChange, onCsvEdit, onCsvReset }) {
  const speed = speedGetter ?? (() => 14.5);
  const p1Overrides = loadP1Overrides();
  let params = { ...defaultParams(), ...defaultPart1Params(), v_prensa: speed(), ...p1Overrides };
  let built = false;

  function saveP1Overrides() {
    try { localStorage.setItem(P1_LOCAL_KEY, JSON.stringify(p1Overrides)); } catch { /* sin localStorage */ }
  }

  const grid = document.getElementById('paramsGridTab');
  const constantsGrid = document.getElementById('constantsGridTab');
  let constantsBuilt = false;
  const feedbackEl = document.getElementById('saveFeedback');
  const tabLinea = document.getElementById('tabLinea');
  const tabParams = document.getElementById('tabParams');
  const lineaControls = document.getElementById('lineaControls');
  const canvas = document.getElementById('canvasScroll');
  const legend = document.getElementById('lineaLegend');
  const panelParams = document.getElementById('panelParams');
  let feedbackTimer = 0;

  function showFeedback(message) {
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.classList.add('is-visible');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedbackEl.classList.remove('is-visible'), 2600);
  }

  function bindInputs(root = grid) {
    root.querySelectorAll('input[data-key]').forEach((input) => {
      const key = input.dataset.key;
      input.value = params[key] ?? '';
      // PRODUCCIÓN: los campos HMI son solo lectura — se muestran, no se atan.
      if (input.disabled) return;
      const commitToCsv = () => {
        if (input.value.trim() === '') return;
        // Cinturón y tirantes: aunque alguien re-habilite el input a mano,
        // un dato vivo del HMI jamás se escribe desde el panel.
        if (KIND_BY_KEY[key] === 'hmi') { input.value = params[key] ?? ''; return; }
        const value = Number(input.value);
        if (!Number.isFinite(value) || value < 0) {
          input.value = params[key] ?? '';
          showFeedback('Valor inválido; el CSV no cambió.');
          return;
        }
        /* TODA variable pide confirmación, no solo las del plano: esta
           pantalla está en planta y un número tocado sin querer mueve las
           horas previstas de todos los cambios en curso. */
        const prev = Number(params[key]);
        if (!Number.isFinite(prev) || Math.abs(prev - value) > 1e-9) {
          const meta = PARAM_BY_KEY[key];
          const aviso = textoConfirmacion(
            key,
            input.dataset.label || meta?.label || key,
            input.dataset.unit || meta?.unit || UNIT_BY_KEY[key] || '',
            prev, value,
          );
          if (!window.confirm(aviso)) {
            input.value = params[key] ?? '';
            showFeedback(PLANO_PROTECTED.has(key)
              ? 'Cambio cancelado — medición de los planos.'
              : 'Cambio cancelado; nada se modificó.');
            return;
          }
        }
        // Constantes (longitudes, volúmenes, geometría, tiempos estimados):
        // almacén local persistente, sin tocar el CSV ni frenar su polling.
        // Se guardan TODOS los alias del tag.
        if (isLocalConstant(key)) {
          for (const alias of aliasesOf(key)) {
            p1Overrides[alias] = value;
            params[alias] = value;
            [grid, constantsGrid].forEach((root) => root?.querySelectorAll(`input[data-key="${CSS.escape(alias)}"]`).forEach((other) => {
              if (other !== input && document.activeElement !== other) other.value = value;
            }));
          }
          saveP1Overrides();
          refreshEquations();
          onChange?.(params);
          showFeedback('Constante guardada en este equipo (persistente; no viene del HMI).');
          return;
        }
        const ok = onCsvEdit?.(key, value);
        if (!ok) input.value = params[key] ?? '';
        showFeedback(ok ? `CSV actualizado · ${input.dataset.csvTag}` : 'Este valor no tiene un tag CSV editable.');
      };
      /* SIEMPRE en 'change' (al salir del campo o con Enter), nunca en
         'input': con confirmación en cada tecla, escribir "12.5" abriría
         cuatro diálogos. */
      input.addEventListener('change', commitToCsv);
      input.addEventListener('change', () => {
        if (input.value.trim() === '') input.value = params[key] ?? '';
      });
    });
  }

  /* El dropdown de parámetros de la Sección 1 sigue al switch: apagada =
     colapsado · encendida = expandido. Después el usuario puede abrirlo o
     cerrarlo a mano cuando quiera. */
  function syncP1WrapOpen() {
    const wrap = document.getElementById('p1ParamsWrap');
    if (wrap) wrap.open = !document.documentElement.classList.contains('sec1-off');
  }
  document.getElementById('sec1Toggle')?.addEventListener('change', () => setTimeout(syncP1WrapOpen, 0));

  // Borra TODAS las constantes locales (vuelven los defaults del modelo y lo
  // que traiga el CSV en la próxima lectura).
  document.getElementById('resetP1LocalBtn')?.addEventListener('click', () => {
    const defs = { ...defaultParams(), ...defaultPart1Params() };
    for (const k of Object.keys(p1Overrides)) {
      if (defs[k] !== undefined) params[k] = defs[k];
      delete p1Overrides[k];
    }
    saveP1Overrides();
    if (built) build();
    if (constantsBuilt) buildConstants();
    refreshEquations();
    onChange?.(params);
    showFeedback('Constantes locales restablecidas a los valores por defecto.');
  });

  function build() {
    const v = speed();
    grid.innerHTML = '';
    grid.appendChild(renderOverview(params, v));
    grid.appendChild(renderGlobals(params, v));

    /* Los grupos 01–06 son la Sección 1 (preparación). Viven dentro de un
       <details>: con la Sección 1 apagada arranca COLAPSADO para que las
       ecuaciones activas de la Sección 2 se lean limpias — pero siempre se
       puede abrir a mano. Con la Sección 1 encendida arranca expandido. */
    const p1Wrap = document.createElement('details');
    p1Wrap.className = 's2-p1-params';
    p1Wrap.id = 'p1ParamsWrap';
    const p1Summary = document.createElement('summary');
    p1Summary.innerHTML = '<span class="ms">factory</span> Sección 1 · Preparación (grupos 01–06) — parámetros y ecuaciones';
    p1Wrap.appendChild(p1Summary);
    grid.appendChild(p1Wrap);
    syncP1WrapOpen();

    let currentGroup = '';
    for (const step of P1_STEPS) {
      if (step.group !== currentGroup) {
        const title = document.createElement('h3');
        title.className = 'parameter-section-title';
        title.textContent = step.group;
        p1Wrap.appendChild(title);
        currentGroup = step.group;
      }
      p1Wrap.appendChild(renderP1Step(step, params));
    }

    const schema = getParameterSchema();
    const stages = new Map();
    for (const p of schema) {
      if (!stages.has(p.nodeId)) stages.set(p.nodeId, { nodeId: p.nodeId, group: p.group, params: [] });
      stages.get(p.nodeId).params.push(p);
    }
    currentGroup = '';
    for (const stage of stages.values()) {
      const group = `07 · Sección 2 · ${stage.group}`;
      if (group !== currentGroup) {
        const title = document.createElement('h3');
        title.className = 'parameter-section-title';
        title.textContent = group;
        grid.appendChild(title);
        currentGroup = group;
      }
      const card = renderGraphStage(stage, v, params);
      if (card) grid.appendChild(card);
    }

    const postStep = { id: 'postprensa', group: '08 · Corte y calidad', label: 'Fin de prensa → Sensores de calidad', type: 'postpress', keys: ['p1:postPress_L'] };
    const postCard = cardShell({
      label: postStep.label,
      subtitle: postStep.group,
      kind: 'measured',
      stepId: postStep.id,
      fields: [fieldHtml(PARAM_BY_KEY['p1:postPress_L']), fieldHtml({ key: 'v_prensa', label: 'Velocidad de prensa', unit: 'm/min', kind: 'hmi-live' })],
      note: '16,40 m efectivos desde fin de prensa (71,60 m) hasta Sensor 1 (≈88,00 m). Validado con pruebas de papel del 14-jul y 21-jul-2026 (residual ±6 s).',
    });
    const length = n(params, 'p1:postPress_L', 16.4);
    const postSpeed = n(params, 'v_prensa', v);
    renderEquation(postCard, {
      symbolic: String.raw`t=\frac{L_{post}\,[\mathrm{m}]}{v_{prensa}\,[\mathrm{m\,min^{-1}}]}\cdot60\,\mathrm{s\,min^{-1}}`,
      substituted: String.raw`t=\frac{${texN(length)}\,\mathrm{m}}{${texN(postSpeed)}\,\mathrm{m\,min^{-1}}}\cdot60\,\mathrm{s\,min^{-1}}`,
      seconds: postSpeed > 0 ? length / postSpeed * 60 : 0,
    });
    const postTitle = document.createElement('h3');
    postTitle.className = 'parameter-section-title';
    postTitle.textContent = '08 · Corte y calidad';
    grid.appendChild(postTitle);
    grid.appendChild(postCard);

    const totalTitle = document.createElement('h3');
    totalTitle.className = 'parameter-section-title parameter-section-title--total';
    totalTitle.textContent = '09 · Cierre de simulación';
    grid.appendChild(totalTitle);
    grid.appendChild(renderFinalRouteTotal(params, v));
    bindInputs();
    built = true;
  }

  /* ── Pestaña CONSTANTES: todo lo que NO viene del CSV del HMI ──────────
     Longitudes, volúmenes, posiciones (calibración física) y tiempos
     estimados. Editarlas las guarda en este equipo de forma permanente. */
  function buildConstants() {
    if (!constantsGrid) return;
    constantsGrid.innerHTML = '';
    const intro = document.createElement('p');
    intro.className = 's2-params__hint';
    intro.innerHTML = 'Constantes del modelo: <strong>no vienen del CSV del HMI</strong>. Al editarlas se guardan en este equipo de forma permanente (sobreviven recargas y reinicios) y mandan sobre cualquier valor del CSV.';
    constantsGrid.appendChild(intro);
    constantsGrid.appendChild(renderPlanoMeds());
    constantsGrid.appendChild(renderGeometryCalibration(params));

    const fields = [];
    for (const [tag, meta] of Object.entries(TAG_MAP)) {
      if (meta.kind !== 'est' && meta.kind !== 'measured') continue;
      const key = meta.keys[0];
      if (key.startsWith('geom:') || key === 'p1:postPress_L') continue;   // ya están en calibración física
      if (key === 'p1:tEncCI' || key === 'p1:tEncCE') continue;            // encoladoras fijas en 40 s por diseño
      const p = PARAM_BY_KEY[key];
      fields.push({ key, label: p?.label ?? tag, unit: p?.unit ?? meta.unit, kind: meta.kind });
    }
    const groupsDef = [
      { title: 'Longitudes de bandas y línea (m)', match: (f) => f.unit === 'm' },
      { title: 'Volúmenes de silos y búnker (m³)', match: (f) => f.unit === 'm³' },
      { title: 'Tiempos estimados · Sección 1 (s)', match: (f) => f.unit === 's' && f.key.startsWith('p1:') },
      { title: 'Otras constantes', match: () => true },
    ];
    const used = new Set();
    for (const gdef of groupsDef) {
      const items = fields.filter((f) => !used.has(f.key) && gdef.match(f));
      items.forEach((f) => used.add(f.key));
      if (!items.length) continue;
      const card = document.createElement('section');
      card.className = 'globals-card globals-card--csv';
      card.innerHTML = `
        <header class="globals-card__hd"><h4>${gdef.title}</h4></header>
        <div class="equation-card__fields">${items.map((f) => fieldHtml(f)).join('')}</div>`;
      constantsGrid.appendChild(card);
    }
    bindInputs(constantsGrid);
    constantsBuilt = true;
  }

  /* Sub-pestañas de Parámetros: Ecuaciones (CSV + constantes sustituidas,
     como siempre) y Constantes (lo editable que no viene del HMI). */
  const subEc = document.getElementById('subtabEcuaciones');
  const subCt = document.getElementById('subtabConstantes');
  function setParamsSubtab(which) {
    const eq = which === 'ecuaciones';
    if (!eq && !constantsBuilt) buildConstants();
    grid?.classList.toggle('is-hidden', !eq);
    constantsGrid?.classList.toggle('is-hidden', eq);
    subEc?.classList.toggle('is-active', eq);
    subCt?.classList.toggle('is-active', !eq);
    subEc?.setAttribute('aria-selected', String(eq));
    subCt?.setAttribute('aria-selected', String(!eq));
  }
  subEc?.addEventListener('click', () => setParamsSubtab('ecuaciones'));
  subCt?.addEventListener('click', () => setParamsSubtab('constantes'));

  function refreshEquations() {
    if (!built) return;
    const v = n(params, 'v_prensa', speed());
    for (const card of grid.querySelectorAll('[data-step-id]')) {
      if (card.dataset.stepId === 'postprensa') {
        const length = n(params, 'p1:postPress_L', 16.4);
        renderEquation(card, {
          symbolic: String.raw`t=\frac{L_{post}\,[\mathrm{m}]}{v_{prensa}\,[\mathrm{m\,min^{-1}}]}\cdot60\,\mathrm{s\,min^{-1}}`,
          substituted: String.raw`t=\frac{${texN(length)}\,\mathrm{m}}{${texN(v)}\,\mathrm{m\,min^{-1}}}\cdot60\,\mathrm{s\,min^{-1}}`,
          seconds: v > 0 ? length / v * 60 : 0,
        });
      } else {
        const step = P1_STEPS.find((item) => item.id === card.dataset.stepId);
        if (step) renderEquation(card, p1StepEquation(step, params));
      }
    }
    for (const card of grid.querySelectorAll('[data-node-id]')) {
      const node = findNode(card.dataset.nodeId);
      if (node) renderEquation(card, graphNodeEquation(node, v, params));
    }
    for (const card of grid.querySelectorAll('[data-total-equation="route-sensor3"]')) {
      renderFinalRouteTotalValues(card, finalRouteEquation(params, v));
    }
    const status = document.getElementById('geometryValidation');
    if (status) {
      const geometry = geometryFromParams(params);
      const errors = validateGeometry(geometry);
      status.className = `geometry-validation ${errors.length ? 'is-error' : 'is-ok'}`;
      status.textContent = errors.length
        ? errors.join(' · ')
        : `Coherente · fin prensa ${geometry.pressEndM.toFixed(2)} m · S1 ${geometry.sensor1M.toFixed(2)} m · S2 ${geometry.sensor2M.toFixed(2)} m · S3 ${geometry.sensor3M.toFixed(2)} m`;
    }
  }

  function setView(view) {
    const isParams = view === 'params';
    if (isParams && !built) build();
    panelParams.classList.toggle('is-hidden', !isParams);
    canvas.classList.toggle('is-hidden', isParams);
    legend.classList.toggle('is-hidden', isParams);
    lineaControls.classList.toggle('is-hidden', isParams);
    tabLinea.classList.toggle('is-active', !isParams);
    tabParams.classList.toggle('is-active', isParams);
    tabLinea.setAttribute('aria-selected', String(!isParams));
    tabParams.setAttribute('aria-selected', String(isParams));
  }

  tabLinea?.addEventListener('click', () => setView('linea'));
  tabParams?.addEventListener('click', async () => {
    if (await requestParametersAccess()) setView('params');
  });
  document.getElementById('lockParamsBtn')?.addEventListener('click', () => {
    lockParameters();
    setView('linea');
    showFeedback('Parámetros bloqueados.');
  });
  document.getElementById('resetParamsBtn')?.addEventListener('click', async () => {
    await onCsvReset?.();
    showFeedback('CSV del servidor recargado.');
  });
  function applyExternal({ updates, rawText, count, origenPorClave } = {}) {
    /* Antes de nada: quién escribió cada valor en ESTE CSV. De ahí sale el
       sello «HMI» vs «Supuesto» de las tarjetas (ver kindReal). */
    let sellosCambian = false;
    if (origenPorClave) {
      const antes = new Set(Object.keys(params).filter((k) => esSupuesto(k)));
      registrarOrigenes(origenPorClave);
      const ahora = new Set(Object.keys(params).filter((k) => esSupuesto(k)));
      sellosCambian = antes.size !== ahora.size || [...ahora].some((k) => !antes.has(k));
    }
    let changed = false;
    for (const [key, value] of Object.entries(updates ?? {})) {
      // Un tiempo S1 enchufado localmente manda sobre lo que traiga el CSV
      // (la Sección 1 no se lee del HMI).
      if (Object.prototype.hasOwnProperty.call(p1Overrides, key)) continue;
      if (params[key] !== value) changed = true;
      params[key] = value;
      for (const root of [built ? grid : null, constantsBuilt ? constantsGrid : null]) {
        root?.querySelectorAll(`input[data-key="${CSS.escape(key)}"]`).forEach((input) => {
          if (document.activeElement !== input) input.value = value;
        });
      }
    }
    const raw = document.getElementById('csvRaw');
    if (raw && rawText != null) raw.textContent = rawText;
    const tagCount = document.getElementById('csvTagCount');
    if (tagCount && count != null) tagCount.textContent = String(count);
    /* Un tag que EMPIEZA (o deja) de llegar de planta cambia el sello de su
       tarjeta: hay que repintar las tarjetas, no solo los números. */
    if (sellosCambian && built) build();
    refreshEquations();
    if (changed) onChange?.(params);
    return changed;
  }

  return { getParams: () => params, applyExternal, rebuild: build };
}
