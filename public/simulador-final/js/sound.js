/* ============================================================
   NOVOPAN · sonidos del simulador
   ------------------------------------------------------------
   Tonos cortos sintetizados con Web Audio (sin assets externos):
     · click de UI (sutil)
     · inyección de cambio
     · llegada a los Sensores de calidad (fin de recorrido)
   MUTEADO por defecto (es una pantalla de planta); el estado se
   activa con el botón de sonido y persiste en localStorage. El
   AudioContext se crea recién tras un gesto del usuario (política
   de autoplay de los navegadores).
   ============================================================ */

const STORE_KEY = 'novopan.soundOn';

let ctx = null;
let muted = true;
try { muted = localStorage.getItem(STORE_KEY) !== '1'; } catch { /* sin localStorage */ }

function ensureCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/* Un tono con ataque corto y caída exponencial (sin clicks de corte). */
function tone(freq, delay, dur, peak, type = 'sine') {
  const c = ensureCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const at = c.currentTime + delay;
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(peak, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(g).connect(c.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

export const sound = {
  isMuted: () => muted,
  setMuted(v) {
    muted = Boolean(v);
    try { localStorage.setItem(STORE_KEY, muted ? '0' : '1'); } catch { /* sin localStorage */ }
    if (!muted) ensureCtx();   // el click que activa el sonido ES el gesto
  },
  /* blip sutil para botones/tabs */
  click() { if (!muted) tone(1500, 0, 0.05, 0.035, 'square'); },
  /* dos notas ascendentes al inyectar un cambio */
  inject() {
    if (muted) return;
    tone(520, 0, 0.09, 0.08);
    tone(780, 0.07, 0.12, 0.08);
  },
  /* campanita de tres notas al llegar a los Sensores de calidad */
  sensor() {
    if (muted) return;
    tone(660, 0, 0.14, 0.09);
    tone(880, 0.12, 0.14, 0.09);
    tone(1100, 0.24, 0.2, 0.08);
  },
};
