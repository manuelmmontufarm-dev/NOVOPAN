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

  // 4 · Velocidad de prensa: sin slider (no se puede mover) y solo lectura
  check('sin slider de velocidad de prensa', !/id="speedRange"/.test(html));
  const speedInputs = html.match(/id="speedInput"[^>]*/g) ?? [];
  check('velocidad de prensa deshabilitada en la barra',
    speedInputs.length === 1 && /disabled/.test(speedInputs[0]), speedInputs.join(' · '));

  // 4b · Sin movedor manual del cambio: falsearía las horas del reporte
  check('sin movedor manual del cambio', !/id="moverRange"/.test(html) && !/moverRange/.test(app));

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

  /* 8 · Frescura: la cabecera dice DE CUÁNDO es el dato, no cuándo se leyó.
     El widget sin su fuente de instante sería un segundo reloj de lectura —
     justo lo que ya hace el pill y lo que había que dejar de mostrar. */
  check('widget de frescura en la cabecera', /id="csvFresh"/.test(html));
  check('frescura alimentada por el instante del propio CSV', /'dato'/.test(hmiCsv) && /instante/.test(hmiCsv));
  check('frescura usa Last-Modified como respaldo', /Last-Modified/.test(hmiCsv));

  // 9 · El botón de conexión ES el estado: dice si hay CSV y de dónde sale
  check('botón de conexión con estado y dirección',
    /id="hmiConnectLabel"/.test(html) && /id="hmiConnectAddr"/.test(html) && /setConnected/.test(hmiCsv));

  /* 10 · Flujo 0 = equipo DETENIDO. El bug que arreglaba esto hacía que un
     silo parado se cruzara en 0 s y el reporte prometiera una hora falsa. */
  check('flujo 0 ⇒ τ infinito (equipo parado), no 0 s', /const DETENIDO = Infinity/.test(app) && /paradoEn/.test(app));
  check('el infinito sobrevive a localStorage (centinela JSON)', /__inf__/.test(app));
  const routeJs = readFileSync(join(root, 'js/route-model.js'), 'utf8');
  check('estado STOPPED separado de INVALID en el modelo de ruta',
    /STOPPED: 'stopped'/.test(routeJs) && /ceroDetiene/.test(routeJs));

  // 11 · Ningún sello «HMI» sobre un número que escribimos nosotros
  check('el sello HMI se decide por el origen real del CSV',
    /export function esSupuesto/.test(hmiCsv) && /origenPorClave/.test(hmiCsv) && /esSupuesto\(key\)/.test(paramsJs));

  // 12 · Toda edición de variable pide confirmación (no solo las del plano)
  check('confirmación en CUALQUIER cambio de variable',
    /function textoConfirmacion/.test(paramsJs) && /VAS A CAMBIAR UNA VARIABLE/.test(paramsJs));
  check('la confirmación es al salir del campo, no por tecla',
    !/addEventListener\(PLANO_PROTECTED\.has\(key\) \? 'change' : 'input'/.test(paramsJs));
}

// 13 · El CSV simulado NUNCA se versiona (en planta ese archivo es el real)
const gitignore = join(deck, '.gitignore');
check('datos/hmi-sistemas.csv fuera de git',
  existsSync(gitignore) && /datos\/hmi-sistemas\.csv/.test(readFileSync(gitignore, 'utf8')));
check('generador de CSV en vivo versionado', existsSync(join(deck, 'scripts/hmi-sim.py')));

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
