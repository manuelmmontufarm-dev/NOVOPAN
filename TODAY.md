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

**Fecha:** 2026-06-19
**Pasante:** Manuel Montúfar
**Supervisor:** Daniel Sotalin (Encargado del Sistema de Gestión / ISO).

**Objetivo activo:** documentar el proceso de **recepción de madera en balanza** en formato IJP ISO, dividido en tres documentos separados (Recepción, Descargas y Consumo, Inventario).

**Documentos vigentes:**
- `instructivos/finales/IJP_FINAL_ACTUALIZADO_2026-06-19.docx` — IJP-REC-001 final sincronizado con marcador TEST 2026-06-19 12:25.
- `instructivos/finales/RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx` — guía rápida ANI sincronizada con marcador TEST 2026-06-19 12:25.
- `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf` — render para impresión re-exportado desde HTML estático actualizado.
- `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` — bundle estático reconstruido desde `Screens.jsx`.
- `html-app/NOVOPNHTML1.html` + `html-app/NOVOPNHTML1_files/Screens.jsx` — app React activa con todos los fixes y marcador TEST.
- `instructivos/IJP_Recepcion_v2.md` — borrador md original (mantener como referencia).

**Próximos pasos (orden de prioridad):**
1. **Insertar manualmente en Word** los 3 bloques de la adenda (`notas/ADENDA_2026-06-19_contenido-nuevo.md`): humedad como último filtro, verificación humedad salida Balanza 1, FIFO con excepción.
2. **Validar con Daniel Sotalin** los `[POR VALIDAR]` de la adenda: punto exacto en ANI donde la humedad bloquea edición, procedimiento de anulación.
3. **Pasar Screens.jsx por Claude Design** usando `notas/CLAUDE_DESIGN_PROMPT.md` para mejora visual slide-by-slide token-optimizada.
4. Validar IJP-Recepción con Alejandro (operador de balanza) y Daniel Sotalin.
5. Resolver los `[POR VALIDAR]` que quedan del borrador v2:
   - Sistema ANI: nombre oficial y si es ANI Sistemas (Brasil).
   - Medición de diámetro: instrumento real (cinta vs calibrador) y si se anota en ANI o solo hoja de campo.
   - WhatsApp de asignación de patios: oficializar canal.
   - QR forestal: confirmar con Christian Villalba si es del SAF/MAATE.
6. Empezar IJP **Descargas y Consumo** (Balanza 1 + grúa + Factory Track + ITMAD→PREMAD).
7. Empezar IJP **Inventario** (basado en RJP-05 del IJP Rev9 original).

**Cosas que NO se han hecho aún:**
- Pegar las 3 secciones nuevas (humedad-filtro, verif salida B1, FIFO) en los .docx finales — están en la adenda lista para copiar.
- Validar con planta los `[POR VALIDAR]` de la adenda.
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

### 2026-06-19 12:25 — Sync agent TEST desde CONTENIDO_MAESTRO

**Qué cambió:**
- `html-app/NOVOPNHTML1_files/Screens.jsx` y `instructivos/finales/NOVOPNHTML1_files/Screens.jsx`: se agregó sección visible `TEST` con timestamp `2026-06-19 12:25 (-05 ECT)` y se actualizó el historial interno.
- `instructivos/finales/IJP_FINAL_ACTUALIZADO_2026-06-19.docx` y `instructivos/finales/RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx`: se insertó el marcador TEST al final, antes del historial, y se actualizó la última actualización a `12:25`.
- `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html`: rebuild desde `Screens.jsx`.
- `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf`: re-export desde el HTML estático actualizado.
- HTML interactivo/print/estático: corrección responsive en el título de portada para evitar desborde horizontal en pantallas móviles.

**Por qué:**
- Push en `maestro/edits` modificó `instructivos/finales/CONTENIDO_MAESTRO.md`; el cambio fue el marcador `TEST — 2026-06-19 12:25 (-05 ECT)`.

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

