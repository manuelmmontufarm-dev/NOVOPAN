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
import { KIND_BY_KEY, TAG_BY_KEY } from './hmi-csv.js';
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
  { key: 'p1:s5_V', label: 'Volumen · Silo 5', unit: 'm³', default: 120, unknown: true },
  { key: 'p1:s5_L', label: 'Nivel · Silo 5', unit: '%', default: 44 },
  { key: 'p1:s5_Fmin', label: 'Flujo de salida · Silo 5', unit: 'kg/min', default: 302 },
  { key: 'p1:s6_rho', label: 'Densidad · Silo 6', unit: 'kg/m³', default: 188 },
  { key: 'p1:s6_V', label: 'Volumen · Silo 6', unit: 'm³', default: 120, unknown: true },
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
  { key: 'geom:prepress', label: 'Posición · Pre-prensa', unit: 'm', default: 47 },
  { key: 'geom:refilaStart', label: 'Inicio · Cuchillos de refila', unit: 'm', default: 81.7 },
  { key: 'geom:refilaEnd', label: 'Fin · Cuchillos de refila', unit: 'm', default: 83 },
  { key: 'geom:sawStart', label: 'Inicio · Sierra transversal', unit: 'm', default: 84.1 },
  { key: 'geom:sawEnd', label: 'Fin · Sierra transversal', unit: 'm', default: 86.4 },
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
};

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
  const disabled = !tag;
  return `
    <label class="equation-field">
      <span class="equation-field__label">${label} ${badgeHtml(kind ?? KIND_BY_KEY[key])}</span>
      <span class="equation-field__control">
        <input type="number" step="any" min="0" data-key="${key}" data-csv-tag="${tag ?? ''}"
          ${unknown ? 'data-unknown="1"' : ''} ${disabled ? 'disabled' : ''}>
        <span>${unit}</span>
      </span>
      ${tag ? `<code>${tag}</code>` : '<small>Valor derivado</small>'}
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
  const v5 = n(params, 'p1:s5_V', 120);
  const l5 = n(params, 'p1:s5_L', 44);
  const f5 = n(params, 'p1:s5_Fmin', 302);
  const rho6 = n(params, 'p1:s6_rho', 188);
  const v6 = n(params, 'p1:s6_V', 120);
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
  'geom:detector', 'geom:cutters', 'geom:nose', 'geom:vapor', 'geom:prepress',
  'geom:refilaStart', 'geom:refilaEnd', 'geom:sawStart', 'geom:sawEnd',
];

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

export function initParams({ speedGetter, onChange, onCsvEdit, onCsvReset, onCsvDownload }) {
  const speed = speedGetter ?? (() => 14.5);
  let params = { ...defaultParams(), ...defaultPart1Params(), v_prensa: speed() };
  let built = false;

  const grid = document.getElementById('paramsGridTab');
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

  function bindInputs() {
    grid.querySelectorAll('input[data-key]').forEach((input) => {
      const key = input.dataset.key;
      input.value = params[key] ?? '';
      const commitToCsv = () => {
        if (input.value.trim() === '') return;
        const value = Number(input.value);
        if (!Number.isFinite(value) || value < 0) {
          input.value = params[key] ?? '';
          showFeedback('Valor inválido; el CSV no cambió.');
          return;
        }
        const ok = onCsvEdit?.(key, value);
        if (!ok) input.value = params[key] ?? '';
        showFeedback(ok ? `CSV actualizado · ${input.dataset.csvTag}` : 'Este valor no tiene un tag CSV editable.');
      };
      input.addEventListener('input', commitToCsv);
      input.addEventListener('change', () => {
        if (input.value.trim() === '') input.value = params[key] ?? '';
      });
    });
  }

  function build() {
    const v = speed();
    grid.innerHTML = '';
    grid.appendChild(renderOverview(params, v));
    grid.appendChild(renderGlobals(params, v));
    grid.appendChild(renderGeometryCalibration(params));

    let currentGroup = '';
    for (const step of P1_STEPS) {
      if (step.group !== currentGroup) {
        const title = document.createElement('h3');
        title.className = 'parameter-section-title';
        title.textContent = step.group;
        grid.appendChild(title);
        currentGroup = step.group;
      }
      grid.appendChild(renderP1Step(step, params));
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
      note: '16,40 m efectivos desde fin de prensa (71,60 m) hasta Sensor 1 (≈88,00 m), según prueba de papel del 14-jul-2026; confirmar con flexómetro.',
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
  document.getElementById('downloadCsvBtn')?.addEventListener('click', () => {
    showFeedback(onCsvDownload?.() ? 'CSV descargado.' : 'Aún no hay un CSV activo.');
  });

  function applyExternal({ updates, rawText, count } = {}) {
    let changed = false;
    for (const [key, value] of Object.entries(updates ?? {})) {
      if (params[key] !== value) changed = true;
      params[key] = value;
      if (built) {
        grid.querySelectorAll(`input[data-key="${CSS.escape(key)}"]`).forEach((input) => {
          if (document.activeElement !== input) input.value = value;
        });
      }
    }
    const raw = document.getElementById('csvRaw');
    if (raw && rawText != null) raw.textContent = rawText;
    const tagCount = document.getElementById('csvTagCount');
    if (tagCount && count != null) tagCount.textContent = String(count);
    refreshEquations();
    if (changed) onChange?.(params);
    return changed;
  }

  return { getParams: () => params, applyExternal, rebuild: build };
}
