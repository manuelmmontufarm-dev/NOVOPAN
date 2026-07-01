/**
 * TrackRenderer — grid P&ID: ↓ caídas, → bandas, 3 esparcidores alineados, SVG conectores.
 */

import { PATHS, PATH_IDS, DOWNSTREAM, FINE_PREFIX, findNode, pathsForInjection } from '../core/process-graph.js';
import { tauForNode } from '../core/trace-engine.js';

const BELT = {
  blue: { fill: '#BBDEFB', rail: '#1565C0' },
  white: { fill: '#FFFFFF', rail: '#004E38' },
  red: { fill: '#EF9A9A', rail: '#C62828' },
  press: { fill: '#1A1A1A', rail: '#5C5C5C' },
};

const BELT_V_PX_PER_M = 7.5;
const BELT_V_HEIGHT_MIN = 180;
const BELT_V_HEIGHT_MAX = 300;
const BELT_V_WIDTH = 100;

const PATH_COLORS = {
  [PATH_IDS.BOTTOM]: '#1565C0',
  [PATH_IDS.CORE]: '#0A7D5A',
  [PATH_IDS.TOP]: '#1976D2',
};

const PX_PER_M = 6;
const PX_PER_M_VERT = 5;
let scrollThrottle = 0;

const COLCHON_LAYER_TOP = { top: '20%', core: '50%', bottom: '80%' };

export class TrackRenderer {
  constructor(root) {
    this.root = root;
    this.params = {};
    this.nodeEls = new Map();
    this.built = false;
    this.gridEl = null;
    this.svgEl = null;
    this.onJump = null;
    this.scrollContainer = null;
    this.userScrollLockUntil = 0;
  }

  setParams(p) {
    this.params = { ...p };
  }

  updateParamDisplays() {
    if (!this.built) return;
    for (const [nodeId, el] of this.nodeEls) {
      const node = findNode(nodeId);
      if (!node) continue;
      const meta = el.querySelector('.pid-box__meta')
        ?? el.closest('.pid-incline-wrap')?.querySelector('.pid-box__meta')
        ?? el.closest('.pid-belt-block')?.querySelector('.pid-box__meta');
      if (!meta) continue;

      const r = Math.round(tauForNode(node, this.params));
      const L = this.params[`len:${nodeId}`] ?? node.lengthM ?? 0;

      if (node.layout === 'spreader') {
        meta.textContent = `τ = ${r} s · zona esparcidor`;
      } else if (node.kind === 'retention') {
        if (node.id === 'sprays-caida') {
          meta.textContent = r > 0 ? `τ = ${r} s · caída` : 'τ mezcla en caída ↓';
        } else if (r > 0) {
          meta.textContent = `τ = ${r} s`;
        } else {
          meta.textContent = 'caída ↓ gravedad';
        }
      } else if (node.kind === 'transport' && L > 0) {
        const incl = node.layout === 'incline-up';
        meta.textContent = incl ? `${L} m · transporte ↗` : `${L} m ↓ transporte`;
      }
    }
  }

  setOnJump(fn) {
    this.onJump = fn;
  }

  mToPx(m) {
    return Math.max(72, m * PX_PER_M);
  }

  build(injectionId) {
    this.injectionId = injectionId;
    this.root.innerHTML = '';
    this.nodeEls.clear();
    this.built = true;

    const wrap = document.createElement('div');
    wrap.className = 'pid-wrap';

    const flowBar = document.createElement('div');
    flowBar.className = 'pid-flow-bar';
    flowBar.setAttribute('aria-hidden', 'true');
    flowBar.innerHTML = `
      <span class="pid-flow-bar__zone">Silos</span>
      <span class="pid-flow-bar__arrow ms">arrow_forward</span>
      <span class="pid-flow-bar__zone">Proceso</span>
      <span class="pid-flow-bar__arrow ms">arrow_forward</span>
      <span class="pid-flow-bar__zone">Esparcidores</span>
      <span class="pid-flow-bar__arrow ms">arrow_forward</span>
      <span class="pid-flow-bar__zone">Unión</span>
      <span class="pid-flow-bar__arrow ms">arrow_forward</span>
      <span class="pid-flow-bar__zone pid-flow-bar__zone--downstream">Bandas ↓</span>`;
    wrap.appendChild(flowBar);

    const grid = document.createElement('div');
    grid.className = 'pid-grid';
    this.gridEl = grid;

    // Encabezados de zona por columna
    this._colHeader(grid, 1, 'Silos');
    this._colHeader(grid, 2, 'Dosing + encolador');
    this._colHeader(grid, 3, 'Banda inclinada');
    this._colHeader(grid, 4, 'Divisor');
    this._colHeader(grid, 6, 'Zona esparcidor (τ)');
    this._colHeader(grid, 7, 'Colchón + bandas ↓');

    // Col 1 — silos (fina arriba, gruesa subida a fila 3)
    this._cell(grid, 1, 2, this._silos('Fina'), true);
    this._cell(grid, 1, 3, this._silos('Gruesa'), true, { className: 'pid-grid__cell--thick-up' });

    // Col 2 — caídas + procesos (gruesa subida)
    this._cell(grid, 2, 2, this._chainDrop([
      FINE_PREFIX.find((n) => n.id === 'dosing-fine'),
      FINE_PREFIX.find((n) => n.id === 'enc-fine'),
    ], 'fine-shared'), true);
    this._cell(grid, 2, 3, this._chainDrop([
      PATHS[PATH_IDS.CORE].nodes.find((n) => n.id === 'dosing-thick'),
      PATHS[PATH_IDS.CORE].nodes.find((n) => n.id === 'sprays-caida'),
      PATHS[PATH_IDS.CORE].nodes.find((n) => n.id === 'enc-thick'),
    ], PATH_IDS.CORE), true, { className: 'pid-grid__cell--thick-up' });

    // Col 3 — fina en fila 2 (misma fila que silos/dosing/enc fina); gruesa en fila 3
    const fineIncl = FINE_PREFIX.find((n) => n.id === 'incl-fine');
    this._cell(grid, 3, 2, this._inclineBelt(fineIncl, 'fine-shared'), true, {
      className: 'pid-grid__cell--incl-fine',
      alignSelf: 'start',
    });
    const thickIncl = PATHS[PATH_IDS.CORE].nodes.find((n) => n.id === 'incl-thick');
    this._cell(grid, 3, 3, this._inclineBelt(thickIncl, PATH_IDS.CORE), true, {
      className: 'pid-grid__cell--incl-thick',
      alignSelf: 'center',
    });

    // Col 4 — nodo bifurcación fina: anclado entre incl-fine y esparcidores (centro esp3↔esp1)
    const dividerCell = document.createElement('div');
    dividerCell.className = 'pid-grid__divider pid-grid__divider--fork';
    dividerCell.innerHTML = `
      <div class="pid-divider"
           title="Salida banda inclinada fina → bifurca sin τ: rama superior → Esp.3 (TOP); rama inferior → Esp.1 (BOTTOM).">
        <div class="pid-divider__stem" aria-hidden="true"></div>
        <div class="pid-divider__icon" data-connector-id="divider-hub"><span class="ms">call_split</span></div>
        <div class="pid-divider__text">Divisor<br/>
          <small class="pid-divider__branch pid-divider__branch--top">↗ TOP · Esp.3</small>
          <small class="pid-divider__branch pid-divider__branch--bottom">↘ BOTTOM · Esp.1</small>
        </div>
      </div>`;
    dividerCell.style.gridColumn = '4';
    dividerCell.style.gridRow = '2 / 5';
    grid.appendChild(dividerCell);

    // Col 5 — corredor vacío para líneas SVG
    const corridor = document.createElement('div');
    corridor.className = 'pid-grid__corridor';
    corridor.style.gridColumn = '5';
    corridor.style.gridRow = '2 / 5';
    grid.appendChild(corridor);

    // Col 6 — esparcidores apilados (sin hueco por altura de fila gruesa)
    const spreaderCol = document.createElement('div');
    spreaderCol.className = 'pid-grid__cell pid-grid__spreader-col';
    spreaderCol.style.gridColumn = '6';
    spreaderCol.style.gridRow = '2 / 5';
    const spreaderStack = document.createElement('div');
    spreaderStack.className = 'pid-spreader-stack';
    spreaderStack.appendChild(this._spreaderBlock(
      PATHS[PATH_IDS.TOP].nodes[0], PATH_IDS.TOP, PATHS[PATH_IDS.TOP],
    ));
    spreaderStack.appendChild(this._spreaderBlock(
      PATHS[PATH_IDS.CORE].nodes.find((n) => n.layout === 'spreader'),
      PATH_IDS.CORE, PATHS[PATH_IDS.CORE],
    ));
    spreaderStack.appendChild(this._spreaderBlock(
      PATHS[PATH_IDS.BOTTOM].nodes[0], PATH_IDS.BOTTOM, PATHS[PATH_IDS.BOTTOM],
    ));
    spreaderCol.appendChild(spreaderStack);
    grid.appendChild(spreaderCol);

    // Col 7–9 — colchón + bandas verticales (zona unificada)
    const downZone = document.createElement('div');
    downZone.className = 'pid-downstream-zone';
    downZone.style.gridColumn = '7';
    downZone.style.gridRow = '2 / 5';

    const colchon = document.createElement('div');
    colchon.className = 'pid-colchon-banner';
    colchon.dataset.nodeId = 'merge-point';
    colchon.innerHTML = `
      <div class="pid-colchon-banner__fan" aria-hidden="true"></div>
      <div class="pid-colchon-banner__label"><span class="ms">layers</span> Colchón 3 capas</div>
      <div class="pid-colchon-banner__sub">Esp.1 abajo + Esp.2 centro + Esp.3 arriba</div>`;
    downZone.appendChild(colchon);

    const beltsRow = document.createElement('div');
    beltsRow.className = 'pid-downstream-belts';
    DOWNSTREAM.forEach((node) => beltsRow.appendChild(this._verticalBelt(node)));
    downZone.appendChild(beltsRow);
    grid.appendChild(downZone);
    this._register('merge-point', colchon, 'merged');

    // SVG overlay para conectores
    const gridWrap = document.createElement('div');
    gridWrap.className = 'pid-grid-wrap';
    gridWrap.appendChild(grid);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('pid-connectors');
    svg.setAttribute('aria-hidden', 'true');
    this.svgEl = svg;
    this.gridWrapEl = gridWrap;
    gridWrap.appendChild(svg);
    wrap.appendChild(gridWrap);

    const legend = document.createElement('div');
    legend.className = 'pid-legend';
    legend.innerHTML = `
      <span><i style="background:#E3F2FD;border:2px solid #1565C0"></i> Dosing fina</span>
      <span><i style="background:#FFF3E0;border:2px solid #E65100"></i> Dosing gruesa</span>
      <span><i style="background:#1565C0"></i> BOTTOM</span>
      <span><i style="background:#0A7D5A"></i> CORE</span>
      <span><i style="background:#1976D2"></i> TOP</span>
      <span class="pid-legend__flow"><span class="ms">arrow_downward</span> ↓ gravedad</span>
      <span class="pid-legend__flow"><span class="ms">arrow_forward</span> → transporte</span>
      <span class="pid-legend__flow"><span class="ms">trending_up</span> ↗ inclinada</span>
      <span><i class="pid-legend__board"></i> Tablero (madera)</span>
      <span><span class="ms" style="color:var(--ok-ink)">check_circle</span> Completado</span>`;
    wrap.appendChild(legend);

    this.root.appendChild(wrap);

    this.scrollContainer = this.root.closest('.diagram-scroll-wrap')
      ?? document.querySelector('.diagram-scroll-wrap');
    if (this.scrollContainer && !this.scrollContainer.dataset.scrollBound) {
      this.scrollContainer.dataset.scrollBound = '1';
      const lockUserScroll = () => {
        this.userScrollLockUntil = performance.now() + 12000;
      };
      this.scrollContainer.addEventListener('wheel', lockUserScroll, { passive: true });
      this.scrollContainer.addEventListener('touchstart', lockUserScroll, { passive: true });
      this.scrollContainer.addEventListener('scroll', lockUserScroll, { passive: true });
    }
    if (!window.__trazUserScrollLock) {
      window.__trazUserScrollLock = true;
      const lockPage = () => {
        if (this.built) this.userScrollLockUntil = performance.now() + 12000;
      };
      window.addEventListener('wheel', lockPage, { passive: true });
      window.addEventListener('touchmove', lockPage, { passive: true });
    }

    const activePaths = this._activePaths(injectionId);
    for (const el of this.nodeEls.values()) {
      const pathId = el.dataset.pathId;
      if (pathId === 'merged' || pathId === 'fine-shared') continue;
      if (!activePaths.includes(pathId)) el.classList.add('is-dimmed');
    }

    requestAnimationFrame(() => this._drawConnectors());
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    this._onResize = () => this._drawConnectors();
    window.addEventListener('resize', this._onResize);
  }

  jumpToNode(nodeId) {
    const el = this.nodeEls.get(nodeId);
    if (el) {
      this._scrollToNode(el);
      el.classList.add('is-highlight');
      setTimeout(() => el.classList.remove('is-highlight'), 1200);
    }
  }

  _scrollToNode(el) {
    if (!el || performance.now() < this.userScrollLockUntil) return;
    const hWrap = this.scrollContainer;
    if (!hWrap) return;
    const cr = hWrap.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const deltaX = er.left + er.width / 2 - (cr.left + cr.width / 2);
    if (Math.abs(deltaX) > 24) {
      hWrap.scrollBy({ left: deltaX, behavior: 'smooth' });
    }
  }

  _getMarker(layer, key) {
    const sel = `[data-marker-key="${CSS.escape(key)}"]`;
    let dot = layer.querySelector(sel);
    if (!dot) {
      dot = document.createElement('div');
      dot.dataset.markerKey = key;
      layer.appendChild(dot);
    }
    return dot;
  }

  _pruneMarkers(layer, keepKeys) {
    layer.querySelectorAll('[data-marker-key]').forEach((el) => {
      if (!keepKeys.has(el.dataset.markerKey)) el.remove();
    });
  }

  _paintDemoClass() {
    return this.injectionId === 'enc-all'
      || this.injectionId === 'enc-fine'
      || this.injectionId === 'enc-thick';
  }

  update(state) {
    if (!this.built) return;

    const completed = new Set(state.completedNodeIds ?? []);
    const byNode = new Map();

    for (const m of state.markers) {
      if (!byNode.has(m.nodeId)) byNode.set(m.nodeId, []);
      byNode.get(m.nodeId).push(m);
    }

    let scrollTarget = null;

    const paintDemo = this._paintDemoClass();

    for (const [nodeId, el] of this.nodeEls) {
      el.classList.remove('is-active');
      const layer = el.querySelector('.path-markers');
      const keepKeys = new Set();

      const isDone = completed.has(nodeId);
      el.classList.toggle('is-done', isDone);

      const check = el.querySelector('.node-check');
      if (check) check.hidden = !isDone;

      const fill = el.querySelector('.retention-fill');
      const isVert = el.dataset.orientation === 'vertical';
      if (fill) {
        if (isVert) {
          fill.style.height = isDone ? '100%' : '0';
          fill.style.width = '100%';
        } else {
          fill.style.width = isDone ? '100%' : '0';
          fill.style.height = '100%';
        }
      }

      const markers = byNode.get(nodeId);
      if (!markers?.length) {
        if (layer) this._pruneMarkers(layer, keepKeys);
        continue;
      }

      el.classList.add('is-active');
      scrollTarget = el;

      if (!layer) continue;

      markers.forEach((m, idx) => {
        const key = `${nodeId}:${m.pathId ?? 'x'}:${idx}`;
        keepKeys.add(key);
        const dot = this._getMarker(layer, key);
        dot.className = `path-marker path-marker--board${paintDemo ? ' path-marker--paint' : ''}`;
        dot.classList.remove('path-marker--retention', 'path-marker--colchon');
        dot.style.opacity = '';
        const tint = m.pathColor ?? PATH_COLORS[m.pathId] ?? '#8B6914';
        dot.style.setProperty('--path-tint', tint);
        dot.title = m.nodeLabel;

        const offset = (idx - (markers.length - 1) / 2) * 12;
        const pct = Math.min(97, Math.max(3, m.progressInNode * 100));

        if (m.phase === 'retention' || (m.phase === 'transport' && fill)) {
          if (fill && !isVert) fill.style.width = `${m.progressInNode * 100}%`;
          if (m.phase === 'retention') dot.classList.add('path-marker--retention');
          if (isVert) {
            dot.style.top = `${Math.max(8, m.progressInNode * 92)}%`;
            dot.style.left = `calc(50% + ${offset}px)`;
          } else {
            dot.style.left = `${Math.max(8, m.progressInNode * 92)}%`;
            dot.style.top = `calc(50% + ${offset}px)`;
          }
        } else if (m.phase === 'colchon' || m.phase === 'colchon-done') {
          dot.classList.add('path-marker--colchon');
          const rowTop = COLCHON_LAYER_TOP[m.layerRow] ?? '50%';
          dot.style.top = rowTop;
          dot.style.left = `calc(50% + ${offset}px)`;
          if (m.phase === 'colchon-done') dot.style.opacity = '0.45';
        } else if (isVert) {
          dot.style.top = `${pct}%`;
          dot.style.left = `calc(50% + ${offset}px)`;
        } else {
          dot.style.left = `${pct}%`;
          dot.style.top = `calc(50% + ${offset}px)`;
        }
      });

      this._pruneMarkers(layer, keepKeys);
    }

    requestAnimationFrame(() => this._drawConnectors());

    const now = performance.now();
    if (scrollTarget && now - scrollThrottle > 2000 && now >= this.userScrollLockUntil) {
      scrollThrottle = now;
      this._scrollToNode(scrollTarget);
    }
  }

  _anchor(nodeId, box, side = 'right') {
    const el = this.nodeEls.get(nodeId);
    if (!el) return null;

    if (nodeId.startsWith('incl-')) {
      const surface = el.querySelector('.pid-incline-belt .belt-surface');
      if (surface) {
        const r = surface.getBoundingClientRect();
        const y = r.top + r.height / 2 - box.top;
        if (side === 'left') return { x: r.left - box.left, y };
        if (side === 'right') return { x: r.right - box.left, y };
        return { x: r.left + r.width / 2 - box.left, y };
      }
    }

    let target = el;
    if (nodeId.includes('esp')) {
      target = el.querySelector('.retention-box') ?? el;
    }
    const r = target.getBoundingClientRect();
    const y = r.top + r.height / 2 - box.top;
    if (side === 'left') return { x: r.left - box.left, y };
    if (side === 'right') return { x: r.right - box.left, y };
    return { x: r.left + r.width / 2 - box.left, y };
  }

  _drawConnectors() {
    if (!this.svgEl || !this.gridWrapEl) return;
    const box = this.gridWrapEl.getBoundingClientRect();
    if (!box.width) return;

    this.svgEl.setAttribute('width', box.width);
    this.svgEl.setAttribute('height', box.height);
    this.svgEl.style.width = `${box.width}px`;
    this.svgEl.style.height = `${box.height}px`;
    this.svgEl.innerHTML = '';

    const addPath = (d, color, { width = 2, opacity = 0.5, dash = false } = {}) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', String(width));
      path.setAttribute('stroke-opacity', String(opacity));
      if (dash) path.setAttribute('stroke-dasharray', '6 4');
      this.svgEl.appendChild(path);
    };

    const hub = this.gridEl.querySelector('[data-connector-id="divider-hub"]');
    const hubRect = hub?.getBoundingClientRect();
    const hubX = hubRect ? hubRect.left + hubRect.width / 2 - box.left : null;
    const hubY = hubRect ? hubRect.top + hubRect.height / 2 - box.top : null;

    const drawThroughHub = (fromId, toId, color) => {
      const a = this._anchor(fromId, box, 'right');
      const b = this._anchor(toId, box, 'left');
      if (!a || !b || hubX == null || hubY == null) return;
      addPath(
        `M ${a.x} ${a.y} L ${hubX} ${a.y} L ${hubX} ${hubY} L ${hubX} ${b.y} L ${b.x} ${b.y}`,
        color,
        { dash: true },
      );
    };

    drawThroughHub('incl-fine', 'esp3-zone', '#1976D2');
    drawThroughHub('incl-fine', 'esp1-zone', '#1565C0');

    const inclA = this._anchor('incl-thick', box, 'right');
    const esp2A = this._anchor('esp2-zone', box, 'left');
    if (inclA && esp2A) {
      addPath(`M ${inclA.x} ${inclA.y} L ${esp2A.x} ${esp2A.y}`, '#0A7D5A', { dash: true });
    }

    const colchon = this.gridEl.querySelector('.pid-colchon-banner');
    const whiteEl = this.nodeEls.get('white');
    if (colchon) {
      const rc = colchon.getBoundingClientRect();
      const mergeTop = rc.top - box.top + 6;
      const mergeLeft = rc.left - box.left + 8;
      const busX = rc.left - box.left - 18;

      for (const [espId, color] of [
        ['esp3-zone', '#1976D2'],
        ['esp2-zone', '#0A7D5A'],
        ['esp1-zone', '#1565C0'],
      ]) {
        const pt = this._anchor(espId, box, 'right');
        if (!pt) continue;
        addPath(
          `M ${pt.x} ${pt.y} L ${busX} ${pt.y} L ${busX} ${mergeTop} L ${mergeLeft} ${mergeTop}`,
          color,
          { dash: true, opacity: 0.45 },
        );
      }

      if (whiteEl) {
        const rw = whiteEl.getBoundingClientRect();
        const rail = whiteEl.querySelector('.belt-rail-v');
        const railRect = rail?.getBoundingClientRect() ?? rw;
        const xWhite = railRect.left + railRect.width / 2 - box.left;
        const yFrom = rc.bottom - box.top;
        const yTo = railRect.top - box.top;
        addPath(`M ${xWhite} ${yFrom} L ${xWhite} ${yTo}`, '#004E38', {
          width: 2,
          opacity: 0.35,
          dash: true,
        });
      }
    }
  }

  _cell(grid, col, row, content, arrowRight = false, opts = null) {
    const cell = document.createElement('div');
    cell.className = 'pid-grid__cell' + (arrowRight ? ' pid-grid__cell--flow-right' : '');
    if (opts?.className) cell.classList.add(opts.className);
    cell.style.gridColumn = String(col);
    cell.style.gridRow = opts?.rowSpan ? String(opts.rowSpan) : String(row);
    if (opts?.alignSelf) cell.style.alignSelf = opts.alignSelf;
    if (content) cell.appendChild(content);
    if (arrowRight) cell.appendChild(this._hArrow());
    grid.appendChild(cell);
    return cell;
  }

  _colHeader(grid, col, label, span) {
    const h = document.createElement('div');
    h.className = 'pid-col-header';
    h.textContent = label;
    h.style.gridColumn = span ?? String(col);
    h.style.gridRow = '1';
    grid.appendChild(h);
  }

  _activePaths(injectionId) {
    return pathsForInjection(injectionId);
  }

  _register(nodeId, el, pathId) {
    el.dataset.nodeId = nodeId;
    el.dataset.pathId = pathId;
    if (el.dataset.orientation) {
      // already set on vertical belts
    }
    this.nodeEls.set(nodeId, el);
    return el;
  }

  _hArrow(label) {
    const a = document.createElement('div');
    a.className = 'pid-h-arrow';
    a.title = label ?? 'Transporte continuo →';
    a.innerHTML = `<span class="ms">arrow_forward</span>${label ? `<span class="pid-h-arrow__label">${label}</span>` : ''}`;
    return a;
  }

  _flowHint(dir, text) {
    const icons = { down: 'arrow_downward', right: 'arrow_forward', up: 'trending_up' };
    const el = document.createElement('div');
    el.className = `pid-flow-hint pid-flow-hint--${dir}`;
    el.innerHTML = `<span class="ms">${icons[dir] ?? 'arrow_forward'}</span>${text ? `<span>${text}</span>` : ''}`;
    return el;
  }

  _silos(kind) {
    const d = document.createElement('div');
    const fine = kind === 'Fina';
    d.className = `pid-silos pid-silos--${fine ? 'fine' : 'thick'}`;
    d.innerHTML = `
      <span class="ms">${fine ? 'blur_on' : 'grain'}</span>
      <span>Silos ${kind}</span>
      <span class="pid-silos__tag">${fine ? 'partícula fina · capas ext.' : 'partícula gruesa · core'}</span>
      <div class="pid-flow-hint pid-flow-hint--down pid-flow-hint--inline" title="Descarga por caída a dosing bin">
        <span class="ms">arrow_downward</span><span>caída</span>
      </div>`;
    return d;
  }

  _chainDrop(nodes, pathId) {
    const fine = pathId === 'fine-shared';
    const col = document.createElement('div');
    col.className = `pid-drop-chain pid-drop-chain--${fine ? 'fine' : 'thick'}`;
    if (!fine) {
      const hdr = document.createElement('div');
      hdr.className = 'pid-zone-header pid-zone-header--pressure';
      hdr.innerHTML = '<span class="ms">compress</span> Alta presión (caída)';
      col.appendChild(hdr);
    }
    for (const node of nodes) {
      if (!node) continue;
      col.appendChild(this._drop());
      col.appendChild(this._processBox(node, pathId));
    }
    return col;
  }

  _drop() {
    const a = document.createElement('div');
    a.className = 'pid-drop';
    a.innerHTML = '<span class="ms">arrow_downward</span>';
    return a;
  }

  _processBox(node, pathId) {
    const wrap = document.createElement('div');
    let cls = 'pid-box pid-box--process';
    if (node.id === 'dosing-fine') cls += ' pid-box--dosing-fine';
    else if (node.id === 'dosing-thick') cls += ' pid-box--dosing-thick';
    else if (node.id === 'sprays-caida') cls += ' pid-box--sprays-pressure';
    else if (pathId === PATH_IDS.CORE) cls += ' pid-box--route-thick';
    else cls += ' pid-box--route-fine';
    wrap.className = cls;
    const r = Math.round(tauForNode(node, this.params));
    const icon = node.id === 'dosing-fine' ? 'blur_on'
      : node.id === 'dosing-thick' ? 'grain'
      : node.id === 'sprays-caida' ? 'water_drop' : '';
    const zoneBadge = node.id === 'sprays-caida'
      ? '<div class="pid-box__zone-badge">Inyección a presión en caída</div>' : '';
    const meta = r > 0
      ? `τ = ${r} s`
      : node.id === 'sprays-caida'
        ? 'τ mezcla en caída ↓'
        : 'caída ↓ gravedad';
    wrap.innerHTML = `
      <div class="node-check" hidden><span class="ms">check_circle</span></div>
      ${icon ? `<div class="pid-box__icon"><span class="ms">${icon}</span></div>` : ''}
      ${zoneBadge}
      <div class="pid-box__title">${node.label}</div>
      ${node.sublabel ? `<div class="pid-box__sub">${node.sublabel}</div>` : ''}
      <div class="retention-box track-surface">
        <div class="retention-fill"></div>
        <div class="path-markers"></div>
      </div>
      <div class="pid-box__meta">${meta}</div>`;
    return this._register(node.id, wrap, pathId);
  }

  _inclineBelt(node, pathId) {
    const wrap = document.createElement('div');
    wrap.className = 'pid-incline-wrap';
    const L = this.params[`len:${node.id}`] ?? node.lengthM ?? 10;
    const w = this.mToPx(L);
    const style = BELT[node.beltColor] ?? BELT.blue;
    const splits = node.splitsTo?.length
      ? '<div class="pid-box__sub">1 banda azul → divisor</div>'
      : '<div class="pid-box__sub">→ Esparcidor 2 (core)</div>';
    wrap.innerHTML = `
      <div class="pid-incline-wrap__labels">
        <div class="pid-box__title">${node.label}</div>
        ${splits}
        <div class="pid-box__meta">${L} m · transporte ↗</div>
      </div>
      <div class="pid-incline-wrap__track" style="--incl-w:${w}px">
        <div class="pid-incline-belt" style="width:${w}px">
          <div class="node-check" hidden><span class="ms">check_circle</span></div>
          <div class="belt-surface track-surface" style="--fill:${style.fill};--rail:${style.rail}">
            <div class="belt-incline-flow" title="Transporte continuo, sin τ"><span class="ms">trending_up</span></div>
            <div class="path-markers"></div>
          </div>
        </div>
      </div>`;
    return this._register(node.id, wrap, pathId);
  }

  _spreaderBlock(node, pathId, path) {
    const wrap = document.createElement('div');
    wrap.className = `pid-box pid-box--spreader pid-box--${path.row}`;
    wrap.style.setProperty('--path-color', path.color);
    const r = Math.round(tauForNode(node, this.params));
    const equipItems = node.equipment ?? [];
    const equip = equipItems
      .map((e, i) => {
        const arrow = i < equipItems.length - 1
          ? '<span class="equip-flow-arrow">→</span>' : '';
        return `<li>${e.name}${arrow}</li>`;
      })
      .join('');
    const layerPct = path.row === 'bottom' ? '43 % ext.'
      : path.row === 'top' ? '53 % ext.' : '70 % total';
    wrap.innerHTML = `
      <div class="node-check" hidden><span class="ms">check_circle</span></div>
      <div class="pid-box__badge">${path.label.split('·')[0].trim()}</div>
      <div class="pid-box__title">${node.label}</div>
      <div class="pid-box__sub">Capa ${layerPct}</div>
      <div class="retention-box retention-box--wide track-surface">
        <div class="retention-fill"></div>
        <div class="path-markers"></div>
      </div>
      <div class="pid-box__meta">τ = ${r} s · zona esparcidor</div>
      <ul class="pid-equip-list" title="Secuencia interna (PROCESO.md)">${equip}</ul>
      <div class="pid-spreader-drop" title="Caída a banda blanca en movimiento">
        <span class="ms">arrow_downward</span> caída a colchón
      </div>`;
    return this._register(node.id, wrap, pathId);
  }

  _verticalBelt(node) {
    const wrap = document.createElement('div');
    const beltKey = node.beltColor ?? 'white';
    wrap.className = `pid-belt-block pid-belt-block--vertical pid-belt-block--${beltKey}`;
    const L = this.params[`len:${node.id}`] ?? node.lengthM ?? 10;
    const h = Math.max(BELT_V_HEIGHT_MIN, Math.min(BELT_V_HEIGHT_MAX, Math.round(L * BELT_V_PX_PER_M)));
    const style = BELT[beltKey] ?? BELT.white;
    const equip = (node.equipment ?? [])
      .map((e, i) => {
        const side = i % 2 === 0 ? 'right' : 'left';
        return `<span class="equip-on-vbelt equip-on-vbelt--${side}" style="top:${e.atPct}%" title="${e.name}">${e.name}</span>`;
      })
      .join('');
    const validatedTag = node.validated
      ? '<span class="pid-belt-block__badge pid-belt-block__badge--ok">validado</span>'
      : '<span class="pid-belt-block__badge">est.</span>';
    const masterNote = node.id === 'press'
      ? '<div class="pid-box__sub pid-box__sub--master">Velocidad prensa = máster línea</div>'
      : node.sublabel
        ? `<div class="pid-box__sub">${node.sublabel}</div>` : '';
    wrap.innerHTML = `
      <div class="pid-belt-block__head">
        <div class="pid-box__title">${node.label}</div>
        ${validatedTag}
      </div>
      ${masterNote}
      <div class="pid-box__meta">${L} m ↓ transporte</div>
      <div class="belt-track-v track-surface" style="height:${h}px;--belt-w:${BELT_V_WIDTH}px" data-orientation="vertical">
        <div class="node-check" hidden><span class="ms">check_circle</span></div>
        <div class="belt-rail-v" style="--fill:${style.fill};--rail:${style.rail}">
          ${equip}
          <div class="path-markers"></div>
        </div>
      </div>`;
    const el = wrap;
    el.dataset.orientation = 'vertical';
    return this._register(node.id, el, 'merged');
  }
}
