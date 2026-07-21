/* ============================================================
   NOVOPAN · Adaptador de formatos CSV — SUITE DE PRUEBAS
   ------------------------------------------------------------
   Corre en Node (node js/adaptador.test.js) y en el navegador
   (importado por tests.html). Cubre:
     · Cada formato de datos/fixtures/ → el MISMO updates{}
     · Perfil detectado (kv · tabla · ancho · desconocido)
     · Los CSV reales de datos/ pasan intactos (regresión)
     · Validity=0 ⇒ pendiente, nunca cero
     · Archivo basura ⇒ desconocido + primeras líneas para diagnosticar
     · Tag desconocido dentro de una tabla ⇒ aviso, el resto sigue
     · datos/adaptador.json fija el mapeo cuando el sniffer no acierta
   ============================================================ */

import { adaptarCsv, detectarPerfil, parseHmiCsv } from './hmi-csv.js';

/* ── mini-harness (mismo de route-model.test.js) ── */
const results = [];
let currentGroup = 'general';
function group(name) { currentGroup = name; }
function test(name, fn) {
  try { fn(); results.push({ group: currentGroup, name, ok: true }); }
  catch (e) { results.push({ group: currentGroup, name, ok: false, err: e.message }); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'assert falló'); }
function approx(actual, expected, msg, tol = 0.001) {
  assert(typeof actual === 'number' && Math.abs(actual - expected) <= tol,
    `${msg || ''} · esperado ${expected}, obtenido ${actual}`);
}

/* ── carga de fixtures (Node por fs, navegador por fetch) ── */
const enNode = typeof process !== 'undefined' && !!process.versions?.node;
async function leer(ruta) {
  const url = new URL(`../${ruta}`, import.meta.url);
  if (enNode) {
    const { readFileSync } = await import('node:fs');
    return readFileSync(url, 'utf8');
  }
  const res = await fetch(url);
  return res.text();
}

const FIXTURES = [
  'kv-actual.csv', 'kv-clasico.csv', 'tabla-wincc.csv', 'tabla-columnas-extra.csv',
  'taglogging-validity.csv', 'ancho.csv', 'tabla-sin-encabezado.csv',
  'tabla-nombres-raros.csv', 'miles-comillas.csv', 'basura.csv',
];
const REALES = ['hmi.csv', 'hmi-preparacion.csv', 'hmi-encolado.csv', 'hmi-formacion.csv'];

const FX = {};
for (const f of FIXTURES) FX[f] = await leer(`datos/fixtures/${f}`);
const RL = {};
for (const f of REALES) RL[f] = await leer(`datos/${f}`);

/* ── contrato: TODOS los formatos describen el mismo estado de planta ── */
const ESPERADO = {
  'v_prensa': 14.5,
  '_global:peso_manta': 6.8,
  '_global:F_CL': 320.5,
  'p1:dosG_M': 1234.56,
  'mass:dosing-thick': 1234.56,
};

const PERFIL_ESPERADO = {
  'kv-actual.csv': 'kv',
  'kv-clasico.csv': 'kv',
  'tabla-wincc.csv': 'tabla',
  'tabla-columnas-extra.csv': 'tabla',
  'taglogging-validity.csv': 'tabla',
  'ancho.csv': 'ancho',
  'tabla-sin-encabezado.csv': 'tabla',
  'tabla-nombres-raros.csv': 'tabla',
  'miles-comillas.csv': 'tabla',
  'basura.csv': 'desconocido',
};

/** Camino completo del simulador: texto de IT → adaptador → parser de siempre. */
function correr(texto, cfg = null) {
  const ad = adaptarCsv(texto, cfg);
  const parsed = parseHmiCsv(ad.texto);
  return { ...ad, ...parsed, avisos: [...ad.avisos, ...parsed.warnings] };
}

function igualA(updates, esperado, msg) {
  const claves = Object.keys(updates).sort();
  assert(claves.join(',') === Object.keys(esperado).sort().join(','),
    `${msg} · claves esperadas [${Object.keys(esperado).sort()}], obtenidas [${claves}]`);
  for (const [k, v] of Object.entries(esperado)) approx(updates[k], v, `${msg} · ${k}`);
}

/* ── 1 · perfil detectado ── */
group('perfil detectado');
for (const [f, perfil] of Object.entries(PERFIL_ESPERADO)) {
  test(`${f} ⇒ perfil ${perfil}`, () => {
    const d = detectarPerfil(FX[f]);
    assert(d.perfil === perfil, `perfil obtenido: ${d.perfil} (${d.detalle})`);
  });
}

/* Regresión: los tags del servidor de Preparación empiezan con DÍGITO porque
   el prefijo es el código de área. El sniffer exigía letra o `_` inicial y
   clasificaba ese CSV entero como "desconocido" — el adaptador lo habría
   rechazado. Al abrirlo hay que seguir rechazando el timestamp. */
group('perfil detectado · nombres que empiezan con dígito');
for (const [linea, esperado] of [
  ['066_C_Dry_Material_CL_Level: 44;', 'kv'],
  ['051_S_Hombak_Level: 30;', 'kv'],
  ['071_DRY_Hum_out: 3.4;', 'kv'],
  ['066_C_Dry_Material_CL_Level: 44;   # con comentario al final', 'kv'],
  ['"H_Act_MatWeight_SP": 11.5;', 'kv'],
]) {
  test(`${linea.slice(0, 38)}… ⇒ ${esperado}`, () => {
    const d = detectarPerfil(linea);
    assert(d.perfil === esperado, `perfil obtenido: ${d.perfil} (${d.detalle})`);
  });
}
for (const linea of [
  '2026-07-21 08:00:00;H_PressSpeed_PV;14,5',
  '2026/07/21 08:00:00;H_PressSpeed_PV;14,5',
  '08:00:00;H_PressSpeed_PV;14,5',
]) {
  test(`${linea.slice(0, 30)}… NO se confunde con kv`, () => {
    const d = detectarPerfil(linea);
    assert(d.perfil !== 'kv', `se detectó kv por error (${d.detalle})`);
  });
}

/* ── 2 · el contrato: mismo updates{} desde cualquier formato ── */
group('mismo updates{} desde cualquier formato');
for (const f of FIXTURES) {
  if (f === 'basura.csv' || f === 'tabla-nombres-raros.csv') continue; // casos propios, ver abajo
  test(`${f} ⇒ updates canónicos`, () => igualA(correr(FX[f]).updates, ESPERADO, f));
}

/* ── 3 · el camino kv no pasa por código nuevo ── */
group('regresión · kv intacto');
test('kv-actual.csv sale byte a byte igual', () => {
  assert(adaptarCsv(FX['kv-actual.csv']).texto === FX['kv-actual.csv'], 'el adaptador modificó un CSV kv');
});
test('kv-clasico.csv (TAG,valor) sale byte a byte igual', () => {
  assert(adaptarCsv(FX['kv-clasico.csv']).texto === FX['kv-clasico.csv'], 'el adaptador modificó un CSV kv');
});
for (const f of REALES) {
  test(`datos/${f} sigue siendo kv y no se toca`, () => {
    const ad = adaptarCsv(RL[f]);
    assert(ad.perfil === 'kv', `perfil ${ad.perfil}`);
    assert(ad.texto === RL[f], 'texto modificado');
    assert(ad.avisos.length === 0, `avisos: ${ad.avisos.join(' | ')}`);
  });
}
test('los 4 CSV reales combinados siguen dando el mismo conteo que sin adaptador', () => {
  const combinado = REALES.map((f) => `# @origen: ${f}\n${RL[f]}`).join('\n');
  const a = parseHmiCsv(combinado);
  const b = correr(combinado);
  assert(a.count === b.count && a.count > 0, `${a.count} vs ${b.count}`);
});

/* ── 4 · calidad del dato ── */
group('calidad · Validity/Quality');
test('Validity=0 ⇒ pendiente, NO cero', () => {
  const r = correr(FX['taglogging-validity.csv']);
  assert(!('p1:s5_L' in r.updates), `s5_L no debía entrar: ${r.updates['p1:s5_L']}`);
  assert(r.texto.includes('SILO5_L_PCT:;'), 'el tag descartado debe quedar explícitamente pendiente');
});
test('Validity=0 avisa cuántas filas descartó', () => {
  const r = correr(FX['taglogging-validity.csv']);
  assert(r.avisos.some((a) => /calidad/i.test(a)), `avisos: ${r.avisos.join(' | ')}`);
});
test('las filas Validity=1 sí entran', () => {
  igualA(correr(FX['taglogging-validity.csv']).updates, ESPERADO, 'taglogging');
});

/* ── 5 · adaptador.json de respaldo ── */
group('adaptador.json (respaldo manual)');
const CFG_RAROS = { perfil: 'tabla', colTag: 'Col1', colValor: 'Col3', colCalidad: 'Col4', calidadOk: 'BUENO' };
test('sin cfg: el sniffer resuelve las columnas por contenido', () => {
  const r = correr(FX['tabla-nombres-raros.csv']);
  assert(r.perfil === 'tabla', `perfil ${r.perfil}`);
  igualA(r.updates, { ...ESPERADO, 'p1:s5_L': 62.4 }, 'nombres raros sin cfg');
});
test('con cfg: la columna de calidad declarada descarta la fila MALO', () => {
  igualA(correr(FX['tabla-nombres-raros.csv'], CFG_RAROS).updates, ESPERADO, 'nombres raros con cfg');
});
test('cfg por índice de columna (0-based) también sirve', () => {
  const cfg = { perfil: 'tabla', colTag: 0, colValor: 2, colCalidad: 3, calidadOk: 'BUENO' };
  igualA(correr(FX['tabla-nombres-raros.csv'], cfg).updates, ESPERADO, 'nombres raros por índice');
});

/* ── 6 · diagnóstico ── */
group('diagnóstico');
test('basura ⇒ desconocido, sin updates y con las primeras líneas en el aviso', () => {
  const r = correr(FX['basura.csv']);
  assert(r.perfil === 'desconocido', `perfil ${r.perfil}`);
  assert(Object.keys(r.updates).length === 0, 'no debe extraer nada de un archivo basura');
  assert(r.count === 0 && r.avisos.length > 0, 'debe quedar en estado de error');
  assert(r.avisos[0].includes('DOCTYPE'), `el aviso debe citar el archivo: ${r.avisos[0]}`);
});
test('basura marca error=true para que el pill se ponga en rojo', () => {
  assert(adaptarCsv(FX['basura.csv']).error === true, 'el archivo ilegible debe marcar error');
});
test('tabla legible pero con TODOS los tags ajenos al modelo ⇒ error explicado', () => {
  const ad = adaptarCsv('Tagname;Value\nMOTOR_X;1\nMOTOR_Y;2\nMOTOR_Z;3\n');
  assert(ad.error === true, 'debe marcar error, no quedarse callado');
  assert(ad.texto === '', 'no debe entregar un documento vacío disfrazado de válido');
  const junto = ad.avisos.join(' | ');
  assert(/MOTOR_X/.test(junto), `debe nombrar los tags: ${junto}`);
  assert(/adaptador\.json/.test(junto), `debe decir cómo arreglarlo: ${junto}`);
  assert(/perfil "tabla"/.test(junto), `debe decir qué creyó leer: ${junto}`);
});
test('los tags ajenos se resumen en UN aviso, no uno por fila', () => {
  const filas = Array.from({ length: 40 }, (_, i) => `MOTOR_${i};1`).join('\n');
  const r = correr(`Tagname;Value\nV_PRENSA_M_MIN;14,5\n${filas}\n`);
  assert(r.avisos.length <= 2, `avisos: ${r.avisos.length} → ${r.avisos.join(' | ')}`);
  assert(r.avisos.some((a) => a.includes('40 tag(s)')), `avisos: ${r.avisos.join(' | ')}`);
  approx(r.updates['v_prensa'], 14.5, 'el tag bueno sigue entrando');
});
test('un archivo bueno no marca error', () => {
  assert(adaptarCsv(FX['tabla-wincc.csv']).error === false, 'falso positivo de error');
  assert(adaptarCsv(RL['hmi.csv']).error === false, 'falso positivo de error en kv');
});
test('tag desconocido dentro de una tabla ⇒ aviso y el resto sigue', () => {
  const r = correr(FX['tabla-columnas-extra.csv']);
  assert(r.avisos.some((a) => a.includes('H_TAG_QUE_NO_EXISTE')), `avisos: ${r.avisos.join(' | ')}`);
  igualA(r.updates, ESPERADO, 'columnas extra');
});
test('el perfil viaja al pill de estado', () => {
  const ad = adaptarCsv(FX['tabla-wincc.csv']);
  assert(ad.perfil === 'tabla' && ad.detalle.includes('Tagname'), `detalle: ${ad.detalle}`);
});

/* ── 7 · robustez de celdas ── */
group('celdas · locale, comillas, miles');
test('decimal alemán con ; de separador (14,5 ⇒ 14.5)', () => {
  approx(correr(FX['tabla-wincc.csv']).updates['v_prensa'], 14.5, 'v_prensa');
});
test('miles + decimal (1.234,56 ⇒ 1234.56)', () => {
  approx(correr(FX['tabla-wincc.csv']).updates['p1:dosG_M'], 1234.56, 'dosG_M');
});
test('celda entre comillas con coma adentro no parte la fila', () => {
  approx(correr(FX['miles-comillas.csv']).updates['p1:dosG_M'], 1234.56, 'dosG_M');
  approx(correr(FX['miles-comillas.csv']).updates['v_prensa'], 14.5, 'v_prensa');
});
test('el ; gana al decimal coma en la detección de separador', () => {
  assert(detectarPerfil(FX['tabla-wincc.csv']).delim === ';', 'delimitador mal detectado');
});
test('separador | también se detecta', () => {
  assert(detectarPerfil(FX['tabla-nombres-raros.csv']).delim === '|', 'delimitador mal detectado');
});
test('una fecha con : no se confunde con el formato TAG: valor;', () => {
  assert(detectarPerfil(FX['tabla-sin-encabezado.csv']).perfil === 'tabla', 'falso positivo de kv');
});

/* ── 8 · formato ancho ── */
group('formato ancho');
test('toma la ÚLTIMA fila (la más reciente), no la primera', () => {
  const r = correr(FX['ancho.csv']);
  approx(r.updates['v_prensa'], 14.5, 'debe leer la última fila');
  assert(r.updates['v_prensa'] !== 13.9, 'leyó la primera fila');
});
test('ignora la columna de tiempo sin avisar de tag desconocido', () => {
  const r = correr(FX['ancho.csv']);
  assert(!r.avisos.some((a) => /Timestamp/i.test(a)), `avisos: ${r.avisos.join(' | ')}`);
});
test('una sola fila de datos también sirve', () => {
  const dos = FX['ancho.csv'].split('\n');
  const r = correr([dos[0], dos[3]].join('\n'));
  igualA(r.updates, ESPERADO, 'ancho de una fila');
});

/* ── 9 · casos borde ── */
group('casos borde');
test('archivo vacío ⇒ pasa como kv, sin avisos ni updates', () => {
  const r = correr('');
  assert(r.perfil === 'kv' && r.count === 0 && r.avisos.length === 0, `perfil ${r.perfil}`);
});
test('archivo de solo comentarios ⇒ pasa intacto (hoy: hmi-preparacion.csv)', () => {
  const soloComentarios = '# hola\n// nada\n';
  const ad = adaptarCsv(soloComentarios);
  assert(ad.perfil === 'kv' && ad.texto === soloComentarios, `perfil ${ad.perfil}`);
});
test('celda vacía en tabla ⇒ pendiente, no cero', () => {
  const r = correr('Tagname;Value\nV_PRENSA_M_MIN;\nPESO_MANTA_KGM2;6,8\n');
  assert(!('v_prensa' in r.updates), 'una celda vacía no puede escribir un valor');
  approx(r.updates['_global:peso_manta'], 6.8, 'el resto de la tabla sigue');
});
test('valor no numérico ⇒ aviso de valor inválido, no un cero', () => {
  const r = correr('Tagname;Value\nV_PRENSA_M_MIN;OFF\n');
  assert(!('v_prensa' in r.updates), 'no debe escribir nada');
  assert(r.avisos.some((a) => /inválido/i.test(a)), `avisos: ${r.avisos.join(' | ')}`);
});
test('BOM al inicio no rompe la detección', () => {
  assert(detectarPerfil(`﻿${FX['tabla-wincc.csv']}`).perfil === 'tabla');
});
test('CRLF (export de Windows) no rompe la detección', () => {
  const r = correr(FX['tabla-wincc.csv'].replace(/\n/g, '\r\n'));
  igualA(r.updates, ESPERADO, 'CRLF');
});
test('mismo tag repetido en varios instantes ⇒ gana el último, sin conflicto', () => {
  const r = correr('Tagname;Value;Timestamp\nV_PRENSA_M_MIN;13,9;07:58\nV_PRENSA_M_MIN;14,5;08:00\n');
  approx(r.updates['v_prensa'], 14.5, 'v_prensa');
  assert(!r.avisos.some((a) => /conflicto/i.test(a)), `avisos: ${r.avisos.join(' | ')}`);
});

/* ── reporte ── */
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);

export function runReport() {
  const byGroup = {};
  for (const r of results) (byGroup[r.group] ??= []).push(r);
  return { results, passed, failed: failed.length, total: results.length, byGroup };
}

const lines = [];
let lastGroup = null;
for (const r of results) {
  if (r.group !== lastGroup) { lines.push(`\n▸ ${r.group}`); lastGroup = r.group; }
  lines.push(`  ${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : `  →  ${r.err}`}`);
}
lines.push(`\n${failed.length === 0 ? '✅' : '❌'} ${passed}/${results.length} pruebas OK`);

// eslint-disable-next-line no-console
console.log(lines.join('\n'));

if (typeof process !== 'undefined' && process.exit) {
  process.exitCode = failed.length === 0 ? 0 : 1;
}
