/* ============================================================
   NOVOPAN · Modelo de ruta — SUITE DE PRUEBAS
   ------------------------------------------------------------
   Corre en Node (node js/route-model.test.js) y en el navegador
   (importado por tests.html). Cubre:
     · Encoladoras (mixers) = 40 s exactos
     · Ruta fina · Ruta gruesa
     · Registro SL1 / CL / SL2
     · Llegada a cada sensor
     · Distintas velocidades de línea
     · Comportamiento ante parámetro faltante
     · Conversión de unidades
     · Valores cero y negativos (+ NaN / Infinity)
   ============================================================ */

import {
  STATUS, MIXER_TAU_SEC, convert, flowToKgMin, defaultParamValues,
  readParam, tauSilo, tauDosing, tauMixer, tInclined, tauSpreader,
  fineUpstream, coarseUpstream, layerArrivals, registration, computeRoute,
  isAvailable, PARAM_INDEX,
} from './route-model.js';

/* ── mini-harness ── */
const results = [];
let currentGroup = 'general';
function group(name) { currentGroup = name; }
function test(name, fn) {
  try { fn(); results.push({ group: currentGroup, name, ok: true }); }
  catch (e) { results.push({ group: currentGroup, name, ok: false, err: e.message }); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'assert falló'); }
const TOL = 0.01;
function approx(actual, expected, msg, tol = TOL) {
  assert(typeof actual === 'number' && Math.abs(actual - expected) <= tol,
    `${msg || ''} · esperado ${expected}, obtenido ${actual}`);
}

/* Valores calculados a mano (v_prensa = 14.5 m/min) para cruzar con el modelo. */
const HAND = {
  tauSilo5: 135 * 120 * 0.44 / 302 * 60,      // 1416.1589 s
  tauSilo6: 188 * 120 * 0.31 / 108 * 60,      // 3885.3333 s
  tauDosingCL: 25 / 302 * 60,                 // 4.96689 s
  tauDosingSL: 20 / 108 * 60,                 // 11.11111 s
  tInclSL: 64.57 / 99.5 * 60,                 // 38.93668 s
  tInclCL: 68.5 / 96.5 * 60,                  // 42.59067 s
};
HAND.fine = HAND.tauSilo6 + HAND.tauDosingSL + 40 + HAND.tInclSL;     // 3975.3811
HAND.coarse = HAND.tauSilo5 + HAND.tauDosingCL + 40 + HAND.tInclCL;   // 1503.7165
HAND.tSL1 = HAND.fine + 40;                                           // 4015.3811
HAND.tCL = HAND.coarse + 40;                                          // 1543.7165
HAND.tSL2 = HAND.fine + 40;                                           // 4015.3811
HAND.tReg = Math.max(HAND.tSL1, HAND.tCL, HAND.tSL2);                 // 4015.3811
HAND.sensor1 = HAND.tReg + 85.15 / 14.5 * 60;                         // 4367.7260
HAND.sensor2 = HAND.tReg + 85.35 / 14.5 * 60;                         // 4368.5535
HAND.sensor3 = HAND.tReg + 85.55 / 14.5 * 60;                         // 4369.3811

/* ── Encoladoras (mixers) = 40 s ── */
group('Encoladoras = 40 s');
test('MIXER_TAU_SEC constante = 40', () => approx(MIXER_TAU_SEC, 40, 'constante'));
test('Encoladora externa/fina (CE) = 40 s', () => {
  const q = tauMixer(defaultParamValues(), 'mixerCE');
  assert(q.status === STATUS.OK, 'CE debe ser OK');
  approx(q.value, 40, 'CE');
});
test('Encoladora interna/gruesa (CI) = 40 s', () => {
  const q = tauMixer(defaultParamValues(), 'mixerCI');
  assert(q.status === STATUS.OK, 'CI debe ser OK');
  approx(q.value, 40, 'CI');
});
test('Ambas encoladoras son iguales (40 = 40)', () => {
  const p = defaultParamValues();
  approx(tauMixer(p, 'mixerCE').value, tauMixer(p, 'mixerCI').value, 'CE=CI');
});
test('Encoladora NO editable a otro valor (min=max=40 la fija)', () => {
  assert(PARAM_INDEX['mixerCE.tau'].editable === false, 'CE debe ser no editable');
  // Intentar forzar 50 s → inválido (fuera de rango), NO se acepta en silencio.
  const q = tauMixer({ ...defaultParamValues(), 'mixerCE.tau': 50 }, 'mixerCE');
  assert(q.status === STATUS.INVALID, 'forzar 50 s debe ser INVALID');
  // Forzar 30 s → también inválido.
  const q2 = tauMixer({ ...defaultParamValues(), 'mixerCI.tau': 30 }, 'mixerCI');
  assert(q2.status === STATUS.INVALID, 'forzar 30 s debe ser INVALID');
});

/* ── Ruta fina ── */
group('Ruta fina (SL)');
test('τ_silo6 correcto', () => approx(tauSilo(defaultParamValues(), 'silo6').value, HAND.tauSilo6, 'silo6'));
test('τ_dosingSL correcto', () => approx(tauDosing(defaultParamValues(), 'dosingSL').value, HAND.tauDosingSL, 'dosingSL'));
test('t_inclSL correcto', () => approx(tInclined(defaultParamValues(), 'inclSL').value, HAND.tInclSL, 'inclSL'));
test('fineUpstream = Σ pasos', () => approx(fineUpstream(defaultParamValues()).value, HAND.fine, 'fine'));
test('fineUpstream lleva flag ESTIMADO (V silo sin confirmar)', () => {
  const q = fineUpstream(defaultParamValues());
  assert(q.flags.has(STATUS.ESTIMATED), 'debe propagar estimado desde silo6.capacity');
});

/* ── Ruta gruesa ── */
group('Ruta gruesa (CL)');
test('τ_silo5 correcto', () => approx(tauSilo(defaultParamValues(), 'silo5').value, HAND.tauSilo5, 'silo5'));
test('τ_dosingCL correcto', () => approx(tauDosing(defaultParamValues(), 'dosingCL').value, HAND.tauDosingCL, 'dosingCL'));
test('t_inclCL correcto', () => approx(tInclined(defaultParamValues(), 'inclCL').value, HAND.tInclCL, 'inclCL'));
test('coarseUpstream = Σ pasos', () => approx(coarseUpstream(defaultParamValues()).value, HAND.coarse, 'coarse'));

/* ── Registro SL1 / CL / SL2 ── */
group('Registro de capas');
test('t_SL1 = fina + esparcidor1', () => approx(layerArrivals(defaultParamValues()).tSL1.value, HAND.tSL1, 'SL1'));
test('t_CL = gruesa + esparcidor2', () => approx(layerArrivals(defaultParamValues()).tCL.value, HAND.tCL, 'CL'));
test('t_SL2 = fina + esparcidor3', () => approx(layerArrivals(defaultParamValues()).tSL2.value, HAND.tSL2, 'SL2'));
test('t_registro = max(SL1, CL, SL2)', () => approx(registration(defaultParamValues()).value, HAND.tReg, 'reg'));
test('registro lo gana la ruta fina (SL), no la gruesa', () => {
  const q = registration(defaultParamValues());
  assert(q.winner === 'SL1' || q.winner === 'SL2', `winner debe ser una capa fina, fue ${q.winner}`);
});
test('registro lleva flag ESTIMADO', () => {
  assert(registration(defaultParamValues()).flags.has(STATUS.ESTIMATED), 'reg estimado');
});

/* ── Sensores ── */
group('Llegada a sensores');
test('sensor1 correcto', () => approx(computeRoute().sensors.sensor1.value, HAND.sensor1, 's1'));
test('sensor2 correcto', () => approx(computeRoute().sensors.sensor2.value, HAND.sensor2, 's2'));
test('sensor3 correcto', () => approx(computeRoute().sensors.sensor3.value, HAND.sensor3, 's3'));
test('sensor2 > sensor1 > registro (orden físico)', () => {
  const s = computeRoute().sensors;
  assert(s.sensor3.value > s.sensor2.value && s.sensor2.value > s.sensor1.value, 'orden s1<s2<s3');
});
test('sensor1 = ESTIMADO (hereda de registro), sensor2/3 = SIN CALIBRAR', () => {
  const s = computeRoute().sensors;
  assert(s.sensor1.status === STATUS.ESTIMATED, `s1 estado ${s.sensor1.status}`);
  assert(s.sensor2.status === STATUS.NOT_CALIBRATED, `s2 estado ${s.sensor2.status}`);
  assert(s.sensor3.status === STATUS.NOT_CALIBRATED, `s3 estado ${s.sensor3.status}`);
});

/* ── Distintas velocidades de línea ── */
group('Velocidades de línea');
for (const v of [7, 14.5, 16.85, 23]) {
  test(`v=${v}: sensor1 = registro + 85.15/v×60`, () => {
    const r = computeRoute({}, { lineSpeed: v });
    approx(r.sensors.sensor1.value, HAND.tReg + 85.15 / v * 60, `s1@${v}`);
  });
}
test('el registro NO depende de v_prensa', () => {
  const a = computeRoute({}, { lineSpeed: 7 }).registration.value;
  const b = computeRoute({}, { lineSpeed: 23 }).registration.value;
  approx(a, b, 'registro invariante a v');
});
test('mayor v ⇒ menor tiempo a sensor', () => {
  assert(computeRoute({}, { lineSpeed: 23 }).sensors.sensor1.value
    < computeRoute({}, { lineSpeed: 7 }).sensors.sensor1.value, 'v↑ ⇒ t↓');
});

/* ── Parámetro faltante ── */
group('Parámetro faltante');
test('silo6.flow vacío ⇒ ruta fina UNAVAILABLE (no 0 silencioso)', () => {
  const r = computeRoute({ 'silo6.flow': '' });
  assert(r.fine.status === STATUS.UNAVAILABLE, 'fina no disponible');
  assert(r.fine.value === null, 'sin valor numérico (no 0)');
  assert(r.registration.status === STATUS.UNAVAILABLE, 'registro no disponible');
  assert(r.sensors.sensor1.value === null, 'sensor sin valor');
});
test('la ruta gruesa sigue disponible aunque falte un dato de la fina', () => {
  const r = computeRoute({ 'silo6.flow': '' });
  assert(isAvailable(r.coarse), 'gruesa disponible');
  approx(r.coarse.value, HAND.coarse, 'gruesa intacta');
});
test('missing reporta la razón (qué parámetro falta)', () => {
  const q = readParam({ 'silo6.flow': undefined }, 'silo6.flow');
  assert(q.status === STATUS.MISSING && /Silo 6/.test(q.reason), 'razón menciona el parámetro');
});

/* ── Conversión de unidades ── */
group('Conversión de unidades');
test('kg/h ⇒ kg/min', () => { approx(convert.kghToKgmin(6000), 100, 'kgh'); approx(flowToKgMin(6000, 'kg/h'), 100, 'flowToKgMin'); });
test('kg/min ⇒ kg/h', () => approx(convert.kgminToKgh(100), 6000, 'kgmin'));
test('% ⇒ fracción', () => { approx(convert.pctToFraction(44), 0.44, 'pct'); approx(convert.pctToFraction(31), 0.31, 'pct31'); });
test('min ⇒ s y s ⇒ min', () => { approx(convert.minToSec(2), 120, 'minToSec'); approx(convert.secToMin(120), 2, 'secToMin'); });
test('τ_silo sale en SEGUNDOS (×60 aplicado), no minutos', () => {
  // mass = 135·120·0.44 = 7128 kg; /302 kg/min = 23.60 min; ×60 = 1416 s
  const q = tauSilo(defaultParamValues(), 'silo5');
  approx(q.value, 1416.16, 'segundos', 0.05);
  approx(q.value / 60, 23.60, 'minutos', 0.05);
});
test('flowToKgMin rechaza unidad desconocida (NaN, no 0)', () => {
  assert(Number.isNaN(flowToKgMin(100, 'kg/s')), 'unidad rara ⇒ NaN');
});

/* ── Cero, negativo, NaN, Infinity ── */
group('Cero / negativo / NaN / Infinity');
test('flujo de silo = 0 ⇒ INVALID (división por cero evitada)', () => {
  const q = tauSilo({ ...defaultParamValues(), 'silo5.flow': 0 }, 'silo5');
  assert(q.status === STATUS.UNAVAILABLE || q.status === STATUS.INVALID, `estado ${q.status}`);
  assert(q.value === null, 'sin valor');
});
test('velocidad inclinada = 0 ⇒ ruta fina UNAVAILABLE', () => {
  const r = computeRoute({ 'inclSL.speed': 0 });
  assert(r.fine.status === STATUS.UNAVAILABLE, 'fina no disponible por v=0');
});
test('line.speed = 0 ⇒ sensores UNAVAILABLE (no ∞)', () => {
  const r = computeRoute({}, { lineSpeed: 0 });
  assert(r.sensors.sensor1.value === null, 's1 sin valor');
  assert(r.sensors.sensor1.status === STATUS.UNAVAILABLE, `estado ${r.sensors.sensor1.status}`);
});
test('densidad negativa ⇒ INVALID', () => {
  const q = tauSilo({ ...defaultParamValues(), 'silo6.rho': -5 }, 'silo6');
  assert(q.value === null && q.status === STATUS.UNAVAILABLE, 'ρ<0 bloquea');
});
test('masa dosing negativa ⇒ INVALID', () => {
  const q = readParam({ 'dosingCL.mass': -1 }, 'dosingCL.mass');
  assert(q.status === STATUS.INVALID, 'masa<0');
});
test('NaN ⇒ INVALID', () => {
  const q = readParam({ 'silo5.rho': NaN }, 'silo5.rho');
  assert(q.status === STATUS.INVALID, 'NaN');
});
test('Infinity ⇒ INVALID', () => {
  const q = readParam({ 'silo5.rho': Infinity }, 'silo5.rho');
  assert(q.status === STATUS.INVALID, 'Infinity');
});
test('nivel > 100% ⇒ INVALID (fuera de rango)', () => {
  const q = readParam({ 'silo5.level': 150 }, 'silo5.level');
  assert(q.status === STATUS.INVALID, 'nivel 150%');
});
test('string en blanco «  » ⇒ MISSING (no 0 silencioso)', () => {
  const q = readParam({ 'silo6.level': '   ' }, 'silo6.level');
  assert(q.status === STATUS.MISSING, `esperado MISSING, fue ${q.status}`);
  // Y no contamina la ruta con un 0 fabricado:
  const r = computeRoute({ 'silo6.level': '   ' });
  assert(r.fine.value === null && r.fine.status === STATUS.UNAVAILABLE, 'ruta fina no disponible');
});
test('tipos no numéricos (boolean/array/objeto) ⇒ INVALID (no 0)', () => {
  for (const bad of [false, true, [], {}, [5]]) {
    const q = readParam({ 'silo5.rho': bad }, 'silo5.rho');
    assert(q.status === STATUS.INVALID, `${JSON.stringify(bad)} debe ser INVALID, fue ${q.status}`);
  }
});
test('overflow (ρ·V → Infinity) ⇒ INVALID, no fuga con estado OK', () => {
  const q = tauSilo({ ...defaultParamValues(), 'silo5.rho': 1e300, 'silo5.capacity': 1e300 }, 'silo5');
  assert(q.value === null && q.status === STATUS.INVALID, `overflow debe ser INVALID, fue ${q.status}/${q.value}`);
});
test('computeRoute nunca produce NaN/Infinity numérico', () => {
  const bads = [{ 'silo5.flow': 0 }, { 'line.speed': 0 }, { 'silo6.rho': -1 }, { 'inclCL.speed': 0 }, {}];
  for (const o of bads) {
    const r = computeRoute(o);
    for (const q of [r.fine, r.coarse, r.registration, r.sensors.sensor1, r.sensors.sensor2, r.sensors.sensor3]) {
      assert(q.value === null || Number.isFinite(q.value), `valor no finito con ${JSON.stringify(o)}`);
    }
  }
});

/* ── reporte ── */
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);

export function runReport() {
  const byGroup = {};
  for (const r of results) (byGroup[r.group] ??= []).push(r);
  return { results, passed, failed: failed.length, total: results.length, byGroup, HAND };
}

// Salida en consola (Node y navegador).
const lines = [];
let lastGroup = null;
for (const r of results) {
  if (r.group !== lastGroup) { lines.push(`\n▸ ${r.group}`); lastGroup = r.group; }
  lines.push(`  ${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : `  →  ${r.err}`}`);
}
lines.push(`\n${failed.length === 0 ? '✅' : '❌'} ${passed}/${results.length} pruebas OK`);
const report = lines.join('\n');

// eslint-disable-next-line no-console
console.log(report);

// En Node: exit code según resultado.
if (typeof process !== 'undefined' && process.exit) {
  process.exitCode = failed.length === 0 ? 0 : 1;
}
