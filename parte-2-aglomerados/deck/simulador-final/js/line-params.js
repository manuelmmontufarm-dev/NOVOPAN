/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — pestaña Parámetros
   ------------------------------------------------------------
   Reusa el MISMO schema, ecuaciones y localStorage que el
   simulador clásico (STORAGE_KEY compartido). No modifica el
   clásico; solo re-renderiza el panel dentro de esta vista.
   ============================================================ */

import {
  GLOBAL_PARAMS, getParameterSchema, defaultParams, findNode, STAGE_SEQUENCE,
} from '../../trazabilidad/js/core/process-graph.js';
import {
  tauForNode, transportForNode, flowFor,
} from '../../trazabilidad/js/core/trace-engine.js';

const STORAGE_KEY = 'novopan-trazabilidad-params-v9';

export function loadParams() {
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

export function saveParamsToStorage(params) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    return true;
  } catch {
    return false;
  }
}

const BADGE = {
  'hmi-live':   { cls: 'hmi', short: 'HMI' },
  recipe:       { cls: 'recipe', short: 'Receta' },
  mechanical:   { cls: 'mech', short: 'Mecánico' },
  manual:       { cls: 'manual', short: 'Manual' },
  measured:     { cls: 'ok', short: 'Medido' },
  derived:      { cls: 'derived', short: 'Derivado' },
  estimated:    { cls: 'est', short: 'Estim.' },
};
function badgeHtml(kind) {
  const b = BADGE[kind] ?? BADGE.estimated;
  return `<span class="badge badge--${b.cls}">${b.short}</span>`;
}

function renderGlobalsCard(params) {
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
        <li><code>τ_enc = t fijo (s)</code> (encolador)</li>
        <li><code>τ_esp = M_hopper / F_capa × 60</code> (esparcidores)</li>
        <li><code>t_banda_inclinada = L / (v_prensa × factor) × 60</code></li>
        <li><code>t_banda_común = L / v_prensa × 60</code></li>
        <li><code>t_total_etapa = (cálculo) + buffer_manual</code></li>
        <li><strong>Merge:</strong> banda blanca arranca cuando termina el esparcidor <strong>más lento</strong>.</li>
      </ul>
    </details>
  `;
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

function groupSchemaByStage(schema) {
  const map = new Map();
  for (const p of schema) {
    if (!map.has(p.nodeId)) map.set(p.nodeId, { nodeId: p.nodeId, group: p.group, params: [] });
    map.get(p.nodeId).params.push(p);
  }
  return [...map.values()];
}

function equationForNode(node, v, params) {
  const tau = tauForNode(node, params);
  const tr = transportForNode(node, v, params);
  const buf = Math.max(0, params[`buffer:${node.id}`] ?? 0);
  const total = tau + tr + buf;

  if (node.model === 'bin' || node.model === 'cstr' || node.model === 'hopper') {
    const F = flowFor(node, params);
    const M = Number(params[`mass:${node.id}`] ?? 0);
    const flowLbl = ({ F_SL: 'F_SL', F_CL: 'F_CL', F_SL1: 'F_SL × %SL1', F_SL2: 'F_SL × %SL2' })[node.flowSource] ?? 'F';
    return {
      eq: `<code>τ = M / (${flowLbl}) × 60</code>`,
      detail: `M = ${M.toFixed(1)} kg ÷ ${F.toFixed(1)} kg/min × 60 = <strong>${tau.toFixed(1)} s</strong>`,
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
  const L = Number(params[`len:${node.id}`] ?? node.lengthM ?? 0);
  const vBelt = Number(params[`speed:${node.id}`] ?? node.beltSpeedMperMin ?? 0);
  if (vBelt > 0) {
    return {
      eq: `<code>t = L / v_banda × 60</code>`,
      detail: `L = ${L.toFixed(2)} m ÷ ${vBelt.toFixed(1)} m/min × 60 = <strong>${tr.toFixed(1)} s</strong> (velocidad fija HMI)`,
      tau, tr, buf, total,
    };
  }
  return {
    eq: `<code>t = L / v_prensa × 60</code>`,
    detail: `L = ${L.toFixed(2)} m ÷ v_prensa = ${v.toFixed(2)} m/min × 60 = <strong>${tr.toFixed(1)} s</strong>`,
    tau, tr, buf, total,
  };
}

function paramFieldHtml(p, params) {
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

function renderStageCard(stage, v, params) {
  const node = findNode(stage.nodeId);
  if (!node) return null;
  const eq = equationForNode(node, v, params);
  const stageMeta = STAGE_SEQUENCE.find((s) => s.id === stage.nodeId);
  const label = stageMeta?.label ?? node.label;
  const src = node?.source;
  const srcBadge = src?.kind ?? 'estimated';

  const card = document.createElement('div');
  card.className = 'stage-card';
  card.dataset.nodeId = stage.nodeId;

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
      ${mainParams.map((p) => paramFieldHtml(p, params)).join('')}
    </div>
    ${bufferParam ? `
      <details class="stage-card__buffer">
        <summary>${badgeHtml('manual')} Buffer manual: <strong data-buffer-value>+${(params[bufferParam.key] ?? 0).toFixed(1)} s</strong></summary>
        <div class="stage-card__buffer-body">
          <p class="stage-card__buffer-help">Segundos adicionales que tú sumas a esta etapa (margen de seguridad, sin tocar la física calculada).</p>
          ${paramFieldHtml(bufferParam, params)}
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

export function initParams({ speedGetter, onChange }) {
  const speed = speedGetter ?? (() => 14.5);
  let params = loadParams();
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

  function showFeedback(msg) {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.classList.add('is-visible');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedbackEl.classList.remove('is-visible'), 2200);
  }

  function refreshEquationsLight() {
    const v = speed();
    grid.querySelectorAll('.stage-card').forEach((card) => {
      const node = findNode(card.dataset.nodeId);
      if (!node) return;
      const eq = equationForNode(node, v, params);
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

  function syncFromUI() {
    let changed = false;
    grid.querySelectorAll('input[data-key]').forEach((inp) => {
      const key = inp.dataset.key;
      const parsed = parseFloat(inp.value);
      const next = Number.isNaN(parsed) ? 0 : parsed;
      if (params[key] !== next) changed = true;
      params[key] = next;
    });
    return changed;
  }

  function build() {
    const v = speed();
    grid.innerHTML = '';
    grid.appendChild(renderGlobalsCard(params));
    const stages = groupSchemaByStage(getParameterSchema());
    let currentGroup = null;
    for (const stage of stages) {
      if (stage.group !== currentGroup) {
        const h = document.createElement('h4');
        h.className = 'param-group__title';
        h.textContent = stage.group;
        grid.appendChild(h);
        currentGroup = stage.group;
      }
      const card = renderStageCard(stage, v, params);
      if (card) grid.appendChild(card);
    }
    grid.querySelectorAll('input[data-key]').forEach((inp) => {
      inp.addEventListener('input', () => {
        syncFromUI();
        refreshEquationsLight();
        onChange?.(params);
      });
    });
    built = true;
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
  }

  tabLinea?.addEventListener('click', () => setView('linea'));
  tabParams?.addEventListener('click', () => setView('params'));

  document.getElementById('saveParamsBtn')?.addEventListener('click', () => {
    syncFromUI();
    showFeedback(saveParamsToStorage(params) ? 'Guardado ✓' : 'Error al guardar');
  });
  document.getElementById('loadParamsBtn')?.addEventListener('click', () => {
    params = loadParams();
    build();
    onChange?.(params);
    showFeedback('Cargado ✓');
  });
  document.getElementById('resetParamsBtn')?.addEventListener('click', () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    params = defaultParams();
    build();
    onChange?.(params);
    showFeedback('Defaults restaurados');
  });

  return {
    getParams: () => params,
  };
}
