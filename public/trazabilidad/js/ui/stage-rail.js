/**
 * StageRail — barra de etapas con ✓ / activo / pendiente; click → scroll al nodo.
 */

import { STAGE_SEQUENCE } from '../core/process-graph.js';

export class StageRail {
  constructor(root, onJump) {
    this.root = root;
    this.onJump = onJump;
    this.chips = new Map();
    this._build();
  }

  _build() {
    this.root.innerHTML = `
      <div class="stage-rail__head">
        <span class="stage-rail__title">Progreso del cambio</span>
        <span class="stage-rail__pct" id="stagePct">0 %</span>
      </div>
      <div class="stage-rail__track" id="stageTrack"></div>`;

    const track = this.root.querySelector('#stageTrack');
    for (const stage of STAGE_SEQUENCE) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'stage-chip';
      chip.dataset.nodeId = stage.id;
      chip.title = stage.label;
      chip.innerHTML = `
        <span class="stage-chip__dot"></span>
        <span class="stage-chip__label">${stage.short}</span>
        <span class="stage-chip__check ms" hidden>check</span>`;
      chip.addEventListener('click', () => this.onJump?.(stage.id));
      track.appendChild(chip);
      this.chips.set(stage.id, chip);
    }
  }

  update(state, totalSec) {
    const completed = new Set(state.completedNodeIds ?? []);
    const activeIds = new Set(state.markers.map((m) => m.nodeId));

    let doneCount = 0;
    for (const stage of STAGE_SEQUENCE) {
      const chip = this.chips.get(stage.id);
      if (!chip) continue;

      chip.classList.remove('is-done', 'is-active', 'is-pending');
      const check = chip.querySelector('.stage-chip__check');

      if (completed.has(stage.id) || stage.id === 'done' && completed.has('done')) {
        chip.classList.add('is-done');
        if (check) check.hidden = false;
        doneCount++;
      } else if (activeIds.has(stage.id)) {
        chip.classList.add('is-active');
        if (check) check.hidden = true;
      } else {
        chip.classList.add('is-pending');
        if (check) check.hidden = true;
      }
    }

    const pct = STAGE_SEQUENCE.length
      ? Math.round((doneCount / STAGE_SEQUENCE.length) * 100)
      : 0;
    const pctEl = this.root.querySelector('#stagePct');
    if (pctEl) pctEl.textContent = `${pct} %`;

    // barra de tiempo global
    const t = state.simulationTimeSec ?? 0;
    const progress = totalSec > 0 ? Math.min(100, (t / totalSec) * 100) : 0;
    this.root.style.setProperty('--time-progress', `${progress}%`);
  }
}
