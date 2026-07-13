/**
 * App — modelo m_dot. Panel de Globales (HMI + receta) arriba; tarjetas de etapa
 * con ecuación visible, badge de origen y buffer manual.
 */

import {
  GLOBAL_PARAMS,
  INJECTION_OPTIONS,
  getParameterSchema,
  defaultParams,
  SPEED_PRESETS,
  findNode,
  STAGE_SEQUENCE,
} from './core/process-graph.js';
import {
  computeAllMarkers,
  totalTravelTimeSec,
  arrivalTimeForStage,
  tauForNode,
  transportForNode,
  flowFor,
} from './core/trace-engine.js';
import { SimulationClock } from './core/simulation-clock.js';
import { TrackRenderer } from './ui/track-renderer.js';

const STORAGE_KEY = 'novopan-trazabilidad-params-v9';
const VIEW_STORAGE_KEY = 'novopan-trazabilidad-view';

const clock = new SimulationClock();
let params = loadParams();
let totalSec = 0;
let saveFeedbackTimer = 0;

const $ = (id) => document.getElementById(id);

const els = {
  clock: $('clockValue'),
  clockSub: $('clockSub'),
  status: $('statusBar'),
  diagram: $('diagramCanvas'),
  paramsGridTab: $('paramsGridTab'),
  panelSimulator: $('panelSimulator'),
  panelParams: $('panelParams'),
  chromeSimulator: $('chromeSimulator'),
  viewTabs: document.querySelectorAll('.view-tab'),
  playBtn: $('playBtn'),
  demoPaintBtn: $('demoPaintBtn'),
  resetBtn: $('resetBtn'),
  fitBtn: $('fitBtn'),
  saveParamsBtnTab: $('saveParamsBtnTab'),
  loadParamsBtnTab: $('loadParamsBtnTab'),
  resetParamsBtnTab: $('resetParamsBtnTab'),
  saveParamsFeedbackTab: $('saveParamsFeedbackTab'),
  injection: $('injectionPoint'),
  speed: $('speedSlider'),
  speedVal: $('speedVal'),
  speedPreset: $('speedPreset'),
  timeScale: $('timeScale'),
  timeScaleVal: $('timeScaleVal'),
  scrub: $('timeScrub'),
  etaVal: $('etaVal'),
};

const PARAM_GRIDS = [els.paramsGridTab].filter(Boolean);

const renderer = new TrackRenderer(els.diagram);
renderer.setOnJump((nodeId) => handleStageSelected(nodeId));

function buildInjectionSelect() {
  if (!els.injection) return;
  const groups = new Map();
  for (const opt of INJECTION_OPTIONS) {
    const g = opt.group ?? 'Otro';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(opt);
  }
  els.injection.innerHTML = '';
  for (const [group, opts] of groups) {
    const og = document.createElement('optgroup');
    og.label = group;
    for (const opt of opts) {
      const o = document.createElement('option');
      o.value = opt.id;
      o.textContent = opt.label;
      if (opt.id === 'enc-all') o.selected = true;
      og.appendChild(o);
    }
    els.injection.appendChild(og);
  }
}

// ── Persistencia ──

function loadParams() {
  const defaults = defaultParams();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return defaults;
    return { ...defaults, ...saved };
  } catch {
    return defaults;
  }
}

function saveParams() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    showSaveFeedback('Guardado ✓');
    return true;
  } catch {
    showSaveFeedback('Error al guardar');
    return false;
  }
}

function showSaveFeedback(message) {
  const feedbackEl = els.saveParamsFeedbackTab;
  if (!feedbackEl) return;
  feedbackEl.textContent = message;
  feedbackEl.classList.add('is-visible');
  clearTimeout(saveFeedbackTimer);
  saveFeedbackTimer = setTimeout(() => feedbackEl.classList.remove('is-visible'), 2200);
}

// ── Helpers ──

function speed() { return parseFloat(els.speed.value) || 14.5; }
function injection() { return els.injection.value; }
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}`;
}

// ── Badge config ──

const BADGE = {
  'hmi-live':    { cls: 'hmi',     label: 'HMI en vivo',  short: 'HMI' },
  'recipe':      { cls: 'recipe',  label: 'Receta',       short: 'Receta' },
  'mechanical':  { cls: 'mech',    label: 'Mecánico',     short: 'Mecánico' },
  'manual':      { cls: 'manual',  label: 'Buffer manual', short: 'Manual' },
  'measured':    { cls: 'ok',      label: 'Medido',       short: 'Medido' },
  'derived':     { cls: 'derived', label: 'Derivado',     short: 'Derivado' },
  'estimated':   { cls: 'est',     label: 'Estimado',     short: 'Estim.' },
};

function badgeHtml(kind) {
  const b = BADGE[kind] ?? BADGE.estimated;
  return `<span class="badge badge--${b.cls}">${b.short}</span>`;
}

// ── Panel de globales (arriba de todo) ──

function renderGlobalsCard() {
  const card = document.createElement('div');
  card.className = 'globals-card';
  card.innerHTML = `
    <header class="globals-card__hd">
      <h4>Parámetros globales</h4>
      <p class="globals-card__sub">Lo que entra "en vivo" del HMI Metso/Dieffenbacher + setpoints de receta. Todo lo demás se deriva.</p>
    </header>

    <div class="globals-card__group">
      <h5>${badgeHtml('hmi-live')} HMI en vivo</h5>
      <div class="globals-card__grid" data-group="hmi-live"></div>
    </div>

    <div class="globals-card__group">
      <h5>${badgeHtml('recipe')} Receta activa</h5>
      <div class="globals-card__grid" data-group="recipe"></div>
    </div>

    <details class="globals-card__legend">
      <summary>Leyenda de origen y ecuaciones</summary>
      <ul class="legend">
        <li>${badgeHtml('hmi-live')} sale en vivo del HMI</li>
        <li>${badgeHtml('recipe')} setpoint de receta (operador)</li>
        <li>${badgeHtml('mechanical')} constante mecánica (ficha técnica)</li>
        <li>${badgeHtml('manual')} buffer manual que tú sumas</li>
        <li>${badgeHtml('measured')} medido en planta</li>
        <li>${badgeHtml('derived')} derivado de otra medición</li>
        <li>${badgeHtml('estimated')} estimación pendiente de medir</li>
      </ul>
      <p class="legend__eq"><strong>Ecuaciones del motor:</strong></p>
      <ul class="legend__eqs">
        <li><code>τ_bin = M_bin / F × 60</code> (dosing)</li>
        <li><code>τ_enc = t fijo (s)</code> (encolador — un solo número)</li>
        <li><code>τ_esp = M_hopper / F_capa × 60</code> (esparcidores)</li>
        <li><code>t_banda_inclinada = L / (v_prensa × factor) × 60</code></li>
        <li><code>t_banda_común = L / v_prensa × 60</code></li>
        <li><code>t_total_etapa = (cálculo) + buffer_manual</code></li>
        <li><strong>Merge:</strong> banda blanca arranca cuando termina el esparcidor <strong>más lento</strong>.</li>
      </ul>
    </details>
  `;

  // Inserta los inputs por grupo
  const groupGrid = (g) => card.querySelector(`[data-group="${g}"]`);
  for (const p of GLOBAL_PARAMS) {
    const grid = groupGrid(p.kind === 'hmi-live' ? 'hmi-live' : 'recipe');
    if (!grid) continue;
    const field = document.createElement('label');
    field.className = 'global-field';
    field.innerHTML = `
      <span class="global-field__lbl">${p.label}</span>
      <span class="global-field__input">
        <input type="number" step="${p.step ?? 0.1}" min="0" data-key="${p.key}" value="${params[p.key]}" />
        <span class="global-field__unit">${p.unit}</span>
      </span>
      <span class="global-field__desc">${p.desc ?? ''}</span>
    `;
    grid.appendChild(field);
  }
  return card;
}

// ── Tarjeta por etapa ──

function groupSchemaByStage(schema) {
  const map = new Map();
  for (const p of schema) {
    if (!map.has(p.nodeId)) {
      map.set(p.nodeId, { nodeId: p.nodeId, group: p.group, params: [] });
    }
    map.get(p.nodeId).params.push(p);
  }
  return [...map.values()];
}

/**
 * Devuelve { etiqueta de ecuación, valor calculado a v_prensa actual }
 * para mostrar en la tarjeta de la etapa.
 */
function equationForNode(node, v) {
  const tau = tauForNode(node, params);
  const tr = transportForNode(node, v, params);
  const buf = Math.max(0, params[`buffer:${node.id}`] ?? 0);
  const total = tau + tr + buf;

  if (node.model === 'bin') {
    const F = flowFor(node, params);
    const M = Number(params[`mass:${node.id}`] ?? 0);
    return {
      eq: `<code>τ = M / F × 60</code>`,
      detail: `M = ${M.toFixed(1)} kg ÷ F = ${F.toFixed(1)} kg/min × 60 = <strong>${tau.toFixed(1)} s</strong>`,
      tau, tr, buf, total,
    };
  }
  if (node.model === 'cstr') {
    const F = flowFor(node, params);
    const M = Number(params[`mass:${node.id}`] ?? 0);
    return {
      eq: `<code>τ_CSTR = M_holdup / F × 60</code>`,
      detail: `M = ${M.toFixed(0)} kg ÷ F = ${F.toFixed(1)} kg/min × 60 = <strong>${tau.toFixed(1)} s</strong>`,
      tau, tr, buf, total,
    };
  }
  if (node.model === 'hopper') {
    const F = flowFor(node, params);
    const M = Number(params[`mass:${node.id}`] ?? 0);
    const flowLbl = ({ F_SL: 'F_SL', F_CL: 'F_CL', F_SL1: 'F_SL × %SL1', F_SL2: 'F_SL × %SL2' })[node.flowSource] ?? 'F';
    return {
      eq: `<code>τ_hopper = M / (${flowLbl}) × 60</code>`,
      detail: `M = ${M.toFixed(0)} kg ÷ F_capa = ${F.toFixed(1)} kg/min × 60 = <strong>${tau.toFixed(1)} s</strong>`,
      tau, tr, buf, total,
    };
  }
  if (node.model === 'fixed') {
    const t = Number(params[`ret:${node.id}`] ?? node.retentionSec ?? 0);
    return {
      eq: `<code>τ = t fijo</code>`,
      detail: `t = <strong>${t.toFixed(1)} s</strong> (parámetro único, no depende de v_prensa ni flujo)`,
      tau, tr, buf, total,
    };
  }
  // transporte
  const L = Number(params[`len:${node.id}`] ?? node.lengthM ?? 0);
  const vBelt = Number(params[`speed:${node.id}`] ?? node.beltSpeedMperMin ?? 0);
  if (vBelt > 0) {
    return {
      eq: `<code>t = L / v_banda × 60</code>`,
      detail: `L = ${L.toFixed(2)} m ÷ v = ${vBelt.toFixed(1)} m/min × 60 = <strong>${tr.toFixed(1)} s</strong> (velocidad fija HMI)`,
      tau, tr, buf, total,
    };
  }
  const f = Number(params[`factor:${node.id}`] ?? node.speedFactor ?? 1);
  const v_eff = v * f;
  if (f !== 1 && Number.isFinite(f)) {
    return {
      eq: `<code>t = L / (v_prensa × factor) × 60</code>`,
      detail: `L = ${L.toFixed(2)} m ÷ (v = ${v.toFixed(2)} × ${f.toFixed(2)}) × 60 = <strong>${tr.toFixed(1)} s</strong>`,
      tau, tr, buf, total,
    };
  }
  return {
    eq: `<code>t = L / v_prensa × 60</code>`,
    detail: `L = ${L.toFixed(2)} m ÷ v_prensa = ${v.toFixed(2)} m/min × 60 = <strong>${tr.toFixed(1)} s</strong>`,
    tau, tr, buf, total,
  };
}

function paramFieldHtml(p) {
  return `
    <label class="stage-field">
      <span class="stage-field__lbl">${p.label} ${badgeHtml(p.kindBadge)}</span>
      <span class="stage-field__input">
        <input type="number" step="0.1" min="0" data-key="${p.key}" value="${params[p.key]}" />
        <span class="stage-field__unit">${p.unit}</span>
      </span>
    </label>
  `;
}

function sourceBadgeForNode(node) {
  const src = node?.source;
  if (!src) return 'estimated';
  return src.kind;
}

function renderStageCard(stage) {
  const node = findNode(stage.nodeId);
  if (!node) return null;

  const v = speed();
  const eq = equationForNode(node, v);
  const stageMeta = STAGE_SEQUENCE.find((s) => s.id === stage.nodeId);
  const label = stageMeta?.label ?? node.label;
  const srcBadge = sourceBadgeForNode(node);
  const src = node?.source;

  const card = document.createElement('div');
  card.className = 'stage-card';
  card.dataset.nodeId = stage.nodeId;

  // Separa params: principales arriba (mass/len/factor/retention) + buffer abajo
  const mainParams = stage.params.filter((p) => p.type !== 'buffer');
  const bufferParam = stage.params.find((p) => p.type === 'buffer');

  card.innerHTML = `
    <header class="stage-card__hd">
      <span class="stage-card__name">${label}</span>
      ${badgeHtml(srcBadge)}
    </header>

    <div class="stage-card__eq">
      <span class="stage-card__eq-label">Ecuación</span>
      ${eq.eq}
      <div class="stage-card__eq-detail">${eq.detail}</div>
    </div>

    ${src ? `<div class="stage-card__source stage-card__source--${BADGE[srcBadge]?.cls ?? 'est'}">
      <strong>Justificación${src.date ? ` · ${src.date}` : ''}:</strong>
      ${src.desc}
      ${src.detail ? `<span class="stage-card__source-detail">${src.detail}</span>` : ''}
    </div>` : ''}

    <div class="stage-card__params">
      ${mainParams.map(paramFieldHtml).join('')}
    </div>

    ${bufferParam ? `
      <details class="stage-card__buffer">
        <summary>${badgeHtml('manual')} Buffer manual: <strong data-buffer-value>+${(params[bufferParam.key] ?? 0).toFixed(1)} s</strong></summary>
        <div class="stage-card__buffer-body">
          <p class="stage-card__buffer-help">Segundos adicionales que tú sumas a esta etapa (margen de seguridad, sin tocar la física calculada).</p>
          ${paramFieldHtml(bufferParam)}
        </div>
      </details>
    ` : ''}

    <div class="stage-card__totals">
      <span class="stage-card__total-line"><span>τ</span><strong>${eq.tau.toFixed(1)} s</strong></span>
      <span class="stage-card__total-line"><span>transporte</span><strong>${eq.tr.toFixed(1)} s</strong></span>
      <span class="stage-card__total-line"><span>buffer</span><strong>${eq.buf.toFixed(1)} s</strong></span>
      <span class="stage-card__total-line stage-card__total-line--sum"><span>Total etapa</span><strong>${eq.total.toFixed(1)} s</strong></span>
    </div>
  `;

  return card;
}

function buildParamsPanel(container) {
  if (!container) return;
  container.innerHTML = '';
  container.appendChild(renderGlobalsCard());

  const stages = groupSchemaByStage(getParameterSchema());
  let currentGroup = null;
  for (const stage of stages) {
    if (stage.group !== currentGroup) {
      const h = document.createElement('h4');
      h.className = 'param-group__title';
      h.textContent = stage.group;
      container.appendChild(h);
      currentGroup = stage.group;
    }
    const card = renderStageCard(stage);
    if (card) container.appendChild(card);
  }

  wireParamInputs(container);
}

function wireParamInputs(container) {
  container.querySelectorAll('input[data-key]').forEach((inp) => {
    inp.addEventListener('input', () => {
      syncParamsFromUI();
      syncParamInputs(inp.dataset.key, inp.value);
      updateScrubMax();
      renderer.updateParamDisplays();
      refresh();
      refreshStageCardsLight();
    });
    inp.addEventListener('change', () => {
      syncParamsFromUI();
      rebuild();
    });
  });
}

function refreshStageCardsLight() {
  // recalcula la línea "Ecuación" + totales sin reconstruir todo
  const v = speed();
  for (const grid of PARAM_GRIDS) {
    grid.querySelectorAll('.stage-card').forEach((card) => {
      const id = card.dataset.nodeId;
      const node = findNode(id);
      if (!node) return;
      const eq = equationForNode(node, v);
      const eqDetail = card.querySelector('.stage-card__eq-detail');
      if (eqDetail) eqDetail.innerHTML = eq.detail;
      const totals = card.querySelectorAll('.stage-card__total-line strong');
      if (totals.length >= 4) {
        totals[0].textContent = `${eq.tau.toFixed(1)} s`;
        totals[1].textContent = `${eq.tr.toFixed(1)} s`;
        totals[2].textContent = `${eq.buf.toFixed(1)} s`;
        totals[3].textContent = `${eq.total.toFixed(1)} s`;
      }
      const bufVal = card.querySelector('[data-buffer-value]');
      if (bufVal) bufVal.textContent = `+${eq.buf.toFixed(1)} s`;
    });
  }
}

function syncParamsFromUI() {
  if (PARAM_GRIDS.length === 0) return false;
  let changed = false;
  const seen = new Set();
  for (const grid of PARAM_GRIDS) {
    grid.querySelectorAll('input[data-key]').forEach((inp) => {
      const key = inp.dataset.key;
      if (seen.has(key)) return;
      seen.add(key);
      const parsed = parseFloat(inp.value);
      const next = Number.isNaN(parsed) ? 0 : parsed;
      if (params[key] !== next) changed = true;
      params[key] = next;
    });
  }
  renderer.setParams(params);
  return changed;
}

function syncParamInputs(key, value) {
  for (const grid of PARAM_GRIDS) {
    grid.querySelectorAll(`input[data-key="${CSS.escape(key)}"]`).forEach((inp) => {
      if (inp.value !== value) inp.value = value;
    });
  }
}

function buildAllParamsPanels() {
  for (const grid of PARAM_GRIDS) buildParamsPanel(grid);
}

function resetParamsToDefaults() {
  params = defaultParams();
  buildAllParamsPanels();
  renderer.setParams(params);
  clock.reset();
  rebuild();
  showSaveFeedback('Defaults restaurados');
}

/** Prepara prueba en planta: pintura en encoladores = t₀, bandas medidas, reloj acelerado. */
function startPaintDemo() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  params = defaultParams();
  buildAllParamsPanels();
  renderer.setParams(params);
  if (els.injection) els.injection.value = 'enc-all';
  if (els.speedPreset) els.speedPreset.value = 'observed-jun24';
  els.speed.value = '14.5';
  els.timeScale.value = '30';
  clock.timeScale = 30;
  els.timeScaleVal.textContent = '30×';
  clock.reset();
  rebuild();
  els.status.innerHTML = 'Demo pintura lista — pulsa <strong>Iniciar</strong> cuando marques los encoladores en planta';
}

function handleStageSelected(nodeId) {
  if (!nodeId) return;
  renderer.jumpToNode(nodeId);
  const v = speed();
  const t = arrivalTimeForStage(nodeId, v, params, injection());
  if (Number.isFinite(t)) {
    clock.pause();
    clock.setTime(Math.max(0, Math.min(t, totalSec)));
    refresh();
  }
}

// ── Main loop ──

function rebuild() {
  renderer.setParams(params);
  renderer.build(injection());
  updateScrubMax();
  refresh();
}

function updateScrubMax() {
  totalSec = totalTravelTimeSec(speed(), params, injection());
  els.scrub.max = String(Math.ceil(totalSec * 1.05));
  els.etaVal.textContent = fmt(totalSec);
  clock.setMaxSec(totalSec);
  if (clock.timeSec > totalSec) clock.setTime(totalSec);
}

function refresh(tick = false) {
  const paramsChanged = syncParamsFromUI();
  if (!tick || paramsChanged) {
    updateScrubMax();
    renderer.updateParamDisplays();
  }
  const t = clock.timeSec;
  const v = speed();
  const state = computeAllMarkers(t, v, injection(), params);

  renderer.update(state);

  els.clock.textContent = fmt(t);
  els.clockSub.textContent = `${t.toFixed(0)} s · ${v.toFixed(1)} m/min`;
  if (tick) {
    els.clock.classList.add('is-ticking');
    requestAnimationFrame(() => els.clock.classList.remove('is-ticking'));
  }

  els.speedVal.textContent = v.toFixed(2);
  els.scrub.value = t;

  const done = state.completedNodeIds?.length ?? 0;
  const activeParts = state.markers
    .filter((m) => m.phase !== 'colchon-done')
    .map((m) => {
      if (m.phase === 'buffer') return `<strong>${m.nodeLabel}</strong> (buffer ${m.retentionRemainingSec.toFixed(1)} s)`;
      if (m.phase === 'retention') return `<strong>${m.nodeLabel}</strong> (τ ${m.retentionRemainingSec.toFixed(1)} s)`;
      if (m.phase === 'transport') return `<strong>${m.nodeLabel}</strong> (${(m.progressInNode * 100).toFixed(0)} %)`;
      if (m.phase === 'colchon') return `<strong>${m.nodeLabel}</strong>`;
      if (m.phase === 'done') return '<strong>Salida prensa</strong> ✓';
      return `<strong>${m.nodeLabel}</strong>`;
    });

  const statusParts = [];
  if (done > 0) statusParts.push(`<span class="status-done">✓ ${done} etapas</span>`);
  if (activeParts.length) statusParts.push(`Activo: ${activeParts.join(' · ')}`);
  else if (!clock.playing && t === 0) {
    statusParts.push('Pulsa <strong>Iniciar</strong> o <kbd>Espacio</kbd>');
  } else if (t >= totalSec && totalSec > 0) {
    statusParts.push('<strong>Simulación completa</strong> — cambio salió de prensa');
  }

  els.status.innerHTML = statusParts.join(' — ') || 'Simulación en curso';

  els.playBtn.classList.toggle('is-playing', clock.playing);
  els.playBtn.innerHTML = clock.playing
    ? '<span class="ms">pause</span> Pausa'
    : '<span class="ms">play_arrow</span> Iniciar';
}

// ── Wiring ──

els.speed.addEventListener('input', () => {
  updateScrubMax();
  refresh();
  refreshStageCardsLight();
});
els.injection.addEventListener('change', () => {
  clock.reset();
  rebuild();
});
els.speedPreset.addEventListener('change', (e) => {
  const p = SPEED_PRESETS.find((x) => x.id === e.target.value);
  if (p) {
    els.speed.value = String(p.mPerMin);
    updateScrubMax();
    refresh();
    refreshStageCardsLight();
  }
});
els.timeScale.addEventListener('input', (e) => {
  clock.timeScale = parseFloat(e.target.value);
  els.timeScaleVal.textContent = `${clock.timeScale}×`;
});
els.scrub.addEventListener('input', (e) => {
  clock.pause();
  clock.setTime(parseFloat(e.target.value));
  refresh();
});
els.playBtn.addEventListener('click', () => {
  syncParamsFromUI();
  updateScrubMax();
  renderer.updateParamDisplays();
  clock.toggle();
  refresh(true);
});
els.resetBtn.addEventListener('click', () => { clock.reset(); refresh(); });
els.demoPaintBtn?.addEventListener('click', startPaintDemo);
els.fitBtn?.addEventListener('click', () => {
  els.diagram.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  const main = els.diagram.closest('.main');
  if (main) main.scrollLeft = 0;
});

[els.saveParamsBtnTab].filter(Boolean).forEach((btn) =>
  btn.addEventListener('click', () => { syncParamsFromUI(); saveParams(); }));
[els.loadParamsBtnTab].filter(Boolean).forEach((btn) =>
  btn.addEventListener('click', () => {
    params = loadParams();
    buildAllParamsPanels();
    renderer.setParams(params);
    clock.reset();
    rebuild();
    showSaveFeedback('Cargado ✓');
  }));
[els.resetParamsBtnTab].filter(Boolean).forEach((btn) =>
  btn.addEventListener('click', () => {
    if (localStorage.getItem(STORAGE_KEY)) localStorage.removeItem(STORAGE_KEY);
    resetParamsToDefaults();
  }));

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
    e.preventDefault();
    syncParamsFromUI();
    updateScrubMax();
    renderer.updateParamDisplays();
    clock.toggle();
    refresh(true);
  }
});

clock.onTick(() => refresh(true));
clock.timeScale = parseFloat(els.timeScale.value) || 10;
els.timeScaleVal.textContent = `${clock.timeScale}×`;

function switchView(view) {
  const isSimulator = view !== 'params';
  els.panelSimulator?.classList.toggle('is-active', isSimulator);
  els.panelParams?.classList.toggle('is-active', !isSimulator);
  els.chromeSimulator?.classList.toggle('is-hidden', !isSimulator);
  els.viewTabs?.forEach((tab) => {
    const active = tab.dataset.view === (isSimulator ? 'simulator' : 'params');
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  try { sessionStorage.setItem(VIEW_STORAGE_KEY, isSimulator ? 'simulator' : 'params'); } catch {}
}
function initViewTabs() {
  els.viewTabs?.forEach((tab) => tab.addEventListener('click', () => switchView(tab.dataset.view)));
  try {
    const saved = sessionStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === 'params' || saved === 'simulator') switchView(saved);
  } catch {}
}

initViewTabs();
buildInjectionSelect();
buildAllParamsPanels();
rebuild();
refresh();
