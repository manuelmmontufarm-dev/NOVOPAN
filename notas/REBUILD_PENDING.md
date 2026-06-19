# Estado de rebuild — entregables finales

**Última edición de contenido:** 2026-06-19 16:07 (-05 ECT) — cierre follow-up Codex sobre revisión HTML contenido GABRIEL.
**Último rebuild/export:** 2026-06-19 17:48 (-05 ECT) — DOCX renderizados y PDF re-exportado desde HTML estático.
**Fuente de verdad:** `instructivos/finales/CONTENIDO_MAESTRO.md`.

## Qué quedó actualizado

| Archivo | Estado |
|---|---|
| `instructivos/finales/CONTENIDO_MAESTRO.md` | ✅ Actualizado con todos los cambios aprobados de Gabriel. |
| `instructivos/finales/NOVOPNHTML1_files/Screens.jsx` | ✅ Actualizado (gemelo de html-app). |
| `html-app/NOVOPNHTML1_files/Screens.jsx` | ✅ Actualizado (gemelo de instructivos/finales). |
| `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` | ✅ Regenerado desde `Screens.jsx` con Babel + React server-render. |
| `instructivos/finales/IJP_FINAL_ACTUALIZADO_2026-06-19.docx` | ✅ Actualizado por edición XML quirúrgica y renderizado para QA visual. |
| `instructivos/finales/RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx` | ✅ Actualizado por edición XML quirúrgica y renderizado para QA visual. |
| `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf` | ✅ Re-exportado desde HTML estático y renderizado para QA visual. |
| `instructivos/documentos-finales-paralelos/*.md/.jsx` | ✅ Alineados con la revisión Gabriel donde contenían texto viejo. |
| `notas/ADENDA_2026-06-19_contenido-nuevo.md` | ✅ Alineada con la revisión Gabriel. |
| `TODAY.md` | ✅ Entrada nueva en Historial. |

## Qué falta regenerar

| Archivo | Acción requerida |
|---|---|
| `html-app/NOVOPAN_Guia_Recepcion_Madera_FINAL.html` | Solo shell/runtime — no requiere edición de contenido si se sirve con servidor local (carga `Screens.jsx`). |
| PDF/DOCX finales | ✅ Sin rebuild pendiente de la revisión Gabriel. |

## Cambios de contenido ya presentes en entregables finales

Los siguientes textos ya quedaron presentes en HTML estático, DOCX finales y PDF:

- **Flujo operativo por etapas** (Antes de recibir / Documentos e ingreso / Peso / Humedad / Cierre / Descarga / Factory Track) con énfasis en "primero datos, después peso".
- **Terceros usa código de barras del proveedor (no QR forestal)** — títulos "Terceros — con/sin código de barras".
- 4.6: `"No permita la entrada con guía repetida"`.
- 4.10.1 sin placeholders no aprobados sobre bloqueo de edición por humedad.
- Muestra perdida: confirmar con balanza → escalar (sin convertir promedio/doble muestra en procedimiento formal).
- 4.11: etiqueta/papel entregada al transportista, llevada al patio asignado.
- 4.5: verificación visual de especie/material.
- Bloque "Anulación / Reliquidación / Nota de crédito" con cuadro caso/acción/escalar.
- **HINO con remolque (~11 t)** y **Chevrolet sin remolque (~8-9 t)** — antes estaban invertidos.
- 4.14.2 Patios y rumas digitales (aviso si descarga fuera de secuencia + habilitación de ruma física nueva).
- Factory Track con cuenta/contraseña por equipo y nombre oficial.

## Cómo se regeneró el bundle estático (HTML)

Se ejecutó un build temporal en `/tmp/novopan-static-build`:

```bash
npm --prefix /tmp/novopan-static-build install @babel/core @babel/preset-react @babel/preset-env react@18.3.1 react-dom@18.3.1
# Luego: Babel transform de html-app/NOVOPNHTML1_files/Screens.jsx + ReactDOMServer.renderToStaticMarkup.
```

## Validación mínima

Verificar que en el HTML estático/PDF aparezcan estos strings:

- `"Terceros - con código de barras"`
- `"No permita la entrada con guía repetida"`
- `"HINO — con remolque"` y `"Chevrolet — sin remolque"`
- `"Si la muestra parece perdida o no procesada"`
- `"4.14.2 Patios y rumas digitales"`
- `"Factory Track — cuentas y equipos"`

Y verificar que **no** aparezcan:

- Placeholders no aprobados de humedad con Daniel.
- Redacción vieja de 4.6 que hablaba de descarga.
- Títulos viejos de terceros como QR.
- Asignaciones antiguas de Chevrolet/HINO con remolque invertidas.

Adicionalmente, los dos DOCX fueron renderizados con `render_docx.py` y revisados visualmente mediante hojas de contacto:

- `/tmp/novopan-docx-render/ijp-after`
- `/tmp/novopan-docx-render/recepcion-after`

## Pendientes anteriores (de la sesión 2026-06-19 10:10) — ya regenerados

Las 3 secciones nuevas (4.10.1, 4.12.1, 4.14.1) que estaban marcadas como pendientes ya quedaron en el bundle estático previo. Lo de esta sesión (2026-06-19 15:35) se monta encima.
