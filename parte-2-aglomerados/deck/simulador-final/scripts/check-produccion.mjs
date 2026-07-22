#!/usr/bin/env node
/* ============================================================
   NOVOPAN · Checks de PRODUCCIÓN del simulador final
   ------------------------------------------------------------
   Verifica que la copia lista para planta cumple las reglas de
   producto final (22-jul-2026). Corre sobre el propio deck y,
   si existe, también sobre public/ (lo que Vercel despliega):

     node scripts/check-produccion.mjs

   Sale con código 1 si CUALQUIER check falla.
   ============================================================ */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const deck = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const roots = [deck];
const pub = resolve(deck, '../../../public/simulador-final');
if (existsSync(join(pub, 'index.html'))) roots.push(pub);

let fallos = 0;
const check = (nombre, ok, detalle = '') => {
  console.log(`  ${ok ? '✓' : '✗'} ${nombre}${ok || !detalle ? '' : `  →  ${detalle}`}`);
  if (!ok) fallos += 1;
};

for (const root of roots) {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const app = readFileSync(join(root, 'js/combined-app.js'), 'utf8');
  const paramsJs = readFileSync(join(root, 'js/combined-params.js'), 'utf8');

  console.log(`\n▸ ${root === deck ? 'deck (fuente)' : 'public (deploy)'}`);

  // 1 · Sin botón de pausa
  check('sin botón de pausa en la barra', !/id="pauseBtn"/.test(html));

  // 2 · Sin botones "Inyectar P1" (Patios / Silo 5 / Silo 6)
  check('sin botones Inyectar P1 (Patios/Silo5/Silo6)', !/data-pre-trigger/.test(html));

  // 3 · Multiplicador de tiempo oculto por defecto, revelable con ?tiempo
  check('multiplicador de tiempo oculto (hidden)', /id="timeScaleWrap"\s+hidden/.test(html));
  // El atributo `hidden` pierde contra `display:inline-flex` de la clase: la
  // regla [hidden]{display:none!important} es la que de verdad lo esconde.
  const cssTotal = readFileSync(join(root, 'css/trazabilidad-total.css'), 'utf8');
  check('CSS refuerza [hidden] (display:none !important)', /\.s2-time-scale\[hidden\]\s*\{\s*display:\s*none\s*!important/.test(cssTotal));
  check('multiplicador revelable solo con ?tiempo', /has\('tiempo'\)/.test(app));
  check('escala guardada NO se restaura sin ?tiempo', /timeToolEnabled && Number\.isFinite\(saved\.timeScale\)/.test(app));

  // 4 · Velocidad de prensa solo lectura (dato vivo del HMI)
  const speedInputs = html.match(/id="speed(Range|Input)"[^>]*/g) ?? [];
  check('velocidad de prensa deshabilitada en la barra',
    speedInputs.length === 2 && speedInputs.every((s) => /disabled/.test(s)), speedInputs.join(' · '));

  // 5 · Panel de Parámetros: datos HMI bloqueados (doble candado)
  check('campos HMI del panel deshabilitados (hmiLock)', /hmiLock/.test(paramsJs) && /'hmi';?\s*$/m.test(paramsJs.match(/const hmiLock =[^\n]*/)?.[0] ?? ''));
  check('cinturón y tirantes: commit rechaza kind hmi', /KIND_BY_KEY\[key\] === 'hmi'.*return/.test(paramsJs));

  // 6 · Estado en pausa guardado no revive (no habría forma de reanudar)
  check('restore ignora saved.paused', !/if \(saved\.paused\) setPaused\(true\)/.test(app));

  // 7 · El contrato de Sistemas sigue cableado
  const hmiCsv = readFileSync(join(root, 'js/hmi-csv.js'), 'utf8');
  check('fuente datos/hmi-sistemas.csv declarada', /hmi-sistemas\.csv/.test(hmiCsv));
  check('alias del Historian (_PV) presentes', /F_CL_DosBin_Weight_PV/.test(hmiCsv) && /F_SL_DosBin_Weight_PV/.test(hmiCsv));
  check('fixture del contrato desplegado', existsSync(join(root, 'datos/fixtures/sistemas-historian.csv')));
}

// 8 · Las suites completas pasan (se importan y ejecutan aquí mismo)
console.log('\n▸ suites');
let suitesOk = true;
for (const suite of ['../js/route-model.test.js', '../js/adaptador.test.js']) {
  try {
    const { runReport } = await import(suite);
    const r = runReport();
    check(`${suite} · ${r.passed}/${r.total}`, r.failed === 0);
    suitesOk = suitesOk && r.failed === 0;
  } catch (e) {
    check(suite, false, e.message);
  }
}

console.log(`\n${fallos === 0 ? '✅ LISTO PARA PRODUCCIÓN' : `❌ ${fallos} check(s) fallaron`}`);
process.exitCode = fallos === 0 ? 0 : 1;
