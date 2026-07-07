/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — carril upstream (silos → esparcidores)
   ------------------------------------------------------------
   Tramo ESQUEMÁTICO (tiempos τ, no distancias) a la izquierda del
   metro 0. Ruta FINA arriba (Silo 6 → Dosing → Encolador CE →
   banda inclinada → Esp.1/Esp.3) y ruta GRUESA abajo (Silo 5 →
   Dosing → CI → inclinada → Esp.2). Mismo lenguaje visual que el
   resto del canvas (gradiente #steel, cajas de rótulo, Barlow).
   ============================================================ */

import { layerChain } from './v3-model.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

export const UPSTREAM_W = 1920;   // ancho del carril; el metro 0 vive en x = UPSTREAM_W + 80
const DIVIDER_X = 1900;

// Colores de ruta (los mismos de SL1/CL en el downstream)
const FINE_COLOR = '#1565C0';
const THICK_COLOR = '#0A7D5A';

// Carriles (y de la banda de cada ruta)
const LANE = { fine: 214, thick: 440 };

// Span horizontal (px) de cada etapa — el marcador se desliza por su span
// proporcionalmente a elapsed/τ (esquemático: mismo ancho, tiempos distintos).
const SPANS = {
  silo:   [120, 380],
  dosing: [380, 660],
  enc:    [660, 960],
  incl:   [960, 1720],
  esp:    [1720, DIVIDER_X],
};

function spanFor(nodeId) {
  const base = nodeId.split('-')[0];      // silo-fine → silo · esp-SL1 → esp
  return SPANS[base] ?? [DIVIDER_X, DIVIDER_X];
}

function el(tag, attrs, txt) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (txt != null) node.textContent = txt;
  return node;
}

function labelBox(g, cx, cy, w, title, sub, color, injectNode, injectLabel) {
  const box = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': injectNode, 'data-label': injectLabel });
  box.appendChild(el('rect', { x: cx - w / 2, y: cy, width: w, height: 30, rx: 6, fill: '#FFFFFF', stroke: color, 'stroke-width': 1.5 }));
  box.appendChild(el('text', { x: cx, y: cy + 14, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 13, fill: '#1A1D1B' }, title));
  box.appendChild(el('text', { x: cx, y: cy + 25, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#676E69' }, sub));
  g.appendChild(box);
  return box;
}

/* Chip de tiempo bajo un equipo. data-chip para refrescar sin redibujar. */
function timeChip(g, cx, y, chipId) {
  const c = el('g', { 'data-chip': chipId });
  c.appendChild(el('rect', { x: cx - 34, y, width: 68, height: 18, rx: 9, fill: '#EEF0EB', stroke: '#D9DDD9', 'data-chip-bg': chipId }));
  c.appendChild(el('text', {
    x: cx, y: y + 13, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif",
    'font-weight': 700, 'font-size': 11, fill: '#3D423F', 'data-chip-text': chipId,
  }, '—'));
  g.appendChild(c);
}

function drawSilo(g, cx, laneY, color, which) {
  const grp = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': `silo-${which}`, 'data-label': which === 'fine' ? 'Silo 6 · fina' : 'Silo 5 · gruesa' });
  const top = laneY - 132;
  grp.appendChild(el('rect', { x: cx - 44, y: top, width: 88, height: 82, rx: 8, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('polygon', { points: `${cx - 44},${top + 82} ${cx + 44},${top + 82} ${cx + 12},${top + 118} ${cx - 12},${top + 118}`, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('rect', { x: cx - 12, y: top + 118, width: 24, height: 10, fill: '#4A5560' }));
  // nivel de material (esquemático)
  grp.appendChild(el('rect', { x: cx - 38, y: top + 34, width: 76, height: 44, rx: 4, fill: which === 'fine' ? '#ECC873' : '#C98B2E', opacity: 0.85 }));
  grp.appendChild(el('line', { x1: cx - 44, y1: top + 34, x2: cx + 44, y2: top + 34, stroke: '#6B7886', 'stroke-width': 1, 'stroke-dasharray': '3 3' }));
  g.appendChild(grp);
  labelBox(g, cx, top - 40, 128, which === 'fine' ? 'SILO 6 · FINA' : 'SILO 5 · GRUESA', 'τ = ρ·V·L% / F_out × 60 · TBD', color, `silo-${which}`, which === 'fine' ? 'Silo 6 · fina' : 'Silo 5 · gruesa');
  timeChip(g, cx, laneY + 16, `silo-${which}`);
}

function drawDosing(g, cx, laneY, color, which) {
  const grp = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': `dosing-${which}`, 'data-label': which === 'fine' ? 'Dosing fina' : 'Dosing gruesa' });
  const top = laneY - 104;
  grp.appendChild(el('rect', { x: cx - 40, y: top, width: 80, height: 58, rx: 6, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('rect', { x: cx - 40, y: top, width: 80, height: 8, rx: 3, fill: color }));
  grp.appendChild(el('polygon', { points: `${cx - 40},${top + 58} ${cx + 40},${top + 58} ${cx + 10},${top + 88} ${cx - 10},${top + 88}`, fill: '#3C4652' }));
  // material cayendo
  const drops = el('g', { fill: which === 'fine' ? '#ECC873' : '#C98B2E' });
  drops.appendChild(el('circle', { cx: cx - 6, cy: laneY - 10, r: 2.5, style: 'animation:fall 1.1s linear infinite' }));
  drops.appendChild(el('circle', { cx: cx + 5, cy: laneY - 10, r: 2, style: 'animation:fall 1.3s linear infinite;animation-delay:.4s' }));
  grp.appendChild(drops);
  g.appendChild(grp);
  labelBox(g, cx, top - 40, 118, which === 'fine' ? 'DOSING FINA' : 'DOSING GRUESA', 'τ = M / F_descarga × 60 · HMI', color, `dosing-${which}`, which === 'fine' ? 'Dosing fina' : 'Dosing gruesa');
  timeChip(g, cx, laneY + 16, `dosing-${which}`);
}

function drawEnc(g, cx, laneY, color, which) {
  const grp = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': `enc-${which}`, 'data-label': which === 'fine' ? 'Encolador CE' : 'Encolador CI' });
  const cy = laneY - 52;
  grp.appendChild(el('rect', { x: cx - 62, y: cy - 26, width: 124, height: 52, rx: 26, fill: 'url(#steelBlue)', stroke: '#5E7286', 'stroke-width': 1.5 }));
  // paletas del tambor
  const blades = el('g', { stroke: '#5E7286', 'stroke-width': 2, opacity: 0.7 });
  for (let i = -2; i <= 2; i++) blades.appendChild(el('line', { x1: cx + i * 22, y1: cy - 18, x2: cx + i * 22 + 8, y2: cy + 18 }));
  grp.appendChild(blades);
  // spray de resina
  const mist = el('g', { fill: '#9FC0D8' });
  mist.appendChild(el('ellipse', { cx: cx - 20, cy: cy - 34, rx: 8, ry: 5, opacity: 0.45, style: 'animation:mist 2.4s ease-in-out infinite' }));
  mist.appendChild(el('ellipse', { cx: cx + 18, cy: cy - 36, rx: 9, ry: 5, opacity: 0.45, style: 'animation:mist 2.8s ease-in-out infinite;animation-delay:.6s' }));
  grp.appendChild(mist);
  grp.appendChild(el('polygon', { points: `${cx - 8},${cy + 26} ${cx + 8},${cy + 26} ${cx},${cy + 40}`, fill: '#4A5560' }));
  g.appendChild(grp);
  labelBox(g, cx, cy - 96, 132, which === 'fine' ? 'ENCOLADOR CE' : 'ENCOLADOR CI', 't_enc = prueba de trazador · TBD', color, `enc-${which}`, which === 'fine' ? 'Encolador CE' : 'Encolador CI');
  timeChip(g, cx, laneY + 16, `enc-${which}`);
}

function drawIncl(g, x0, x1, laneY, color, which, lenM, vFix) {
  const rise = 34;   // sube esquemáticamente hacia el esparcidor
  const grp = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': `incl-${which}`, 'data-label': which === 'fine' ? 'Banda inclinada fina' : 'Banda inclinada gruesa' });
  grp.appendChild(el('rect', { x: x0, y: laneY - rise - 10, width: x1 - x0, height: rise + 26, fill: 'transparent' }));
  grp.appendChild(el('line', { x1: x0, y1: laneY, x2: x1, y2: laneY - rise, stroke: '#1565C0', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.85 }));
  grp.appendChild(el('line', { x1: x0, y1: laneY, x2: x1, y2: laneY - rise, stroke: '#BBDEFB', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '10 12', style: 'animation:conveyor 1.1s linear infinite' }));
  // tambores extremos
  grp.appendChild(el('circle', { cx: x0, cy: laneY, r: 9, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('circle', { cx: x1, cy: laneY - rise, r: 9, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  g.appendChild(grp);
  const midX = (x0 + x1) / 2;
  labelBox(g, midX, laneY - rise - 74, 200, which === 'fine' ? 'BANDA INCLINADA · FINA' : 'BANDA INCLINADA · GRUESA', `${lenM} m @ ${vFix} m/min · Medido (v fija HMI)`, color, `incl-${which}`, which === 'fine' ? 'Banda inclinada fina' : 'Banda inclinada gruesa');
  timeChip(g, midX, laneY + 16, `incl-${which}`);
}

function drawConnector(g, laneY, color, targetsLabel) {
  const x0 = SPANS.esp[0];
  const rise = 34;
  g.appendChild(el('line', { x1: x0, y1: laneY - rise, x2: DIVIDER_X, y2: laneY - rise, stroke: color, 'stroke-width': 3, 'stroke-dasharray': '7 6', opacity: 0.8 }));
  g.appendChild(el('polygon', { points: `${DIVIDER_X - 2},${laneY - rise - 7} ${DIVIDER_X + 12},${laneY - rise} ${DIVIDER_X - 2},${laneY - rise + 7}`, fill: color }));
  g.appendChild(el('text', {
    x: DIVIDER_X - 18, y: laneY - rise - 12, 'text-anchor': 'end',
    'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: color,
  }, targetsLabel));
}

export function renderUpstream() {
  const g = document.getElementById('upstreamRoot');
  if (!g) return;
  g.innerHTML = '';

  // Fondo + cinta de zona (esquemático)
  g.appendChild(el('rect', { x: 0, y: 42, width: DIVIDER_X, height: 410, fill: 'rgba(55,71,79,0.04)' }));
  const ribbon = el('g', { 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 13, 'text-anchor': 'middle', fill: '#fff', 'letter-spacing': '0.06em' });
  ribbon.appendChild(el('rect', { x: 600, y: 10, width: 600, height: 26, rx: 13, fill: '#37474F' }));
  ribbon.appendChild(el('text', { x: 900, y: 27 }, '0 · SILOS · DOSIFICACIÓN Y ENCOLADO — MODELO v3'));
  g.appendChild(ribbon);
  g.appendChild(el('text', {
    x: 900, y: 52, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif",
    'font-weight': 600, 'font-size': 10, fill: '#676E69',
  }, 'Tramo esquemático: recipientes por TIEMPO de residencia (τ = M/F × 60), no a escala de metros'));

  // Divisor: aquí empieza la escala métrica del colchón
  g.appendChild(el('line', { x1: DIVIDER_X, y1: 44, x2: DIVIDER_X, y2: 470, stroke: '#37474F', 'stroke-width': 2, 'stroke-dasharray': '6 5' }));
  g.appendChild(el('text', {
    x: DIVIDER_X - 8, y: 484, 'text-anchor': 'end', 'font-family': "'Barlow',sans-serif",
    'font-weight': 700, 'font-size': 9, fill: '#37474F', 'letter-spacing': '0.05em',
  }, 'FIN TRAMO ESQUEMÁTICO → ESCALA MÉTRICA (70 px = 1 m)'));

  // Nota τ_esp por capa (los esparcidores viven en el tramo métrico)
  g.appendChild(el('text', {
    x: DIVIDER_X - 8, y: 497, 'text-anchor': 'end', 'font-family': "'Barlow',sans-serif",
    'font-weight': 600, 'font-size': 9, fill: '#676E69', id: 'upstreamEspNote',
  }, ''));

  // Botón "cambio de receta" (arranca en LOS DOS silos → 3 capas)
  const btn = el('g', { class: 's2-machine s2-up-node s2-up-recipe', 'data-inject-node': 'silos', 'data-label': 'Cambio de receta · silos' });
  btn.appendChild(el('rect', { x: 20, y: 226, width: 68, height: 84, rx: 10, fill: '#FFDE00', stroke: '#1A1D1B', 'stroke-width': 1.5 }));
  btn.appendChild(el('text', { x: 54, y: 252, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#1A1D1B' }, 'CAMBIO'));
  btn.appendChild(el('text', { x: 54, y: 266, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#1A1D1B' }, 'RECETA'));
  btn.appendChild(el('text', { x: 54, y: 284, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#3D423F' }, 'silos 5 + 6'));
  btn.appendChild(el('text', { x: 54, y: 294, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#3D423F' }, '3 capas'));
  g.appendChild(btn);

  // ── Ruta FINA (arriba): alimenta SL1 + SL2 ──
  const yF = LANE.fine;
  g.appendChild(el('text', { x: 120, y: yF + 44, 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 13, fill: FINE_COLOR }, 'RUTA FINA · SL1 + SL2 (compartida hasta los esparcidores)'));
  g.appendChild(el('line', { x1: SPANS.silo[0], y1: yF, x2: SPANS.incl[0], y2: yF, stroke: '#98A6B4', 'stroke-width': 3 }));
  drawSilo(g, 230, yF, FINE_COLOR, 'fine');
  drawDosing(g, 500, yF, FINE_COLOR, 'fine');
  drawEnc(g, 800, yF, FINE_COLOR, 'fine');
  drawIncl(g, SPANS.incl[0], SPANS.incl[1], yF, FINE_COLOR, 'fine', 64.57, 99.5);
  drawConnector(g, yF, FINE_COLOR, '→ ESP. 1 (SL1) · ESP. 3 (SL2)');

  // ── Ruta GRUESA (abajo): alimenta CL ──
  const yT = LANE.thick;
  g.appendChild(el('text', { x: 120, y: yT + 52, 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 13, fill: THICK_COLOR }, 'RUTA GRUESA · CL (core)'));
  g.appendChild(el('line', { x1: SPANS.silo[0], y1: yT, x2: SPANS.incl[0], y2: yT, stroke: '#98A6B4', 'stroke-width': 3 }));
  drawSilo(g, 230, yT, THICK_COLOR, 'thick');
  drawDosing(g, 500, yT, THICK_COLOR, 'thick');
  drawEnc(g, 800, yT, THICK_COLOR, 'thick');
  drawIncl(g, SPANS.incl[0], SPANS.incl[1], yT, THICK_COLOR, 'thick', 68.5, 96.5);
  drawConnector(g, yT, THICK_COLOR, '→ ESP. 2 (CL)');
}

/* Refresca los chips de tiempo (τ o TBD) con los parámetros actuales. */
export function refreshUpstreamChips(params) {
  const sl1 = layerChain('SL1', params);
  const cl = layerChain('CL', params);
  const sl2 = layerChain('SL2', params);
  const byId = {};
  for (const n of [...sl1, ...cl]) byId[n.id] = n;         // fina (sin esp) + gruesa
  const setChip = (chipId, node) => {
    const txt = document.querySelector(`[data-chip-text="${chipId}"]`);
    const bg = document.querySelector(`[data-chip-bg="${chipId}"]`);
    if (!txt || !bg) return;
    if (node.tbd) {
      txt.textContent = 'TBD';
      txt.setAttribute('fill', '#B00020');
      bg.setAttribute('fill', '#FDECEA');
      bg.setAttribute('stroke', '#B00020');
    } else {
      txt.textContent = `${node.sec.toFixed(1)} s`;
      txt.setAttribute('fill', '#1B5E20');
      bg.setAttribute('fill', '#E3F1E8');
      bg.setAttribute('stroke', '#9CCFAE');
    }
  };
  for (const id of ['silo-fine', 'dosing-fine', 'enc-fine', 'incl-fine', 'silo-thick', 'dosing-thick', 'enc-thick', 'incl-thick']) {
    if (byId[id]) setChip(id, byId[id]);
  }
  // Nota de esparcidores por capa (llegan con τ_esp distinto)
  const espNote = document.getElementById('upstreamEspNote');
  if (espNote) {
    const f = (n) => (n.tbd ? 'TBD' : `${n.sec.toFixed(1)} s`);
    espNote.textContent = `τ esparcidores — Esp.1 (SL1): ${f(sl1[4])} · Esp.2 (CL): ${f(cl[4])} · Esp.3 (SL2): ${f(sl2[4])}`;
  }
}

/* Posición (x,y) del marcador de una capa dentro del carril. slice = cadena
   activa (desde el punto de inyección). Desliza continuo por el span de cada
   etapa según elapsed/τ; etapas con τ=0 (TBD) se cruzan al instante. */
export function upstreamMarkerPos(slice, elapsedSec, layer) {
  const laneY = layer === 'CL' ? LANE.thick : LANE.fine;
  const yOff = layer === 'SL1' ? -7 : layer === 'SL2' ? 7 : 0;
  let acc = 0;
  for (const node of slice) {
    const [x0, x1] = spanFor(node.id);
    if (node.sec <= 0) continue;
    if (elapsedSec < acc + node.sec) {
      const f = (elapsedSec - acc) / node.sec;
      // la inclinada sube en diagonal; el tramo al esparcidor viaja ya arriba
      const rise = node.id.startsWith('incl') ? 34 * f : (node.id.startsWith('esp') ? 34 : 0);
      return { x: x0 + f * (x1 - x0), y: laneY + yOff - rise, done: false };
    }
    acc += node.sec;
  }
  return { x: DIVIDER_X, y: laneY + yOff - 34, done: true };
}
