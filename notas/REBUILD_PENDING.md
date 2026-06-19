# Rebuild pendiente — entregables finales

**Última edición de contenido:** 2026-06-19 15:35 (-05 ECT) — Revisión HTML contenido GABRIEL.
**Fuente de verdad:** `instructivos/finales/CONTENIDO_MAESTRO.md`.

## Qué se editó directamente (ya quedó actualizado)

| Archivo | Estado |
|---|---|
| `instructivos/finales/CONTENIDO_MAESTRO.md` | ✅ Actualizado con todos los cambios aprobados de Gabriel. |
| `instructivos/finales/NOVOPNHTML1_files/Screens.jsx` | ✅ Actualizado (gemelo de html-app). |
| `html-app/NOVOPNHTML1_files/Screens.jsx` | ✅ Actualizado (gemelo de instructivos/finales). |
| `TODAY.md` | ✅ Entrada nueva en Historial. |

## Qué falta regenerar (NO se regeneró en este sync)

| Archivo | Acción requerida |
|---|---|
| `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` | Re-bundle con babel desde `NOVOPNHTML1_files/Screens.jsx`. Sin esto el HTML estático **no refleja** los cambios de Gabriel. |
| `html-app/NOVOPAN_Guia_Recepcion_Madera_FINAL.html` | Solo shell — no requiere edición de contenido si se sirve con servidor local (carga Screens.jsx en runtime). |
| `instructivos/finales/IJP_FINAL_ACTUALIZADO_2026-06-19.docx` | Edición XML quirúrgica o regeneración desde el maestro. Requiere proceso del Cursor agent o intervención manual en Word. |
| `instructivos/finales/RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx` | Igual que arriba. |
| `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf` | Re-exportar desde HTML o DOCX una vez que cualquiera de los dos esté actualizado. |

## Cambios de contenido que el rebuild debe propagar

Los siguientes textos deben quedar presentes (en HTML estático, DOCX y PDF) cuando se regenere:

- **Flujo operativo por etapas** (Antes de recibir / Documentos e ingreso / Peso / Humedad / Cierre / Descarga / Factory Track) con énfasis en "primero datos, después peso".
- **Terceros usa código de barras del proveedor (no QR forestal)** — títulos "Terceros — con/sin código de barras".
- 4.6: `"No permita la entrada con guía repetida"` (antes "descarga").
- 4.10.1 sin el placeholder `[POR VALIDAR con Daniel Sotalin]`.
- Muestra perdida: confirmar con balanza → escalar (sin convertir promedio/doble muestra en procedimiento formal).
- 4.11: etiqueta/papel entregada al transportista, llevada al patio asignado.
- 4.5: verificación visual de especie/material.
- Bloque "Anulación / Reliquidación / Nota de crédito" con cuadro caso/acción/escalar.
- **HINO con remolque (~11 t)** y **Chevrolet sin remolque (~8-9 t)** — antes estaban invertidos.
- 4.14.2 Patios y rumas digitales (aviso si descarga fuera de secuencia + habilitación de ruma física nueva).
- Factory Track con cuenta/contraseña por equipo y nombre oficial.

## Cómo regenerar el bundle estático (HTML)

El proceso confiable es el de Codex/Cursor agent. Pasos manuales si fuera necesario:

```bash
# 1. Transpilar Screens.jsx con babel
cd instructivos/finales/NOVOPNHTML1_files
npx -y @babel/cli@7 Screens.jsx \
  --presets=@babel/preset-react,@babel/preset-env \
  -o Screens.compiled.js

# 2. Hidratar el SSR con ReactDOMServer (similar al script previo de Codex):
#    - Toma NOVOPAN_Guia_Recepcion_Madera_FINAL.html como template
#    - Inyecta Screens.compiled.js inline
#    - Ejecuta React server-render para llenar <div id="root">
#    - Escribe NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html
```

## Validación visual mínima (después del rebuild)

Verificar que en el HTML estático aparezcan estos strings:

- `"Terceros - con código de barras"`
- `"No permita la entrada con guía repetida"`
- `"HINO — con remolque"` y `"Chevrolet — sin remolque"`
- `"Si la muestra parece perdida o no procesada"`
- `"4.14.2 Patios y rumas digitales"`
- `"Factory Track — cuentas y equipos"`

Y verificar que **no** aparezcan:

- `"POR VALIDAR con Daniel Sotalin"`
- `"No permita la descarga con guía repetida"`
- `"Terceros - con QR"` / `"Terceros sin QR"`
- `"Chevrolet (con remolque)"` (antiguo) / `"HINO (sin remolque)"` (antiguo)

## Pendientes anteriores (de la sesión 2026-06-19 10:10) — ya regenerados

Las 3 secciones nuevas (4.10.1, 4.12.1, 4.14.1) que estaban marcadas como pendientes ya quedaron en el bundle estático previo. Lo de esta sesión (2026-06-19 15:35) se monta encima.
