/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — puente motor ⇄ SVG
   ------------------------------------------------------------
   Traduce los marcadores del trace-engine (posición en METROS por
   banda: white/red/press) a la coordenada X del canvas horizontal,
   y arma las anotaciones discretas de distancias medidas.

   El SVG NO es proporcional a los metros (el diseño es fijo): se usa
   un mapeo por tramos (breakpoints absM → x) anclado a los equipos
   dibujados. La lógica de tiempo/slider sigue siendo del motor.
   ============================================================ */

import {
  bandSegmentsWithBounds, bandWaypoints, bandLengthM,
} from '../../trazabilidad/js/core/process-graph.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Offset absoluto (m) del inicio de cada banda a lo largo del downstream.
// Usa los totales del contenedor (45 / 10) para casar con marker.positionM.
export const BAND_OFFSET = { white: 0, red: 45, press: 55 };
export const DOWNSTREAM_TOTAL_M = 71.6; // 45 + 10 + 16.6

// Breakpoints [absM, x] anclados a los equipos del SVG del handoff.
// Monótono creciente en ambos ejes.
const BREAKS = [
  [0, 60],       // arranque banda blanca
  [4.89, 470],   // zona SL1 (cabezal)
  [13.9, 730],   // zona CL
  [20.66, 980],  // zona SL2
  [26.68, 1150], // imán (tambor banda azul)
  [31.4, 1443],  // pre-prensa
  [35.99, 1810], // sprays desmoldante #2
  [37.69, 2010], // detector de metales
  [39.56, 2230], // cortadores de filo
  [45, 2500],    // fin blanca / inicio banda roja
  [48.0, 2720],  // vapor EVOsteam
  [55, 2960],    // fin roja / inicio prensa
  [55.10, 2985], // marco 1
  [70.4, 3705],  // marco 19
  [71.6, 3900],  // fin zona activa / tablero
];

/** Mapea metros absolutos del downstream a X del canvas (lineal por tramos). */
export function mapAbsMToX(absM) {
  if (absM <= BREAKS[0][0]) return BREAKS[0][1];
  for (let i = 1; i < BREAKS.length; i++) {
    if (absM <= BREAKS[i][0]) {
      const [a0, x0] = BREAKS[i - 1];
      const [a1, x1] = BREAKS[i];
      const t = a1 > a0 ? (absM - a0) / (a1 - a0) : 1;
      return x0 + (x1 - x0) * t;
    }
  }
  return BREAKS[BREAKS.length - 1][1];
}

/** Metros absolutos del downstream para un marcador del motor. */
export function absMForMarker(m) {
  if (!m) return 0;
  if (m.nodeId === 'done' || m.phase === 'done') return DOWNSTREAM_TOTAL_M;
  const band = m.bandId ?? m.nodeId;
  const off = BAND_OFFSET[band];
  if (off == null) return 0;
  return off + (m.positionM ?? 0);
}

/** Selecciona el marcador downstream (white/red/press/done) del estado. */
export function pickDownstreamMarker(state) {
  const ids = ['white', 'red', 'press', 'done'];
  let best = null;
  for (const m of state.markers ?? []) {
    if (ids.includes(m.nodeId)) best = m; // el downstream se agrega al final
  }
  return best;
}

/** Texto corto de posición del marcador para lectura en vivo. */
export function markerReadout(m) {
  if (!m) return '—';
  if (m.nodeId === 'done' || m.phase === 'done') return 'Salida prensa · 71.6 m';
  const absM = absMForMarker(m);
  const seg = m.segmentLabel ? ` · ${m.segmentLabel}` : '';
  return `${absM.toFixed(1)} m${seg}`;
}

/**
 * Anotaciones discretas de distancias medidas:
 *  - segments: longitud de cada tramo (zonas + gaps) de blanca/roja + resumen prensa
 *  - waypoints: puntos con posición (m) y % de su banda
 */
export function buildAnnotations() {
  const segments = [];
  const waypoints = [];

  for (const band of ['white', 'red']) {
    const off = BAND_OFFSET[band];
    for (const s of bandSegmentsWithBounds(band)) {
      const cAbs = off + (s.startM + s.endM) / 2;
      segments.push({ x: mapAbsMToX(cAbs), len: s.lengthM, type: s.type, label: s.label });
    }
  }
  // Prensa: resumen de pitch (no se etiqueta cada marco para no saturar).
  segments.push({ x: mapAbsMToX(55 + 2.35), len: 0.75, type: 'pitch', label: '6× 0.75 m' });
  segments.push({ x: mapAbsMToX(55 + 10.0), len: 0.90, type: 'pitch', label: '12× 0.90 m' });

  const pressShow = new Set(['point:m1', 'point:m7', 'point:m13', 'point:m19', 'point:end']);
  for (const band of ['white', 'red', 'press']) {
    const off = BAND_OFFSET[band];
    const total = bandLengthM(band) || 1;
    for (const w of bandWaypoints(band)) {
      if (band === 'press' && !pressShow.has(w.id)) continue;
      waypoints.push({
        x: mapAbsMToX(off + w.atM),
        atM: w.atM,
        pct: Math.round((w.atM / total) * 100),
        label: w.label,
        band,
      });
    }
  }
  return { segments, waypoints };
}
