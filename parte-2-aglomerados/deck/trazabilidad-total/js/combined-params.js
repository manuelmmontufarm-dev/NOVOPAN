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
const P1_STORAGE_KEY = 'novopan-trazabilidad-total-p1-v1';

export const P1_PARAMS = [
  { key: 'p1:pila1_M', label: 'M pila aserrín', unit: 'kg', default: 5000, group: 'Parte 1 · Reducción' },
  { key: 'p1:pila1_F', label: 'F aserrín', unit: 'kg/h', default: 7000, group: 'Parte 1 · Reducción' },
  { key: 'p1:pila2_M', label: 'M pila chip', unit: 'kg', default: 10000, group: 'Parte 1 · Reducción' },
  { key: 'p1:pila2_F', label: 'F chip', unit: 'kg/h', default: 20000, group: 'Parte 1 · Reducción' },
  { key: 'p1:tr3', label: 't Hombak→S3', unit: 's', default: 60, group: 'Parte 1 · Reducción' },
  { key: 'p1:s1_rho', label: 'Silo 1 ρ', unit: 'kg/m³', default: 271, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:s1_V', label: 'Silo 1 V', unit: 'm³', default: 150, group: 'Parte 1 · Silos verdes', unknown: true },
  { key: 'p1:s1_L', label: 'Silo 1 nivel', unit: '%', default: 50, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:s1_F', label: 'Silo 1 F out', unit: 'kg/h', default: 7000, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:s2_rho', label: 'Silo 2A ρ', unit: 'kg/m³', default: 230, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:s2_V', label: 'Silo 2A V', unit: 'm³', default: 200, group: 'Parte 1 · Silos verdes', unknown: true },
  { key: 'p1:s2_L', label: 'Silo 2A nivel', unit: '%', default: 25.4, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:s2_F', label: 'Silo 2A F out', unit: 'kg/h', default: 13990, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:s3_rho', label: 'Silo 3 ρ', unit: 'kg/m³', default: 211, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:s3_V', label: 'Silo 3 V', unit: 'm³', default: 250, group: 'Parte 1 · Silos verdes', unknown: true },
  { key: 'p1:s3_L', label: 'Silo 3 nivel', unit: '%', default: 30, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:s3_F', label: 'Silo 3 F out', unit: 'kg/h', default: 8700, group: 'Parte 1 · Silos verdes' },
  { key: 'p1:bk_rho', label: 'Bunker ρ', unit: 'kg/m³', default: 290, group: 'Parte 1 · Mezcla/secado' },
  { key: 'p1:bk_V', label: 'Bunker V', unit: 'm³', default: 40, group: 'Parte 1 · Mezcla/secado' },
  { key: 'p1:bk_L', label: 'Bunker nivel', unit: '%', default: 55, group: 'Parte 1 · Mezcla/secado' },
  { key: 'p1:bk_F', label: 'Bunker F húmedo', unit: 'kg/h', default: 27005, group: 'Parte 1 · Mezcla/secado' },
  { key: 'p1:trSec', label: 't transp. secadero', unit: 's', default: 30, group: 'Parte 1 · Mezcla/secado' },
  { key: 'p1:tauTambor', label: 'τ tambor secadero', unit: 's', default: 900, group: 'Parte 1 · Mezcla/secado' },
  { key: 'p1:tCriba', label: 't tamices F/G', unit: 's', default: 8, group: 'Parte 1 · Clasificación' },
  { key: 'p1:tZar', label: 't 3 zarandas', unit: 's', default: 15, group: 'Parte 1 · Clasificación' },
  { key: 'p1:tColectCL', label: 't colector CL', unit: 's', default: 12, group: 'Parte 1 · Clasificación' },
  { key: 'p1:tColectSL', label: 't colector SL', unit: 's', default: 12, group: 'Parte 1 · Clasificación' },
  { key: 'p1:tWS1', label: 't Windsifter 1', unit: 's', default: 10, group: 'Parte 1 · Clasificación' },
  { key: 'p1:tWS2', label: 't Windsifter 2', unit: 's', default: 10, group: 'Parte 1 · Clasificación' },
  { key: 'p1:tWS3', label: 't Windsifter 3', unit: 's', default: 10, group: 'Parte 1 · Clasificación' },
  { key: 'p1:tRef1', label: 't Refinador 1', unit: 's', default: 25, group: 'Parte 1 · Oversize/refino' },
  { key: 'p1:tRef2', label: 't Refinador 2', unit: 's', default: 25, group: 'Parte 1 · Oversize/refino' },
  { key: 'p1:tCiclon', label: 't ciclones', unit: 's', default: 8, group: 'Parte 1 · Oversize/refino' },
  { key: 'p1:tClasSL', label: 't clasificadores', unit: 's', default: 12, group: 'Parte 1 · Oversize/refino' },
  { key: 'p1:tReingresoSL', label: 't reingreso SL', unit: 's', default: 10, group: 'Parte 1 · Oversize/refino' },
  { key: 'p1:s5_rho', label: 'Silo 5 ρ', unit: 'kg/m³', default: 135, group: 'Parte 1 · Silos finales' },
  { key: 'p1:s5_V', label: 'Silo 5 V', unit: 'm³', default: 120, group: 'Parte 1 · Silos finales', unknown: true },
  { key: 'p1:s5_L', label: 'Silo 5 nivel', unit: '%', default: 44, group: 'Parte 1 · Silos finales' },
  { key: 'p1:s5_Fmin', label: 'Silo 5 F out', unit: 'kg/min', default: 302, group: 'Parte 1 · Silos finales' },
  { key: 'p1:s6_rho', label: 'Silo 6 ρ', unit: 'kg/m³', default: 188, group: 'Parte 1 · Silos finales' },
  { key: 'p1:s6_V', label: 'Silo 6 V', unit: 'm³', default: 120, group: 'Parte 1 · Silos finales', unknown: true },
  { key: 'p1:s6_L', label: 'Silo 6 nivel', unit: '%', default: 31, group: 'Parte 1 · Silos finales' },
  { key: 'p1:s6_Fmin', label: 'Silo 6 F out', unit: 'kg/min', default: 108, group: 'Parte 1 · Silos finales' },
  { key: 'p1:dosG_M', label: 'Dosing CL M', unit: 'kg', default: 25, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:dosG_F', label: 'Dosing CL F', unit: 'kg/min', default: 302, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:dosF_M', label: 'Dosing SL M', unit: 'kg', default: 20, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:dosF_F', label: 'Dosing SL F', unit: 'kg/min', default: 108, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:tEncCI', label: 't encolador CI', unit: 's', default: 30, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:tEncCE', label: 't encolador CE', unit: 's', default: 30, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:inclG_L', label: 'Inclinada CL L', unit: 'm', default: 68.5, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:inclG_v', label: 'Inclinada CL v', unit: 'm/min', default: 96.5, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:inclF_L', label: 'Inclinada SL L', unit: 'm', default: 64.57, group: 'Parte 2 · Entrada desde P1' },
  { key: 'p1:inclF_v', label: 'Inclinada SL v', unit: 'm/min', default: 99.5, group: 'Parte 2 · Entrada desde P1' },
];

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

export function defaultPart1Params() {
  return Object.fromEntries(P1_PARAMS.map((p) => [p.key, p.default]));
}

export function loadPart1Params() {
  const defaults = defaultPart1Params();
  try {
    const raw = localStorage.getItem(P1_STORAGE_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return defaults;
    return { ...defaults, ...saved };
  } catch {
    return defaults;
  }
}

function savePart1Params(params) {
  try {
    const out = {};
    for (const p of P1_PARAMS) out[p.key] = params[p.key];
    localStorage.setItem(P1_STORAGE_KEY, JSON.stringify(out));
    return true;
  } catch {
    return false;
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

function renderPart1Cards(params) {
  const frag = document.createDocumentFragment();
  const groups = [...new Set(P1_PARAMS.map((p) => p.group))];
  for (const group of groups) {
    const rows = P1_PARAMS.filter((p) => p.group === group);
    const card = document.createElement('section');
    card.className = 'p1-param-card';
    card.innerHTML = `
      <header class="p1-param-card__hd">
        <h4>${group}</h4>
        <p>${group.includes('Silos') ? 'Volúmenes m³ en rojo = no confirmados' : 'Parte del modelo τ=M/F×60 · t=L/v×60'}</p>
      </header>
      <div class="p1-param-grid">
        ${rows.map((p) => `
          <label class="p1-param-field">
            <span>${p.label}</span>
            <span class="p1-param-field__input">
              <input type="number" step="any" min="0" data-key="${p.key}" data-unknown="${p.unknown ? '1' : '0'}" value="${params[p.key] ?? p.default}">
              <span class="p1-param-field__unit">${p.unit}</span>
            </span>
          </label>
        `).join('')}
      </div>
    `;
    frag.appendChild(card);
  }
  return frag;
}

export function initParams({ speedGetter, onChange }) {
  const speed = speedGetter ?? (() => 14.5);
  let params = { ...loadParams(), ...loadPart1Params() };
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
    grid.appendChild(renderPart1Cards(params));
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
    const ok = saveParamsToStorage(params) && savePart1Params(params);
    showFeedback(ok ? 'Guardado ✓' : 'Error al guardar');
  });
  document.getElementById('loadParamsBtn')?.addEventListener('click', () => {
    params = { ...loadParams(), ...loadPart1Params() };
    build();
    onChange?.(params);
    showFeedback('Cargado ✓');
  });
  document.getElementById('resetParamsBtn')?.addEventListener('click', () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    try { localStorage.removeItem(P1_STORAGE_KEY); } catch {}
    params = { ...defaultParams(), ...defaultPart1Params() };
    build();
    onChange?.(params);
    showFeedback('Defaults restaurados');
  });

  return {
    getParams: () => params,
  };
}
