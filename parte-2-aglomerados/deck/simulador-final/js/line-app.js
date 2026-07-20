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
import { initParams } from './line-params.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const QUITO_TZ = 'America/Guayaquil';

// ── Configuración de la vista horizontal (Parte 2 · HMI en vivo) ──
const DEFAULT_SPEED = SPEED_PRESETS.find((p) => p.id === 'observed-jun24')?.mPerMin ?? 14.5;
const SPEED_MIN = 8;
const SPEED_MAX = 22;

// Fin real medido: 71.6 m hasta fin de prensa + 13.55 m post-prensa.
const PROCESS_END_M = PROCESS_TOTAL_M;

// Waypoints con nombre (m absolutos) para registrar en qué equipo y a qué hora
// real pasó cada cambio. Los equipos "esparcidores" con material que cae (SL1/
// CL/SL2) inyectan a los 3/4 de su zona (el material no cae al inicio del
// cabezal sino más hacia el final de su recorrido). Pre-prensa/Vapor usan el
// INICIO real de su zona. El resto son eventos puntuales (ya son su "inicio").
const NAMED_WAYPOINTS = [
  { m: 0.7, label: 'Desmoldante #1' },
  { m: 6.63, label: 'SL1 · capa inferior' },
  { m: 15.0, label: 'CL · core' },
  { m: 22.25, label: 'SL2 · capa superior' },
  { m: 26.68, label: 'Imán / tambor azul' },
  { m: 29.06, label: 'Pre-prensa' },
  { m: 35.99, label: 'Desmoldante #2' },
  { m: 37.69, label: 'Detector de metales' },
  { m: 39.56, label: 'Cortadores de filo' },
  { m: 44.9, label: 'Nariz · rechazo' },
  { m: 46.86, label: 'Vapor EVOsteam' },
  { m: 55.0, label: 'Prensa continua' },
  { m: 71.6, label: 'Fin prensa' },
  { m: 78.3, label: 'Cuchillos de refila · inicio' },
  { m: 79.65, label: 'Cuchillos de refila · fin' },
  { m: 80.35, label: 'Sierra transversal · inicio' },
  { m: 82.65, label: 'Sierra transversal · fin' },
  { m: PROCESS_END_M, label: 'Sensores de calidad · fin de proceso' },
].sort((a, b) => a.m - b.m);

function nextWaypoint(posM) {
  return NAMED_WAYPOINTS.find((wp) => wp.m > posM + 1e-6) ?? null;
}

// Paleta de colores para cambios simultáneos (se cicla si hay más de 8 activos).
const CHANGE_COLORS = ['#FFDE00', '#FF7A33', '#29B6F6', '#AB47BC', '#EC407A', '#26A69A', '#8BC34A', '#EF5350'];

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
  let scrubbing = false;
  let changeSeq = 0;
  let selectedId = null;   // cambio que controla el movedor manual (el último inyectado)
  const changes = [];      // cambios activos: { id, seq, color, posM, el, arrivals[], passed:Set }
  const reports = [];      // cambios completados (más reciente primero), máx. 8

  const speedRange = document.getElementById('speedRange');
  const speedInput = document.getElementById('speedInput');
  const moverRange = document.getElementById('moverRange');
  const canvas = document.getElementById('canvasScroll');
  const tracersLayer = document.getElementById('tracers');
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

  function updateTracerEl(ch) {
    const mx = xm(ch.posM);
    const my = topTop(mx) - 6;
    ch.el?.setAttribute('transform', `translate(${mx.toFixed(1)} ${my.toFixed(1)})`);
  }

  // El reporte de cada cambio existe desde que NACE (se ve "en curso" con solo
  // su primera fila) y se va llenando en vivo con cada equipo que va cruzando;
  // al completarse pasa a "completado" y queda fijo en la lista.
  function renderCard(item, isActive) {
    const card = document.createElement('div');
    card.className = isActive ? 'report-card report-card--active' : 'report-card';
    card.style.borderLeftColor = item.color;
    const nextWp = isActive ? nextWaypoint(item.posM) : null;
    const countdownRow = isActive ? `
        <li class="report-card__countdown">
          <span data-countdown-label-for="${item.id}">Próximo: ${nextWp?.label ?? '—'}</span>
          <strong data-countdown-for="${item.id}">--:--</strong>
        </li>` : '';
    card.innerHTML = `
      <div class="report-card__hd">
        <i style="background:${item.color}"></i>
        <strong>Cambio ${item.seq}</strong>
        <span class="report-card__status">${isActive ? 'EN CURSO' : 'COMPLETADO'}</span>
      </div>
      <ul class="report-card__list">
        ${countdownRow}
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
      const wp = nextWaypoint(ch.posM);
      if (!wp) {
        if (labelEl) labelEl.textContent = 'Próximo';
        strong.textContent = '—';
        continue;
      }
      if (labelEl) labelEl.textContent = `Próximo: ${wp.label}`;
      const distM = Math.max(0, wp.m - ch.posM);
      strong.textContent = fmtCountdown((distM / vPrensa) * 60);
    }
  }

  function renderReportsList() {
    if (!reportsList) return;
    reportsList.innerHTML = '';
    const activeList = changes.slice().reverse(); // más reciente primero
    if (activeList.length === 0 && reports.length === 0) {
      const p = document.createElement('p');
      p.className = 'report-empty';
      p.textContent = 'Aún no hay cambios. Haz clic en un equipo para inyectar uno.';
      reportsList.appendChild(p);
    } else {
      for (const ch of activeList) reportsList.appendChild(renderCard(ch, true));
      for (const rep of reports) reportsList.appendChild(renderCard(rep, false));
    }
    if (reportsCount) reportsCount.textContent = String(activeList.length + reports.length);
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
    if (!ch.passed.has('Sensores de calidad · fin de proceso')) {
      ch.arrivals.push({ label: 'Sensores de calidad · fin de proceso', m: PROCESS_END_M, wallTime: new Date() });
    }
    ch.el?.remove();
    const idx = changes.indexOf(ch);
    if (idx >= 0) changes.splice(idx, 1);
    reports.unshift({ id: ch.id, seq: ch.seq, color: ch.color, arrivals: ch.arrivals });
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
      arrivals: [{ label: startLabel, m: startM, wallTime: new Date() }],
      passed: new Set([startLabel]),
    };
    ch.el = createTracerEl(ch);
    updateTracerEl(ch);
    changes.push(ch);
    selectedId = ch.id;
    syncMoverEnabled();
    renderReportsList(); // el reporte nace con el cambio, no solo al completarse
  }

  // Bucle continuo — la línea nunca deja de moverse; cada cambio activo avanza a v_prensa.
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    const advanceM = (vPrensa / 60) * dt;
    let crossed = false;
    for (const ch of changes.slice()) {
      if (scrubbing && ch.id === selectedId) continue; // el movedor controla este directamente
      const prevM = ch.posM;
      ch.posM = Math.min(ch.posM + advanceM, PROCESS_END_M);
      if (recordCrossings(ch, prevM)) crossed = true;
      if (ch.posM >= PROCESS_END_M) finishChange(ch); // ya re-renderiza el panel
      else updateTracerEl(ch);
    }
    if (crossed) renderReportsList(); // llena en vivo el reporte de cada cambio activo
    if (changes.length) updateReportCountdowns();
    if (selectedId && moverRange && document.activeElement !== moverRange) {
      const sel = changes.find((c) => c.id === selectedId);
      if (sel) moverRange.value = sel.posM.toFixed(1);
    }
    requestAnimationFrame(frame);
  }

  // Velocidad de prensa (único parámetro operador visible en la barra).
  speedRange?.addEventListener('input', () => setSpeed(speedRange.value));
  speedInput?.addEventListener('input', () => setSpeed(speedInput.value));
  speedInput?.addEventListener('change', syncSpeedUI);
  syncSpeedUI();

  // Movedor manual: adelanta/retrocede el cambio SELECCIONADO (el último inyectado).
  const endScrub = () => { scrubbing = false; last = performance.now(); };
  moverRange?.addEventListener('pointerdown', () => { scrubbing = true; });
  moverRange?.addEventListener('input', () => {
    scrubbing = true;
    const sel = changes.find((c) => c.id === selectedId);
    if (!sel) return;
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

  // Clic en un equipo → crea un cambio NUEVO (color propio) desde el inicio de ese proceso.
  canvas?.addEventListener('click', (e) => {
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
    changes.length = 0;
    reports.length = 0;
    changeSeq = 0;
    selectedId = null;
    syncMoverEnabled();
    renderReportsList();
  }
  resetChangesBtn?.addEventListener('click', resetAll);

  syncMoverEnabled();
  renderReportsList();
  updateReportCountdowns();
  requestAnimationFrame(frame);

  // Pestaña Parámetros: comparte localStorage con el clásico y refleja v_prensa.
  initParams({
    speedGetter: () => vPrensa,
    onChange: () => {},
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
  initLiveClock();
  initSimulation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { topTop };
