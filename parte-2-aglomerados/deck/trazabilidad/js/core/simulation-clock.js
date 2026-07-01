/**
 * SimulationClock — reloj de simulación (setInterval, fiable en todos los navegadores).
 */

const TICK_MS = 33;

export class SimulationClock {
  #timeSec = 0;
  #playing = false;
  #timeScale = 10;
  #listeners = new Set();
  #intervalId = null;
  #maxSec = Infinity;

  get timeSec() {
    return this.#timeSec;
  }

  get playing() {
    return this.#playing;
  }

  get timeScale() {
    return this.#timeScale;
  }

  set timeScale(value) {
    this.#timeScale = Math.max(0.25, Math.min(120, value));
  }

  setMaxSec(sec) {
    this.#maxSec = sec > 0 ? sec : Infinity;
  }

  onTick(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  setTime(sec) {
    this.#timeSec = Math.max(0, Math.min(sec, this.#maxSec));
    this.#emit(0);
  }

  reset() {
    this.pause();
    this.#timeSec = 0;
    this.#emit(0);
  }

  play() {
    if (this.#playing) return;
    this.#playing = true;
    this.#emit(0);
    this.#intervalId = setInterval(() => this.#tick(), TICK_MS);
  }

  pause() {
    this.#playing = false;
    if (this.#intervalId != null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
    this.#emit(0);
  }

  toggle() {
    if (this.#playing) this.pause();
    else this.play();
  }

  #tick() {
    if (!this.#playing) return;
    const deltaSimSec = (TICK_MS / 1000) * this.#timeScale;
    this.#timeSec = Math.min(this.#timeSec + deltaSimSec, this.#maxSec);
    this.#emit(deltaSimSec);
    if (this.#timeSec >= this.#maxSec) this.pause();
  }

  #emit(deltaSec) {
    for (const fn of this.#listeners) fn(this.#timeSec, deltaSec);
  }
}
