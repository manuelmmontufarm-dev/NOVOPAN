/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — carril upstream (silos → esparcidores)
   ------------------------------------------------------------
   REDISEÑO VERTICAL (jul-2026): el tramo esquemático silo → dosing →
   encolador ahora CAE en VERTICAL (cascada), una columna por ruta
   (FINA a la izquierda, GRUESA a la derecha). Al salir del encolador el
   material gira y retoma el movimiento HORIZONTAL sobre la banda
   inclinada, que corre a la derecha hasta el metro 0 (DIVIDER_X), donde
   empieza la escala métrica del colchón.

   Tiempos τ (no distancias) — mismo modelo v3, misma física. Solo cambia
   la disposición visual y por dónde viaja el punto animado del trazador.

   Contrato EXPORTADO sin cambios (line-app.js los llama igual):
     · renderUpstream()
     · refreshUpstreamChips(params)
     · upstreamMarkerPos(slice, elapsedSec, layer)
   UPSTREAM_W = 1920 y DIVIDER_X = 1900 SIN CAMBIOS → index.html / line-app.js
   no requieren ajustes.
   ============================================================ */

import { layerChain } from './v3-model.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

export const UPSTREAM_W = 1920;   // ancho del carril; el metro 0 vive en x = UPSTREAM_W + 80
const DIVIDER_X = 1900;

// Colores de ruta (los mismos de SL1/CL en el downstream)
const FINE_COLOR = '#1565C0';
const THICK_COLOR = '#0A7D5A';

// ── Configuración de cada COLUMNA vertical (una por ruta) ──
// La ruta FINA cae en una columna a la izquierda; la GRUESA a su derecha.
// Cada columna: silo (arriba) → dosing → encolador (abajo) → codo → banda
// inclinada HORIZONTAL hacia el metro 0. La banda de la FINA corre más abajo
// para pasar por debajo de la columna GRUESA sin cruzarla.
const COLS = {
  fine: {
    which: 'fine', color: FINE_COLOR, side: 'left',
    cx: 280,
    siloTop: 96, dosingTop: 250, encCy: 405, encBottom: 445,
    beltY: 475, beltX0: 280, beltX1: 1740,
    lenM: 64.57, vFix: 99.5,
    route: 'RUTA FINA · SL1 + SL2',
    target: '→ ESP. 1 (SL1) · ESP. 3 (SL2)',
    siloLabel: 'Silo 6 · fina', siloTitle: 'SILO 6 · FINA',
    dosLabel: 'Dosing fina', dosTitle: 'DOSING FINA',
    encLabel: 'Encolador CE', encTitle: 'ENCOLADOR CE',
    inclLabel: 'Banda inclinada fina', inclTitle: 'BANDA INCLINADA · FINA',
  },
  thick: {
    which: 'thick', color: THICK_COLOR, side: 'right',
    cx: 560,
    siloTop: 70, dosingTop: 205, encCy: 335, encBottom: 375,
    beltY: 400, beltX0: 560, beltX1: 1740,
    lenM: 68.5, vFix: 96.5,
    route: 'RUTA GRUESA · CL (core)',
    target: '→ ESP. 2 (CL)',
    siloLabel: 'Silo 5 · gruesa', siloTitle: 'SILO 5 · GRUESA',
    dosLabel: 'Dosing gruesa', dosTitle: 'DOSING GRUESA',
    encLabel: 'Encolador CI', encTitle: 'ENCOLADOR CI',
    inclLabel: 'Banda inclinada gruesa', inclTitle: 'BANDA INCLINADA · GRUESA',
  },
};

// Geometría del marcador por etapa (segmentos [x0,y0,x1,y1]) — el punto se
// interpola por elapsed/τ dentro de cada segmento. Silo/dosing/enc caen en
// VERTICAL; incl/esp corren en HORIZONTAL sobre la banda hacia el metro 0.
const GEO = {
  fine: {
    silo:   [280, 120, 280, 245],
    dosing: [280, 245, 280, 375],
    enc:    [280, 375, 280, 455],
    incl:   [280, 475, 1740, 475],
    esp:    [1740, 475, DIVIDER_X, 468],
  },
  thick: {
    silo:   [560, 100, 560, 205],
    dosing: [560, 205, 560, 335],
    enc:    [560, 335, 560, 378],
    incl:   [560, 400, 1740, 400],
    esp:    [1740, 400, DIVIDER_X, 394],
  },
};

function el(tag, attrs, txt) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (txt != null) node.textContent = txt;
  return node;
}

/* Rótulo centrado (por encima de un equipo). */
function centerLabel(g, cx, top, w, title, sub, color, injectNode, injectLabel) {
  const box = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': injectNode, 'data-label': injectLabel });
  box.appendChild(el('rect', { x: cx - w / 2, y: top, width: w, height: 30, rx: 6, fill: '#FFFFFF', stroke: color, 'stroke-width': 1.5 }));
  box.appendChild(el('text', { x: cx, y: top + 14, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 13, fill: '#1A1D1B' }, title));
  box.appendChild(el('text', { x: cx, y: top + 25, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#676E69' }, sub));
  g.appendChild(box);
  return box;
}

/* Rótulo lateral (a un costado de un equipo, alineado hacia la columna). */
function sideLabel(g, side, edgeX, yc, title, sub, color, injectNode, injectLabel) {
  const w = 150;
  const box = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': injectNode, 'data-label': injectLabel });
  const x = side === 'left' ? edgeX - w : edgeX;
  const anchor = side === 'left' ? 'end' : 'start';
  const tx = side === 'left' ? edgeX - 10 : edgeX + 10;
  box.appendChild(el('rect', { x, y: yc - 17, width: w, height: 34, rx: 6, fill: '#FFFFFF', stroke: color, 'stroke-width': 1.5 }));
  box.appendChild(el('text', { x: tx, y: yc - 2, 'text-anchor': anchor, 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 13, fill: '#1A1D1B' }, title));
  box.appendChild(el('text', { x: tx, y: yc + 11, 'text-anchor': anchor, 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#676E69' }, sub));
  g.appendChild(box);
  return box;
}

/* Chip de tiempo. data-chip para refrescar sin redibujar. cy = centro. */
function timeChip(g, cx, cy, chipId) {
  const c = el('g', { 'data-chip': chipId });
  c.appendChild(el('rect', { x: cx - 34, y: cy - 9, width: 68, height: 18, rx: 9, fill: '#EEF0EB', stroke: '#D9DDD9', 'data-chip-bg': chipId }));
  c.appendChild(el('text', {
    x: cx, y: cy + 4, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif",
    'font-weight': 700, 'font-size': 11, fill: '#3D423F', 'data-chip-text': chipId,
  }, '—'));
  g.appendChild(c);
}

/* Tubería vertical entre dos equipos + hilo de material cayendo. */
function pipe(g, cx, y0, y1, color) {
  g.appendChild(el('rect', { x: cx - 7, y: y0, width: 14, height: Math.max(0, y1 - y0), fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1 }));
  g.appendChild(el('line', { x1: cx, y1: y0, x2: cx, y2: y1, stroke: color, 'stroke-width': 3, 'stroke-dasharray': '6 8', opacity: 0.55, style: 'animation:fall 1.2s linear infinite' }));
}

/* Codo: caída del encolador a la banda + cuarto de vuelta a horizontal. */
function elbow(g, cx, yFrom, beltY, color) {
  const r = 20;
  const d = `M ${cx} ${yFrom} L ${cx} ${beltY - r} Q ${cx} ${beltY} ${cx + r} ${beltY}`;
  g.appendChild(el('path', { d, fill: 'none', stroke: '#98A6B4', 'stroke-width': 8, 'stroke-linecap': 'round' }));
  g.appendChild(el('path', { d, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-dasharray': '5 8', opacity: 0.6, style: 'animation:fall 1.1s linear infinite' }));
}

/* Silo (tolva cónica) — mismo dibujo, recolocado en vertical. top = borde
   superior del cuerpo. La salida cae hacia el dosing (abajo). */
function drawSilo(g, cx, top, color, which) {
  const grp = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': `silo-${which}`, 'data-label': which === 'fine' ? 'Silo 6 · fina' : 'Silo 5 · gruesa' });
  grp.appendChild(el('rect', { x: cx - 44, y: top, width: 88, height: 82, rx: 8, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('polygon', { points: `${cx - 44},${top + 82} ${cx + 44},${top + 82} ${cx + 12},${top + 118} ${cx - 12},${top + 118}`, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('rect', { x: cx - 12, y: top + 118, width: 24, height: 10, fill: '#4A5560' }));
  grp.appendChild(el('rect', { x: cx - 38, y: top + 34, width: 76, height: 44, rx: 4, fill: which === 'fine' ? '#ECC873' : '#C98B2E', opacity: 0.85 }));
  grp.appendChild(el('line', { x1: cx - 44, y1: top + 34, x2: cx + 44, y2: top + 34, stroke: '#6B7886', 'stroke-width': 1, 'stroke-dasharray': '3 3' }));
  g.appendChild(grp);
}

/* Dosing (bin + cono) — recolocado en vertical. top = borde superior. */
function drawDosing(g, cx, top, color, which) {
  const grp = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': `dosing-${which}`, 'data-label': which === 'fine' ? 'Dosing fina' : 'Dosing gruesa' });
  grp.appendChild(el('rect', { x: cx - 40, y: top, width: 80, height: 58, rx: 6, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('rect', { x: cx - 40, y: top, width: 80, height: 8, rx: 3, fill: color }));
  grp.appendChild(el('polygon', { points: `${cx - 40},${top + 58} ${cx + 40},${top + 58} ${cx + 10},${top + 88} ${cx - 10},${top + 88}`, fill: '#3C4652' }));
  const drops = el('g', { fill: which === 'fine' ? '#ECC873' : '#C98B2E' });
  drops.appendChild(el('circle', { cx: cx - 6, cy: top + 100, r: 2.5, style: 'animation:fall 1.1s linear infinite' }));
  drops.appendChild(el('circle', { cx: cx + 5, cy: top + 100, r: 2, style: 'animation:fall 1.3s linear infinite;animation-delay:.4s' }));
  grp.appendChild(drops);
  g.appendChild(grp);
}

/* Encolador (tambor + spray de resina) — recolocado, entra por arriba y sale
   por abajo hacia el codo. cy = centro del tambor. */
function drawEnc(g, cx, cy, color, which) {
  const grp = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': `enc-${which}`, 'data-label': which === 'fine' ? 'Encolador CE' : 'Encolador CI' });
  grp.appendChild(el('rect', { x: cx - 62, y: cy - 26, width: 124, height: 52, rx: 26, fill: 'url(#steelBlue)', stroke: '#5E7286', 'stroke-width': 1.5 }));
  const blades = el('g', { stroke: '#5E7286', 'stroke-width': 2, opacity: 0.7 });
  for (let i = -2; i <= 2; i++) blades.appendChild(el('line', { x1: cx + i * 22, y1: cy - 18, x2: cx + i * 22 + 8, y2: cy + 18 }));
  grp.appendChild(blades);
  const mist = el('g', { fill: '#9FC0D8' });
  mist.appendChild(el('ellipse', { cx: cx - 20, cy: cy - 34, rx: 8, ry: 5, opacity: 0.45, style: 'animation:mist 2.4s ease-in-out infinite' }));
  mist.appendChild(el('ellipse', { cx: cx + 18, cy: cy - 36, rx: 9, ry: 5, opacity: 0.45, style: 'animation:mist 2.8s ease-in-out infinite;animation-delay:.6s' }));
  grp.appendChild(mist);
  grp.appendChild(el('polygon', { points: `${cx - 8},${cy + 26} ${cx + 8},${cy + 26} ${cx},${cy + 40}`, fill: '#4A5560' }));
  g.appendChild(grp);
}

/* Banda inclinada HORIZONTAL: corre desde la columna hacia el metro 0. */
function drawBelt(g, cfg) {
  const { beltX0, beltX1, beltY, which, inclLabel, inclTitle, color, lenM, vFix } = cfg;
  const grp = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': `incl-${which}`, 'data-label': inclLabel });
  grp.appendChild(el('rect', { x: beltX0, y: beltY - 16, width: beltX1 - beltX0, height: 32, fill: 'transparent' }));
  grp.appendChild(el('line', { x1: beltX0, y1: beltY, x2: beltX1, y2: beltY, stroke: '#1565C0', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.85 }));
  grp.appendChild(el('line', { x1: beltX0, y1: beltY, x2: beltX1, y2: beltY, stroke: '#BBDEFB', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '10 12', style: 'animation:conveyor 1.1s linear infinite' }));
  grp.appendChild(el('circle', { cx: beltX0, cy: beltY, r: 9, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('circle', { cx: beltX1, cy: beltY, r: 9, fill: 'url(#steel)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  g.appendChild(grp);
  const midX = (beltX0 + 220 + beltX1) / 2;
  centerLabel(g, midX, beltY - 50, 200, inclTitle, `${lenM} m @ ${vFix} m/min · Medido (v fija HMI)`, color, `incl-${which}`, inclLabel);
  timeChip(g, midX, beltY + 30, `incl-${which}`);
}

/* Conector final: de la banda al metro 0 (esparcidores en el tramo métrico). */
function drawConnector(g, cfg) {
  const { beltX1, beltY, color, target } = cfg;
  g.appendChild(el('line', { x1: beltX1, y1: beltY, x2: DIVIDER_X, y2: beltY, stroke: color, 'stroke-width': 3, 'stroke-dasharray': '7 6', opacity: 0.8 }));
  g.appendChild(el('polygon', { points: `${DIVIDER_X - 2},${beltY - 7} ${DIVIDER_X + 12},${beltY} ${DIVIDER_X - 2},${beltY + 7}`, fill: color }));
  g.appendChild(el('text', {
    x: DIVIDER_X - 18, y: beltY - 12, 'text-anchor': 'end',
    'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: color,
  }, target));
}

/* Dibuja una columna completa (silo → dosing → enc → codo → banda). */
function renderColumn(g, cfg) {
  const { cx, side, color, siloTop, dosingTop, encCy, encBottom, beltY, route } = cfg;
  const labelEdge = side === 'left' ? cx - 56 : cx + 56;
  const chipX = side === 'left' ? cx + 92 : cx - 92;

  // espina gris de la columna (detrás de los equipos)
  g.appendChild(el('line', { x1: cx, y1: siloTop, x2: cx, y2: encBottom, stroke: '#98A6B4', 'stroke-width': 3, opacity: 0.5 }));

  // título de ruta (arriba de la columna)
  g.appendChild(el('text', { x: cx, y: siloTop - 30, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 13, fill: color }, route));

  // tuberías entre etapas
  pipe(g, cx, siloTop + 128, dosingTop, color);
  pipe(g, cx, dosingTop + 88, encCy - 26, color);
  elbow(g, cx, encCy + 40, beltY, color);

  // equipos
  drawSilo(g, cx, siloTop, color, cfg.which);
  drawDosing(g, cx, dosingTop, color, cfg.which);
  drawEnc(g, cx, encCy, color, cfg.which);

  // rótulos laterales + chips (lado opuesto)
  sideLabel(g, side, labelEdge, siloTop + 55, cfg.siloTitle, 'τ = ρ·V·L% / F_out × 60 · TBD', color, `silo-${cfg.which}`, cfg.siloLabel);
  sideLabel(g, side, labelEdge, dosingTop + 30, cfg.dosTitle, 'τ = M / F_descarga × 60 · HMI', color, `dosing-${cfg.which}`, cfg.dosLabel);
  sideLabel(g, side, labelEdge, encCy, cfg.encTitle, 't_enc = prueba de trazador · TBD', color, `enc-${cfg.which}`, cfg.encLabel);
  timeChip(g, chipX, siloTop + 55, `silo-${cfg.which}`);
  timeChip(g, chipX, dosingTop + 30, `dosing-${cfg.which}`);
  timeChip(g, chipX, encCy, `enc-${cfg.which}`);

  // banda inclinada + conector
  drawBelt(g, cfg);
  drawConnector(g, cfg);
}

export function renderUpstream() {
  const g = document.getElementById('upstreamRoot');
  if (!g) return;
  g.innerHTML = '';

  // Fondo de zona esquemática
  g.appendChild(el('rect', { x: 0, y: 42, width: DIVIDER_X, height: 456, fill: 'rgba(55,71,79,0.04)' }));

  // Cinta de zona
  const ribbon = el('g', { 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 13, 'text-anchor': 'middle', fill: '#fff', 'letter-spacing': '0.06em' });
  ribbon.appendChild(el('rect', { x: 600, y: 10, width: 600, height: 26, rx: 13, fill: '#37474F' }));
  ribbon.appendChild(el('text', { x: 900, y: 27 }, '0 · SILOS · DOSIFICACIÓN Y ENCOLADO — MODELO v3'));
  g.appendChild(ribbon);
  g.appendChild(el('text', {
    x: 900, y: 52, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif",
    'font-weight': 600, 'font-size': 10, fill: '#676E69',
  }, 'Cascada vertical por TIEMPO de residencia (τ = M/F × 60) → banda inclinada horizontal al metro 0'));

  // Divisor: aquí empieza la escala métrica del colchón
  g.appendChild(el('line', { x1: DIVIDER_X, y1: 44, x2: DIVIDER_X, y2: 490, stroke: '#37474F', 'stroke-width': 2, 'stroke-dasharray': '6 5' }));
  g.appendChild(el('text', {
    x: DIVIDER_X - 8, y: 484, 'text-anchor': 'end', 'font-family': "'Barlow',sans-serif",
    'font-weight': 700, 'font-size': 9, fill: '#37474F', 'letter-spacing': '0.05em',
  }, 'FIN TRAMO ESQUEMÁTICO → ESCALA MÉTRICA (70 px = 1 m)'));
  g.appendChild(el('text', {
    x: DIVIDER_X - 8, y: 497, 'text-anchor': 'end', 'font-family': "'Barlow',sans-serif",
    'font-weight': 600, 'font-size': 9, fill: '#676E69', id: 'upstreamEspNote',
  }, ''));

  // Botón "cambio de receta" (arranca en LOS DOS silos → 3 capas)
  const btn = el('g', { class: 's2-machine s2-up-node s2-up-recipe', 'data-inject-node': 'silos', 'data-label': 'Cambio de receta · silos' });
  btn.appendChild(el('rect', { x: 24, y: 60, width: 68, height: 84, rx: 10, fill: '#FFDE00', stroke: '#1A1D1B', 'stroke-width': 1.5 }));
  btn.appendChild(el('text', { x: 58, y: 86, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#1A1D1B' }, 'CAMBIO'));
  btn.appendChild(el('text', { x: 58, y: 100, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#1A1D1B' }, 'RECETA'));
  btn.appendChild(el('text', { x: 58, y: 118, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#3D423F' }, 'silos 5 + 6'));
  btn.appendChild(el('text', { x: 58, y: 128, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#3D423F' }, '3 capas'));
  g.appendChild(btn);

  // Botón DISCRETO "cambio en encolador (ambas rutas)" — pastilla compacta entre
  // las dos columnas, a la altura de las encoladoras. El cambio se ve en LAS DOS
  // filas (mismo color) y se unen en la línea de formación. (Las encoladoras CE/CI
  // siguen siendo clicables por separado para un cambio en una sola ruta.)
  const bx = 420, by = 368, bw = 118, bh = 26;
  const encBtn = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': 'enc', 'data-label': 'Cambio · encolador (ambas rutas)' });
  encBtn.appendChild(el('rect', { x: bx - bw / 2, y: by, width: bw, height: bh, rx: 13, fill: '#FFFFFF', stroke: '#0A7D5A', 'stroke-width': 1.5 }));
  encBtn.appendChild(el('circle', { cx: bx - bw / 2 + 15, cy: by + bh / 2, r: 7, fill: '#0A7D5A' }));
  encBtn.appendChild(el('text', { x: bx - bw / 2 + 15, y: by + bh / 2 + 4, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#fff' }, '+'));
  encBtn.appendChild(el('text', { x: bx + 8, y: by + bh / 2 + 4, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 700, 'font-size': 10, fill: '#1A1D1B' }, 'cambio encolador'));
  g.appendChild(encBtn);

  // Columnas verticales: FINA (izquierda) y GRUESA (derecha)
  renderColumn(g, COLS.fine);
  renderColumn(g, COLS.thick);
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
  const espNote = document.getElementById('upstreamEspNote');
  if (espNote) {
    const f = (n) => (n.tbd ? 'TBD' : `${n.sec.toFixed(1)} s`);
    espNote.textContent = `τ esparcidores — Esp.1 (SL1): ${f(sl1[4])} · Esp.2 (CL): ${f(cl[4])} · Esp.3 (SL2): ${f(sl2[4])}`;
  }
}

/* Posición (x,y) del marcador de una capa dentro del carril. slice = cadena
   activa (desde el punto de inyección). Silo/dosing/enc CAEN en vertical;
   incl/esp corren en horizontal sobre la banda. Etapas con τ=0 (TBD) se
   cruzan al instante. */
export function upstreamMarkerPos(slice, elapsedSec, layer, opts = {}) {
  const col = layer === 'CL' ? 'thick' : 'fine';
  const geo = GEO[col];
  const off = layer === 'SL1' ? -7 : layer === 'SL2' ? 7 : 0;   // separa SL1/SL2 (misma columna)
  const merge = opts.mergeTo;   // {x,y}: punto de formación común (dos filas se unen)
  let acc = 0;
  for (const node of slice) {
    const base = node.id.split('-')[0];
    const seg = geo[base];
    if (!seg) continue;
    if (node.sec <= 0) continue;
    if (elapsedSec < acc + node.sec) {
      const f = (elapsedSec - acc) / node.sec;
      // en el tramo esparcidor con merge, converge desde el fin de banda al punto común
      if (base === 'esp' && merge) {
        return { x: seg[0] + f * (merge.x - seg[0]), y: seg[1] + f * (merge.y - seg[1]), done: false };
      }
      const x = seg[0] + f * (seg[2] - seg[0]);
      const y = seg[1] + f * (seg[3] - seg[1]);
      const vertical = base === 'silo' || base === 'dosing' || base === 'enc';
      // el offset separa las dos capas finas: perpendicular al movimiento
      return { x: x + (vertical ? off : 0), y: y + (vertical ? 0 : off), done: false };
    }
    acc += node.sec;
  }
  return merge ? { x: merge.x, y: merge.y, done: true } : { x: DIVIDER_X, y: geo.esp[3] + off, done: true };
}
