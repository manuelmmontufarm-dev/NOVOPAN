# AGENT_INSTRUCTIONS.md — Workflow del agent de sincronización

> **Audiencia:** Cualquier AI agent (Cursor, Claude, Codex, etc.) que opere sobre este repo automáticamente.
> **Status:** Política obligatoria. Si eres un agent leyendo esto, sigue estas reglas SIEMPRE.

---

## Resumen del flujo

```
   Manuel edita CONTENIDO_MAESTRO.md
            ↓
     push a branch maestro/edits
            ↓
       Cursor agent dispara
            ↓
  Agent lee CONTENIDO_MAESTRO.md (fuente de verdad)
            ↓
  Agent actualiza los 4 documentos derivados
            ↓
   Agent abre PR de maestro/edits → main
            ↓
       Manuel revisa y mergea
```

---

## La regla de oro

**`instructivos/finales/CONTENIDO_MAESTRO.md` es la ÚNICA fuente de verdad.**

Si hay divergencia entre el maestro y cualquier otro doc, el agent debe **siempre creerle al maestro** y actualizar los derivados — nunca al revés.

---

## La branch dedicada: `maestro/edits`

- Todo cambio al contenido del IJP se hace **primero** en el branch `maestro/edits`, editando únicamente `instructivos/finales/CONTENIDO_MAESTRO.md`.
- El agent observa pushes a este branch específicamente.
- Cuando el agent termina su trabajo, abre PR de `maestro/edits` → `main`.
- Después del merge, `maestro/edits` se queda como branch persistente (no se borra) — se re-usa para la siguiente edición.

---

## Las 4 piezas que el agent debe mantener sincronizadas con CONTENIDO_MAESTRO.md

| # | Archivo derivado | Tipo de update |
|---|---|---|
| 1 | `html-app/NOVOPNHTML1_files/Screens.jsx` | Editar JSX (componentes Card, Callout, List, etc) reflejando el contenido del maestro |
| 2 | `instructivos/finales/IJP_FINAL_ACTUALIZADO_<fecha>.docx` | Editar via descompresión XML (find/replace en `word/document.xml` preservando estilos) |
| 3 | `instructivos/finales/RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_<fecha>.docx` | Igual que el IJP |
| 4 | `instructivos/finales/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` | Rebuild con babel desde Screens.jsx (instrucciones más abajo) |

**El PDF** (`NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf`) NO se actualiza automáticamente — requiere re-export desde Word manualmente. El agent solo documenta que el PDF quedó stale.

---

## Reglas estrictas para el agent

### Cuándo NO actuar
Si el push **no tocó** `instructivos/finales/CONTENIDO_MAESTRO.md`:
- Detente.
- No modifiques ningún archivo.
- Reporta: `"Sin cambios en CONTENIDO_MAESTRO.md; no se ejecutó sincronización."`

### Cuándo SÍ actuar
Si el push tocó `instructivos/finales/CONTENIDO_MAESTRO.md`:
1. Lee el archivo completo.
2. Identifica qué cambió (diff vs versión anterior en main).
3. Determina qué derivados necesitan update basado en el tipo de cambio:
   - Cambio de texto literal (ej. "5 m" → "5.5 m") → todos los 4 derivados.
   - Cambio en sección nueva añadida al maestro → todos los 4 derivados, añadiendo sección equivalente.
   - Cambio solo en comentario HTML (`<!-- ... -->`) → no propagar; reportar que es comentario no funcional.
   - Cambio solo en el CHANGELOG del maestro → no propagar; reportar que es metadata.
4. Aplica los cambios a los derivados.
5. Añade entrada al CHANGELOG del maestro con `YYYY-MM-DD HH:MM — Cursor agent` y resumen del cambio (si no la añadió Manuel).
6. Añade changelog interno a los derivados modificados (footer de cada doc).
7. Actualiza `TODAY.md` (raíz) con entrada nueva.
8. Abre PR a `main` con título: `sync(maestro): propagar cambios de CONTENIDO_MAESTRO.md [YYYY-MM-DD HH:MM]`.

### Cero tolerancia
- ❌ **NO** edites `CONTENIDO_MAESTRO.md` tú mismo durante el push event (es la fuente; solo el humano la toca primero).
- ❌ **NO** mergees el PR — solo lo abres y comentas. Manuel mergea.
- ❌ **NO** toques `_archive/`, `audios/`, `transcripts_audio_forestal/`, `work/`.
- ❌ **NO** subas binarios pesados nuevos.
- ❌ **NO** modifiques `POLICY_DOCUMENTOS_FINALES.md` ni este archivo `AGENT_INSTRUCTIONS.md`.

---

## Cómo regenerar el ESTATICO (instrucciones para el agent)

```bash
# 1. Transpilar Screens.jsx con babel
cd /tmp && mkdir -p babel-build && cd babel-build
npm init -y > /dev/null
npm i --silent @babel/core @babel/preset-react @babel/preset-env

cat > build.cjs <<'EOF'
const babel = require('@babel/core');
const fs = require('fs');
const src = fs.readFileSync('<repo>/html-app/NOVOPNHTML1_files/Screens.jsx', 'utf-8');
const out = babel.transformSync(src, {
  presets: [
    ['@babel/preset-env', { targets: { browsers: ['last 2 chrome versions'] } }],
    '@babel/preset-react'
  ]
});
fs.writeFileSync('/tmp/Screens.compiled.js', out.code);
EOF
node build.cjs

# 2. Descargar React + ReactDOM (con -L para seguir redirect)
curl -sL https://unpkg.com/react@18.3.1/umd/react.production.min.js -o /tmp/react.min.js
curl -sL https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js -o /tmp/react-dom.min.js

# 3. Construir el bundle inline (ver código de referencia en el commit a593125
#    o en notas/REBUILD_PENDING.md)
# Resultado: bundle de ~277KB con TODO inline (CSS + DS + React + ReactDOM + Screens compilado)
```

---

## Cómo editar los .docx (instrucciones para el agent)

Los `.docx` son archivos zip con XML adentro. Para editar texto preservando estilos:

```python
import zipfile, os, shutil
work = '/tmp/docx_work'
shutil.rmtree(work, ignore_errors=True); os.makedirs(work)
with zipfile.ZipFile('<docx_path>') as zf: zf.extractall(work)

with open(f'{work}/word/document.xml') as f: xml = f.read()
xml = xml.replace('<texto viejo>', '<texto nuevo>')   # surgical replace
with open(f'{work}/word/document.xml', 'w') as f: f.write(xml)

with zipfile.ZipFile('<docx_path>', 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(work):
        for file in files:
            fp = os.path.join(root, file)
            zf.write(fp, os.path.relpath(fp, work))
```

Si el texto a buscar abarca múltiples `<w:r>` (split por formato bold/cursiva en medio), el find/replace simple falla — en ese caso el agent debe abortar y dejar un comentario explicando que ese párrafo requiere edición manual en Word.

---

## Plantilla de mensaje del commit del agent

```
sync(maestro): propagar <resumen del cambio> a derivados

CONTENIDO_MAESTRO.md cambió en: <secciones afectadas>
Derivados actualizados:
- Screens.jsx
- IJP_FINAL_ACTUALIZADO_<fecha>.docx
- RECEPCION_DE_MADERA_guia_v2_ACTUALIZADO_<fecha>.docx
- NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html (rebuild)

Pendiente (no automatizable):
- NOVOPAN_Guia_Recepcion_Madera_FINAL.pdf (re-export desde Word)
```

---

## Configuración Cursor (referencia)

- **Trigger:** Push in `NOVOPAN-SLIDES` on `maestro/edits` by Anyone
- **Model:** GPT-5.5 High (o equivalente)
- **Tools:** Memories + Comment on Pull Request (Allow PR Approval)
- **System prompt:** apuntar a este archivo (`AGENT_INSTRUCTIONS.md`) como contexto base.
