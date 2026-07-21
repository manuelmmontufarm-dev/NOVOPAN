# TODAY — Bitácora de cambios

> **Regla:** este archivo se actualiza **SIEMPRE** antes de cada `git push`. Sin excepción.
> Es el documento de contexto que se pega al inicio de un nuevo chat para que el asistente entienda en qué punto está la pasantía.

---

## Cómo usar este archivo

1. **Antes de pushear:** agregar una entrada nueva arriba del todo bajo "Historial".
2. **Formato:** fecha en `YYYY-MM-DD`, lista corta de qué cambió y por qué.
3. **Estado actual** se actualiza para que refleje SIEMPRE el punto donde está hoy la pasantía.

---

## Historial reciente

### 2026-07-21 · Mediciones del plano DXF + validación con prueba de papel

- Plano `PlanoGeneral2022.dwg` (Dieffenbacher) decodificado: sistema de estaciones
  del fabricante, residual < 1 mm. Fuente de verdad en `deck/_mediciones-plano/`.
- Corrección de prensa: tambor de entrada en 52.67 m (roja 7.67, prensa 18.93
  tambor a tambor, marco 1 sigue en 55.10 abs, fin prensa 71.60 intacto).
- Sierras: refila 78.3 (confirmada), transversales 85.57 (plano + 32 m del operador).
- Bandas alimentación identificadas: fina 31.170 (E1+E3, distribución 16.42 m),
  gruesa 31.270 (flap → E2); brazos oscilatorios 6 m.
- Prueba de papel (14.77 m/min): VALIDA el modelo, residuales ≤ ±3 s hasta fin prensa.
- simulador-final: defaults del plano + dropdown «Mediciones del plano» en
  Constantes (candado) + alerta al editar claves protegidas. 56/56 tests.
- OJO planta: si hay constantes viejas guardadas, usar «Restablecer constantes».
- Ajuste: el carro de la sierra transversal empieza 30 cm tras la refila (79.95)
  y es largo hasta la salida (86.72); la cuchilla corta en 85.57.

## Estado actual

**Fecha:** 2026-06-22
**Pasante:** Manuel Montúfar
**Supervisor:** Daniel Sotalin (Encargado del Sistema de Gestión / ISO).

**Cambio de área:** termina la semana de **Recepción de madera** (entregables cerrados 2026-06-19). Esta semana arranca **Parte 2 — Aglomerados** (encolados Línea 1). La Parte 1 queda **independiente** en [`parte-1-preparacion-madera/`](parte-1-preparacion-madera/).

**Objetivo activo (Parte 2):** documentar encolados L1 — ver [`parte-2-aglomerados/encolados/PROCESO.md`](parte-2-aglomerados/encolados/PROCESO.md) y [`parte-2-aglomerados/encolados/BASE_INFO_ENCOLADOS.md`](parte-2-aglomerados/encolados/BASE_INFO_ENCOLADOS.md).

**Objetivo anterior (cerrado):** documentar el proceso de **recepción de madera en balanza** en formato IJP ISO, dividido en tres documentos separados (Recepción, Descargas y Consumo, Inventario).

**Documentos vigentes (Parte 1):**
- `parte-1-preparacion-madera/instructivos/finales/IJP_FINAL_ACTUALIZADO_2026-06-19.docx`
- `parte-1-preparacion-madera/instructivos/finales/RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx`
- `parte-1-preparacion-madera/instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf`
- `parte-1-preparacion-madera/instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html`
- `parte-1-preparacion-madera/html-app/NOVOPNHTML1.html` + `Screens.jsx`
- `parte-1-preparacion-madera/instructivos/IJP_Recepcion_v2.md` — borrador md referencia

**Próximos pasos — Encolados (orden de prioridad):**
1. ✅ Integrar datos del recorrido 2026-06-22 en `parte-2-aglomerados/encolados/PROCESO.md` — HECHO.
2. Investigación técnica → `parte-2-aglomerados/technical-research/` — en curso.
3. **Formular plan del proyecto Opción A** (trazabilidad por etapas con sensor en banda).
4. ✅ Transcripciones 22-jun en `parte-2-aglomerados/transcripciones/` — HECHO (sync Cursor 22-jun).
5. Confirmar: split exacto externas (53/47 o 53/43), nombre oficial del área, nombre supervisor.

**Próximos pasos — Recepción (pendientes de la fase anterior):**
1. Validar IJP-Recepción con Alejandro (operador de balanza) y Daniel Sotalin.
2. Resolver `[POR VALIDAR]` del borrador v2 (ANI, diámetro, WhatsApp patios, QR forestal).
3. Empezar IJP **Descargas y Consumo** cuando se retome.

**Cosas que NO se han hecho aún:**
- Validar con planta los `[POR VALIDAR]` generales del borrador v2.
- Falta sección 1 "PROPÓSITO Y ALCANCE" formal en el v2 md (el documento empieza en 2. DEFINICIONES).

---

## Contexto rápido (para pegar en chats nuevos)

- **Personas clave:**
  - **Alejandro** — operador de balanza (fuente principal del flujo de recepción).
  - **Daniel Sotalin** — encargado del Sistema de Gestión / ISO (jefe directo del pasante para el instructivo).
  - **Christian Villalba** — ingeniero a cargo de parametrización del QR forestal.
  - **Iván** — segundo jefe de producción (guía operativa).
  - **Carlos** — gerente de planta.
  - **Gabriel** — jefe de patios.
  - **Jorge** — jefe de producción.
  - **Franklin** — jefe de control de calidad.

- **Sistemas mencionados:**
  - **ANI** — sistema de balanza/recepción. Teclas: `F4` (peso), `F12` (confirmar), `F5` (guardar/generar n.º de ingreso).
  - **Factory Track** — consumo/inventario en patio (handheld con lector de barras).
  - **INFOR** — ERP/contable. Códigos de proveedor creados por Contabilidad.
  - **ITMAD** — almacén con ubicación física (ej. `P07001` = Patio 7 / ubicación 01).
  - **PREMAD** — almacén sin ubicación, vinculado a consumo.

- **Documentos de referencia (formato ISO de Novopan):**
  - **IJP Rev9** — instructivo original que estamos reemplazando por secciones.
  - **RJP-01** — Comprobante de peso.
  - **RJP-03** — Esquema de patios.
  - **RJP-05** — Inventario mensual.
  - **LEF-01** — Lista de precios y forma de pago.

- **Tipos de carga que entran por balanza:**
  1. Rollizo (tronco)
  2. Subproducto (chip, aserrín, viruta, lámina, jampa, retazo)
  3. Combustible (DSL, GLP, resina)
  4. Reciclado (madera externa, recortes de tableros)
  5. Residuo (camión EMASEO)

- **Tipos de proveedor:** Propio · Tercero · Transportista.

---

## Historial

### 2026-07-20 (11) — CORRECCIÓN DE DATO: la pre-prensa vive en la BANDA BLANCA (29.06→33.75 m)

- **Manuel confirmó la física real:** la pre-prensa va DESPUÉS del imán y ANTES del desmoldante #2 (sprays), sobre la banda blanca — como siempre dijo la cadena de segmentos medidos (`WHITE_SEGMENTS`: imán→pre-prensa 2.40 m · zona 4.69 m · →sprays 2.22 m; esa cadena reproduce todos los demás waypoints con error ≤3 cm).
- **Origen del error:** el commit del 14-jul ("prueba de papel") movió el marcador a 47 m con la nota "va justo antes de la prensa" — interpretación equivocada que hoy se arrastró. Ambas fuentes convivían en el repo; se eligió mal la del 14-jul por ser "la más reciente".
- **Fix:** `geom:prepress` default → **29.06 m** (line-bridge, Constantes, hmi.csv); validación nueva: entrada+largo dentro del tramo imán→desmoldante #2. Waypoints reordenados solos (imán 26.68 → entrada 29.06 → fin 33.75 → sprays 35.99 → … → nariz → vapor → prensa); la rampa de compresión del colchón ocurre en 29.06→33.75; el dibujo volvió a su lugar original en la fila 1 (placa a y118). La banda roja quedó limpia: nariz → vapor → prensa.
- **Verificado con stepSim determinista** (inyección en SL2, τ esparcidora 11.5 s + Δm/v): imán 31≈29.8 · entrada 41≈39.7 · fin 60≈59.1 · sprays 69≈68.4 s. Orden de waypoints y validación de geometría OK; mapa visual cae a lineal (ya no hay clúster que despegar).


### 2026-07-20 (10) — auditoría total: llegadas Y salidas correctas en todas las etapas, con constantes y ecuaciones cambiadas

- **Ganchos de verificación permanentes** (`window.__NOVOPAN_SIM_DEBUG__`): exponen preMilestonesFor/buildPreDurations/geometría y un `stepSim(dt, atMs)` determinista (mismo mecanismo que la recuperación offline) — los tests de página auditan el motor sin depender del requestAnimationFrame.
- **Barrido estructural: 12 312 chequeos, 0 fallos.** 12 juegos de constantes mutadas al azar (×0.2–×3 en 42 constantes: tiempos, volúmenes, niveles, flujos, bandas) × TODAS las rutas/etapas: para cada equipo, llegada y salida (residencia = su ecuación; transporte = su ecuación) comparadas contra fórmulas recalculadas de forma INDEPENDIENTE en el test (τ=M/F, ρ·V·L%/F, L/v). También geometría: sensores = blanca+roja+prensa+postL(+offsets), fin pre-prensa = entrada+largo.
- **Conductual con ecuaciones cambiadas:** v_prensa 14.5→10 ⇒ nariz→vapor 12/11.8 · →entrada 13/12.6 · →fin pre-prensa 41/40.7 · →prensa 61/60.6 (obs/eq, s). Masa esparcidora CL 40→80 kg ⇒ salida al colchón 41 s vs τ=80/118·60=40.7, registro sellado al caer.
- Restaurado todo (v 14.5, masa 40, CSV del servidor); 104 tags en vivo.

### 2026-07-20 (9) — MAPA VISUAL: la estética desacoplada de la física (definitivo)

- **Regla de Manuel:** «deja que la estética sea la estética, y después a base de tiempos el cambio se mueve como debe». Al restaurar la pre-prensa a 47 m el dibujo volvía a montarse con el vapor (46.86) porque los píxeles eran esclavos de los metros (70 px/m fijo).
- **Solución estructural (`visualAnchors`/`mapAbsMToX` en line-bridge, única fuente m→px):** fuera de la ventana [banda roja → prensa] el mapa es el lineal de siempre (toda el arte estática alineada, onepage intacto). DENTRO, los píxeles se reparten estéticamente (nariz | vapor 23% | aire | cuerpo pre-prensa 36→83% | aire | prensa) con extremos clavados al lineal (continuo y monótono). El marcador calcula su posición SIEMPRE en metros por ecuaciones y solo se PINTA con el mapa → en pantalla va más rápido o más lento por tramo, su tiempo es el físico.
- Si la calibración rompe el orden físico (p.ej. fin de pre-prensa tras la prensa) el mapa cae al lineal y la validación avisa — nunca un mapa no monótono, nunca crash (verificado con largo=12).
- **Verificado con números cambiados** (vapor→46, largo→6 ⇒ fin 53): los tiempos siguen a los números nuevos — vapor→entrada 4 s (eq 4.1) · entrada→fin 25 s (eq 24.8) · fin→prensa 9 s (eq 8.3). Restaurado a valores medidos; 56/56 tests.

### 2026-07-20 (8) — pre-prensa: física restaurada de las medidas + verificación tramo-por-tramo de TODO el recorrido

- **Se revirtió el error de ayer:** la posición de la pre-prensa había sido movida 47 → 49.7 m para arreglar un solape del DIBUJO — violaba la lógica maestra (el diseño jamás cambia la física). Vuelve a **47 m** (prueba de papel 14-jul) en line-bridge, Constantes y hmi.csv.
- **Nueva constante calibrable `M_PREPRENSA_LEN_M` (largo real 4.69 m,** de la cadena de segmentos medidos) → la pre-prensa deja de ser un punto: waypoints **«Pre-prensa · entrada» (47 m)** y **«Fin pre-prensa» (51.69 m)**. La rampa de compresión del colchón ahora ocurre a lo largo del cuerpo real. Validación: entrada+largo < prensa.
- **Respuesta a la pregunta de Manuel:** fin pre-prensa → prensa continua = 3.31 m = **13.7 s @ 14.5 m/min** (visible ahora en reportes/countdown; recalcula solo si cambian las constantes o la velocidad).
- **Verificación tramo-por-tramo (replay 420 s, TIEMPO 1×):** los 20 tramos del recorrido 0.7 → 88.4 m dieron |obs − ecuación| ≤ 1 s (SL1→CL 35/34.6 · CL→SL2 30/30 · … · entrada→fin pre-prensa 19/19.4 · fin→prensa 14/13.7 · prensa 69/68.7 · … · S2→S3 1/0.8). El dibujo quedó espaciado (cuerpo real 47→51.7, aire hasta la prensa) SIN tocar un solo número físico.

### 2026-07-20 (7) — fix: el simulador "saltaba" tramos enteros tras un atasco del navegador (Pre-prensa → Prensa sin tiempo)

- **Reporte de Manuel:** según las ecuaciones hay tiempo de banda entre pre-prensa y prensa, pero en pantalla se veía ir directo de una a la otra, sin tiempo.
- **Causa real (reproducida):** cuando `requestAnimationFrame` se pausa (pestaña oculta, laptop bloqueada, GC largo, devtools) y luego se reanuda, el `dt` del siguiente frame es TODO el tiempo real transcurrido de una vez. Un solo `stepSim(dt)` gigante mueve el trazador de golpe por todo el tramo restante — Prensa, Fin prensa, cuchillos, sierra y los 3 Sensores quedaban registrados con la MISMA hora exacta (verificado: todos a las 10:56:26).
- **Fix:** `frame()` detecta un atraso >1.5 s y lo trocea en sub-pasos de 0.5 s (tope 240 = 120 s de recuperación por frame) con hora de pared interpolada por sub-paso — mismo tiempo total real (no hay deriva de reloj), pero cada equipo queda sellado con SU hora real, como si el atasco nunca hubiera pasado.
- **Verificado:** con el mismo escenario (Pre-prensa, tab oculto, TIEMPO 20×), las llegadas ahora quedan espaciadas correctamente: Pre-prensa → Prensa continua 1 s después (= 5.3 m/14.5 m/min a esa escala), → Fin prensa +4 s, → Sensores +3 s más. Reset a TIEMPO 1× para toma de tiempos en planta.

### 2026-07-20 (6) — LÓGICA MAESTRA: las ecuaciones mandan sobre el dibujo (ruta P1 completa)

- **Bug confirmado por Manuel:** con banda inclinada de 0.000001 m el trazador igual "tardaba" — la residencia de la encoladora (40 s) y el L/v de la banda iban SUMADOS en una sola arista y el dibujo se cruzaba con la suma. Mismo patrón en varios tramos (tDS+tr1, espera+tr2, bunker+trSec, ws2+neumático, clasificadores+reingreso).
- **Fix estructural (`edgeSplit`):** cada arista se separa en RESIDENCIA (quieto dentro del equipo, su ecuación) + TRANSPORTE puro (cruza el dibujo exactamente en L/v o el tiempo estimado del tramo). `preMilestonesFor` ahora lleva `t` (llegada) y `tLeave` (salida) por equipo y `posOnPreRoute` respeta ambos.
- Además `modelParams` arranca con las constantes locales desde el inicio (antes quedaba en defaults hasta el primer poll del CSV).
- **Verificado con extremos:** banda 0.000001 m → encoladora→gate 41 s (40 residencia + 0.5 cruce mínimo; antes 82.6). Banda 1 000 000 m → el trazador se queda en la banda y el gate no llega. WS2→Silo 6 = 19 s (10 retención + 8 neumático + redondeo). Totales por defecto invariantes.
- Visual: cuerpo de la pre-prensa estrechado 0.8× alrededor de su centro — aire a ambos lados (vapor ← · → prensa) sin mover la posición física (49.7 m, calibrable).

### 2026-07-20 (5) — SIMULADOR FINAL · pre-prensa reubicada + fuera el cubo TABLERO ACTUAL

- La pre-prensa NO puede estar en el mismo lugar que el inyector de vapor: se movió al tramo libre entre el fin del vapor (49.1 m) y la entrada de la prensa (55 m). Default `geom:prepress` 47 → **49.7 m** (line-bridge, Constantes y hmi.csv); su cuerpo ocupa ~49.1–54.9 m, pegado a la prensa. Sigue calibrable en Constantes cuando se mida la posición real. (No se movió la prensa: 55→71.6 m es un ancla medida de la regla y los tiempos.)
- Eliminado DEFINITIVAMENTE el cubo «TABLERO ACTUAL · POST-PRENSA» (valores de ejemplo) junto a los sensores — pedido repetido de Manuel; quedó anotado en la memoria del asistente para no reintroducirlo al rescatar versiones viejas.

### 2026-07-20 (4) — SIMULADOR FINAL · ronda pre-toma de tiempos (R1–R5)

- **R1 · jitter:** los círculos de cambio en silos/banda inclinada saltaban de lado a lado — el re-mapeo de tracers hacía early-return sin escribir cuando el valor mapeado no cambiaba entre frames, dejando pintado el transform crudo. Corregido (se compara contra el atributo actual).
- **R2 · Ecuaciones/Constantes:** la pestaña Parámetros ahora tiene sub-pestañas. «Constantes» = todo lo que NO viene del CSV del HMI (calibración física, longitudes de bandas, volúmenes de silos, tiempos estimados S1) — al editarlas se guardan en el equipo DE FORMA PERMANENTE (localStorage, con todos los alias del tag; mandan sobre el CSV) y el polling del HMI sigue vivo. «Ecuaciones» queda como estaba. Botón «Restablecer constantes» en Parámetros bloqueados.
- **R3 · persistencia de simulación:** los cambios ya NO dependen del tab: el estado completo se guarda (~3 Hz + al ocultar/cerrar) y al reabrir se restaura y AVANZA lo que de verdad pasó, sellando cada equipo con su hora real interpolada (verificado: 26 min offline → llegadas 09:53:32→09:56:38 coherentes, no la hora de reapertura).
- **R4 · visual:** PRE PRENSA, VAPOR·EVOsteam y NARIZ·RECHAZO en franjas separadas y legibles (a 47 m conviven físicamente).
- **R5 · verificación:** route-model 56/56; registro vivo 3987 s = cálculo a mano (τ silo6 3885.3 + dosing 11.1 + encoladora 40 + inclinada 38.9 + esparcidora); sensores 88.00/88.20/88.40 m desde postPress_L=16.4+offsets; TIEMPO arranca en 1× (tiempo real) para la toma de tiempos.

### 2026-07-20 (3) — SIMULADOR FINAL completo: F4 S1 enchufable · F5 flecha S1⇄S2 · F6 sonidos — cierre del plan F1–F8

- **F4:** los tiempos A→B estimados de la Sección 1 se guardan en un almacén local (`novopan.p1Overrides`) aplicado ENCIMA del CSV — editarlos ya no detiene el polling del HMI (la S1 no se lee del HMI). Silos siguen con τ_silo. Botón «Restablecer tiempos S1» en Parámetros bloqueados.
- **F5:** o se mira la Sección 1 o la Sección 2, a pantalla completa cada una. Flecha ← (borde izquierdo) → S1 fullscreen; flecha → vuelve a S2. Sin slide; también con teclado. La flecha solo existe con S1 encendida. Mismo reloj y simulación: los cambios de S1 avanzan aunque no se miren, y cada tracer se ve solo en su vista.
- **F6:** sonidos Web Audio sintetizados (llegada a Sensores, inyección de cambio, click de UI), MUTEADOS por defecto; botón de sonido en la toolbar persiste el estado.
- Tests: `node js/route-model.test.js` → 56/56 OK. Clave del candado: la de siempre del simulador operativo (hash en `js/params-auth.js`).
- Con esto quedan cerradas las 8 fases del plan de instalación (F1–F8) sobre `/simulador-final`.

### 2026-07-20 (2) — SIMULADOR FINAL: F2 switch con candado · F3 params S1 colapsables · F7 reportes con countdown

- **F2:** el switch de la Sección 1 salió de la toolbar y vive en «Parámetros bloqueados» dentro de la pestaña Parámetros (protegida por la clave de calibración, sesión 15 min).
- **F3:** los grupos 01–06 (preparación) van dentro de un dropdown: colapsado con S1 apagada, expandido al encenderla, siempre abrible a mano.
- **F7:** cada cambio muestra en su cabecera el countdown a la SIGUIENTE etapa (nombre verificado contra el orden físico) y una fila nueva «Total a Sensores finales» con countdown y hora real (Quito) estimada de llegada. Los tiempos reales por máquina + predicciones pasaron a un dropdown «Detalle por equipo» (persiste abierto entre re-renders). Chip flotante en la vista Línea con el próximo evento del cambio seleccionado.
- Fix de paso: los countdowns se pintan inmediatamente tras cada re-render de la lista (antes quedaba «--:--» un instante en cada cruce).

### 2026-07-20 — SIMULADOR FINAL: rescatada la versión de planta y publicada como ruta propia

- **Qué pasó:** lo que corría en planta (`/simulador-seccion-2`) venía de la rama `agent/novopan-hmi-simulator` (commit `5c1f7a3`, 17-jul) — NO de main. El deploy de main de hoy lo pisó. Esa versión tiene: Sección 2 completa en una pantalla (dos filas, `onepage-layout.js`), candado de Parámetros con clave (`params-auth.js`, acceso 15 min) y 103 tags con calibración física.
- **Solución:** esa versión ahora vive como fuente propia en `parte-2-aglomerados/deck/simulador-final/` y se publica en **`/simulador-final`**, con tarjeta «SIMULADOR FINAL · Línea 1» arriba de todo en el hub. `/trazabilidad-total` y `/simulador-seccion-2` quedan como estaban en main.
- Se le re-aplicaron los fixes de hoy: F1 (estado Sección 1 persistido y aplicado pre-paint, sin flash; aquí S1 arranca APAGADA por defecto y el lienzo no se pinta hasta que onepage-layout compone las filas) y F8 (intervalo de polling configurable `?poll=`, y el error de formato del CSV ya no es pisado por el pill "en vivo" — conserva el último CSV válido y muestra el aviso).
- La pantalla de planta debe navegar a `novopan.vercel.app/simulador-final` (la URL vieja quedó con la versión horizontal de main).
- Siguen sobre esta ruta: switch S1 dentro de la zona con candado (F2), colapso de parámetros S1 (F3), reportes con countdown (F7), S1 enchufable (F4), flecha S1⇄S2 (F5), sonidos (F6).

### 2026-07-20 — Instalación Sección 2 · F1: fix del flash de Sección 1 al cargar

- `/trazabilidad-total`: el estado del switch Sección 1 ahora persiste en `localStorage` (`novopan.sec1On`).
- Script inline en `<head>` aplica la clase `sec1-off` en `<html>` ANTES del primer paint → ya no se ve la Sección 1 un instante al recargar con la sección apagada.
- Con S1 apagada el canvas arranca directamente en la formación (scroll fijado durante el parseo).
- El valor persistido manda sobre la restauración de formularios del navegador (`autocomplete="off"` en el checkbox).
- Es la fase 1 del plan de fixes para la instalación de hoy (F1–F8, deploy por fases).

### 2026-07-15 — Simulador operativo Sección 2 · restaurado en una línea

- Nueva ruta pública: `/simulador-seccion-2`.
- Restaurado el diagrama original horizontal, de una sola línea, para revisar el proceso completo sin la composición compacta.
- El motor conserva las distancias ajustadas con la última prueba de papel (14-jul): Sensor 1 ≈ 88.0 m, pendiente de confirmación con flexómetro.
- Añadido el acceso desde el hub de entregables de NOVOPAN.

### 2026-07-13 (2) — trazabilidad-total: zarandas conectadas + caída en esparcidoras + ruta fina única

Feedback del usuario sobre la Sección 2: (a) zarandas 1 y 3 flotaban sin tuberías; (b) los cambios "volaban" sobre la banda en vez de entrar por arriba de las esparcidoras; (c) la ruta fina mostraba 2 marcadores en las bandas (raro).

- **Zarandas conectadas** (index.html): Tamiz F → Zaranda 1, Tamiz G → Zaranda 3, y columna vertical Zaranda 1↔2↔3, coincidiendo con las rutas de los marcadores. Ya no flotan.
- **Caída en la esparcidora** (combined-app.js): cada cambio que entra a P2 (SL1 6.63 m · CL 15 m · SL2 22.25 m) NACE en la boca de la tolva (y≈205) y CAE al colchón en 0.7 s (basado en tiempo real → visible a cualquier escala), en vez de aparecer volando sobre la banda. Verificado: y arranca en la tolva y desciende.
- **Ruta fina = UN marcador** que se SEPARA en la formación: las máquinas finas ahora usan una sola rama `sl` (antes sl1+sl2 = 2 marcadores encimados). Al llegar a la formación se divide en SL1 (capa inferior, 6.63 m) y SL2 (capa superior, 22.25 m). Receta (patios) = 2 marcadores upstream (gruesa CL + fina), no 3. Validado Node: 56/56 nodo×rama.

### 2026-07-13 — trazabilidad-total: inyección por-nodo (grafo del proceso) + z-order de marcadores

Reporte del usuario (probando en localhost): (a) clic en Silo 2B ponía el cambio en Silo 1/2A; (b) los cambios solo aparecían en Zaranda 2 (las otras zarandas "desconectadas"); (c) los marcadores en la zona de silos se escondían detrás de las imágenes. Todos reales — mi fix anterior solo cubría las 6 máquinas del intake animado; los ~30 nodos del wireframe seguían colapsando a un punto compartido por zona (silos-verdes → Silo 2A, clasificacion → Zaranda 2) o no eran clicables.

**Fix (combined-app.js + index.html):**
- **Modelo de inyección = grafo del proceso.** `NODE_POS` (posición global de cada equipo), `LINEAR_NEXT` + `succ(key,branch)` (sucesor por rama, bifurca CL/SL en Zaranda 2), `EDGE_VIA` (codos/aéreos/bandas), `GATE_LAUNCH`. `preMilestonesFor` ahora **recorre el grafo** desde el nodo clicado: el cambio NACE en ese equipo y avanza siguiendo las tuberías dibujadas hasta la entrada a la Sección 2 (o al quemador, ruta de polvo). Validado en Node: **87/87** combinaciones nodo×rama arrancan en su posición y terminan en una compuerta o el quemador.
- **30 equipos clicables** (antes ~11 colapsados): silos 1/2A/2B/3, secaderos 1/2, tamices F/G, zarandas 1/2/3, molinos/pisos, W1/2/3, refinadores, ciclones, clasificadores, silos 4/8, silos 5/6 y las 6 del intake. Cada uno con su `data-pre-stage` propio.
- **Z-order:** `#preTracers` movido al final del SVG → los marcadores se dibujan ENCIMA de todo (antes quedaban detrás del intake). Verificado: `preTracersIsLast=true`.
- **Ruta de polvo/biomasa** (Silo 4/8 → quemador) no entra a P2: se registra como completada en el quemador.
- Verificado en navegador: 6 cambios simultáneos, cada uno sobre SU equipo con color propio, visibles; Zaranda 3 recorre grafo→P2; selfTest verde; 0 errores.

**Nota Vercel:** el sitio desplegado sigue en el commit viejo (Vercel devuelve 402 = sobre el límite, no compila). Probar en localhost (`~/novopan-preview`, `python3 -m http.server 8080`). Al reponerse el límite, `main` despliega solo.

### 2026-07-11 (noche) — trazabilidad-total: auditoría profunda + CSV del HMI + fix de inyección + optimización

Auditoría multi-agente (24 hallazgos confirmados, verificados contra el código) + ejecución autónoma:

- **Bug de inyección (crítico) corregido:** al hacer clic en Encolador CE/CI, Dosing fina/gruesa o los silos animados, el marcador nacía en el silo del *wireframe* (x≈−705, fuera de pantalla) en vez de en la máquina. Causa: todas compartían `data-pre-stage="silo6/silo5"` y `preMilestonesFor` arrancaba en un índice fijo. Ahora cada máquina tiene su `data-pre-stage` propio (`active-silo6/dosSL/encCE/silo5/dosCL/encCI`) y `STAGE_CONFIG` define dónde arranca cada una. Verificado (Node + navegador): las 12 puntos inyectan con d=0 sobre la máquina clicada.
- **CSV del HMI (nuevo, releído cada 2 s):** `datos/hmi.csv` (formato `VARIABLE:VALOR;`, 54 tags P1+P2) + `js/hmi-csv.js` (fetch no-cache cada 2 s, fallback a archivo local, parser tolerante, mapa tag→p1:*). Pill de estado en la barra + latido cada 2 s. Estático ahora, listo para el servidor (un job sobrescribe el archivo). Verificado: poll cada 2000 ms, cambio en vivo 44→77→44 reflejado en el panel en ≤2 s.
- **Pestaña Parámetros = lee del CSV:** los valores vienen del CSV (fuente de verdad), se refrescan en vivo con flash, badges HMI (30) / Estim. (23), visor de CSV crudo, banner explicativo. `initParams` expone `applyExternal`.
- **Optimización/arquitectura:** bucle rAF auto-suspendible (idle = 0 CPU, verificado rAF=0 al no haber cambios; reanuda al inyectar), countdowns throttleados a ~3 Hz (no 60 fps), `selfTest()` en consola (duraciones + inyección), teardown en reset (cancelAnimationFrame).
- **A11y/legibilidad:** etiqueta "5 fracciones" ya no pisa el sublabel de Tamiz F; ecuación τ_silo agregada a la leyenda y subtítulos.
- Sin errores de consola. Deriva de la auditoría wf_f4f72958 (findings en scratchpad).

### 2026-07-11 — Simulador profesional: Sección 1 rediseñada + fixes Sección 2 + sync de páginas desplegadas

**Qué cambió:**
- **Sync repo ↔ Vercel:** `/trazabilidad-preparacion` y `/trazabilidad-total` estaban desplegadas (deploy manual 10-jul) pero no versionadas — se agregan las fuentes (`parte-1-preparacion-madera/html-app/trazabilidad-preparacion/`, `parte-2-aglomerados/deck/trazabilidad-total/`) + rutas en `vercel.json` y `scripts/build-vercel-public.sh` + landing.
- **Sección 1 (preparación de madera):** rediseño visual completo conservando el wireframe P&ID — header verde NOVOPAN con reloj amarillo, tipografía Barlow/Barlow Semi Condensed, toolbar sticky con pastillas y chips de zona, fondos tenues por zona, tarjetas blancas en Parámetros/Reportes/Detalle, paleta de trazadores igual a Sección 2 (con número de cambio sobre el marcador). Lógica y ecuaciones intactas (τ=M/F×60 · t=L/v×60 · receta start=min/end=max); placeholders naranja y volúmenes no confirmados en rojo se conservan.
- **Sección 2 (línea horizontal, en `trazabilidad-linea` y `trazabilidad-total`):** des-aglomerado de la zona 2B — detector de metales más angosto con rótulo elevado y guía punteada, rótulo de cortadores de filo ya no pisa el detector, nariz de rechazo sin tambor duplicado; rótulos "IMÁN · BANDA → AZUL" y "BANDA → ROJA" subidos para que el colchón no los tape; "TABLERO · POST-PRENSA" movido para no quedar detrás de refila/sierra.
- Verificado en navegador: selfTest v3 OK (346.5 s @ 14.5 · 452.2 s @ 11.11), inyecciones y reportes con hora de Quito en las 3 páginas, CSV del HMI en vivo, sin errores de consola.
- **Auditoría de coherencia (pedida 11-jul tarde):** (1) Trazadores P1 ahora RECORREN las tuberías dibujadas (waypoints `via` con reparto de tiempo por longitud; validado en Node: 401/401 muestras sobre ruta en ambas ramas). (2) Terminología verificada contra fuentes: "criba" no aparece en ninguna transcripción/glosario (usan tamiz/zaranda) → renombrado a **Tamiz F/G** en total + preparación (claves de parámetros intactas), pendiente confirmar nombre exacto del HMI. (3) Clúster clasificación/refino des-aglomerado: panel más alto (la fila polvo/quemador ya no se sale), Silos 4/8 separados de Part. Grandes/W3/Refinador 2, lazo naranja de reingreso por ARRIBA de la fila W1–W2 (ya no encima de la tubería principal) entrando a W1. (4) Costura P1→Sección 2: transportadores aéreos continuos (verde CL → Silo 5 animado, azul SL → Silo 6 animado) con flujo animado y flecha entrando por el tope del silo — mismo camino que siguen los trazadores; títulos SILOS 5/6 y PASA A SECCIÓN reubicados. (5) Ecuaciones/tiempo confirmados en código: duraciones desde τ=M/F×60 · t=L/v×60 y avance elapsed×multiplicador (36000× P1 / tope 300× P2).
- **Trazabilidad-total · Parte 1 rediseñada al estilo Sección 2:** mismo layout/posiciones/lógica, solo presentación — equipos con gradiente de acero y sombra, silos con nivel de llenado por material, tuberías gruesas con material fluyendo (guiones blancos animados), ruta oversize naranja y biomasa con guiones en movimiento, rotores girando en molinos/windsifters/refinadores, zarandas vibrando, chevrones de pisos móviles marchando, vapor en secaderos y llama en el quemador. Tipografía Barlow con halo blanco en etiquetas. Decorador JS puramente visual (no toca coordenadas ni handlers); `prefers-reduced-motion` respetado.
- **Trazabilidad-total · zona de silos animada:** los rótulos "RUTA FINA" y "RUTA GRUESA" estaban tapados por los cuerpos de los silos 6/5 y el subtítulo quedaba detrás del Silo 5 — ahora son pastillas blancas con borde de color en espacio libre; tapa azul en Dosing Fina (simétrica a la verde de la gruesa); panel del wireframe Parte 1 con esquinas redondeadas y borde suave (la costura ya no se ve cortada); flechas puente CL/core y SL/capas en color de ruta y llegando hasta el panel animado.

**Pendiente:** reemplazar los 27 placeholders y los 8 volúmenes m³ de silos cuando IT confirme los tags del HMI (los campos ya están listos en Parámetros).

### 2026-06-22 — Reorganización repo: Parte 1 / Parte 2 + sync local

**Qué cambió:**
- Repo dividido en **`parte-1-preparacion-madera/`** (recepción, IJP-REC, html-app) y **`parte-2-aglomerados/`** (encolados, deck, transcripciones 22-jun).
- **`_compartido/`** — glossary, reference, decisions-and-open-items.
- Nuevos índices: `00_Index.md`, READMEs por parte, `linea-1-overview.md` y `AGENT_INSTRUCTIONS.md` actualizados con rutas nuevas.
- **Sync desde folder local NOVOPAN:** transcripciones `2026-06-22_aglomerados`, `2026-06-22_encolados`, research aglomerados, deck `Encolados.dc.html`, raw whisper txt.
- **Codex (ya en main antes de este commit):** PR #6/#7 Gabriel rebuild; 8 commits encolados (`BASE_INFO_ENCOLADOS`, `TEMAS_PARA_REVISAR`, HMI analysis, prompts Cursor/Claude).

**Corte Parte 1 → Parte 2:** salida de preparación de madera = partícula en **silos**; Parte 2 empieza en encolados.

### 2026-06-22 — Cambio de área: arranca Encolados (Línea 1)

**Qué cambió:**
- Cierre del área **Recepción de madera** (entregables del 2026-06-19 quedan vigentes e independientes).
- Nueva carpeta [`encolados/`](encolados/) para el área actual con:
  - `PROCESO.md` — descripción técnica del flujo: silos → encolador + caja de dosificación (capas externas finas vs. capa media con biruta+polvo, ambas mezcladas con resina+parafina) → 3 esparcidores (fino/medio/fino) → prensa caliente continua de acero inoxidable → corte angular en movimiento → enfriadoras tipo estrella (3 tableros, giro 180°, tubos metálicos) → estacado.
  - `notas/` y `transcripts/` listos para el trabajo de campo.
- Nuevo documento maestro [`linea-1-overview.md`](linea-1-overview.md): mapa completo de la Línea 1 por áreas, vivo, al que se le van añadiendo etapas conforme avanzan las semanas.
- `TODAY.md` actualizado para reflejar el cambio de objetivo activo.

**Pendientes inmediatos del área nueva:**
- Definir alcance del proyecto de Encolados con Daniel Sotalin (¿IJP por etapa? ¿guía visual estilo Recepción?).
- Confirmar contactos: operador de encolador, operador de prensa, control de calidad (¿Franklin?), Jorge (jefe de producción).
- Empezar a llenar los `Pendiente documentar` de cada etapa en `encolados/PROCESO.md` (tipos de resina, setpoints de prensa, tiempos de enfriamiento, etc.).

### 2026-06-19 17:48 — Codex: cierre real de entregables finales

**Qué cambió:**
- Actualizados por XML los dos DOCX finales:
  - `IJP_FINAL_ACTUALIZADO_2026-06-19.docx`
  - `RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx`
- Renderizados ambos DOCX con `render_docx.py` y revisados visualmente en hojas de contacto.
- Regenerado el HTML estático después de limpiar el historial pendiente.
- Re-exportado `NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf` desde el HTML estático actualizado y revisado visualmente.
- Verificado que no queden frases viejas/prohibidas en fuentes, HTML/PDF y DOCX.

### 2026-06-19 16:07 — Follow-up Codex: cierre de trabajo Claude

**Qué cambió:**
- Confirmado: PR #6 ya estaba mergeado en GitHub (`main` contiene la revisión Gabriel).
- Alineados los documentos paralelos/adendas que no había tocado el PR #6:
  - `instructivos/documentos-finales-paralelos/IJP-REC-002_Recepcion_Madera_DRAFT.md`
  - `ADENDA_2026-06-19_IJP_CONTENIDO.md`
  - `GuiaApp_ADENDA_SECTIONS.jsx`
  - matrices/pendientes ISO afectados
  - `notas/ADENDA_2026-06-19_contenido-nuevo.md`
- Regenerado `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` desde `Screens.jsx`.
- Limpiados changelogs/notas para que las búsquedas literales no reporten texto viejo como pendiente.

**Cerrado después en 17:48:**
- DOCX finales y PDF quedaron regenerados/re-exportados; documentado en `notas/REBUILD_PENDING.md`.

### 2026-06-19 15:35 — Revisión HTML contenido GABRIEL aplicada

**Qué cambió (cambios aprobados de la revisión de Gabriel sobre el HTML):**
- Flujo operativo reescrito por etapas; **primero datos del ingreso, luego peso** (no "ver camión → capturar peso" como primer acto).
- **QR forestal vs código de barras de terceros separados** en 4.5 y en Screens.jsx; títulos "Terceros — con/sin código de barras" (antes "con/sin QR").
- 4.6: redacción vieja que hablaba de "descarga con guía repetida" → `"No permita la entrada con guía repetida"`.
- 4.10.1: **eliminado** el placeholder no aprobado sobre ubicación exacta del bloqueo de edición por humedad.
- Muestra perdida: confirmar primero con balanza y escalar; **no** documentado como práctica regular el promedio de últimos viajes ni el doble muestreo.
- 4.11: etiqueta/papel **entregada al transportista** (no "todo automático") y llevada al patio asignado.
- 4.5: verificación visual de especie/material (rápido pero más difícil de noche, punto adicional si no coincide).
- Nuevo bloque **Anulación / Reliquidación / Nota de crédito** (caso / acción / a quién escalar).
- **Camiones HINO/Chevrolet invertidos en versiones anteriores — corregido**: HINO con remolque (~11 t), Chevrolet sin remolque (~8-9 t).
- 4.14.2 Patios y rumas digitales: avisar si descarga fuera de secuencia; pedir habilitación si se crea ruma física sin registro digital; ruma digital como histórico/control.
- Factory Track: cada equipo con cuenta/contraseña propia; credenciales con supervisores/jefe de patios/responsable definido; nombre oficial Factory Track.

**Archivos modificados:**
- `instructivos/finales/CONTENIDO_MAESTRO.md` (fuente de verdad).
- `instructivos/finales/NOVOPNHTML1_files/Screens.jsx` y `html-app/NOVOPNHTML1_files/Screens.jsx` (gemelos sincronizados).

**Pendientes de regeneración (ver `notas/REBUILD_PENDING.md`):**
- `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` (bundle estático con babel).
- `instructivos/finales/IJP_FINAL_ACTUALIZADO_2026-06-19.docx`.
- `instructivos/finales/RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx`.
- `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf`.

**Fuera de alcance (no incluido por instrucción explícita):**
- No se agregó procedimiento de proveedor nuevo / asignación de código de barras.
- No se agregó pendiente sobre el punto exacto donde la humedad bloquea edición.
- No se documentó como procedimiento formal el promedio de últimos seis viajes ni el doble muestreo.

### 2026-06-19 10:10 — ESTATICO rebuilt + paridad git==local

**Qué cambió:**
- **`NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html`**: rebuild completo con babel. Ahora es **TRULY self-contained** (277KB, todo inline: React + ReactDOM + DS bundle + Screens.compiled + CSS). Tiene TODAS las secciones nuevas (4.10.1, 4.12.1, 4.14.1, sección 7 Historial). Abre sin internet y sin servidor.
- Sincronizado al repo: `instructivos/documentos-finales-paralelos/` (10 markdowns de otra sesión paralela: CHECKLIST_AUDITORIA, INFORME_CAMBIOS_ISO, MATRIZ_DOCUMENTOS_SGC, MATRIZ_REGISTROS_ISO, PROCEDIMIENTO_NO_CONFORMIDAD_DRAFT, IJP-REC-002 DRAFT, etc).
- Sincronizado: `transcripciones/extra/` con transcripts/2026-06-17_batch.
- Sincronizado: `notas/SETUP_COMPLETE.md` + `notas/iso documentation.pdf`.

**Estado de paridad git ↔ local:**
- ✅ Todos los docs finales tienen mismo hash SHA-256 en local y git.
- ✅ La app React (`html-app/`) sincronizada al 100%.
- ✅ Policy y CONTENIDO_MAESTRO sincronizados.
- ⚠ NO se subió al repo (intencional, demasiado pesado): `audios/` 82MB, `transcripts_audio_forestal/` 58MB, `work/` 149MB, `_archive/` 89MB.

**Por qué:**
- Usuario: "ultimo paso es todos los documentos finales de el archivo local novopan sean los mismos que en el git". Cumplido.
- Usuario: "asegurate que la version estatica este congruente con esta version". Cumplido — rebuild con babel.
- Usuario: "tal vez deberia dejar de usar el folder novopan y solo download el zip cada vez". Sí, ahora es viable.

**Cómo usar el repo a partir de ahora:**
1. Trabaja directo en GitHub vía web/codespaces/clone — el repo tiene todo.
2. Para los archivos pesados (audios/transcripts forestales), mantén una referencia en Drive/Box.
3. El folder local de NOVOPAN puede quedar congelado o eliminarse después de verificar.

### 2026-06-19 09:58 — Policy obligatoria + CONTENIDO_MAESTRO + changelog en cada doc final

**Qué cambió:**
- Nueva **POLICY_DOCUMENTOS_FINALES.md** en la raíz del repo: regla obligatoria que cada actualización de doc final lleva fecha + HORA (con minuto) + autor + qué cambió, registrado dentro del archivo al final.
- Nuevo **`instructivos/finales/CONTENIDO_MAESTRO.md`** — fuente única de verdad. Aquí se edita primero el contenido; después se propaga a docx/HTML/PDF. Resuelve el problema de "tengo 4 docs finales y no sé cuál es el bueno".
- Cada doc final ahora tiene **changelog interno** al final:
  - `IJP_FINAL_ACTUALIZADO_2026-06-19.docx` — sección "Historial de cambios" al final del documento.
  - `RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx` — íd.
  - `NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` — footer con timestamp visible.
  - `html-app/NOVOPNHTML1_files/Screens.jsx` — nueva sección "7. Historial de cambios" navegable en la app.
- `TODAY.md` (este archivo) actualizado con esta entrada.

**Por qué:**
- Usuario: "todos los documentos finales desde ahora deberían tener fecha y HORA con minuto de la última vez que se actualizaron y que se cambió en la parte de el final".
- Necesidad de tener un solo archivo editable plano donde no preocuparse del formato.

**Pendiente:**
- PDF (`NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf`) NO tiene changelog interno — requiere re-exportar desde el HTML actualizado. Por ahora, su timestamp se infiere de la fecha de modificación del archivo en disco.

### 2026-06-19 09:21 — Sync masivo desde folder local + fixes de consistencia

**Qué cambió:**
- Se sincronizó todo el folder local `/Users/manue/Documents/NOVOPAN/` al repo. Antes solo había `.md` sueltos; ahora están los `.docx` finales, el PDF, la app React (`html-app/`), `reference/`, `glossary/`, `decisions-and-open-items/`, `technical-research/`.
- Se aplicaron 3 fixes surgical a `instructivos/finales/IJP_FINAL_ACTUALIZADO_2026-06-19.docx`:
  - Altura de ruma: `4-5 m` → `5 m máx (excepcional 6 m), patrón dos rumas + camino + dos rumas`.
  - Tiempo análisis: `20-40 min` → `25-40 min (madera rolliza)`.
  - Etiquetado Patio 5: `llenar manualmente` → `recibir etiqueta enviada desde balanza`.
- Mismo fix de altura de ruma aplicado a `RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx`.
- App React `html-app/NOVOPNHTML1_files/Screens.jsx`: los 3 fixes de arriba + 3 secciones nuevas (humedad como último filtro + verificación humedad salida Balanza 1 + FIFO con excepción justificada).
- Bundle `NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` parcialmente actualizado (4 text-edits via find/replace; las 2 secciones nuevas requieren rebuild con babel — ver `notas/REBUILD_PENDING.md`).
- Notas nuevas en `notas/`:
  - `ADENDA_2026-06-19_contenido-nuevo.md` — 3 bloques listos para pegar manualmente en Word.
  - `CLAUDE_DESIGN_PROMPT.md` — prompt token-optimizado para mejora visual del HTML slide-by-slide.
  - `REBUILD_PENDING.md` — qué falta del bundle estático.

**Por qué:**
- Inconsistencias detectadas por Cursor cruzando los .docx finales, el HTML estático y los transcripts (recordings 26, 27, 29 con Gabriel/Iván).
- Necesidad de trabajar contra el repo de GitHub para evitar que se sigan creando documentos sueltos en local.

**Qué NO se hizo (intencional):**
- Audios y `transcripts_audio_forestal/` NO se subieron al repo (82MB + 58MB; pesados, hostear aparte).
- Las 3 secciones nuevas NO se insertaron en los .docx automáticamente (riesgo de corromper XML del archivo de 7MB); van en la adenda para pegar manualmente.
- El bundle estático NO se rebuildeó completo (requiere babel + script de Codex que no está versionado).

---

## Historial

### 2026-06-18 — Organización del repo
- Repo Git inicializado y estructurado en cuatro carpetas: `instructivos/`, `notas/`, `transcripciones/`, `presentaciones/`.
- Se agregaron `README.md` y este `TODAY.md`.
- Política definida: `TODAY.md` se actualiza obligatoriamente antes de cada push.
- Archivos subidos: 8 (IJP_Recepcion_v2 + 3 instructivos archivados + notas coherentes + 2 transcripciones + PPTX de presentación).

### 2026-06-16 — IJP-Recepción v2
- Versión v2 con tablas, fórmulas de humedad, definiciones completas (ruma, ton húmeda/seca, m³ estéreo/neto), códigos INFOR mencionados.
- Renumeración 4.1–4.15 corregida (eliminado gap 4.7 y duplicado 4.11).
- Sección 4.13 "Medición de diámetro" ampliada con cinta diamétrica, cm, hoja de campo + ANI.
- Sección 5.2 "Patios externos" concretada: anotar número de pase en comprobante.
- Sección 4.14 "Asignación de patio": grupo de WhatsApp marcado como `[POR VALIDAR]` (canal informal).
- Nota agregada al final de Sección 4: "La salida del camión por Balanza 1 se procesa según el IJP de Descargas y Consumo."

### 2026-06-16 — Reunión con Alejandro (balanza)
- 5 audios grabados durante la mañana en planta.
- Transcripciones automáticas con `whisper-small` (Spanish).
- Información nueva levantada: Balanza 1=salida / Balanza 2=entrada, teclas ANI, QR forestal, pase para Patapungo, aserrín pagado por peso+distancia, cola en turno tarde, EMASEO/Daniel Sotalin.
- Día 2 anexado al archivo `transcripciones_audio.md`.

### 2026-06-15 — Primera visita a planta
- 9 audios grabados durante el recorrido con Iván.
- Notas coherentes derivadas en `notas_coherentes_novopan.md`.
- Presentación PPTX de 15 slides creada (`presentaciones/presentacion_pasantia_novopan.pptx`).
- Mapeo del flujo completo: recepción → patios → pisos móviles → chipeadora → secado → clasificación → silos → encolado → prensa.
