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

import {
  adaptarCsv, detectarPerfil, parseHmiCsv, repararFilaAncha, clavarInstante,
  fechaDeClave, esSupuesto, registrarOrigenes, DEFAULTS_LABEL, fmtEdad, KIND_BY_KEY,
} from './hmi-csv.js';
import { cardKindReal } from './combined-params.js';

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
  'tabla-nombres-raros.csv', 'miles-comillas.csv', 'basura.csv', 'tendencia-metso.csv',
  'sistemas-historian.csv',
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
  'sistemas-historian.csv': 'tabla',
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
  if (['basura.csv', 'tabla-nombres-raros.csv', 'sistemas-historian.csv'].includes(f)) continue; // casos propios, ver abajo
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

/* ── export de tendencias: coma doble uso + muchos instantes + desordenado ── */
group('tendencia (Save To File del HMI)');

test('reconstruye 9 columnas a partir de 12 campos', () => {
  const r = repararFilaAncha('07/20/26,07:42:50,70,89912,75,23389,2,68814,0,0,0,0'.split(','), 9);
  assert(r.campos.length === 9, `columnas: ${r.campos.length}`);
  assert(r.uniones === 3, `uniones: ${r.uniones}`);
  assert(r.campos[2] === '70.89912', `SL: ${r.campos[2]}`);
  assert(r.campos[3] === '75.23389', `CL: ${r.campos[3]}`);
  assert(r.campos[4] === '2.68814', `HUM: ${r.campos[4]}`);
});

test('NO une los booleanos contiguos (0,0,0,0 son 4 columnas)', () => {
  const r = repararFilaAncha('07/20/26,07:42:50,70,89912,75,23389,2,68814,0,0,0,0'.split(','), 9);
  assert(r.campos.slice(5).join(',') === '0,0,0,0', r.campos.slice(5).join(','));
});

test('fila que ya cuadra queda intacta', () => {
  const r = repararFilaAncha(['2026-07-21 08:00:00', '14,5', '6,8'], 3);
  assert(r.uniones === 0 && r.campos.length === 3);
});

test('ordena instantes en MM/DD/YY, DD/MM/YY e ISO', () => {
  assert(clavarInstante('07/21/26', '01:00:00') > clavarInstante('07/20/26', '23:00:00'), 'MM/DD');
  assert(clavarInstante('20/07/26', '10:00', true) < clavarInstante('21/07/26', '09:00', true), 'DD/MM');
  assert(clavarInstante('2026-07-21', '00:00:01') > clavarInstante('2026-07-20', '23:59:59'), 'ISO');
  assert(clavarInstante('no-es-fecha', '10:00') === null, 'ilegible');
});

test('archivo real: perfil ancho + avisos de coma e instante', () => {
  const a = adaptarCsv(FX['tendencia-metso.csv']);
  assert(a.perfil === 'ancho', a.perfil);
  assert(a.avisos.some((w) => /separador Y como decimal/.test(w)), 'falta aviso de coma');
  assert(a.avisos.some((w) => /más reciente/.test(w)), 'falta aviso de instante');
});

test('toma el instante más reciente aunque esté en el MEDIO del archivo', () => {
  const p = parseHmiCsv(adaptarCsv(FX['tendencia-metso.csv']).texto).updates;
  approx(p['v_prensa'], 14.5, 'velocidad');
  approx(p['_global:peso_manta'], 6.8, 'peso manta');
  approx(p['_global:F_CL'], 320.5, 'flujo CL');
  approx(p['p1:dosG_M'], 1234.56, 'masa dosing');
  assert(p['v_prensa'] !== 14.2, 'se quedó con la última línea, que es un dato viejo');
});

test('reconoce el formato por su forma aunque no conozca ningún tag', () => {
  const a = adaptarCsv('$Date,$Time,TAG_QUE_NO_EXISTE,OTRO_TAG_RARO\n07/20/26,10:00:00,1,5,2,5\n');
  assert(a.perfil === 'ancho', a.perfil);
  assert(a.avisos.some((w) => /no existen en el modelo/.test(w)), 'falta aviso de desconocidos');
});

/* ── 11 · EL CONTRATO: el archivo real de Sistemas (22-jul-2026) ── */
group('contrato · Historian de Sistemas');
test('se detecta como tabla Datetime,Tagname,Value', () => {
  const a = adaptarCsv(FX['sistemas-historian.csv']);
  assert(a.perfil === 'tabla', a.perfil);
  assert(a.detalle.includes('Tagname') && a.detalle.includes('Value'), a.detalle);
  assert(a.error === false, 'no debe marcar error');
});
test('los 13 tags conocidos alimentan el modelo con sus valores exactos', () => {
  const p = correr(FX['sistemas-historian.csv']).updates;
  approx(p['v_prensa'], 14.76851845, 'v_prensa (H_PressSpeed_PV)');
  approx(p['_global:peso_manta'], 11.60000038, 'peso manta');
  approx(p['_global:F_CL'], 292.7554016, 'F_CL (H_CL_Total_Flakes)');
  approx(p['_global:F_SL'], 96.78607941, 'F_SL (F_SL_FlakeFlow_PV, kg/min confirmado)');
  approx(p['_global:pctSL1'], 46.99999988, 'PCT_SL1');
  approx(p['p1:s5_rho'], 125.3954391, 'silo5 ρ');
  approx(p['p1:s5_L'], 52.81966019, 'silo5 nivel');
  approx(p['p1:s5_Fmin'], 17273.62695 / 60, 'silo5 descarga kg/h → kg/min');
  approx(p['p1:s6_rho'], 154.8154449, 'silo6 ρ');
  approx(p['p1:s6_L'], 35.81180954, 'silo6 nivel');
  approx(p['p1:s6_Fmin'], 3802.490234 / 60, 'silo6 descarga kg/h → kg/min');
  approx(p['p1:dosG_M'], 44.17129898, 'masa dosing CL (F_CL_DosBin_Weight_PV, con _PV)');
  approx(p['p1:dosF_M'], 35.14930344, 'masa dosing SL (F_SL_DosBin_Weight_PV, con _PV)');
});
test('la descarga del silo alimenta también el flujo de la dosificadora', () => {
  const p = correr(FX['sistemas-historian.csv']).updates;
  approx(p['p1:dosG_F'], 17273.62695 / 60, 'dosing CL flujo = descarga silo 5');
  approx(p['flow:dosing-thick'], 17273.62695 / 60, 'clave S2 gruesa');
  approx(p['p1:dosF_F'], 3802.490234 / 60, 'dosing SL flujo = descarga silo 6');
  approx(p['flow:dosing-fine'], 3802.490234 / 60, 'clave S2 fina');
});
test('21 tags aún sin mapear ⇒ UN aviso agregado, sin error', () => {
  const r = correr(FX['sistemas-historian.csv']);
  assert(r.avisos.some((a) => /21 tag\(s\)/.test(a)), `avisos: ${r.avisos.join(' | ')}`);
  assert(!r.avisos.some((a) => /conflicto/i.test(a)), 'no debe haber conflictos');
});
test('P_Act_LineSpeed_SP (14.30) NO pisa a H_PressSpeed_PV (14.77)', () => {
  approx(correr(FX['sistemas-historian.csv']).updates['v_prensa'], 14.76851845, 'v_prensa');
});
test('varios instantes del mismo tag DESORDENADOS ⇒ gana el más reciente por fecha', () => {
  const csv = 'Datetime,Tagname,Value\n'
    + '7/22/2026 07:00,H_PressSpeed_PV,13.1\n'
    + '7/22/2026 12:36,H_PressSpeed_PV,14.77\n'
    + '7/22/2026 09:15,H_PressSpeed_PV,13.9\n'; // la más reciente va en el MEDIO
  const r = correr(csv);
  approx(r.updates['v_prensa'], 14.77, 'debe elegir por Datetime, no por posición');
  assert(r.avisos.some((a) => /más reciente/.test(a)), `avisos: ${r.avisos.join(' | ')}`);
});
test('fecha DD/MM también ordena bien (22/7 vs 7/22)', () => {
  const csv = 'Datetime,Tagname,Value\n'
    + '22/7/2026 12:36,H_PressSpeed_PV,14.77\n'
    + '22/7/2026 07:00,H_PressSpeed_PV,13.1\n';
  approx(correr(csv).updates['v_prensa'], 14.77, 'día-primero detectado por el 22');
});
test('si mañana agregan columnas o cambian el orden, sigue entrando', () => {
  const csv = 'Quality,Value,Extra,Tagname,Datetime\n'
    + 'GOOD,14.77,x,H_PressSpeed_PV,7/22/2026 12:36\n'
    + 'BAD,99.9,x,H_CL_Total_Flakes,7/22/2026 12:36\n';
  const p = correr(csv).updates;
  approx(p['v_prensa'], 14.77, 'columnas localizadas por nombre, no por posición');
  assert(!('_global:F_CL' in p), 'la fila BAD queda pendiente, no entra');
});

/* ══ Frescura: DE CUÁNDO es el dato ══════════════════════════════════════
   El widget de la cabecera responde "¿de cuándo es esta versión del CSV?".
   Su insumo es el instante que trae el propio archivo — si eso miente, el
   widget miente, y es peor que no tenerlo. */
group('Frescura del CSV (instante del dato)');
test('la tabla del Historian entrega su instante más reciente', () => {
  const csv = 'Datetime,Tagname,Value\n'
    + '7/22/2026 11:36,H_PressSpeed_PV,14.10\n'
    + '7/22/2026 12:36,H_CL_Total_Flakes,292.8\n'
    + '7/22/2026 09:12,H_Act_SL1_SP,47.1\n';
  const ad = adaptarCsv(csv);
  const d = new Date(ad.instante);
  const hhmm = d.toLocaleString('es-EC', { timeZone: 'America/Guayaquil', hour12: false, hour: '2-digit', minute: '2-digit' });
  assert(hhmm === '12:36', `debe ganar el más reciente, no la última fila: ${hhmm}`);
});
test('un tag desconocido también cuenta para la edad del archivo', () => {
  // La antigüedad del CSV no depende de que el modelo entienda sus tags.
  const csv = 'Datetime,Tagname,Value\n'
    + '7/22/2026 08:00,H_PressSpeed_PV,14.10\n'
    + '7/22/2026 15:45,TAG_QUE_NO_EXISTE,1\n';
  const d = new Date(adaptarCsv(csv).instante);
  const hh = d.toLocaleString('es-EC', { timeZone: 'America/Guayaquil', hour12: false, hour: '2-digit' });
  assert(hh === '15', `debe ganar 15:45 aunque su tag no esté mapeado: ${hh}`);
});
test('el formato TAG: valor; no inventa fecha (instante null)', () => {
  const ad = adaptarCsv('V_PRENSA_M_MIN: 14.5;\n');
  assert(ad.instante == null, 'sin columna de tiempo NO se puede afirmar una fecha');
});
test('fechaDeClave reconstruye la hora de Quito exacta', () => {
  const ms = fechaDeClave(20260722123600);
  const txt = new Date(ms).toLocaleString('es-EC', { timeZone: 'America/Guayaquil', hour12: false, hour: '2-digit', minute: '2-digit' });
  assert(txt === '12:36', `los dígitos del archivo deben verse tal cual: ${txt}`);
});
test('fechaDeClave rechaza claves imposibles en vez de inventar una fecha', () => {
  assert(fechaDeClave(null) === null, 'null');
  assert(fechaDeClave(20260732123600) === null, 'día 32');
  assert(fechaDeClave(20261322123600) === null, 'mes 13');
  assert(fechaDeClave(20260722993600) === null, 'hora 99');
});
test('fmtEdad se lee como lo diría un operador', () => {
  assert(fmtEdad(8) === 'hace 8 s', fmtEdad(8));
  assert(fmtEdad(200) === 'hace 3 min 20 s', fmtEdad(200));
  assert(fmtEdad(3900) === 'hace 1 h 5 min', fmtEdad(3900));
  assert(fmtEdad(-3) === 'hace 0 s', 'nunca negativo');
});

/* ══ Bug de frescura: hora 12 h AM/PM ═══════════════════════════════════ */
group('Hora AM/PM (bug frescura 12 h)');
test('1:16 PM se lee como 13:16, no como 01:16 (evita el "hace 12 h")', () => {
  assert(clavarInstante('7/23/2026', '1:16:05 PM') === 20260723131605, 'PM suma 12');
  assert(clavarInstante('7/23/2026', '1:16 p. m.') === 20260723131600, 'p. m. con puntos/espacios');
});
test('12 AM y 12 PM se convierten bien', () => {
  assert(clavarInstante('7/23/2026', '12:30 AM') === 20260723003000, '12 AM → 00:30');
  assert(clavarInstante('7/23/2026', '12:30 PM') === 20260723123000, '12 PM → 12:30');
});
test('24 h sin marcador sigue leyéndose igual', () => {
  assert(clavarInstante('7/23/2026', '13:16') === 20260723131600, '13:16 intacto');
  assert(clavarInstante('7/23/2026', '08:00') === 20260723080000, '08:00 intacto');
});
test('adaptarCsv: una tarde en 12 h ya NO sale 12 h vieja', () => {
  const csv = 'Datetime,Tagname,Value\n7/23/2026 1:16:00 PM,H_PressSpeed_PV,14.5\n';
  const hh = new Date(adaptarCsv(csv).instante)
    .toLocaleString('es-EC', { timeZone: 'America/Guayaquil', hour12: false, hour: '2-digit' });
  assert(hh === '13', `1:16 PM debe ser las 13 h de Quito, salió ${hh}`);
});

/* ══ Sello HMI: solo si planta lo escribió de verdad ═════════════════════ */
group('Sello HMI vs Supuesto');
test('un valor que solo sale de los defaults NO lleva sello HMI', () => {
  const { origenPorClave } = parseHmiCsv('# @origen: ' + DEFAULTS_LABEL + '\nSILO1_RHO_KGM3: 150;\n');
  registrarOrigenes(origenPorClave);
  assert(esSupuesto('p1:s1_rho'), 'salió de nuestro archivo de defaults ⇒ supuesto');
});
test('en cuanto un servidor vivo lo escribe, vuelve a ser HMI', () => {
  const { origenPorClave } = parseHmiCsv('# @origen: Sistemas\nSILO1_RHO_KGM3: 150;\n');
  registrarOrigenes(origenPorClave);
  assert(!esSupuesto('p1:s1_rho'), 'lo escribió Sistemas ⇒ dato de planta');
});
test('masa de esparcidor: kind `hmi` (báscula de capa) · sello «Supuesto» hasta que planta la escriba', () => {
  // Desde 23-jul-2026 la masa viene de la báscula de capa (H_*_Scale_PV,
  // kg/m sobre 1 m ≡ kg). Con solo el default → «Supuesto»; con dato vivo → HMI.
  const { origenPorClave } = parseHmiCsv('# @origen: ' + DEFAULTS_LABEL + '\nM_ESP1_KG: 12.5;\n');
  registrarOrigenes(origenPorClave);
  assert(KIND_BY_KEY['mass:esp1-zone'] === 'hmi', `kind debe ser 'hmi', fue ${KIND_BY_KEY['mass:esp1-zone']}`);
  assert(esSupuesto('mass:esp1-zone'), 'solo defaults ⇒ sello «Supuesto»');
  const vivo = parseHmiCsv('# @origen: Sistemas\nH_CC_Scale_PV: 76.55;\n');
  registrarOrigenes(vivo.origenPorClave);
  assert(!esSupuesto('mass:esp2-zone'), 'báscula viva ⇒ sello «HMI»');
});
test('básculas de capa: H_*_Scale_PV y los nombres cortos *_KGM alimentan mass:esp*-zone', () => {
  const { updates } = parseHmiCsv(
    'H_SL1_Scale_PV: 23.36;\nH_CC_Scale_PV: 76.55;\nSL2_KGM: 27.79;\n');
  approx(updates['mass:esp1-zone'], 23.36, 'SL1 báscula → mass:esp1-zone');
  approx(updates['mass:esp2-zone'], 76.55, 'CC báscula → mass:esp2-zone');
  approx(updates['mass:esp3-zone'], 27.79, 'alias corto SL2_KGM → mass:esp3-zone');
});
test('una constante local nuestra nunca se marca como supuesto-HMI', () => {
  const { origenPorClave } = parseHmiCsv('# @origen: Sistemas\nH_PressSpeed_PV: 14.77;\n');
  registrarOrigenes(origenPorClave);
  // len:white es kind 'measured': su sello es «Medido», no entra en esta lógica.
  assert(!esSupuesto('len:white'), 'measured no es HMI');
});

/* ══ Sello de CABECERA de tarjeta: honesto igual que los campos ══════════ */
group('Sello de tarjeta (cardKindReal)');
test('cabecera HMI de la tarjeta del esparcidor baja a «Supuesto» si nadie de planta la escribe', () => {
  registrarOrigenes(parseHmiCsv('# @origen: ' + DEFAULTS_LABEL + '\nM_ESP2_KG: 40;\nF_CL_KGMIN: 118;\n').origenPorClave);
  // Todos los tags de la tarjeta salen de defaults ⇒ cabecera no debe decir HMI.
  assert(cardKindReal('hmi', ['mass:esp2-zone', '_global:F_CL']) === 'assumed', 'defaults ⇒ assumed');
});
test('cabecera vuelve a «HMI» en cuanto la báscula viva llega', () => {
  registrarOrigenes(parseHmiCsv('# @origen: Sistemas\nH_CC_Scale_PV: 85.8;\nH_CL_Total_Flakes: 337;\n').origenPorClave);
  assert(cardKindReal('hmi', ['mass:esp2-zone', '_global:F_CL']) === 'hmi', 'vivo ⇒ hmi');
});
test('cardKindReal nunca toca sellos que no son HMI', () => {
  assert(cardKindReal('estimated', ['p1:tr1']) === 'estimated', 'estimado se respeta');
  assert(cardKindReal('measured', ['len:white']) === 'measured', 'medido se respeta');
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
