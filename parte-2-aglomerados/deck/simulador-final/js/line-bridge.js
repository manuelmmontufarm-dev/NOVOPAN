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
  redM: 7.67,   // plano DXF: tambor entrada prensa en 52.67 m
  pressM: 18.93, // tambor a tambor (marcos 16.6 m desde 55.10 abs)
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
  prepressM: 29.06,
  prepressLenM: 4.69,
  refilaStartM: 78.3,   // campo jul + plano: inicio grupo de sierras
  refilaEndM: 79.65,
  sawStartM: 84.42,     // eje cuchilla transversal 85.57 (plano + operador 32 m)
  sawEndM: 86.72,
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
  for (const key of ['esp1M', 'esp2M', 'esp3M', 'magnetM', 'sprays2M', 'detectorM', 'cuttersM', 'noseM', 'vaporM', 'prepressM', 'prepressLenM', 'refilaStartM', 'refilaEndM', 'sawStartM', 'sawEndM']) {
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
  // La pre-prensa vive en la BANDA BLANCA: después del imán y antes del
  // desmoldante #2 (sprays) — cadena de segmentos medidos jul-2026.
  if (g.prepressM < g.magnetM || g.prepressM + g.prepressLenM > g.sprays2M) errors.push('La pre-prensa va en la banda blanca: después del imán y antes del desmoldante #2 (entrada + largo dentro de ese tramo).');
  return errors;
}

/* ── Mapa VISUAL m→px: la estética desacoplada de la física ──────────────
   Fuera de la ventana [redStartM, pressStartM] el mapa es el lineal de
   siempre (X0 + 70·m): toda el arte estática (bandas, prensa, sensores,
   cortes de fila del onepage) queda alineada. DENTRO de la ventana los
   píxeles se reparten para que nariz / vapor / pre-prensa se LEAN
   separados; los extremos quedan clavados al lineal (mapa continuo y
   monótono). La posición del cambio se calcula SIEMPRE en metros con las
   ecuaciones y solo se PINTA con este mapa: en pantalla el marcador va
   más rápido o más lento según el tramo, pero su tiempo es el físico.
   Si la calibración rompe el orden (vapor fuera de la ventana, pre-prensa
   antes del vapor, fin de pre-prensa después de la prensa) se cae al mapa
   lineal — nunca a uno no monótono. */
function visualAnchors(g) {
  const lin = (m) => X0 + PX_PER_M * m;
  const w0 = g.redStartM, w1 = g.pressStartM;
  const vap = g.vaporM, pIn = g.prepressM, pOut = g.prepressM + g.prepressLenM;
  if (!(w0 < vap && vap <= pIn && pIn < pOut && pOut < w1)) return null;
  const x0 = lin(w0), span = lin(w1) - x0;
  return [
    [w0, x0],
    [vap, x0 + span * 0.23],   // el vapor respira tras la nariz
    [pIn, x0 + span * 0.36],   // aire vapor → entrada de pre-prensa
    [pOut, x0 + span * 0.83],  // cuerpo de la pre-prensa
    [w1, x0 + span],           // aire fin de pre-prensa → prensa
  ];
}

export function mapAbsMToX(absM, geometry = geometryFromParams(), noClamp = false) {
  const m = noClamp ? absM : clamp(absM, 0, geometry.processEndM);
  const a = visualAnchors(geometry);
  if (a && m > a[0][0] && m < a[a.length - 1][0]) {
    for (let i = 1; i < a.length; i++) {
      if (m <= a[i][0]) {
        const [m0, px0] = a[i - 1];
        const [m1, px1] = a[i];
        return px0 + (px1 - px0) * ((m - m0) / Math.max(1e-9, m1 - m0));
      }
    }
  }
  return X0 + PX_PER_M * m;
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
