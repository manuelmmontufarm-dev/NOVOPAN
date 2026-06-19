# POLICY — Documentos finales NOVOPAN-SLIDES

> **Status:** Obligatoria · Aplica desde **2026-06-19**
> Esta política se aplica a TODO archivo en `docs-finales/` y a `html-app/NOVOPNHTML1_files/Screens.jsx`.

## Regla #1 — Toda actualización lleva fecha + HORA (con minuto)

Cada vez que se modifique un documento final, **dentro del archivo** debe quedar registrado:

- **Fecha** en formato `YYYY-MM-DD`.
- **Hora** en formato `HH:MM` con timezone (ej. `09:53 (-05 ECT)`).
- **Editor** (nombre humano).
- **Qué cambió** (lista corta).

Esto NO sustituye al git log — es para que el lector del documento sepa qué versión está leyendo sin tener que ir a git.

## Regla #2 — El changelog vive AL FINAL del documento

Estructura obligatoria:

```
========== Contenido del documento ==========
...
...
==============================================
========== Historial de cambios ==============
[entrada más reciente arriba]
[entrada anterior]
[entrada más vieja]
==============================================
```

Las entradas viejas NO se borran. Solo se añaden nuevas arriba del todo.

## Regla #3 — `CONTENIDO_MAESTRO.md` es la fuente única de verdad

`docs-finales/CONTENIDO_MAESTRO.md` es el archivo **donde se edita el contenido primero**. No te preocupes del formato ahí — solo escribe el contenido correcto. Los demás archivos (docx, HTML, PDF) se actualizan después, propagando lo que dice el maestro.

**Si hay divergencia entre el maestro y otro doc, gana el maestro.**

| Archivo | Rol | Edita aquí primero? |
|---|---|---|
| `docs-finales/CONTENIDO_MAESTRO.md` | **Fuente de verdad** | ✅ **SÍ — siempre primero** |
| `html-app/NOVOPNHTML1_files/Screens.jsx` | App React activa (HTML interactivo) | Segundo |
| `docs-finales/IJP_FINAL_*.docx` | Documento ISO para impresión/Word | Tercero |
| `docs-finales/RECEPCION_*.docx` | Guía rápida ANI | Tercero |
| `docs-finales/NOVOPAN_Guia_*_ESTATICO.html` | Bundle HTML standalone | Auto desde Screens.jsx |
| `docs-finales/NOVOPAN_Guia_*.pdf` | Render para impresión final | Auto desde HTML/docx |

## Regla #4 — Flujo cuando hay un cambio de contenido

1. **Editar `CONTENIDO_MAESTRO.md`** con el cambio.
2. **Añadir entrada al CHANGELOG del maestro** (al final del archivo) con `YYYY-MM-DD HH:MM` + autor + qué cambió.
3. **Propagar a los otros docs** (puede ser después, no tiene que ser el mismo commit):
   - Editar `Screens.jsx` con el mismo cambio y actualizar su `ChangelogFooter`.
   - Editar el `.docx` correspondiente (find/replace surgical si es texto existente, o pegar manualmente en Word si es contenido nuevo).
   - Regenerar el bundle `_ESTATICO.html` con babel.
   - Re-exportar el PDF.
4. **Commitear al repo** con mensaje que liste qué docs se actualizaron.

## Regla #5 — Entradas del changelog: formato fijo

```markdown
## YYYY-MM-DD HH:MM — Nombre del editor

**Qué cambió:**
- Cambio 1 con detalle suficiente para entenderlo sin abrir git.
- Cambio 2.

**Por qué:**
- Razón corta.

**Pendiente / por validar:**
- Si quedó algo abierto, dilo aquí.
```

## Regla #6 — Antes de mergear un PR que toca docs finales

Checklist obligatorio en la descripción del PR:

- [ ] `CONTENIDO_MAESTRO.md` actualizado.
- [ ] Changelog del maestro tiene entrada nueva con fecha + HORA.
- [ ] Cada doc final tocado tiene su changelog interno actualizado.
- [ ] `TODAY.md` (raíz del repo) tiene entrada nueva en Historial.
- [ ] Si quedan docs no propagados (ej. PDF stale), está documentado en `notas/REBUILD_PENDING.md`.

## Por qué esta política existe

Antes de esto:
- Había 4+ documentos finales con la misma info, divergiendo entre sí.
- No había forma rápida de saber qué versión era la más reciente.
- Los cambios se hacían en local y no se versionaban consistentemente.
- Tu mismo lo dijiste: "se crean muchos documentos trabajando localmente".

Con esta política:
- `CONTENIDO_MAESTRO.md` evita el problema "¿cuál es el bueno?".
- El changelog interno permite verificar la versión sin abrir git.
- La hora con minuto distingue entre múltiples edits del mismo día.
- El repo enforza el flujo.
