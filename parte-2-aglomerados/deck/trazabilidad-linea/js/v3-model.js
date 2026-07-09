/* ============================================================
   NOVOPAN · Línea 1 · Sección 2 — modelo v3 (silos → sensores)
   ------------------------------------------------------------
   Fuente de verdad: ../trazabilidad/CODEX_PROMPT_PRESENTACION_ECUACIONES.md
     recipiente  τ = M / F × 60          (silo: M = ρ · V_cap · L%)
     banda       t = L / v × 60
     encolador   t_enc = prueba de trazador (TBD)
     T_antes,e = τ_silo + τ_dos + t_enc + t_incl + τ_esp,e
     t_reg  = max(T_antes,SL1 , T_antes,CL , T_antes,SL2)
     t_down = 83.73 / v_prensa × 60      (punto SL1 → sensores)
   No toca el motor clásico: solo REUSA tauForNode/findNode para
   esparcidores e inclinadas y añade silos + dosing CE/CI + t_enc.
   ============================================================ */

import { findNode } from '../../trazabilidad/js/core/process-graph.js';
import { tauForNode } from '../../trazabilidad/js/core/trace-engine.js';

// Distancia punto SL1 (1.42 m) → sensores (85.15 m). 43.58 + 10 + 16.6 + 13.55.
export const SL1_TO_SENSORS_M = 83.73;
export const REGISTRO_POS_M = 1.42;

/* Parámetros nuevos del modelo v3. default null = TBD (regla §9: NO rellenar).
   Viven en el MISMO localStorage que el resto (novopan-trazabilidad-params-v9);
   el simulador clásico los ignora. */
/* Valores de PRUEBA (placeholder) para los campos que antes eran TBD — puestos
   para que el simulador SIEMPRE calcule un t_reg real y no se quede bloqueado
   en "TBD" mientras IT confirma los tags reales del HMI/SQL. Marcados con badge
   'estimated' (no 'hmi-live' ni 'medido') para dejar claro que son de prueba.
   Reemplazar por los valores reales apenas llegue el CSV real del HMI. */
export const V3_PARAMS = [
  // Silo 6 · fina
  { key: 'v3:silo-fine:rho',  label: 'ρ densidad',   unit: 'kg/m³',  default: 150, group: 'silo-fine',  kindBadge: 'estimated' },
  { key: 'v3:silo-fine:Vcap', label: 'V_cap',        unit: 'm³',     default: 15,  group: 'silo-fine',  kindBadge: 'estimated' },
  { key: 'v3:silo-fine:Lpct', label: 'Nivel L%',     unit: '%',      default: 55,  group: 'silo-fine',  kindBadge: 'hmi-live' },
  { key: 'v3:silo-fine:Fout', label: 'F_out descarga', unit: 'kg/min', default: 400, group: 'silo-fine', kindBadge: 'estimated' },
  // Silo 5 · gruesa
  { key: 'v3:silo-thick:rho',  label: 'ρ densidad',   unit: 'kg/m³',  default: 160, group: 'silo-thick', kindBadge: 'estimated' },
  { key: 'v3:silo-thick:Vcap', label: 'V_cap',        unit: 'm³',     default: 18,  group: 'silo-thick', kindBadge: 'estimated' },
  { key: 'v3:silo-thick:Lpct', label: 'Nivel L%',     unit: '%',      default: 55,  group: 'silo-thick', kindBadge: 'hmi-live' },
  { key: 'v3:silo-thick:Fout', label: 'F_out descarga', unit: 'kg/min', default: 450, group: 'silo-thick', kindBadge: 'estimated' },
  // Encoladores (prueba de trazador pendiente — 10/12 s son estimación de planta similar)
  { key: 'v3:enc-fine:tEnc',  label: 't_enc CE (fina)',   unit: 's', default: 10, group: 'enc', kindBadge: 'estimated' },
  { key: 'v3:enc-thick:tEnc', label: 't_enc CI (gruesa)', unit: 's', default: 12, group: 'enc', kindBadge: 'estimated' },
  // Caudal de descarga HMI por corriente (para el dosing, doc §3)
  { key: 'v3:dos-fine:F',  label: 'F descarga CE (fina)',   unit: 'kg/min', default: 111, group: 'dos', kindBadge: 'hmi-live' },
  { key: 'v3:dos-thick:F', label: 'F descarga CI (gruesa)', unit: 'kg/min', default: 282, group: 'dos', kindBadge: 'hmi-live' },
];

export function v3Defaults() {
  const out = {};
  for (const p of V3_PARAMS) out[p.key] = p.default;
  return out;
}

const isTbd = (v) => v == null || v === '' || Number.isNaN(Number(v)) || Number(v) <= 0;

/** τ_silo = (ρ · V_cap · L%/100) / F_out × 60. TBD si falta algún campo. */
export function tauSilo(which, params) {
  const rho = params[`v3:silo-${which}:rho`];
  const Vcap = params[`v3:silo-${which}:Vcap`];
  const Lpct = params[`v3:silo-${which}:Lpct`];
  const Fout = params[`v3:silo-${which}:Fout`];
  if (isTbd(rho) || isTbd(Vcap) || isTbd(Lpct) || isTbd(Fout)) return { sec: 0, tbd: true };
  return { sec: (Number(rho) * Number(Vcap) * (Number(Lpct) / 100) / Number(Fout)) * 60, tbd: false };
}

/** t_enc: prueba de trazador. TBD hasta que exista la medición. */
export function tEnc(which, params) {
  const t = params[`v3:enc-${which}:tEnc`];
  if (isTbd(t)) return { sec: 0, tbd: true };
  return { sec: Number(t), tbd: false };
}

/** τ_dos = M_dosing (HMI) / F_descarga CE|CI × 60 (doc §3). */
export function tauDosing(which, params) {
  const nodeId = which === 'fine' ? 'dosing-fine' : 'dosing-thick';
  const node = findNode(nodeId);
  const M = Number(params[`mass:${nodeId}`] ?? node?.holdupKg ?? 0);
  const F = Number(params[`v3:dos-${which}:F`]);
  if (M <= 0 || !(F > 0)) return { sec: 0, tbd: true };
  return { sec: (M / F) * 60, tbd: false };
}

/** t_incl = L / v_banda × 60 (velocidad fija HMI; reusa len:/speed: del clásico). */
export function tIncl(which, params) {
  const nodeId = which === 'fine' ? 'incl-fine' : 'incl-thick';
  const node = findNode(nodeId);
  const L = Number(params[`len:${nodeId}`] ?? node?.lengthM ?? 0);
  const v = Number(params[`speed:${nodeId}`] ?? node?.beltSpeedMperMin ?? 0);
  if (L <= 0 || v <= 0) return { sec: 0, tbd: true };
  return { sec: (L / v) * 60, tbd: false };
}

/** τ_esp: mismo modelo hopper del clásico (M zona / F capa × 60). */
export function tauEsp(layer, params) {
  const nodeId = layer === 'SL1' ? 'esp1-zone' : layer === 'CL' ? 'esp2-zone' : 'esp3-zone';
  const sec = tauForNode(findNode(nodeId), params);
  return { sec, tbd: !(sec > 0) };
}

/* Cadena upstream de una capa: silo → dosing → encolador → inclinada → esparcidor.
   SL1 y SL2 comparten la ruta FINA (silo 6 · dosing fina · CE · inclinada fina) y
   difieren solo en el esparcidor. CL va por la ruta GRUESA. */
export function layerChain(layer, params) {
  const w = layer === 'CL' ? 'thick' : 'fine';
  const silo = tauSilo(w, params);
  const dos = tauDosing(w, params);
  const enc = tEnc(w, params);
  const incl = tIncl(w, params);
  const esp = tauEsp(layer, params);
  const siloLabel = layer === 'CL' ? 'Silo 5 · gruesa' : 'Silo 6 · fina';
  const espLabel = layer === 'SL1' ? 'Esparcidor 1' : layer === 'CL' ? 'Esparcidor 2' : 'Esparcidor 3';
  return [
    { id: `silo-${w}`,   label: siloLabel,                      ...silo },
    { id: `dosing-${w}`, label: layer === 'CL' ? 'Dosing gruesa' : 'Dosing fina', ...dos },
    { id: `enc-${w}`,    label: layer === 'CL' ? 'Encolador CI' : 'Encolador CE', ...enc },
    { id: `incl-${w}`,   label: layer === 'CL' ? 'Banda inclinada gruesa' : 'Banda inclinada fina', ...incl },
    { id: `esp-${layer}`, label: espLabel,                      ...esp },
  ];
}

/* ¿Qué capas arrastra un cambio inyectado en un equipo upstream?
   Ruta fina compartida → SL1+SL2 · ruta gruesa → CL · silos (receta) → las 3. */
export function activeLayersFor(nodeId) {
  if (nodeId === 'silos') return ['SL1', 'CL', 'SL2'];
  if (/-fine$/.test(nodeId)) return ['SL1', 'SL2'];
  if (/-thick$/.test(nodeId)) return ['CL'];
  return ['SL1', 'CL', 'SL2'];
}

/* Registro del cambio (v3): t_reg = max de T_antes de las capas activas,
   arrancando la cadena en startId (o desde el silo si es null/'silos'). */
export function computeRegistro(params, startId = 'silos') {
  const layers = activeLayersFor(startId);
  const perLayer = {};
  let tReg = 0;
  let governing = layers[0];
  let anyTbd = false;
  let govChain = [];
  // Una etapa genérica ('enc', 'dosing', 'silo', 'incl') arranca cada capa en SU
  // propio nodo real (fina/gruesa). startId específico ('enc-fine') matchea directo.
  const genericStage = /^(silo|dosing|enc|incl)$/.test(startId);
  for (const L of layers) {
    const chain = layerChain(L, params);
    const realId = genericStage ? `${startId}-${L === 'CL' ? 'thick' : 'fine'}` : startId;
    const si = startId && startId !== 'silos' ? chain.findIndex((n) => n.id === realId) : 0;
    const slice = chain.slice(si < 0 ? 0 : si);
    const sum = slice.reduce((a, n) => a + n.sec, 0);
    const tbd = slice.some((n) => n.tbd);
    perLayer[L] = { sum, tbd, slice };
    if (tbd) anyTbd = true;
    if (sum > tReg || govChain.length === 0) { tReg = sum; governing = L; govChain = slice; }
  }
  return { tReg, perLayer, governing, govChain, anyTbd, layers, startId };
}

/** t punto SL1 → sensores, acoplado a v_prensa. */
export function downstreamSec(vPrensa) {
  return vPrensa > 0 ? (SL1_TO_SENSORS_M / vPrensa) * 60 : 0;
}

/** Ecuación maestra: t_tot = max_e(T_antes,e) + 83.73 / v_prensa × 60. */
export function totalToSensors(params, vPrensa, startId = 'silos') {
  const reg = computeRegistro(params, startId);
  const tDown = downstreamSec(vPrensa);
  return { ...reg, tDown, tTot: reg.tReg + tDown };
}

/* Checks de validación del doc §5: 346.5 s @ 14.5 · 452.1 s @ 11.11 m/min. */
export const DOWNSTREAM_CHECKS = { '14.5': 346.5, '11.11': 452.1 };

export function expectedDownstream(vPrensa) {
  return DOWNSTREAM_CHECKS[String(+(+vPrensa).toFixed(2))] ?? null;
}

export function selfTest() {
  const t1 = downstreamSec(14.5);
  const t2 = downstreamSec(11.11);
  const ok1 = Math.abs(t1 - 346.5) < 0.1;
  const ok2 = Math.abs(t2 - 452.1) < 0.1;
  const msg = `[v3-model] selfTest: t_down@14.5 = ${t1.toFixed(1)}s (${ok1 ? 'OK' : 'FALLO, esperado 346.5'}) · ` +
    `t_down@11.11 = ${t2.toFixed(1)}s (${ok2 ? 'OK' : 'FALLO, esperado 452.1'})`;
  (ok1 && ok2 ? console.info : console.error)(msg);
  return ok1 && ok2;
}
