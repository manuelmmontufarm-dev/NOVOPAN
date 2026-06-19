# NOVOPAN — Pasantía Manuel Montúfar

> **Última reorganización:** 2026-06-19
> Estructura limpia para empezar a trabajar contra el repo de GitHub `NOVOPAN-SLIDES`.

## Estructura del folder

```
NOVOPAN/
├── README.md                          ← este archivo
├── docs-finales/                      ★ los entregables vigentes
│   ├── IJP_FINAL_ACTUALIZADO_2026-06-19.docx
│   ├── RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_2026-06-19.docx
│   ├── NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf
│   └── NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html
├── html-app/                          ★ la app React activa (editable)
│   ├── NOVOPNHTML1.html               (runtime entry — abrir en navegador)
│   ├── NOVOPAN_Guia_Recepcion_Madera_FINAL.html  (print template)
│   └── NOVOPNHTML1_files/
│       ├── Screens.jsx                ← contenido principal (editar aquí)
│       ├── GuiaApp.jsx
│       ├── styles.css
│       ├── _ds_bundle.js
│       └── assets/
├── notes/                             ← notas, planes, prompts
│   ├── CLAUDE_DESIGN_PROMPT.md        (prompt para optimización visual)
│   ├── ADENDA_2026-06-19_contenido-nuevo.md  (contenido nuevo para los docx)
│   ├── REBUILD_PENDING.md             (qué falta rebuild en el bundle estático)
│   ├── IJP_CLAUDE_PAGE_PLAN.md
│   ├── SETUP_COMPLETE.md
│   ├── 00_Index.md
│   └── iso documentation.pdf
├── transcripts/                       ← transcripciones de reuniones
├── transcripts_audio_forestal/        ← transcripciones de audios planta
├── audios/                            ← grabaciones originales
├── reference/                         ← documentos de referencia
├── technical-research/                ← investigación técnica
├── glossary/                          ← glosario
├── decisions-and-open-items/          ← decisiones y pendientes
├── work/                              ← scripts y trabajo en proceso
└── _archive/                          ← versiones viejas, NO tocar
    ├── old-versions/                  (docx + .bak antiguos)
    ├── entregables/                   (zip + html viejos)
    ├── docx_render_check/
    └── outputs/                       (intermediates de processing)
```

## Cambios aplicados 2026-06-19

Inconsistencias resueltas entre HTML, docx, PDF (basado en findings de Cursor):

| # | Inconsistencia | Aplicado en |
|---|---|---|
| 1 | Altura ruma: 4-5m → 5m máx (excepcional 6m) + patrón 2+camino+2 | ✅ docx (IJP + RECEPCION), Screens.jsx, ESTATICO.html |
| 2 | Tiempo muestra rolliza: 20-40 → 25-40 min | ✅ IJP docx, Screens.jsx, ESTATICO.html |
| 3 | Etiquetado Patio 5: ya no es manual, balanza envía la etiqueta | ✅ IJP docx, Screens.jsx, ESTATICO.html |
| 4 | Humedad como último filtro + procedimiento anulación | ✅ Screens.jsx · ⚠️ docx: ver ADENDA |
| 5 | Verificación humedad salida Balanza 1 | ✅ Screens.jsx · ⚠️ docx: ver ADENDA |
| 6 | FIFO con excepción justificada | ✅ Screens.jsx · ⚠️ docx: ver ADENDA |

**Verificación previa:** la definición de patios internos/externos (5,6,7,8,21) ya estaba correcta en IJP_FINAL. La crítica de Cursor sobre "Patio interno = Itulcachi" venía de una versión vieja.

## Para abrir el HTML activo

```bash
# En navegador (versión interactiva)
open html-app/NOVOPNHTML1.html

# Versión para imprimir/PDF
open html-app/NOVOPAN_Guia_Recepcion_Madera_FINAL.html
```

## Trabajo pendiente

Ver `notes/ADENDA_2026-06-19_contenido-nuevo.md` y `notes/REBUILD_PENDING.md`.

1. Pegar manualmente en Word los 3 bloques de contenido nuevo en el IJP_FINAL.
2. Rebuild del bundle `ESTATICO.html` (necesita babel + el script de Codex).
3. Validar con planta (Daniel Sotalin) los puntos `[POR VALIDAR]` en la sección de humedad-como-filtro.
