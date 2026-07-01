/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — orquestación
   ------------------------------------------------------------
   PASO 1: render estático de la geometría del colchón, rodillos,
   marcos de prensa y regla métrica (portado 1:1 del handoff).
   PASO 2 (actual): reloj + play + slider vía SimulationClock del
   motor clásico (reusado, sin modificar). El trazador avanza por
   progreso lineal; el mapeo real por marcadores llega en el Paso 3.
   ============================================================ */

import { SimulationClock } from '../../trazabilidad/js/core/simulation-clock.js';
import { SPEED_PRESETS } from '../../trazabilidad/js/core/process-graph.js';
import { totalTravelTimeSec, computeAllMarkers } from '../../trazabilidad/js/core/trace-engine.js';
import {
  mapAbsMToX, absMForMarker, pickDownstreamMarker, buildAnnotations,
} from './line-bridge.js';
import { loadParams, initParams } from './line-params.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// ── Configuración de simulación (Paso 2) ──
// Inyección por defecto para esta vista horizontal: el cambio arranca en
// la formación del colchón (banda blanca) y recorre blanca → roja →
// prensa → tablero, que es exactamente el span del SVG.
const INJECTION = 'white';
const DEFAULT_SPEED = SPEED_PRESETS.find((p) => p.id === 'observed-jun24')?.mPerMin ?? 14.5;
/** 1 = tiempo real (1 s de simulación = 1 s de reloj). La barra manual sigue funcionando. */
const DEFAULT_TIME_SCALE = 1;

// ── Constantes de geometría (idénticas al handoff) ──
const BELT_Y = 400;
const END = 4258;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);

// multiplicador de compresión global a lo largo de x
function comp(x) {
  if (x < 1320) return 1;
  if (x < 1620) return lerp(1, 0.62, (x - 1320) / 300);      // pre-prensa
  if (x < 2988) return 0.62;
  if (x < 3720) return lerp(0.62, 0.38, (x - 2988) / 732);   // prensa
  return 0.38;
}

// alturas base por capa (con rampas de entrada), luego comprimidas
const bh = (x) => (x < 430 ? 0 : x < 470 ? ((x - 430) / 40) * 9 : 9) * comp(x);
const ch = (x) => (x < 680 ? 0 : x < 720 ? ((x - 680) / 40) * 15 : 15) * comp(x);
const th = (x) => (x < 950 ? 0 : x < 990 ? ((x - 950) / 40) * 9 : 9) * comp(x);

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
  document.getElementById('layerBottom').setAttribute('d', genLayer(430, () => BELT_Y, bottomTop));
  document.getElementById('layerCore').setAttribute('d', genLayer(680, bottomTop, coreTop));
  document.getElementById('layerTop').setAttribute('d', genLayer(950, coreTop, topTop));
}

function renderRollers() {
  const g = document.getElementById('rollers');
  for (let x = 90; x <= 4230; x += 70) {
    g.appendChild(el('ellipse', { cx: x, cy: 430, rx: 9, ry: 7 }));
  }
}

function renderFrames() {
  const g = document.getElementById('pressFrames');
  for (let i = 0; i < 19; i++) {
    const x = +(2985 + i * 40).toFixed(1);
    g.appendChild(el('line', { x1: x, y1: 188, x2: x, y2: 416 }));
  }
}

function renderRuler() {
  const gTicks = document.getElementById('rulerTicks');
  const gLabels = document.getElementById('rulerLabels');
  const x0 = 40, x1 = 4260, span = x1 - x0, totalM = 90;
  for (let m = 0; m <= totalM; m++) {
    const x = +(x0 + (m / totalM) * span).toFixed(1);
    const major = m % 5 === 0;
    gTicks.appendChild(el('line', { x1: x, y1: 470, x2: x, y2: major ? 458 : 464 }));
    if (major) {
      const t = el('text', { x, y: 490 });
      t.textContent = String(m);
      gLabels.appendChild(t);
    }
  }
}

// coloca el trazador en X (px del canvas); Y sigue la cima del colchón.
function setTracerX(mx) {
  const my = topTop(mx) - 6;
  document.getElementById('tracer').setAttribute('transform', `translate(${+mx.toFixed(1)} ${+my.toFixed(1)})`);
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
    pos.textContent = `${w.atM.toFixed(1)} m · ${w.pct}%`;
    gWp.appendChild(pos);
  }
}

// mm:ss.d (idéntico al fmt del handoff)
function fmtClock(t) {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${String(m).padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}`;
}

// ── Wiring de reloj + transporte + parámetros ──
function initSimulation() {
  let params = loadParams();
  let totalSec = totalTravelTimeSec(DEFAULT_SPEED, params, INJECTION) || 1;

  const clock = new SimulationClock();
  clock.timeScale = DEFAULT_TIME_SCALE;
  clock.setMaxSec(totalSec);

  const clockEl = document.getElementById('clockValue');
  const pctEl = document.getElementById('progressPct');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const resetBtn = document.getElementById('resetBtn');
  const range = document.getElementById('timeRange');

  range.min = 0;
  range.max = totalSec.toFixed(1);
  range.step = 0.1;

  function render(tSec) {
    const state = computeAllMarkers(tSec, DEFAULT_SPEED, INJECTION, params);
    const marker = pickDownstreamMarker(state);
    const mx = mapAbsMToX(absMForMarker(marker));
    setTracerX(mx);

    const p = clamp(tSec / totalSec, 0, 1);
    clockEl.textContent = fmtClock(tSec);
    pctEl.textContent = (p * 100).toFixed(0);
    if (document.activeElement !== range) range.value = tSec;
    playIcon.textContent = clock.playing ? 'pause' : 'play_arrow';
  }

  clock.onTick((tSec) => render(tSec));

  playBtn.addEventListener('click', () => clock.toggle());
  resetBtn.addEventListener('click', () => clock.reset());
  range.addEventListener('input', () => {
    clock.pause();
    clock.setTime(parseFloat(range.value));
  });

  render(0);

  // Pestaña Parámetros: comparte localStorage con el clásico. Al editar,
  // recalcula el total del recorrido y re-renderiza al tiempo actual.
  initParams({
    speedGetter: () => DEFAULT_SPEED,
    onChange: (newParams) => {
      params = newParams;
      totalSec = totalTravelTimeSec(DEFAULT_SPEED, params, INJECTION) || 1;
      range.max = totalSec.toFixed(1);
      clock.setMaxSec(totalSec);
      if (clock.timeSec > totalSec) clock.setTime(totalSec);
      render(clock.timeSec);
    },
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
  initSimulation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { setTracerX, topTop };
