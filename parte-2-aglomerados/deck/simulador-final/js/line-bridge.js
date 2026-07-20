/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — geometría calibrable
   ------------------------------------------------------------
   Una sola fuente convierte los parámetros CSV en metros absolutos
   para simulación, reportes, regla y anotaciones del SVG.
   ============================================================ */

import {
  bandSegmentsWithBounds, bandWaypoints, bandLengthM,
} from '../../trazabilidad/js/core/process-graph.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const finitePositive = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
const finiteNonNegative = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export const X0 = 80;
export const PX_PER_M = 70;

export const DEFAULT_GEOMETRY = Object.freeze({
  whiteM: 45,
  redM: 10,
  pressM: 16.6,
  postToSensor1M: 16.4,
  sensor2OffsetM: 0.2,
  sensor3OffsetM: 0.4,
  esp1M: 6.63,
  esp2M: 15,
  esp3M: 22.25,
  magnetM: 26.68,
  sprays2M: 35.99,
  detectorM: 37.69,
  cuttersM: 39.56,
  noseM: 44.9,
  vaporM: 46.86,
  prepressM: 49.7,
  refilaStartM: 81.7,
  refilaEndM: 83,
  sawStartM: 84.1,
  sawEndM: 86.4,
});

export function geometryFromParams(params = {}) {
  const g = {
    whiteM: finitePositive(params['len:white'], DEFAULT_GEOMETRY.whiteM),
    redM: finitePositive(params['len:red'], DEFAULT_GEOMETRY.redM),
    pressM: finitePositive(params['len:press'], DEFAULT_GEOMETRY.pressM),
    postToSensor1M: finitePositive(params['p1:postPress_L'], DEFAULT_GEOMETRY.postToSensor1M),
    sensor2OffsetM: finiteNonNegative(params['geom:sensor2Offset'], DEFAULT_GEOMETRY.sensor2OffsetM),
    sensor3OffsetM: finiteNonNegative(params['geom:sensor3Offset'], DEFAULT_GEOMETRY.sensor3OffsetM),
  };
  for (const key of ['esp1M', 'esp2M', 'esp3M', 'magnetM', 'sprays2M', 'detectorM', 'cuttersM', 'noseM', 'vaporM', 'prepressM', 'refilaStartM', 'refilaEndM', 'sawStartM', 'sawEndM']) {
    const paramKey = `geom:${key.replace(/M$/, '')}`;
    g[key] = finiteNonNegative(params[paramKey], DEFAULT_GEOMETRY[key]);
  }
  g.redStartM = g.whiteM;
  g.pressStartM = g.whiteM + g.redM;
  g.pressEndM = g.pressStartM + g.pressM;
  g.sensor1M = g.pressEndM + g.postToSensor1M;
  g.sensor2M = g.sensor1M + g.sensor2OffsetM;
  g.sensor3M = g.sensor1M + g.sensor3OffsetM;
  g.processEndM = Math.max(g.sensor1M, g.sensor2M, g.sensor3M);
  return g;
}

export function validateGeometry(g) {
  const errors = [];
  const ordered = (label, values) => {
    for (let i = 1; i < values.length; i++) if (!(values[i] > values[i - 1])) errors.push(`${label}: ${values[i - 1]} ≥ ${values[i]}`);
  };
  ordered('Esparcidores', [g.esp1M, g.esp2M, g.esp3M]);
  ordered('Corte y sensores', [g.pressEndM, g.refilaStartM, g.refilaEndM, g.sawStartM, g.sawEndM, g.sensor1M, g.sensor2M, g.sensor3M]);
  if (g.esp3M >= g.whiteM) errors.push('El esparcidor 3 debe caer antes del fin de la banda blanca.');
  if (g.noseM > g.whiteM) errors.push('La nariz no puede quedar después del fin de la banda blanca.');
  if (g.vaporM < g.redStartM || g.vaporM > g.pressStartM) errors.push('El vapor debe quedar dentro de la banda roja.');
  if (g.prepressM < g.redStartM || g.prepressM > g.pressStartM) errors.push('La pre-prensa debe quedar antes de la prensa continua.');
  return errors;
}

export function mapAbsMToX(absM, geometry = geometryFromParams()) {
  return X0 + PX_PER_M * clamp(absM, 0, geometry.processEndM);
}

export function buildAnnotations(geometry = geometryFromParams()) {
  const segments = [];
  const waypoints = [];
  const bandConfig = {
    white: { offset: 0, length: geometry.whiteM },
    red: { offset: geometry.redStartM, length: geometry.redM },
    press: { offset: geometry.pressStartM, length: geometry.pressM },
  };

  for (const band of ['white', 'red']) {
    const cfg = bandConfig[band];
    const nominal = bandLengthM(band) || cfg.length;
    const scale = cfg.length / nominal;
    for (const s of bandSegmentsWithBounds(band)) {
      const startM = s.startM * scale;
      const endM = s.endM * scale;
      segments.push({
        x: mapAbsMToX(cfg.offset + (startM + endM) / 2, geometry),
        len: s.lengthM * scale,
        type: s.type,
        label: s.label,
      });
    }
  }

  segments.push({ x: mapAbsMToX(geometry.pressStartM + geometry.pressM * (2.35 / 16.6), geometry), len: geometry.pressM * (0.75 / 16.6), type: 'pitch', label: '6× pitch inicial' });
  segments.push({ x: mapAbsMToX(geometry.pressStartM + geometry.pressM * (10 / 16.6), geometry), len: geometry.pressM * (0.90 / 16.6), type: 'pitch', label: '12× pitch estándar' });

  const post = [
    [geometry.pressEndM, geometry.refilaStartM, 'Fin prensa → cuchillos de refila', 'transport'],
    [geometry.refilaStartM, geometry.refilaEndM, 'Cuchillos de refila', 'zone'],
    [geometry.refilaEndM, geometry.sawStartM, 'Refila → sierra transversal', 'transport'],
    [geometry.sawStartM, geometry.sawEndM, 'Sierra transversal', 'zone'],
    [geometry.sawEndM, geometry.sensor1M, 'Sierra transversal → Sensor 1', 'transport'],
  ];
  for (const [startM, endM, label, type] of post) {
    segments.push({ x: mapAbsMToX((startM + endM) / 2, geometry), len: Math.max(0, endM - startM), type, label });
  }

  for (const band of ['white', 'red', 'press']) {
    const cfg = bandConfig[band];
    const nominal = bandLengthM(band) || cfg.length;
    const scale = cfg.length / nominal;
    const pressShow = new Set(['point:m1', 'point:m7', 'point:m13', 'point:m19', 'point:end']);
    for (const w of bandWaypoints(band)) {
      if (band === 'press' && !pressShow.has(w.id)) continue;
      const localM = w.atM * scale;
      waypoints.push({
        x: mapAbsMToX(cfg.offset + localM, geometry),
        atM: cfg.offset + localM,
        pct: Math.round((localM / cfg.length) * 100),
        label: band === 'press' && w.id === 'point:end' ? 'Fin prensa' : w.label,
        band,
      });
    }
  }
  waypoints.push(
    { x: mapAbsMToX(geometry.refilaStartM, geometry), atM: geometry.refilaStartM, pct: null, label: 'Inicio refila', band: 'post-press' },
    { x: mapAbsMToX(geometry.refilaEndM, geometry), atM: geometry.refilaEndM, pct: null, label: 'Fin refila', band: 'post-press' },
    { x: mapAbsMToX(geometry.sawStartM, geometry), atM: geometry.sawStartM, pct: null, label: 'Inicio sierra', band: 'post-press' },
    { x: mapAbsMToX(geometry.sawEndM, geometry), atM: geometry.sawEndM, pct: null, label: 'Fin sierra', band: 'post-press' },
    { x: mapAbsMToX(geometry.sensor1M, geometry), atM: geometry.sensor1M, pct: null, label: 'Sensor 1', band: 'post-press' },
    { x: mapAbsMToX(geometry.sensor2M, geometry), atM: geometry.sensor2M, pct: null, label: 'Sensor 2', band: 'post-press' },
    { x: mapAbsMToX(geometry.sensor3M, geometry), atM: geometry.sensor3M, pct: null, label: 'Sensor 3', band: 'post-press' },
  );
  return { segments, waypoints };
}
