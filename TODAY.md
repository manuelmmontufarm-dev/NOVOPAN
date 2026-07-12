# TODAY — Bitácora de cambios

> **Regla:** este archivo se actualiza **SIEMPRE** antes de cada `git push`. Sin excepción.
> Es el documento de contexto que se pega al inicio de un nuevo chat para que el asistente entienda en qué punto está la pasantía.

---

## Cómo usar este archivo

1. **Antes de pushear:** agregar una entrada nueva arriba del todo bajo "Historial".
2. **Formato:** fecha en `YYYY-MM-DD`, lista corta de qué cambió y por qué.
3. **Estado actual** se actualiza para que refleje SIEMPRE el punto donde está hoy la pasantía.

---

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

### 2026-07-11 — Simulador profesional: Sección 1 rediseñada + fixes Sección 2 + sync de páginas desplegadas

**Qué cambió:**
- **Sync repo ↔ Vercel:** `/trazabilidad-preparacion` y `/trazabilidad-total` estaban desplegadas (deploy manual 10-jul) pero no versionadas — se agregan las fuentes (`parte-1-preparacion-madera/html-app/trazabilidad-preparacion/`, `parte-2-aglomerados/deck/trazabilidad-total/`) + rutas en `vercel.json` y `scripts/build-vercel-public.sh` + landing.
- **Sección 1 (preparación de madera):** rediseño visual completo conservando el wireframe P&ID — header verde NOVOPAN con reloj amarillo, tipografía Barlow/Barlow Semi Condensed, toolbar sticky con pastillas y chips de zona, fondos tenues por zona, tarjetas blancas en Parámetros/Reportes/Detalle, paleta de trazadores igual a Sección 2 (con número de cambio sobre el marcador). Lógica y ecuaciones intactas (τ=M/F×60 · t=L/v×60 · receta start=min/end=max); placeholders naranja y volúmenes no confirmados en rojo se conservan.
- **Sección 2 (línea horizontal, en `trazabilidad-linea` y `trazabilidad-total`):** des-aglomerado de la zona 2B — detector de metales más angosto con rótulo elevado y guía punteada, rótulo de cortadores de filo ya no pisa el detector, nariz de rechazo sin tambor duplicado; rótulos "IMÁN · BANDA → AZUL" y "BANDA → ROJA" subidos para que el colchón no los tape; "TABLERO · POST-PRENSA" movido para no quedar detrás de refila/sierra.
- Verificado en navegador: selfTest v3 OK (346.5 s @ 14.5 · 452.2 s @ 11.11), inyecciones y reportes con hora de Quito en las 3 páginas, CSV del HMI en vivo, sin errores de consola.
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
