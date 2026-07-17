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

/* Rótulo centrado (HUD glass). */
function centerLabel(g, cx, top, w, title, sub, color, injectNode, injectLabel) {
  const box = el('g', { class: 's2-machine s2-up-node s2-hud-tag', 'data-inject-node': injectNode, 'data-label': injectLabel });
  box.appendChild(el('rect', { x: cx - w / 2, y: top, width: w, height: 34, rx: 8, fill: 'rgba(255,255,255,0.92)', stroke: color, 'stroke-width': 1.6, filter: 'url(#equipShadow)' }));
  box.appendChild(el('rect', { x: cx - w / 2, y: top, width: 5, height: 34, rx: 2, fill: color }));
  box.appendChild(el('text', { x: cx + 2, y: top + 15, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#1A1D1B' }, title));
  box.appendChild(el('text', { x: cx + 2, y: top + 27, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#676E69' }, sub));
  g.appendChild(box);
  return box;
}

/* Rótulo lateral (HUD glass). */
function sideLabel(g, side, edgeX, yc, title, sub, color, injectNode, injectLabel) {
  const w = 158;
  const box = el('g', { class: 's2-machine s2-up-node s2-hud-tag', 'data-inject-node': injectNode, 'data-label': injectLabel });
  const x = side === 'left' ? edgeX - w : edgeX;
  const anchor = side === 'left' ? 'end' : 'start';
  const tx = side === 'left' ? edgeX - 12 : edgeX + 12;
  const accentX = side === 'left' ? x + w - 5 : x;
  box.appendChild(el('rect', { x, y: yc - 19, width: w, height: 38, rx: 8, fill: 'rgba(255,255,255,0.94)', stroke: color, 'stroke-width': 1.6, filter: 'url(#equipShadow)' }));
  box.appendChild(el('rect', { x: accentX, y: yc - 19, width: 5, height: 38, rx: 2, fill: color }));
  box.appendChild(el('text', { x: tx, y: yc - 2, 'text-anchor': anchor, 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#1A1D1B' }, title));
  box.appendChild(el('text', { x: tx, y: yc + 12, 'text-anchor': anchor, 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#676E69' }, sub));
  g.appendChild(box);
  return box;
}

/* Chip de tiempo. data-chip para refrescar sin redibujar. cy = centro. */
function timeChip(g, cx, cy, chipId) {
  const c = el('g', { 'data-chip': chipId, class: 's2-hud-chip' });
  c.appendChild(el('rect', { x: cx - 36, y: cy - 11, width: 72, height: 22, rx: 11, fill: 'rgba(26,29,27,0.88)', stroke: 'rgba(255,255,255,0.12)', 'data-chip-bg': chipId }));
  c.appendChild(el('text', {
    x: cx, y: cy + 4, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif",
    'font-weight': 800, 'font-size': 12, fill: '#FFDE00', 'data-chip-text': chipId,
  }, '—'));
  g.appendChild(c);
}

/* Tubería vertical entre dos equipos + hilo de material cayendo. */
function pipe(g, cx, y0, y1, color) {
  const h = Math.max(0, y1 - y0);
  g.appendChild(el('rect', { x: cx - 9, y: y0, width: 18, height: h, rx: 3, fill: 'url(#steel)', stroke: '#5E6A76', 'stroke-width': 1 }));
  g.appendChild(el('rect', { x: cx - 5, y: y0, width: 3, height: h, fill: 'rgba(255,255,255,0.35)' }));
  g.appendChild(el('line', { x1: cx, y1: y0 + 2, x2: cx, y2: y1 - 2, stroke: color, 'stroke-width': 3, 'stroke-dasharray': '5 7', opacity: 0.65, style: 'animation:fall 1.2s linear infinite' }));
}

/* Codo: caída del encolador a la banda + cuarto de vuelta a horizontal. */
function elbow(g, cx, yFrom, beltY, color) {
  const r = 22;
  const d = `M ${cx} ${yFrom} L ${cx} ${beltY - r} Q ${cx} ${beltY} ${cx + r} ${beltY}`;
  g.appendChild(el('path', { d, fill: 'none', stroke: '#6B7886', 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0.35 }));
  g.appendChild(el('path', { d, fill: 'none', stroke: '#98A6B4', 'stroke-width': 8, 'stroke-linecap': 'round' }));
  g.appendChild(el('path', { d, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-dasharray': '5 8', opacity: 0.7, style: 'animation:fall 1.1s linear infinite' }));
}

/* Silo cilíndrico 3D (tolva industrial) — top = borde superior del cuerpo. */
function drawSilo(g, cx, top, color, which) {
  const grp = el('g', {
    class: 's2-machine s2-up-node s2-equip s2-equip--silo',
    'data-inject-node': `silo-${which}`,
    'data-label': which === 'fine' ? 'Silo 6 · fina' : 'Silo 5 · gruesa',
    filter: 'url(#equipShadow)',
  });
  const w = 86;
  const bodyH = 78;
  const rx = w / 2;
  const chip = which === 'fine' ? 'url(#chipFine)' : 'url(#chipThick)';
  const fillTop = top + 28;
  const fillH = 42;

  // sombra en piso
  grp.appendChild(el('ellipse', { cx, cy: top + 126, rx: 40, ry: 7, fill: 'rgba(26,36,44,0.22)' }));

  // patas / estructura
  grp.appendChild(el('line', { x1: cx - 34, y1: top + 88, x2: cx - 28, y2: top + 122, stroke: '#5A6570', 'stroke-width': 3, 'stroke-linecap': 'round' }));
  grp.appendChild(el('line', { x1: cx + 34, y1: top + 88, x2: cx + 28, y2: top + 122, stroke: '#5A6570', 'stroke-width': 3, 'stroke-linecap': 'round' }));
  grp.appendChild(el('line', { x1: cx - 30, y1: top + 108, x2: cx + 30, y2: top + 108, stroke: '#7A8794', 'stroke-width': 2 }));

  // cono de descarga
  grp.appendChild(el('polygon', {
    points: `${cx - rx},${top + bodyH} ${cx + rx},${top + bodyH} ${cx + 14},${top + 112} ${cx - 14},${top + 112}`,
    fill: 'url(#binCone)', stroke: '#5A6570', 'stroke-width': 1.2,
  }));
  grp.appendChild(el('rect', { x: cx - 12, y: top + 112, width: 24, height: 10, rx: 2, fill: '#3C4652', stroke: '#2A323A', 'stroke-width': 1 }));

  // cuerpo cilíndrico
  grp.appendChild(el('rect', { x: cx - rx, y: top + 8, width: w, height: bodyH - 8, fill: 'url(#binShellTall)', stroke: '#6B7886', 'stroke-width': 1.4 }));
  // elipse inferior (base del cilindro)
  grp.appendChild(el('ellipse', { cx, cy: top + bodyH, rx, ry: 10, fill: 'url(#binLid)', stroke: '#6B7886', 'stroke-width': 1 }));
  // material (nivel)
  grp.appendChild(el('rect', { x: cx - rx + 6, y: fillTop, width: w - 12, height: fillH, fill: chip, opacity: 0.92 }));
  grp.appendChild(el('ellipse', { cx, cy: fillTop, rx: rx - 6, ry: 7, fill: which === 'fine' ? '#F0D078' : '#E0A84A', opacity: 0.9 }));
  // anillos de refuerzo
  for (const yy of [top + 30, top + 52, top + 74]) {
    grp.appendChild(el('ellipse', { cx, cy: yy, rx: rx - 1, ry: 6, fill: 'none', stroke: 'rgba(90,101,112,0.55)', 'stroke-width': 1.4 }));
  }
  // brillo cilíndrico
  grp.appendChild(el('rect', { x: cx - rx + 10, y: top + 12, width: 10, height: bodyH - 18, rx: 4, fill: 'rgba(255,255,255,0.38)' }));
  // tapa / plataforma superior
  grp.appendChild(el('ellipse', { cx, cy: top + 8, rx, ry: 12, fill: 'url(#binLid)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('ellipse', { cx, cy: top + 6, rx: rx - 10, ry: 7, fill: '#E8EEF3', stroke: color, 'stroke-width': 2 }));
  // barandal / pasarela
  grp.appendChild(el('line', { x1: cx - rx + 6, y1: top + 2, x2: cx + rx - 6, y2: top + 2, stroke: '#4A5560', 'stroke-width': 2 }));
  grp.appendChild(el('line', { x1: cx - rx + 8, y1: top - 6, x2: cx - rx + 8, y2: top + 2, stroke: '#4A5560', 'stroke-width': 1.5 }));
  grp.appendChild(el('line', { x1: cx + rx - 8, y1: top - 6, x2: cx + rx - 8, y2: top + 2, stroke: '#4A5560', 'stroke-width': 1.5 }));
  grp.appendChild(el('line', { x1: cx - rx + 8, y1: top - 6, x2: cx + rx - 8, y2: top - 6, stroke: '#4A5560', 'stroke-width': 1.5 }));
  // brida de entrada
  grp.appendChild(el('rect', { x: cx - 10, y: top - 14, width: 20, height: 10, rx: 2, fill: '#7A8794', stroke: '#4A5560', 'stroke-width': 1 }));
  // acento de ruta
  grp.appendChild(el('rect', { x: cx - 18, y: top + 14, width: 36, height: 5, rx: 2, fill: color }));

  g.appendChild(grp);
}

/* Dosing bin cilíndrico 3D — tolva industrial tipo silo corto (foto planta). */
function drawDosing(g, cx, top, color, which) {
  const grp = el('g', {
    class: 's2-machine s2-up-node s2-equip s2-equip--dosing',
    'data-inject-node': `dosing-${which}`,
    'data-label': which === 'fine' ? 'Dosing fina' : 'Dosing gruesa',
    filter: 'url(#equipShadow)',
  });
  const w = 72;
  const bodyH = 50;
  const rx = w / 2;
  const ry = 13; // elipse de tapa (más “cilindro” que caja)
  const chip = which === 'fine' ? 'url(#chipFine)' : 'url(#chipThick)';
  const yBody = top + ry;
  const yBase = yBody + bodyH;

  // sombra en piso
  grp.appendChild(el('ellipse', { cx, cy: top + 100, rx: 34, ry: 6, fill: 'rgba(26,36,44,0.26)' }));

  // patas + travesaño
  grp.appendChild(el('line', { x1: cx - 28, y1: yBase - 4, x2: cx - 22, y2: top + 96, stroke: '#5A6570', 'stroke-width': 2.8, 'stroke-linecap': 'round' }));
  grp.appendChild(el('line', { x1: cx + 28, y1: yBase - 4, x2: cx + 22, y2: top + 96, stroke: '#5A6570', 'stroke-width': 2.8, 'stroke-linecap': 'round' }));
  grp.appendChild(el('line', { x1: cx - 24, y1: top + 84, x2: cx + 24, y2: top + 84, stroke: '#7A8794', 'stroke-width': 1.8 }));

  // cono hopper
  grp.appendChild(el('polygon', {
    points: `${cx - rx + 2},${yBase} ${cx + rx - 2},${yBase} ${cx + 11},${top + 86} ${cx - 11},${top + 86}`,
    fill: 'url(#binCone)', stroke: '#5A6570', 'stroke-width': 1.2,
  }));
  grp.appendChild(el('ellipse', { cx, cy: yBase, rx: rx - 2, ry: 7, fill: '#8A949E', stroke: '#5A6570', 'stroke-width': 1 }));
  // válvula
  grp.appendChild(el('rect', { x: cx - 10, y: top + 86, width: 20, height: 7, rx: 2, fill: '#3C4652', stroke: '#2A323A', 'stroke-width': 1 }));
  grp.appendChild(el('rect', { x: cx - 6, y: top + 93, width: 12, height: 5, rx: 1, fill: '#5A6570' }));

  // cuerpo cilíndrico (rect + elipses = 3D)
  grp.appendChild(el('rect', { x: cx - rx, y: yBody, width: w, height: bodyH, fill: 'url(#binShell)', stroke: '#6B7886', 'stroke-width': 1.3 }));
  // anillos de refuerzo (elipses = lectura cilíndrica)
  for (const yy of [yBody + 12, yBody + 26, yBody + 40]) {
    grp.appendChild(el('ellipse', { cx, cy: yy, rx: rx - 0.5, ry: 6, fill: 'none', stroke: 'rgba(60,70,80,0.45)', 'stroke-width': 1.35 }));
  }
  // material interno (nivel)
  grp.appendChild(el('rect', { x: cx - rx + 8, y: yBody + 16, width: w - 16, height: 28, fill: chip, opacity: 0.95 }));
  grp.appendChild(el('ellipse', { cx, cy: yBody + 16, rx: rx - 8, ry: 5, fill: which === 'fine' ? '#F0D078' : '#E0A84A' }));
  // ventana de inspección
  grp.appendChild(el('rect', { x: cx - 14, y: yBody + 14, width: 28, height: 30, rx: 5, fill: 'none', stroke: '#2A323A', 'stroke-width': 1.6, opacity: 0.55 }));
  grp.appendChild(el('rect', { x: cx - 12, y: yBody + 16, width: 6, height: 26, rx: 2, fill: 'rgba(255,255,255,0.12)' }));
  // highlight vertical (curvatura)
  grp.appendChild(el('rect', { x: cx - rx + 8, y: yBody + 2, width: 7, height: bodyH - 4, rx: 3, fill: 'rgba(255,255,255,0.45)' }));
  grp.appendChild(el('rect', { x: cx + rx - 16, y: yBody + 4, width: 5, height: bodyH - 8, rx: 2, fill: 'rgba(0,0,0,0.10)' }));

  // tapa elíptica + anillo de ruta + pasarela
  grp.appendChild(el('ellipse', { cx, cy: yBody, rx, ry, fill: 'url(#binLid)', stroke: '#6B7886', 'stroke-width': 1.5 }));
  grp.appendChild(el('ellipse', { cx, cy: top + 4, rx: rx - 7, ry: ry - 4, fill: '#EEF2F6', stroke: color, 'stroke-width': 2.5 }));
  grp.appendChild(el('line', { x1: cx - rx + 6, y1: top + 2, x2: cx + rx - 6, y2: top + 2, stroke: '#3C4652', 'stroke-width': 2 }));
  grp.appendChild(el('line', { x1: cx - rx + 10, y1: top - 7, x2: cx - rx + 10, y2: top + 2, stroke: '#3C4652', 'stroke-width': 1.4 }));
  grp.appendChild(el('line', { x1: cx + rx - 10, y1: top - 7, x2: cx + rx - 10, y2: top + 2, stroke: '#3C4652', 'stroke-width': 1.4 }));
  grp.appendChild(el('line', { x1: cx - rx + 10, y1: top - 7, x2: cx + rx - 10, y2: top - 7, stroke: '#3C4652', 'stroke-width': 1.4 }));
  grp.appendChild(el('rect', { x: cx - 8, y: top - 14, width: 16, height: 10, rx: 2, fill: '#7A8794', stroke: color, 'stroke-width': 1.5 }));

  // partículas cayendo
  const drops = el('g', { fill: which === 'fine' ? '#E0B456' : '#C98B2E' });
  drops.appendChild(el('circle', { cx: cx - 5, cy: top + 104, r: 2.4, style: 'animation:fall 1.1s linear infinite' }));
  drops.appendChild(el('circle', { cx: cx + 4, cy: top + 104, r: 2, style: 'animation:fall 1.3s linear infinite;animation-delay:.35s' }));
  grp.appendChild(drops);

  g.appendChild(grp);
}

/* Encolador (tambor + spray de resina) — más volumen 3D. */
function drawEnc(g, cx, cy, color, which) {
  const grp = el('g', {
    class: 's2-machine s2-up-node s2-equip s2-equip--enc',
    'data-inject-node': `enc-${which}`,
    'data-label': which === 'fine' ? 'Encolador CE' : 'Encolador CI',
    filter: 'url(#equipShadow)',
  });
  // sombra
  grp.appendChild(el('ellipse', { cx, cy: cy + 38, rx: 58, ry: 8, fill: 'rgba(26,36,44,0.2)' }));
  // cuerpo tambor
  grp.appendChild(el('rect', { x: cx - 64, y: cy - 28, width: 128, height: 56, rx: 28, fill: 'url(#steelBlue)', stroke: '#5E7286', 'stroke-width': 1.6 }));
  grp.appendChild(el('ellipse', { cx: cx - 64, cy, rx: 10, ry: 28, fill: '#8FA3B8', stroke: '#5E7286', 'stroke-width': 1 }));
  grp.appendChild(el('ellipse', { cx: cx + 64, cy, rx: 10, ry: 28, fill: '#6B8298', stroke: '#5E7286', 'stroke-width': 1 }));
  // highlight
  grp.appendChild(el('rect', { x: cx - 50, y: cy - 22, width: 100, height: 10, rx: 5, fill: 'rgba(255,255,255,0.28)' }));
  const blades = el('g', { stroke: '#4A5A6A', 'stroke-width': 2, opacity: 0.75 });
  for (let i = -2; i <= 2; i++) blades.appendChild(el('line', { x1: cx + i * 22, y1: cy - 16, x2: cx + i * 22 + 10, y2: cy + 16 }));
  grp.appendChild(blades);
  const mist = el('g', { fill: '#9FC0D8', filter: 'url(#softGlow)' });
  mist.appendChild(el('ellipse', { cx: cx - 20, cy: cy - 36, rx: 9, ry: 6, opacity: 0.5, style: 'animation:mist 2.4s ease-in-out infinite' }));
  mist.appendChild(el('ellipse', { cx: cx + 18, cy: cy - 38, rx: 10, ry: 6, opacity: 0.5, style: 'animation:mist 2.8s ease-in-out infinite;animation-delay:.6s' }));
  grp.appendChild(mist);
  // salida
  grp.appendChild(el('polygon', { points: `${cx - 10},${cy + 28} ${cx + 10},${cy + 28} ${cx},${cy + 42}`, fill: '#3C4652', stroke: '#2A323A', 'stroke-width': 1 }));
  // anillo de ruta
  grp.appendChild(el('rect', { x: cx - 22, y: cy + 18, width: 44, height: 4, rx: 2, fill: color }));
  g.appendChild(grp);
}

/* Banda inclinada HORIZONTAL 3D: corre desde la columna hacia el metro 0. */
function drawBelt(g, cfg) {
  const { beltX0, beltX1, beltY, which, inclLabel, inclTitle, color, lenM, vFix } = cfg;
  const grp = el('g', { class: 's2-machine s2-up-node s2-equip s2-equip--belt', 'data-inject-node': `incl-${which}`, 'data-label': inclLabel });
  const len = beltX1 - beltX0;
  grp.appendChild(el('rect', { x: beltX0, y: beltY - 18, width: len, height: 36, fill: 'transparent' }));
  // rail sombra
  grp.appendChild(el('rect', { x: beltX0, y: beltY - 2, width: len, height: 14, rx: 7, fill: 'rgba(13,71,161,0.18)' }));
  // superficie 3D
  grp.appendChild(el('rect', { x: beltX0, y: beltY - 9, width: len, height: 18, rx: 9, fill: 'url(#beltBlue3d)', stroke: '#0D47A1', 'stroke-width': 1.4, filter: 'url(#equipShadow)' }));
  grp.appendChild(el('rect', { x: beltX0 + 4, y: beltY - 7, width: len - 8, height: 5, rx: 3, fill: 'rgba(255,255,255,0.28)' }));
  grp.appendChild(el('line', {
    x1: beltX0 + 8, y1: beltY, x2: beltX1 - 8, y2: beltY,
    stroke: 'rgba(255,255,255,0.55)', 'stroke-width': 2.5, 'stroke-linecap': 'round',
    'stroke-dasharray': '12 10', style: 'animation:conveyor 1.1s linear infinite',
  }));
  // tambores
  for (const dx of [beltX0, beltX1]) {
    grp.appendChild(el('circle', { cx: dx, cy: beltY, r: 12, fill: 'url(#steel)', stroke: '#5E6A76', 'stroke-width': 1.6 }));
    grp.appendChild(el('circle', { cx: dx, cy: beltY, r: 5, fill: '#4A5560' }));
    grp.appendChild(el('circle', { cx: dx - 2, cy: beltY - 2, r: 2, fill: 'rgba(255,255,255,0.45)' }));
  }
  g.appendChild(grp);
  const midX = (beltX0 + 220 + beltX1) / 2;
  centerLabel(g, midX, beltY - 52, 210, inclTitle, `${lenM} m @ ${vFix} m/min · Medido (v fija HMI)`, color, `incl-${which}`, inclLabel);
  timeChip(g, midX, beltY + 32, `incl-${which}`);
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

  // título de ruta (arriba de la columna, con aire sobre el silo)
  g.appendChild(el('text', { x: cx, y: siloTop - 36, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: color, 'letter-spacing': '0.04em' }, route));

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

  // Fondo de zona esquemática (atmósfera industrial suave)
  g.appendChild(el('rect', { x: 0, y: 42, width: DIVIDER_X, height: 456, fill: 'url(#upZoneBg)' }));

  // Cinta de zona (HUD ribbon)
  const ribbon = el('g', { 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, 'text-anchor': 'middle', fill: '#fff', 'letter-spacing': '0.08em' });
  ribbon.appendChild(el('rect', { x: 560, y: 8, width: 680, height: 28, rx: 14, fill: '#1A2E28', stroke: '#0A7D5A', 'stroke-width': 1.5, filter: 'url(#equipShadow)' }));
  ribbon.appendChild(el('rect', { x: 560, y: 8, width: 8, height: 28, rx: 2, fill: '#FFDE00' }));
  ribbon.appendChild(el('text', { x: 900, y: 26 }, '0 · SILOS · DOSIFICACIÓN Y ENCOLADO — MODELO v3'));
  g.appendChild(ribbon);
  g.appendChild(el('text', {
    x: 900, y: 52, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif",
    'font-weight': 600, 'font-size': 10, fill: '#676E69',
  }, 'Cascada vertical por TIEMPO de residencia (τ = M/F × 60) → banda inclinada horizontal al metro 0'));

  // Divisor: aquí empieza la escala métrica del colchón
  g.appendChild(el('line', { x1: DIVIDER_X, y1: 44, x2: DIVIDER_X, y2: 490, stroke: '#1A2E28', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }));
  g.appendChild(el('text', {
    x: DIVIDER_X - 8, y: 484, 'text-anchor': 'end', 'font-family': "'Barlow',sans-serif",
    'font-weight': 700, 'font-size': 9, fill: '#1A2E28', 'letter-spacing': '0.05em',
  }, 'FIN TRAMO ESQUEMÁTICO → ESCALA MÉTRICA (70 px = 1 m)'));
  g.appendChild(el('text', {
    x: DIVIDER_X - 8, y: 497, 'text-anchor': 'end', 'font-family': "'Barlow',sans-serif",
    'font-weight': 600, 'font-size': 9, fill: '#676E69', id: 'upstreamEspNote',
  }, ''));

  // Botón "cambio de receta" (arranca en LOS DOS silos → 3 capas)
  const btn = el('g', { class: 's2-machine s2-up-node s2-up-recipe', 'data-inject-node': 'silos', 'data-label': 'Cambio de receta · silos' });
  btn.appendChild(el('rect', { x: 22, y: 58, width: 72, height: 88, rx: 12, fill: '#FFDE00', stroke: '#1A1D1B', 'stroke-width': 1.6, filter: 'url(#equipShadow)' }));
  btn.appendChild(el('rect', { x: 22, y: 58, width: 72, height: 6, rx: 3, fill: '#1A2E28' }));
  btn.appendChild(el('text', { x: 58, y: 88, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#1A1D1B' }, 'CAMBIO'));
  btn.appendChild(el('text', { x: 58, y: 102, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 800, 'font-size': 12, fill: '#1A1D1B' }, 'RECETA'));
  btn.appendChild(el('text', { x: 58, y: 120, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 600, 'font-size': 8, fill: '#3D423F' }, 'silos 5 + 6'));
  btn.appendChild(el('text', { x: 58, y: 132, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 700, 'font-size': 8, fill: '#004E38' }, '3 capas'));
  g.appendChild(btn);

  // Botones DISCRETOS de cambio combinado (ambas rutas)
  const drawComboBtn = (node, cy, label) => {
    const bx = 420, bw = 124, bh = 28, by = cy - bh / 2;
    const b = el('g', { class: 's2-machine s2-up-node', 'data-inject-node': node, 'data-label': `Cambio · ${label} (ambas rutas)` });
    b.appendChild(el('rect', { x: bx - bw / 2, y: by, width: bw, height: bh, rx: 14, fill: 'rgba(255,255,255,0.96)', stroke: '#0A7D5A', 'stroke-width': 1.6, filter: 'url(#equipShadow)' }));
    b.appendChild(el('circle', { cx: bx - bw / 2 + 16, cy, r: 8, fill: '#0A7D5A' }));
    b.appendChild(el('text', { x: bx - bw / 2 + 16, y: cy + 4, 'text-anchor': 'middle', 'font-family': "'Barlow',sans-serif", 'font-weight': 800, 'font-size': 13, fill: '#fff' }, '+'));
    b.appendChild(el('text', { x: bx + 10, y: cy + 4, 'text-anchor': 'middle', 'font-family': "'Barlow Semi Condensed',sans-serif", 'font-weight': 700, 'font-size': 10, fill: '#1A1D1B' }, `cambio ${label}`));
    g.appendChild(b);
  };
  drawComboBtn('dosing', 253, 'dosing');
  drawComboBtn('enc', 381, 'encolador');

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
      txt.setAttribute('fill', '#FF8A80');
      bg.setAttribute('fill', 'rgba(80,16,16,0.92)');
      bg.setAttribute('stroke', '#B00020');
    } else {
      txt.textContent = `${node.sec.toFixed(1)} s`;
      txt.setAttribute('fill', '#FFDE00');
      bg.setAttribute('fill', 'rgba(26,29,27,0.88)');
      bg.setAttribute('stroke', 'rgba(10,125,90,0.65)');
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
